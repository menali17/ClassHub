require("reflect-metadata");

const { NestFactory } = require("@nestjs/core");
const { AppModule } = require("./app.module");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3333;

  app.setGlobalPrefix("api");

  await app.listen(port);
}

bootstrap();
