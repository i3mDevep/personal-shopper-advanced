import { EventBridge } from 'aws-sdk'

const eventBridge = new EventBridge({ region: 'us-east-1' })

export class BridgeInfrastructure {
  constructor(private bus: string, private source: string) {}
  async sendMessage(messages: Array<{ DetailType?: string; Detail?: string }>) {
    await eventBridge
      .putEvents({
        Entries: messages.map((message) => ({
          EventBusName: this.bus,
          Source: this.source,
          ...message,
        })),
      })
      .promise()
  }
}
