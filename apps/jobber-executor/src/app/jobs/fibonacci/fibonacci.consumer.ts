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
    this.logger.debug(
      `FibonacciConsumer.handleMessage for data: ${data.iterations}`
    );
    const result = this.fibonacciFastDoubling(data.iterations);
    this.logger.debug(`Fibonacci result for ${data.iterations}: ${result}`);
  }

  private fibonacci(n: number): number {
    if (n <= 1) {
      return n;
    }
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }

  private fibonacciFastDoubling(n: number): bigint | string {
    if (n === 0) {
      return BigInt(0);
    }

    let a = BigInt(0);
    let b = BigInt(1);
    let m = BigInt(1); // Represents 2^k where k is the highest bit of n

    // Find the highest bit
    while (m <= n) {
      m <<= BigInt(1);
    }
    m >>= BigInt(1); // Back to the highest bit

    while (m > BigInt(0)) {
      // Square the matrix [0,1;1,1]
      const c = a * (BigInt(2) * b - a);
      const d = a * a + b * b;
      a = c;
      b = d;

      if ((BigInt(n) & m) !== BigInt(0)) {
        // Multiply by [0,1;1,1]
        const temp_a = b;
        const temp_b = a + b;
        a = temp_a;
        b = temp_b;
      }
      m >>= BigInt(1);
    }
    return a;
  }
}
