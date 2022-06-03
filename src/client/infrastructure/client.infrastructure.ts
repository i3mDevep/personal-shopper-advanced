import DynamoDBService from '@shared/persistence/dynamodb/infrastructure/dynamodb.infrastructure'

import type { ClientModel } from '../domain/client.model'
import type { ClientRepository } from '../domain/client.repository'

export class ClientInfrastructure
  extends DynamoDBService<ClientModel>
  implements ClientRepository
{
  test(): Promise<string> {
    throw new Error('Method not implemented.')
  }
}
