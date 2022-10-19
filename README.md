# Used Car Pricing API

## Features

- Users sign up with email/password
- Users get an estimate for how much their car is worth based on the make/model/year/mileage
- Users can report wha they sold their vehicles for
- Admin have to approve reported sales.

## Structure

### 1) Create a mew user and sign in

- POST /auth/signup
- Body - {email, password}

### 2) Sign in as an existing user

- POST /auth/signin
- Body - {email, password}

### 3) Get an estimate for the cars value

- GET /reports
- Query String - make, model, year, mileage, longitude, latitude

### 4) Report how much a vehicle sold for

- POST /reports
- Body - {make, model, year, mileage, longitude, latitude, price}

### 5) Approve or reject a report submitted by a user

- PATCH /reports/:id
- Body - {approved}

### Extra (for practice purpose only):

1. Find a user with given id
   - GET /auth/:id
2. Find all users with given email
   - GET /auth?email=
3. Update a user with given id
   - PATCH /auth/:id; Body - {email, password}
4. Delete user with given id
   - DELETE /auth/:id

## Persisting Data with TypeORM

Nest works fine with ant ORM, but works well out of the box with TypeORM and Mongoose

### Connection

- AppModule -> Connection to SQLite DB
- UsersModule/ ReportsModule
  - User(Report) Entity: Lists the different properties that a User(Report) has (no functionality)
  - Users(Reports) Repository: Methods to find, update, delete, create a User(Report)

### Creating an Entity

1. Create an entity file, and create a class in it that lists all the properties that your entity will have.
2. Connect the entity to its parent module. This creates a repository
3. Connect the entity to the root connection (in app module)

### [Repository API](https://typeorm.io/#/repository-api)

There are always more ways to achieve the purpose

- create(): Makes a new instance of am entity, but does not persist it to the DB
- save(): Adds or updates a record to the DB
- find(): Runs a query and returns a list of entities
- findOne(): Run a query, returning the first record matching the search criteria.
- remove(): Remove a record from the DB

## Creating and saving user data

### Working flow

1. Request {email: 'a#a.com', password: 'aaa'}
2. Validation Pipe <- CreateUserDto (email: string, password: string)
3. UsersControllers: Defines routes + picks interesting data from incoming request
4. User Entity: Defines what a user is
   1. UsersService: Contains our real app logic
   2. UsersRepository: Created by TypeORM
5. SQLite DB

### Error Handling

Nest has other three types of Controller (HTTP, WebSocket, GRPC). BUT WebSocket & GRPC don't know how to handler a NotFoundException

## Customize data serialization

### Doc Recommended (flow is bidirectional)

e.g. Exclude password in response data

1. UserService - findOne()

UserEntityInstance: Directions on how to turn this instance of a class into a plain object

2. Users Controller - findUser()

Class Serializer Interceptor: Turns an instance of User Entity into a plain object based on some rules

3. Request GET /auth/2

#### Problem

We might turns out to have two routes: Admin and Public.

- Admin: {id, email, age, name} - Controller: findUserForAdmin()
- Public: {id, email} - Controller: findUser()

#### Solution

In step 2, we create a Custom Interceptor.

User DTO: that describes how to serialize a user for this particular handler.
One DTO for admin, One DTO for public

### Customize Interceptor

- Interceptors can mess around with incoming requests and/or outgoing responses.
- Interceptors can be applied to a single handler, all the handlers in a controller or globally

```ts
intercept(context: ExecutionContext, next: CallHandler)
```

- 'intercept' method is called automatically
- first param: Information on the incoming request
- second param: Kind of a reference to the request handler in our controller

## Authentication

- Optional # 1 - Add more functionality to the Users Service
- Optional # 2 - Create a new AuthService that relies on UserService

Why Option # 2?

What if we need to add more user related service? Like add preference, reset feature... The content of UserService will become messy.

### Common Auth System Features

- Handler to Sign Up, Log In, Sign Out
- Handler to return currently signed in user
- Reject requests to certain handlers is the user is not signed in -> **Guard**
- Automatically tell a handler who the currently signed in user is -> **Interceptor + Decorator**
  - Challenge: Param decorators exist outside the DI system, so our decorator can't get an instance of UsersService directly.
  - Solution: Make an interceptor to get the current user, then use the value produced by it in the decorator.

### How auto signIn works (cookie-session library)

1. GET /asdf

   Headers - Cookie: ey4ji145152

2. Server:

   1. Cookie-Session library looks at the 'Cookie' header
   2. Cookie-Session decodes the string, result in an object
      - Session - {userId: 'asd'}
   3. We get access to session object in a request handler using a decorator
   4. We add/remove/change properties on the session object
      - Session - {userId: 'zxc'}
   5. Cookie-Session sees the updated session and turns it into an encrypted string
   6. String sent back in the 'Set-Cookie' header on the response object

3. Response

   Headers - Set-Cookie: ey6ak025k66

## Unit testing

DI container When testing (weird faking user service)

Auth Service -> Class that implements all the methods of Users Service

## end-to-end Test

### Test Runner

#### it ('handles a request to signup')

1. Create new copy of the entire nest app
2. Listen on traffic to a randomly assigned port
3. Receive requests form the test

### Wire up Validation Pipe and cookie-session into App module

### Create Dev & Prod Database

Nest's recommended way of handling environment config is incredibly over-the-top complicated.

Create a ConfigService, and in DI container, Change the TypeOrmModule to depend on it.

## Relation with TypeORM (Foreign key)

### Associations with Nests & TypeORM

1. Figure out what kind of association we are modeling
   - One to many: A user has many reports
     - @OneToMany(): Does not change the Users table;
     - reports:Report[]
       - Report tied to this user will be accessed with: user.reports
       - Association is not automatically fetched when we fetch a User
   - Many to one: A report has one user.
     - @ManyToOne(): Change the Reports table
     - user: User
       - User who created this report will be accessed with report.user
       - Association is not automatically fetched when we fetch a Report
2. Add the appropriate decorators to our related entities. (see above usage)

3. Associate the records when one is created.
4. Apply a serializer to limit info shared.

## Permission System (Auth & Public)

- Authentication: Figure out who is making a request.
- Authorization: Figure out if the person making the request is allowed to make it.
- About the incorrect auth mode:
  - Execution order: Request -> Middlewares -> Guard -> Request Handler -> Response. Interceptor could be between Guards and Request Handler, or Request Handler and Response.
  - We make the CurrentUser Interceptor into Middleware. Which will makes it runs right after the cook-session middleware

## QueryBuilders with TypeORM

### User one more on TypeORM Repository

- createQueryBuilder: Returns a query builder that can bed used for complex queries
