import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UserModule } from "./user/user.module";
import { CategoryModule } from "./category/category.module";
import { AuthorsModule } from "./authors/authors.module";
import { BooksModule } from "./books/books.module";
import { BorrowedModule } from "./borrowed/borrowed.module";
import { HoldsModule } from "./holds/holds.module";
import { ReadingListModule } from "./reading-list/reading-list.module";
import { AdminModule } from "./admin/admin.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "public"),
      serveStaticOptions: {
        index: false,
        fallthrough: true,
      },
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    CategoryModule,
    AuthorsModule,
    BooksModule,
    BorrowedModule,
    HoldsModule,
    ReadingListModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
