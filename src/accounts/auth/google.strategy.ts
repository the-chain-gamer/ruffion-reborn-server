import {Injectable, UnauthorizedException} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy , VerifyCallback } from 'passport-google-token';
import {fetchConfig} from "../../app.config";

@Injectable()
export class GoogleTokenStrategy extends PassportStrategy(Strategy, 'google-token') {
    constructor() {
        super({
            ...fetchConfig('auth','google'),
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { name, emails } = profile;
        const user = {
            data:{
                email: emails[0].value,
                firstName: name.givenName,
                lastName: name.familyName,
            }
        };
        done(null, user);
    }
}