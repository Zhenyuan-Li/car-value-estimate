import { CanActivate, ExecutionContext } from '@nestjs/common';
import { request } from 'http';
import { Observable } from 'rxjs';

export class AuthGuard implements CanActivate {
  // kind of like a request coming into an HTTP based application
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    return request.session.userId;
  }
}
