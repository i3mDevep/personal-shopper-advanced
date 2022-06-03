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
  async getAdviserForAccount(
    account: string
  ): Promise<Result<AdviserModel | Record<string, unknown>>> {
    const res = await this.db
      .query({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :account and begins_with(SK,:sk)',
        FilterExpression: 'active = :active',
        ExpressionAttributeValues: {
          ':account': `${ID.Account}#${account}`,
          ':sk': `${ID.Adviser}#`,
          ':active': true,
        },
      })
      .promise()

    return ResponseDto('123', res.Items, res.Count)
  }

  async getAdviserForState(
    account: string,
    state: string
  ): Promise<Result<AdviserModel | Record<string, unknown>>> {
    const res = await this.db
      .query({
        TableName: this.tableName,
        IndexName: 'stateIndex',
        KeyConditionExpression: 'account = :account and stateRole = :stateRole',
        FilterExpression: 'active = :active',
        ExpressionAttributeValues: {
          ':account': account,
          ':stateRole': `${ID.Adviser}#${ID.State}#${state}`,
          ':active': true,
        },
      })
      .promise()

    return ResponseDto('123', res.Items, res.Count)
  }

  async advicerSearchAvailable(account: string) {
    const res = await this.getAdviserForState(account, 'AVAILABLE')

    return res
  }
}
