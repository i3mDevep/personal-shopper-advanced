import type { PersistenceRepository } from '../domain/persistence.repository'

export class PersistenceInfrastructure implements PersistenceRepository {
  constructor(
    private readonly ddb: AWS.DynamoDB.DocumentClient,
    private meetingTable: string
  ) {}

  async putMeeting(title: string, meeting: string): Promise<void> {
    await this.ddb
      .put({
        TableName: this.meetingTable,
        Item: {
          Title: title,
          Data: JSON.stringify(meeting),
          TTL: `${Math.floor(Date.now() / 1000) + 60 * 60 * 24}`,
        },
      })
      .promise()
  }

  async getMeeting(
    title: string
  ): Promise<AWS.Chime.CreateMeetingResponse | undefined> {
    const result = await this.ddb
      .get({
        TableName: this.meetingTable,
        Key: {
          Title: title,
        },
      })
      .promise()

    if (!result.Item) return undefined

    return JSON.parse(result.Item.Data || '{}')
  }
}
