import type { BaseRepository } from '@shared/persistence/dynamodb/domain/dynamodb.repository'
import type Result from '@shared/persistence/dynamodb/application/result.interface'

import type { AdviserModel } from './adviser.model'

export interface AdviserRepository extends BaseRepository<AdviserModel> {
  getAdviserForState(
    account: string,
    state: string
  ): Promise<Result<AdviserModel | Record<string, unknown>>>

  getAdviserForAccount(
    account: string
  ): Promise<Result<AdviserModel | Record<string, unknown>>>
}
