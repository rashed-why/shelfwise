import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { UserService } from "../../user/user.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.getOrThrow("GOOGLE_CLIENT_ID"),
      clientSecret: configService.getOrThrow("GOOGLE_CLIENT_SECRET"),
      callbackURL: configService.getOrThrow("GOOGLE_REDIRECT_URI"),
      scope: ["email", "profile"],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    return this.userService.findOrCreateFromGoogle(profile);
  }
}
