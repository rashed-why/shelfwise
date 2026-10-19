import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @IsString()
  @IsNotEmpty()
  authorId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  summary?: string;
}
