import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable, of, from } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import * as bcrypt from 'bcrypt';
import { IUser } from 'src/auth/interfaces/user.interface';
import { UserService } from 'src/auth/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  register(userData: IUser): Observable<string> {
    return from(bcrypt.hash(userData.password, 10)).pipe(
      mergeMap((hashedPassword) =>
        this.userService.createUser({
          ...userData,
          password: hashedPassword,
        }),
      ),
      catchError(() => {
        throw new HttpException(
          'Wrong credentials provides',
          HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  validateUser(
    username: string,
    password: string,
  ): Observable<{ email: string; id: number }> {
    return from(this.userService.findOneByEmail(username)).pipe(
      map((user) => {
        if (bcrypt.compare(password, user.password)) {
          return { email: user.email, id: user.id };
        } else {
          throw new HttpException(
            'Wrong credentials provides',
            HttpStatus.BAD_REQUEST,
          );
        }
      }),
      catchError(() => {
        throw new HttpException(
          'Wrong credentials provides',
          HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  login(user: IUser): Observable<{ access_token: string }> {
    const payload = { username: user.email, sub: user.id };
    return of({
      access_token: this.jwtService.sign(payload),
    });
  }
}
