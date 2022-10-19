import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  // No type support (like resolve number in find()), using Partial to help with that.
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    // 1. Create a fake copy of the users service
    // Only create find() and create() is because AuthService only use these two
    fakeUserService = {
      // Promise.resolve() to mimic the async & await
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        // without casting, we missed the hooks (logInsert...)
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    // 2. Create a test module for Auth
    const module = await Test.createTestingModule({
      providers: [
        // List of things we want to register in our testing DI container
        AuthService,
        // Re-route the DI system: If anyone asks for UserService, give them this object
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  // I. Exists of instance
  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  // II. Signup related tests
  it('create a new user with a slated and hashed password', async () => {
    const user = await service.signup('a@a.com', 'a');
    expect(user.password).not.toEqual('a');

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined;
    expect(hash).toBeDefined;
  });

  it('throws an error if user signs up with email that is in use', async () => {
    // // mock there already a user exists
    // fakeUserService.find = () =>
    //   Promise.resolve([
    //     { id: 1, email: 'test@test.com', password: 'test' } as User,
    //   ]);
    await service.signup('a@a.com', 'aaa');
    try {
      await service.signup('a@a.com', 'aaa');
    } catch (err) {
      expect(err.message).toMatch('email is in use');
      return;
    }
    throw new TypeError('cannot get email error');
  });

  // III. Signin related tests
  it('throws if signin is called with an unused email', async () => {
    try {
      await service.signin('a@a.com', 'aaa');
    } catch (err) {
      expect(err.message).toMatch('user not found');
      return;
    }
    throw new TypeError('cannot get email error');
  });

  it('throws if an invalid password is provided', async () => {
    // fakeUserService.find = () =>
    //   Promise.resolve([
    //     { id: 1, email: 'test@test.com', password: 'test' } as User,
    //   ]);
    await service.signup('a@a.com', 'aaa');
    try {
      await service.signin('a@a.com', 'bbb');
    } catch (err) {
      expect(err.message).toMatch('Bad password');
      return;
    }
    throw new TypeError('password is valid but not correct');
  });

  it('returns a user if correct password is provided', async () => {
    // // // This approach is to find out the hashed password manually
    // // const user = await service.signup('a@a.com', 'aaa');
    // // console.log(user);
    // fakeUserService.find = () =>
    //   Promise.resolve([
    //     {
    //       id: 1,
    //       email: 'a@a.com',
    //       password:
    //         '919a34b72fb999c6.e665a542c7cf5351536afbe06e9137914e318000f3ace2d004fc0740e1bd81c0',
    //     } as User,
    //   ]);
    await service.signup('a@a.com', 'aaa');

    const user = await service.signin('a@a.com', 'aaa');
    expect(user).toBeDefined();
  });
});
