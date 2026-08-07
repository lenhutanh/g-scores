import { NotFoundException as NestNotFoundException } from '@nestjs/common';
import { ErrorCode } from 'src/constants/error-code';

export class NotFoundException extends NestNotFoundException {
    readonly errorCode: ErrorCode;

    constructor(errorCode: ErrorCode, message: string) {
        super({ message, code: errorCode });
        this.errorCode = errorCode;
    }
}
