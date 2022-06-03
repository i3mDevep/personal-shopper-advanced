import type { BaseRepository } from '@shared/persistence/dynamodb/domain/dynamodb.repository'

import type { ClientModel } from './client.model'

export interface ClientRepository extends BaseRepository<ClientModel> {
  test(): Promise<string>
}
