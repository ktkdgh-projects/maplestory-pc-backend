import { HttpException, HttpStatus } from '@nestjs/common';

export function handleHttpError(error: any): never {
    const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = error.response?.data || 'Internal server error';
    throw new HttpException(message, status);
}
