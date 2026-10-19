import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const frontendUrl = configService.get<string>(
    "FRONTEND_URL",
    "http://localhost:3000",
  );
  const allowedOrigins = new Set([
    frontendUrl,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ]);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, origin ?? frontendUrl);
        return;
      }

      callback(null, false);
    },
    credentials: true,
  });

  await app.listen(configService.get<number>("PORT", 4000));
}
void bootstrap();
