export type TaskStatus = "pending" | "in_progress" | "done";

export type TaskDTO = {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  status: TaskStatus;
  dueDate: string;
};

export type CategoryDTO = {
  id: string;
  name: string;
  color: string;
};

export type TaskFormInput = Omit<TaskDTO, "id">;

export type TaskFilter = {
  categoryId: "all" | string;
  status: "all" | TaskStatus;
};

export type DashboardSummary = {
  total: number;
  done: number;
  pending: number;
  inProgress: number;
};
