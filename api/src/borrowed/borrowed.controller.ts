import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { Role } from "../generated/prisma/client";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { BorrowedService } from "./borrowed.service";
import { CreateBorrowedDto } from "./dto/create-borrowed.dto";
import { UpdateBorrowedStatusDto } from "./dto/update-borrowed-status.dto";

@Controller("borrowed")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class BorrowedController {
  constructor(private readonly borrowedService: BorrowedService) {}

  @Post()
  create(@Body() createBorrowedDto: CreateBorrowedDto) {
    return this.borrowedService.create(createBorrowedDto);
  }

  @Get()
  findAll() {
    return this.borrowedService.findAll();
  }

  @Patch(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body() updateBorrowedStatusDto: UpdateBorrowedStatusDto,
  ) {
    return this.borrowedService.updateStatus(id, updateBorrowedStatusDto.status);
  }

  @Patch(":id/return")
  markReturned(@Param("id") id: string) {
    return this.borrowedService.markReturned(id);
  }
}
