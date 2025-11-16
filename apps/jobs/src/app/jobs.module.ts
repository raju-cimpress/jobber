import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FibonacciJob } from './jobs/fibonacci/fibonacci.job';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { JobsService } from './jobs.service';
import { JobsResolver } from './jobs.resolver';
import { AUTH_PACKAGE_NAME } from '@jobber/grpc';
import { join } from 'path';
import { PulsarModule } from '@jobber/pulsar';

@Module({
  imports: [
    DiscoveryModule,
    PulsarModule,
    ClientsModule.register([
      {
        name: AUTH_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: AUTH_PACKAGE_NAME,
          protoPath: join(__dirname, '../../libs/grpc/proto/auth.proto'),
        },
      },
    ]),
  ],
  providers: [FibonacciJob, JobsService, JobsResolver],
})
export class JobsModule {}
