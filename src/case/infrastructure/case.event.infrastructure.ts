import { BridgeInfrastructure } from '@shared/event-bridge/infrastructure/event.infrastructure'
import type { BridgeRepository } from '@shared/event-bridge/domain/event.repository'

const { BUS_PERSONAL_SHOPPER } = process.env

export class CaseEventInfrastructure
  extends BridgeInfrastructure
  implements BridgeRepository
{
  constructor() {
    super(BUS_PERSONAL_SHOPPER, 'custom.personal-shopper')
  }
}
