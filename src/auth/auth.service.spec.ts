import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        AuthService,

        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneOrFail: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();
    authService = await module.get(AuthService);
    userService = await module.get(UserService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
  describe('when accessing the data of authenticating user', () => {
    it('should attempt to get the user by email', () => {
      const getByEmailSpy = jest.spyOn(userService, 'findOneByEmail');
      authService.validateUser('user@email.com', 'strongPassword').toPromise();
      expect(getByEmailSpy).toBeCalledTimes(1);
    });
  });
});
