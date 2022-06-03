import type { BaseRepository } from '@shared/persistence/dynamodb/domain/dynamodb.repository'
import type Result from '@shared/persistence/dynamodb/application/result.interface'

import type { ClientModel } from './client.model'

export interface StoreRepository extends BaseRepository<ClientModel> {
  getClientForState(
    account: string,
    state: string
  ): Promise<Result<ClientModel | Record<string, unknown>>>
}
