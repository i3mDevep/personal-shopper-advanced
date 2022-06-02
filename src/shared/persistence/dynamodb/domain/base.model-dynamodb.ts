export abstract class BaseModel {
  abstract get pk(): string
  abstract get sk(): string
  abstract toItems(): Record<string, unknown>
  abstract toRemoveKey(): Record<string, unknown>

  public keys() {
    return {
      PK: this.pk,
      SK: this.sk,
    }
  }
}
