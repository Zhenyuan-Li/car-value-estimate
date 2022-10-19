import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

// We can't test all the surrounding decorator since the type is too complex
// only testing the method it self. (otherwise end-to-end test)
describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUserService = {
      findOne: (id: number) =>
        Promise.resolve({ id, email: 'a@a.com', password: 'aaa' } as User),
      find: (email: string) =>
        Promise.resolve([{ id: 1, email, password: 'aaa' } as User]),
      // remove: () => {},
      // update: () => {},
    };
    fakeAuthService = {
      // signup: () => {},
      signin: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with given email.', async () => {
    const users = await controller.findAllUsers('a@a.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('a@a.com');
  });

  it('findUser returns a single user with the given id ', async () => {
    const user = await controller.findAllUsers('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUserService.findOne = () => null;
    try {
      await controller.findUser('1');
    } catch (err) {
      expect(err.message).toEqual('user not found');
      return;
    }
    throw new TypeError('user has found accidentally');
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      { email: 'a@a.com', password: 'aaa' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
