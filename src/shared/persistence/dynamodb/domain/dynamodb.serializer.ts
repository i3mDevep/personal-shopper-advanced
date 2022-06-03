export abstract class BaseSerializer {
  abstract get pk(): string
  abstract get sk(): string
  abstract toRemoveKey(): Record<string, unknown>

  public keys() {
    return {
      PK: this.pk,
      SK: this.sk,
    }
  }

  public toItems(): Record<string, unknown> {
    return {
      ...this.keys(),
      ...this.toRemoveKey(),
    }
  }
}
