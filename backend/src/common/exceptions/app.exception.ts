import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from 'src/constants/error-code';

export class AppException extends HttpException {
    readonly errorCode: ErrorCode;

    constructor(errorCode: ErrorCode, message: string, status: HttpStatus) {
        super({ message, code: errorCode }, status);
        this.errorCode = errorCode;
    }
}
