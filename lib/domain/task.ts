import { BaseEntity } from "./base-entity";
import type { TaskDTO, TaskFormInput, TaskStatus, TaskFilter } from "./types";

export class Task extends BaseEntity {
  constructor(
    id: string,
    private taskTitle: string,
    private taskDescription: string,
    private taskCategoryId: string,
    private taskStatus: TaskStatus,
    private taskDueDate: string,
  ) {
    super(id);
  }

  get title() {
    return this.taskTitle;
  }

  get description() {
    return this.taskDescription;
  }

  get categoryId() {
    return this.taskCategoryId;
  }

  get status() {
    return this.taskStatus;
  }

  get dueDate() {
    return this.taskDueDate;
  }

  update(input: TaskFormInput) {
    this.taskTitle = input.title.trim();
    this.taskDescription = input.description;
    this.taskCategoryId = input.categoryId;
    this.taskStatus = input.status;
    this.taskDueDate = input.dueDate;
  }

  markAsDone() {
    this.taskStatus = "done";
  }

  reopen() {
    this.taskStatus = "pending";
  }

  matchesFilter(filter: TaskFilter) {
    const categoryMatch = filter.categoryId === "all" || this.categoryId === filter.categoryId;
    const statusMatch = filter.status === "all" || this.status === filter.status;

    return categoryMatch && statusMatch;
  }

  toDTO(): TaskDTO {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      categoryId: this.categoryId,
      status: this.status,
      dueDate: this.dueDate,
    };
  }
}
