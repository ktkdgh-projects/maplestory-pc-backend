import { IJwtPayload, IJwtPayloadData } from '@libs/common';
import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

export const TokenServiceToken = 'TokenServiceToken';

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService) {}

    verifyRefreshToken(token: string): IJwtPayload {
        const { JWT_REFRESH_SECRET_KEY } = process.env;

        try {
            return this.jwtService.verify(token, { secret: JWT_REFRESH_SECRET_KEY });
        } catch (error) {
            throw this.handleJwtError(error);
        }
    }

    verifyAccessToken(token: string): IJwtPayload {
        const { JWT_ACCESS_SECRET_KEY } = process.env;

        try {
            return this.jwtService.verify(token, { secret: JWT_ACCESS_SECRET_KEY });
        } catch (error) {
            throw this.handleJwtError(error);
        }
    }

    issueAccessToken(payload: IJwtPayloadData, options?: JwtSignOptions): Promise<string> {
        const { JWT_ACCESS_SECRET_KEY, JWT_ACCESS_TOKEN_TIME } = process.env;

        return this.jwtService.signAsync(
            { type: 'access', payload },
            {
                secret: JWT_ACCESS_SECRET_KEY,
                expiresIn: JWT_ACCESS_TOKEN_TIME,
                notBefore: '0h',
                ...options,
            },
        );
    }

    issueRefreshToken(payload: IJwtPayloadData, options?: JwtSignOptions): Promise<string> {
        const { JWT_REFRESH_SECRET_KEY, JWT_REFRESH_TOKEN_TIME } = process.env;

        return this.jwtService.signAsync(
            { type: 'refresh', payload },
            {
                secret: JWT_REFRESH_SECRET_KEY,
                expiresIn: JWT_REFRESH_TOKEN_TIME,
                notBefore: '0h',
                ...options,
            },
        );
    }

    private handleJwtError(error: unknown): Error {
        const errorMap = new Map<string, () => Error>([
            ['TokenExpiredError', () => new UnauthorizedException('토큰이 만료되었습니다.')],
            ['JsonWebTokenError', () => new ForbiddenException('유효하지 않은 토큰입니다.')],
            ['NotBeforeError', () => new BadRequestException('토큰 사용 가능 시간이 되지 않았습니다.')],
        ]);

        const errorName = (error as Error)?.name;
        const createException = errorMap.get(errorName);

        return createException ? createException() : new ForbiddenException('토큰 처리 중 알 수 없는 오류가 발생했습니다.');
    }
}
