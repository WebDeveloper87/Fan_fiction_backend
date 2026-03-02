import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../modules/users/users.service';

@Injectable()
export class RefreshAccessTokenMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader?.split(' ')[1];
    const rawRefreshToken = req.headers['x-refresh-token'];

    const refreshToken =
      typeof rawRefreshToken === 'string'
        ? rawRefreshToken
        : rawRefreshToken?.[0];

    if (!accessToken || !refreshToken) {
      return next();
    }

    try {
      this.userService.verifyAccessToken(accessToken);
      return next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        try {
          const { accessToken: newAccessToken } =
            await this.userService.refresh(refreshToken);

          req.headers['authorization'] = `Bearer ${newAccessToken}`;
        } catch {}
      }
    }
    return next();
  }
}
