import DynamoDBService from '@shared/persistence/dynamodb/infrastructure/dynamodb.infrastructure'
import type Result from '@shared/persistence/dynamodb/application/result.interface'
import { identityDatabase as ID } from 'src/shared/helper/identity.database'
import { ResponseDto } from '@shared/persistence/dynamodb/application/response.dto'

import type { CaseModel } from '../domain/case.model'
import type { StoreRepository } from '../domain/case.store.repository'

export class CaseInfrastructure
  extends DynamoDBService<CaseModel>
  implements StoreRepository
{
  async getClienForState(
    account: string,
    adviser: string,
    state: string
  ): Promise<Result<CaseModel | Record<string, unknown>>> {
    const res = await this.db
      .query({
        TableName: this.tableName,
        IndexName: 'stateClientIndex',
        KeyConditionExpression: 'GSI1PK = :pk and stateClient = :sk',
        ExpressionAttributeValues: {
          ':pk': `${ID.Account}#${account}#${ID.Adviser}#${adviser}`,
          ':sk': `${ID.StateCase}#${state}`,
        },
      })
      .promise()

    return ResponseDto('123', res.Items, res.Count)
  }
}
