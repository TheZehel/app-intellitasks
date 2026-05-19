import { BaseEntity } from "./base-entity";
import type { CategoryDTO } from "./types";

export class Category extends BaseEntity {
  constructor(
    id: string,
    private categoryName: string,
    private categoryColor: string,
  ) {
    super(id);
  }

  get name() {
    return this.categoryName;
  }

  get color() {
    return this.categoryColor;
  }

  toDTO(): CategoryDTO {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
    };
  }
}
