require("reflect-metadata");

const { existsSync } = require("node:fs");
const { join } = require("node:path");
const { NestFactory } = require("@nestjs/core");
const { AppModule } = require("../src/app.module");

const envPath = join(process.cwd(), ".env");

if (existsSync(envPath) && process.loadEnvFile) {
  process.loadEnvFile(envPath);
}

let cachedServer;

async function getServer() {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
    });
    app.setGlobalPrefix("api");

    await app.init();
    cachedServer = app.getHttpAdapter().getInstance();
  }

  return cachedServer;
}

module.exports = async function handler(request, response) {
  const server = await getServer();
  return server(request, response);
};
