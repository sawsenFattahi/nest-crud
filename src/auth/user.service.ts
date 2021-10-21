import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findOneByEmail(email): Observable<IUser> {
    return from(this.userRepository.findOneOrFail({ email })).pipe(
      map((user) => user),
      catchError(() => {
        throw new HttpException(
          'user with this email does not exist',
          HttpStatus.NOT_FOUND,
        );
      }),
    );
  }

  createUser(userData: IUser): Observable<string> {
    const newUser = this.userRepository.create(userData);
    return from(this.userRepository.save(newUser)).pipe(
      map((response: IUser) => response.email),
      catchError((e) => {
        throw new InternalServerErrorException(e);
      }),
    );
  }
}
