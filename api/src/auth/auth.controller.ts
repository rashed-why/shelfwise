import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Response } from "express";
import { AuthService } from "./auth.service";
import { LogoutDto } from "./dto/logout.dto";
import { RefreshDto } from "./dto/refresh.dto";
import { GoogleAuthGuard } from "./guards/google-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import type { AuthenticatedRequest } from "../types/authenticated-request";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Request() req: AuthenticatedRequest) {
    return this.authService.login(req.user);
  }

  @Post("refresh")
  refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  logout(@Request() req: AuthenticatedRequest, @Body() logoutDto: LogoutDto) {
    return this.authService.logout(req.user.id, logoutDto.refreshToken);
  }

  /** Redirects browser to Google sign-in. Open in browser: GET /auth/google */
  @UseGuards(GoogleAuthGuard)
  @Get("google")
  googleAuth() {
    // Handled by GoogleAuthGuard — redirects to Google
  }

  /** Google redirects here — sends tokens to the Next.js callback page. */
  @UseGuards(GoogleAuthGuard)
  @Get("google/callback")
  async googleAuthCallback(
    @Request() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    const tokens = await this.authService.login(req.user);
    const frontendUrl = this.configService.getOrThrow<string>("FRONTEND_URL");

    const params = new URLSearchParams({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      userId: tokens.user.id,
      name: tokens.user.name,
      email: tokens.user.email,
      role: tokens.user.role,
    });

    return res.redirect(
      `${frontendUrl}/auth/google/callback?${params.toString()}`,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@Request() req: AuthenticatedRequest) {
    return req.user;
  }
}
