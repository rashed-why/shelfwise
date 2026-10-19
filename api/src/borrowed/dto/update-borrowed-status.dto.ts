import { IsEnum } from "class-validator";
import { HoldStatus } from "../../generated/prisma/client";

export class UpdateBorrowedStatusDto {
  @IsEnum(HoldStatus)
  status!: HoldStatus;
}
