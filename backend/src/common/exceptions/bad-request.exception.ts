import { BadRequestException as NestBadRequestException } from '@nestjs/common';
import { ErrorCode } from 'src/constants/error-code';

export class BadRequestException extends NestBadRequestException {
    readonly errorCode: ErrorCode;

    constructor(errorCode: ErrorCode, message: string) {
        super({ message, code: errorCode });
        this.errorCode = errorCode;
    }
}
