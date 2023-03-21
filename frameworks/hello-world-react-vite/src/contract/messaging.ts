
export interface Command<TName extends string> { command: TName };

export interface MessageSink<TPostMsg> {
  postMessage(message: TPostMsg): void
}

export interface MessageSource<TListenMsg> {
  subscribeToMessages(subscriber: MessageSubscriber<TListenMsg>): void
}

export type MessageContext<TPostMsg, TListenMsg> = MessageSink<TPostMsg> & MessageSource<TListenMsg>;

type MessageHandlers<TMessage> = {
  [command: string]: (message: TMessage) => void
};

export class MessageSubscriber<TMessage> {
  private constructor(
    private readonly handlers: MessageHandlers<TMessage>
  ) {}

  static create<TMessage>(): MessageSubscriber<TMessage> {
    return new MessageSubscriber({});
  }

  getCommands() {
    return Object.keys(this.handlers);
  }

  getHandler(command: string): (message: TMessage) => void {
    const handler = this.handlers[command];
    if (!handler) {
      throw new Error(`No handler found for command ${command}`);
    }
    return handler;
  }

  withHandler<TCommand extends string>(command: TCommand, fn: (message: (Command<TCommand> & TMessage)) => void) {
    let newHandler: MessageHandlers<TMessage> = {};
    newHandler[command] = msg => fn(msg as Command<TCommand> & TMessage);
    const mergedHandlers = { ...this.handlers, ...newHandler };
    return new MessageSubscriber<TMessage>(mergedHandlers);
  }
}
