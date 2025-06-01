import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private logger = new Logger(JwtAuthGuard.name);
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    this.logger.log(`Authorization: ${req.headers['authorization']}`);
    this.logger.log(`Cookies: ${JSON.stringify(req.cookies)}`);
    return super.canActivate(context);
  }
}
