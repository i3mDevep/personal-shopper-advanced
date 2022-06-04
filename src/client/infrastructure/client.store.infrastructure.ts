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
  async getClienForState(
    account: string,
    adviser: string,
    state: string
  ): Promise<Result<ClientModel | Record<string, unknown>>> {
    console.log(`${ID.Account}#${account}#${ID.Adviser}#${adviser}`)
    console.log(`${ID.StateClient}#${state}`)

    const res = await this.db
      .query({
        TableName: this.tableName,
        IndexName: 'stateClientIndex',
        KeyConditionExpression: 'GSI1PK = :pk and stateClient = :sk',
        ExpressionAttributeValues: {
          ':pk': `${ID.Account}#${account}#${ID.Adviser}#${adviser}`,
          ':sk': `${ID.StateClient}#${state}`,
        },
      })
      .promise()

    return ResponseDto('123', res.Items, res.Count)
  }
}
