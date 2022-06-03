import BaseApplication from '@shared/persistence/dynamodb/application/dynamodb.application'

import type { ClientModel } from '../domain/client.model'
import type { ClientRepository } from '../domain/client.repository'

export class ClientApplication extends BaseApplication<ClientModel> {
  constructor(private clientRepository: ClientRepository) {
    super(clientRepository)
  }

  async test() {
    await this.clientRepository.test()
  }
}
