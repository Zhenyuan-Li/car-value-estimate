import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '<h1>Welcome</h1><h2><a href="https://vincent-car-value.herokuapp.com/">See the Swagger API Document</a><h2>';
  }
}
