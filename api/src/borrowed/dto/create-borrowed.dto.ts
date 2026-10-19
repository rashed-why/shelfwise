import { ArrayMinSize, IsArray, IsDateString, IsNotEmpty, IsString } from "class-validator";

export class CreateBorrowedDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  bookIds!: string[];

  @IsDateString()
  dueAt!: string;
}
