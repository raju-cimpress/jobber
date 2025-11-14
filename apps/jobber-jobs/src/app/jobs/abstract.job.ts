import { Producer } from 'pulsar-client';
import { PulsarClient, serialize } from '@jobber/pulsar';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export abstract class AbstractJob<T extends object> {
  private producer: Producer;
  protected abstract dataClass: new () => T;

  constructor(private readonly pulsarClient: PulsarClient) {}

  async execute(data: T, jobTopicName: string): Promise<void> {
    await this.validateData(data);
    if (!this.producer) {
      this.producer = await this.pulsarClient.createProducer(jobTopicName);
    }
    if (Array.isArray(data)) {
      for (const item of data) {
        await this.send(item);
      }
    } else {
      await this.send(data);
    }
    return;
  }

  private async send(data: T): Promise<void> {
    await this.producer.send({
      data: serialize<T>(data),
    });
  }

  private async validateData(data: T): Promise<void> {
    const errors = await validate(plainToInstance(this.dataClass, data));
    if (errors.length > 0) {
      throw new BadRequestException(
        `Job data is invalid: ${JSON.stringify(errors)}`
      );
    }
  }
}
