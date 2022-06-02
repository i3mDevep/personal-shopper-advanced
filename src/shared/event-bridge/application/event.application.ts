import type { BridgeRepository } from '../domain/event.repository'

export class EventApplication {
  constructor(private operation: BridgeRepository) {}
  async sendMessage(messages: Array<{ DetailType?: string; Detail?: string }>) {
    await this.operation.sendMessage(messages)
  }
}
