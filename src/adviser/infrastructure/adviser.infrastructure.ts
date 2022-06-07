import { ResponseDto } from '@shared/persistence/dynamodb/application/response.dto'
import type Result from '@shared/persistence/dynamodb/application/result.interface'
import DynamoDBService from '@shared/persistence/dynamodb/infrastructure/dynamodb.infrastructure'
import { identityDatabase as ID } from 'src/shared/helper/identity.database'

import type { AdviserModel } from '../domain/adviser.model'
import type { AdviserRepository } from '../domain/adviser.repository'

export class AdviserInfrastructure
  extends DynamoDBService<AdviserModel>
  implements AdviserRepository
{
  async getAdviserValidateClient(
    key: Record<string, string>,
    client: string
  ): Promise<Result<AdviserModel | Record<string, unknown>>> {
    const adviser = await this.getItem(key)

    const client_ = await this.db
      .get({
        TableName: this.tableName,
        Key: {
          PK: `${ID.Client}#${client}`,
          SK: `${ID.Client}#${client}`,
        },
      })
      .promise()

    if (!client_.Item) return undefined

    return adviser
  }

  async getAdviserForAccount(
    account: string,
    state?: string
  ): Promise<Result<AdviserModel | Record<string, unknown>>> {
    const addQueryState = {
      FilterExpression: state ? ' and #state = :state' : '',
      ExpressionAttributeNames: state ? { '#state': 'state' } : {},
      ExpressionAttributeValues: state ? { ':state': state } : {},
    }

    const res = await this.db
      .query({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :account and begins_with(SK,:sk)',
        FilterExpression: `#active = :active${addQueryState.FilterExpression}`,
        ExpressionAttributeValues: {
          ':account': `${ID.Account}#${account}`,
          ':sk': `${ID.Adviser}#`,
          ':active': true,
          ...addQueryState.ExpressionAttributeValues,
        },
        ExpressionAttributeNames: {
          '#active': 'active',
          ...addQueryState.ExpressionAttributeNames,
        },
      })
      .promise()

    return ResponseDto('123', res.Items, res.Count)
  }
}
