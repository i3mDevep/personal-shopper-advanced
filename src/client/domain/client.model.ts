import { identityDatabase as ID } from 'src/shared/helper/identity.database'
import { BaseModel } from 'src/shared/persistence/dynamodb/domain/base.model-dynamodb'

export class ClientModel extends BaseModel {
  id: string
  account: string
  fullName: string
  email: string
  phone: string
  state: string

  createdAt: number
  meetAt: number
  finishAt: number

  get GSI1PK(): string {
    return `${ID.Account}#${this.account}#${ID.Adviser}#${this.email}`
  }

  get GSI1SK(): string {
    return `${ID.Client}#${this.id}`
  }

  get stateRoleIndex(): string {
    return `${ID.Client}#${this.id}#${ID.State}#${this.state}`
  }

  get pk(): string {
    return `${ID.Client}#${this.id}`
  }

  get sk(): string {
    return `${ID.Client}#${this.id}`
  }
}
