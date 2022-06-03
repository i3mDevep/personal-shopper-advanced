import { identityDatabase as ID } from 'src/shared/helper/identity.database'
import { BaseSerializer } from '@shared/persistence/dynamodb/domain/dynamodb.serializer'

import type { ClientModel } from './client.model'

export class ClientSerializer extends BaseSerializer {
  constructor(private data?: ClientModel) {
    super()
  }

  toRemoveKey(): Record<string, unknown> {
    return {
      id: this.data.id,
      stateRole: this.stateRoleIndex,
      GSI1PK: this.gsi1pk,
      GSI1SK: this.gsi1sk,
      account: this.data.account,
      state: this.data.state,
      adviser: this.data.advisor,
      fullName: this.data.fullName,
      email: this.data.email,
      phone: this.data.phone,
      createdAt: this.data.createdAt,
      meetAt: this.data.meetAt,
      finishAt: this.data.finishAt,
    }
  }

  get gsi1pk(): string | undefined {
    if (!this.data.advisor) return undefined

    return `${ID.Account}#${this.data.account}#${ID.Adviser}#${this.data.advisor}`
  }

  get gsi1sk(): string | undefined {
    if (!this.data.advisor) return undefined

    return `${ID.Client}#${this.data.id}`
  }

  get stateRoleIndex(): string {
    if (!this.data.state) return undefined

    return `${ID.Client}#${this.data.id}#${ID.State}#${this.data.state}`
  }

  get pk(): string {
    return `${ID.Client}#${this.data.id}`
  }

  get sk(): string {
    return `${ID.Client}#${this.data.id}`
  }
}
