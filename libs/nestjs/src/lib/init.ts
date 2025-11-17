/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

export async function init(app: INestApplication) {
  // Increase the max listeners limit to handle multiple applications
  process.setMaxListeners(20);

  // Enable graceful shutdown hooks
  app.enableShutdownHooks();

  const globalPrefix = 'api';
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix(globalPrefix);
  app.useLogger(app.get(Logger));
  app.use(cookieParser());
  const port = app.get(ConfigService).getOrThrow('APP_PORT');
  await app.listen(port);
  app
    .get(Logger)
    .log(
      `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
    );
}
