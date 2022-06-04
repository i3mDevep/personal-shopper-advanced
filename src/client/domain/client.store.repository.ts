import type Result from '@shared/persistence/dynamodb/application/result.interface'
import type { BaseRepository } from '@shared/persistence/dynamodb/domain/dynamodb.repository'

import type { ClientModel } from './client.model'

export interface StoreRepository extends BaseRepository<ClientModel> {
  getClienForState(
    account: string,
    adviser: string,
    state: string
  ): Promise<Result<ClientModel | Record<string, unknown>>>
}
