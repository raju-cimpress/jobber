import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, Consumer, Message, Producer } from 'pulsar-client';

@Injectable()
export class PulsarClient implements OnModuleDestroy {
  private readonly client: Client;
  private producers: Producer[] = [];
  private consumers: Consumer[] = [];

  constructor(private readonly configService: ConfigService) {
    const serviceUrl = this.configService.get<string>('PULSAR_SERVICE_URL');

    if (!serviceUrl) {
      throw new Error('PULSAR_SERVICE_URL environment variable is required');
    }

    this.client = new Client({
      serviceUrl, // ✅ Now guaranteed to be string
    });
  }

  async createProducer(topic: string) {
    const producer = await this.client.createProducer({
      topic,
    });
    this.producers.push(producer);
    return producer;
  }

  async createConsumer(topic: string, listener: (message: Message) => void) {
    const consumer = await this.client.subscribe({
      topic,
      subscription: 'jobber',
      listener,
    });
    this.consumers.push(consumer);
    return consumer;
  }

  async onModuleDestroy() {
    // Close all producers
    for (const producer of this.producers) {
      await producer.close();
    }

    // Close all consumers
    for (const consumer of this.consumers) {
      await consumer.close();
    }

    // Close the main client
    await this.client.close();
  }
}
