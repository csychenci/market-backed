import { AccessLevel, SingletonProto } from '@eggjs/tegg';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'backed_jwt_secret_token_12345';
const JWT_EXPIRES_IN = '7d';

@SingletonProto({
  accessLevel: AccessLevel.PUBLIC,
})
export class JwtService {
  sign(payload: object): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  verify(token: string): any {
    return jwt.verify(token, JWT_SECRET);
  }
}
