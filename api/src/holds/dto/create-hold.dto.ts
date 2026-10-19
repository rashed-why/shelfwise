import { IsNotEmpty, IsString } from "class-validator";

export class CreateHoldDto {
  @IsString()
  @IsNotEmpty()
  bookId!: string;
}
