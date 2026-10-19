import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { BooksService } from "./books.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";

const MAX_BOOK_IMAGE_SIZE = 500_000;
const BOOK_IMAGE_TYPES = /^image\/(jpeg|png|webp)$/;

const bookImageValidators = [
  new MaxFileSizeValidator({ maxSize: MAX_BOOK_IMAGE_SIZE }),
  new FileTypeValidator({ fileType: BOOK_IMAGE_TYPES }),
];

@Controller("books")
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("image", {
      storage: memoryStorage(),
    }),
  )
  create(
    @Body() createBookDto: CreateBookDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: bookImageValidators,
      }),
    )
    image: Express.Multer.File,
  ) {
    return this.booksService.create(createBookDto, image);
  }

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.booksService.findOne(id);
  }

  @Patch(":id")
  @UseInterceptors(
    FileInterceptor("image", {
      storage: memoryStorage(),
    }),
  )
  update(
    @Param("id") id: string,
    @Body() updateBookDto: UpdateBookDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: bookImageValidators,
        fileIsRequired: false,
      }),
    )
    image?: Express.Multer.File,
  ) {
    return this.booksService.update(id, updateBookDto, image);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.booksService.remove(id);
  }
}
