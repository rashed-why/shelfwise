import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { Role } from "../generated/prisma/client";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import type { AuthenticatedRequest } from "../types/authenticated-request";
import { CreateHoldDto } from "./dto/create-hold.dto";
import { HoldsService } from "./holds.service";

@Controller("holds")
@UseGuards(JwtAuthGuard)
export class HoldsController {
  constructor(private readonly holdsService: HoldsService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.holdsService.findAll();
  }

  @Post()
  create(
    @Request() req: AuthenticatedRequest,
    @Body() createHoldDto: CreateHoldDto,
  ) {
    return this.holdsService.create(req.user.id, createHoldDto);
  }

  @Get("me")
  findMine(@Request() req: AuthenticatedRequest) {
    return this.holdsService.findMine(req.user.id);
  }

  @Delete(":id")
  remove(@Request() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.holdsService.remove(req.user.id, id);
  }
}
