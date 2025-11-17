import { Module } from '@nestjs/common';
import { JobsModule } from './jobs/jobs.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@jobber/nestjs';

@Module({
  imports: [JobsModule, ConfigModule.forRoot({ isGlobal: true }), LoggerModule],
  providers: [],
})
export class AppModule {}
