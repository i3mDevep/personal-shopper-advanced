import { identityDatabase as ID } from 'src/shared/helper/identity.database'
import { BaseSerializer } from '@shared/persistence/dynamodb/domain/dynamodb.serializer'

import type { CaseModel } from './case.model'

export class ClientSerializer extends BaseSerializer {
  constructor(private data?: CaseModel) {
    super()
  }

  toRemoveKey(): Record<string, unknown> {
    return {
      id: this.data.id,
      GSI1PK: this.gsi1pk,
      GSI1SK: this.gsi1sk,
      ...this.toKeyStateClientIndex(),
      account: this.data.account,
      state: this.data.state,
      advisor: this.data.advisor,
      fullName: this.data.fullName,
      email: this.data.email,
      phone: this.data.phone,
      createdAt: this.data.createdAt,
      meetAt: this.data.meetAt,
      finishAt: this.data.finishAt,
    }
  }

  toKeyStateClientIndex() {
    return {
      GSI1PK: this.stateClientPk,
      stateClient: this.stateClientSk,
    }
  }

  get stateClientPk(): string | undefined {
    return this.gsi1pk
  }

  get stateClientSk(): string | undefined {
    if (!this.data.state) return undefined

    return `${ID.StateCase}#${this.data.state}`
  }

  get gsi1pk(): string | undefined {
    if (!this.data.advisor) return undefined

    return `${ID.Account}#${this.data.account}#${ID.Adviser}#${this.data.advisor}`
  }

  get gsi1sk(): string | undefined {
    if (!this.data.advisor) return undefined

    return `${ID.Case}#${this.data.id}`
  }

  get pk(): string {
    return `${ID.Case}#${this.data.id}`
  }

  get sk(): string {
    return `${ID.Case}#${this.data.id}`
  }
}
