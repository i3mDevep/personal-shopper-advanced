import DynamoDBService from '@shared/persistence/dynamodb/infrastructure/dynamodb.infrastructure'
import type Result from '@shared/persistence/dynamodb/application/result.interface'
import { identityDatabase as ID } from 'src/shared/helper/identity.database'
import { ResponseDto } from '@shared/persistence/dynamodb/application/response.dto'

import type { ClientModel } from '../domain/client.model'
import type { StoreRepository } from '../domain/client.store.repository'

export class ClientInfrastructure
  extends DynamoDBService<ClientModel>
  implements StoreRepository
{
  async getClientForState(
    account: string,
    state: string
  ): Promise<Result<ClientModel | Record<string, unknown>>> {
    const res = await this.db
      .query({
        TableName: this.tableName,
        IndexName: 'stateIndex',
        KeyConditionExpression: 'account = :account and stateRole = :stateRole',
        ExpressionAttributeValues: {
          ':account': account,
          ':stateRole': `${ID.Client}#${ID.State}#${state}`,
        },
      })
      .promise()

    return ResponseDto('123', res.Items, res.Count)
  }
}
