import { Injectable } from '@nestjs/common';
import { PulsarClient, PulsarConsumer } from '@jobber/pulsar';
import { OnModuleInit } from '@nestjs/common';
import { FibonacciData } from './fibonacci-data.interface';

@Injectable()
export class FibonacciConsumer
  extends PulsarConsumer<FibonacciData>
  implements OnModuleInit
{
  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient, 'Fibonacci');
  }

  protected async handleMessage(data: FibonacciData): Promise<void> {
    this.logger.debug(`FibonacciConsumer.handleMessage`);
    const result = this.fibonacci(data.iterations);
    this.logger.debug(`Fibonacci result: ${result}`);
  }

  private fibonacci(n: number): number {
    if (n <= 1) {
      return n;
    }
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
}
