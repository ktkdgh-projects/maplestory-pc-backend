import { pbkdf2Sync, randomBytes } from 'crypto';
import { IPBKDF2EncryptedData } from '@libs/common';
import { BadRequestException, Injectable } from '@nestjs/common';

export const Pbkdf2ServiceToken = 'Pbkdf2ServiceToken';

@Injectable()
export class Pbkdf2Service {
    encryptPBKDF2(plaintext: string): IPBKDF2EncryptedData {
        const salt = randomBytes(16).toString('base64');
        const { INTERATIONS, DKLEN, HASH } = process.env;

        if (INTERATIONS === undefined || DKLEN === undefined || HASH === undefined) {
            throw new BadRequestException('PBKDF2 환경변수가 설정되지 않았습니다.');
        }

        const encryptedData = pbkdf2Sync(plaintext, salt, Number(INTERATIONS), Number(DKLEN), HASH).toString('base64');

        return { salt, encryptedData };
    }

    comparePBKDF2(plaintext: string, salt: string, encryptedData: string): boolean {
        const { INTERATIONS, DKLEN, HASH } = process.env;

        if (
            INTERATIONS === undefined ||
            DKLEN === undefined ||
            HASH === undefined ||
            plaintext === undefined ||
            salt === undefined ||
            encryptedData === undefined
        ) {
            return false;
        }
        const hashedPlaintext = pbkdf2Sync(plaintext, salt, Number(INTERATIONS), Number(DKLEN), HASH).toString('base64');
        return encryptedData === hashedPlaintext;
    }
}
