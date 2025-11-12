/* eslint-disable @nx/enforce-module-boundaries */
import {
  CanActivate,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import {
  AuthServiceClient,
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE_NAME,
} from 'types/proto/auth';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext } from '@nestjs/common';
import { get } from 'http';

@Injectable()
export class GqlAuthGuard implements CanActivate, OnModuleInit {
  private readonly logger = new Logger(GqlAuthGuard.name);
  private authService: AuthServiceClient;

  constructor(@Inject(AUTH_PACKAGE_NAME) private client: ClientGrpc) {
    this.logger.log('GqlAuthGuard.constructor:');
  }

  onModuleInit() {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.logger.log('Looking for token in GqlAuthGuard.canActivate:');
    const token = this.getRequest(context).cookies?.Authentication;
    this.logger.log('Token extracted in GqlAuthGuard.canActivate:');
    this.logger.log(token);
    if (!token) {
      return false;
    }
    return this.authService.authenticate({ token }).pipe(
      map((res) => {
        this.logger.log('GqlAuthGuard.canActivate successful response:');
        this.getRequest(context).user = res;
        return true;
      }),
      catchError((err) => {
        this.logger.log('Error occurred in GqlAuthGuard.canActivate:');
        this.logger.error(err);
        return of(false);
      })
    );
  }

  private getRequest(context: ExecutionContext) {
    this.logger.log(
      'Fetching request from ExecutionContext in GqlAuthGuard.getRequest:'
    );
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
