import { Job } from '../decorators/job.decorator';
import { AbstractJob } from './abstract.job';

@Job({
  name: 'Fibonacci',
  description: 'Generate a Fibonnacci sequence and store it in the DB.',
})
export class FibonacciJob extends AbstractJob {
  async execute(): Promise<void> {
    console.log('Executing FibonacciJob.');
  }
}
