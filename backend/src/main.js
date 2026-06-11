require("reflect-metadata");

const { existsSync } = require("node:fs");

if (existsSync(".env")) {
  process.loadEnvFile(".env");
}

const { NestFactory } = require("@nestjs/core");
const { AppModule } = require("./app.module");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3333;

  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  });
  app.setGlobalPrefix("api");

  await app.listen(port);
}

bootstrap();
