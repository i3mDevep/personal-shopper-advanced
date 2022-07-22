import type Result from '@shared/persistence/dynamodb/application/result.interface'
import type { BaseRepository } from '@shared/persistence/dynamodb/domain/dynamodb.repository'

import type { CaseModel } from './case.model'

export interface StoreRepository extends BaseRepository<CaseModel> {
  getClienForState(
    account: string,
    adviser: string,
    state: string
  ): Promise<Result<CaseModel | Record<string, unknown>>>
}
