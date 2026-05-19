export abstract class BaseEntity {
  protected constructor(private readonly entityId: string) {}

  get id() {
    return this.entityId;
  }
}
