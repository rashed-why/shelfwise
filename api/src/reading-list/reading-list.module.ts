import { Module } from "@nestjs/common";
import { ReadingListController } from "./reading-list.controller";
import { ReadingListService } from "./reading-list.service";

@Module({
  controllers: [ReadingListController],
  providers: [ReadingListService],
})
export class ReadingListModule {}
