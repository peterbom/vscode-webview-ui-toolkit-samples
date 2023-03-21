import { MessageSource, MessageSubscriber } from "../../../src/contract/messaging";

export class Scenario {
  private constructor(
    readonly name: string,
    readonly factory: () => JSX.Element
  ) {}

  static create(name: string, factory: () => JSX.Element): Scenario {
    return new Scenario(name, factory);
  }

  withSubscription<TListenMsg>(context: MessageSource<TListenMsg>, subscriber: MessageSubscriber<TListenMsg>): Scenario {
    const factory = () => {
      // Set up the subscription before creating the element
      context.subscribeToMessages(subscriber);
      return this.factory();
    };
    return new Scenario(this.name, factory);
  }
}
