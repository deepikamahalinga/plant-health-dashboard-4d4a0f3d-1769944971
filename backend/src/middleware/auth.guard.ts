// auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

// Custom interfaces
interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

interface RequestWithUser extends Request {
  user?: JwtPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      // Remove sensitive data before attaching to request
      delete payload.iat;
      delete payload.exp;
      
      // Attach user to request object
      request.user = payload;
      
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }
      throw new UnauthorizedException('Authentication failed');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

// auth.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

// user.interface.ts
export interface User {
  id: string;
  email: string;
  role: string;
}

// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '15m', // Short-lived access tokens
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}

// Usage example in controller
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { CurrentUser } from './auth.decorator';
import { User } from './user.interface';

@Controller('protected')
export class ProtectedController {
  @UseGuards(AuthGuard)
  @Get()
  getProtectedResource(@CurrentUser() user: User) {
    return {
      message: 'This is a protected resource',
      user,
    };
  }
}