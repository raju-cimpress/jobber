import { PulsarClient } from '@jobber/pulsar';
import { Job } from '../../decorators/job.decorator';
import { AbstractJob } from '../abstract.job';
import { FibonacciData } from './fibonacci-data.message';

@Job({
  name: 'Fibonacci',
  description: 'Generate a Fibonnacci sequence and store it in the DB.',
})
export class FibonacciJob extends AbstractJob<FibonacciData> {
  protected dataClass = FibonacciData;
  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient);
  }
}
