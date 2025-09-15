export abstract class AbstractJob {
  abstract execute(): Promise<void>;
}
