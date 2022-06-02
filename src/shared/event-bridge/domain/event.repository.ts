export interface BridgeRepository {
  sendMessage(
    message: Array<{ DetailType?: string; Detail?: string }>
  ): Promise<void>
}
