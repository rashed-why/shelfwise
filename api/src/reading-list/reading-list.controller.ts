import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { AuthenticatedRequest } from "../types/authenticated-request";
import { ReadingListService } from "./reading-list.service";

@Controller("reading-list")
@UseGuards(JwtAuthGuard)
export class ReadingListController {
  constructor(private readonly readingListService: ReadingListService) {}

  @Get("me")
  findMine(@Request() req: AuthenticatedRequest) {
    return this.readingListService.findMine(req.user.id);
  }
}
