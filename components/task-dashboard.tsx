"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import type { CategoryDTO, DashboardSummary, TaskDTO, TaskFormInput, TaskStatus } from "@/lib/domain/types";

const statusLabels: Record<TaskStatus, string> = {
  pending: "Pendente",
  in_progress: "Em andamento",
  done: "Concluida",
};

const statusClasses: Record<TaskStatus, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  in_progress: "bg-blue-50 text-blue-700 ring-blue-200",
  done: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const emptySummary: DashboardSummary = {
  total: 0,
  done: 0,
  pending: 0,
  inProgress: 0,
};

export default function TaskDashboard() {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [summary, setSummary] = useState<DashboardSummary>(emptySummary);
  const [form, setForm] = useState<TaskFormInput>(() => createEmptyForm([]));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | TaskStatus>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        categoryId: categoryFilter,
        status: statusFilter,
      });
      const response = await fetch(`/api/tasks?${params.toString()}`);
      const data = (await response.json()) as {
        tasks: TaskDTO[];
        summary: DashboardSummary;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.message ?? "Nao foi possivel carregar as tarefas.");
      }

      setTasks(data.tasks);
      setSummary(data.summary);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Nao foi possivel carregar as tarefas.");
    } finally {
      setIsLoading(false);
    }
  }, [categoryFilter, statusFilter]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = (await response.json()) as {
          categories: CategoryDTO[];
          message?: string;
        };

        if (!response.ok) {
          throw new Error(data.message ?? "Nao foi possivel carregar as categorias.");
        }

        setCategories(data.categories);
        setForm((current) => ({
          ...current,
          categoryId: current.categoryId || data.categories[0]?.id || "",
        }));
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Nao foi possivel carregar as categorias.");
      }
    }

    void loadCategories();
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  function getCategory(categoryId: string) {
    return categories.find((category) => category.id === categoryId) ?? { id: "", name: "Sem categoria", color: "#64748b" };
  }

  function resetForm() {
    setForm(createEmptyForm(categories));
    setEditingId(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(editingId ? `/api/tasks/${editingId}` : "/api/tasks", {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.message ?? "Nao foi possivel salvar a tarefa.");
      }

      await loadTasks();
      resetForm();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Nao foi possivel salvar a tarefa.");
    } finally {
      setIsSaving(false);
    }
  }

  function startEditing(task: TaskDTO) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description,
      categoryId: task.categoryId,
      status: task.status,
      dueDate: task.dueDate,
    });
  }

  async function deleteTask(taskId: string) {
    setError("");

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.message ?? "Nao foi possivel excluir a tarefa.");
      }

      await loadTasks();

      if (editingId === taskId) {
        resetForm();
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Nao foi possivel excluir a tarefa.");
    }
  }

  async function toggleDone(taskId: string) {
    setError("");

    try {
      const response = await fetch(`/api/tasks/${taskId}/toggle`, {
        method: "PATCH",
      });
      const data = (await response.json()) as {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.message ?? "Nao foi possivel atualizar a tarefa.");
      }

      await loadTasks();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Nao foi possivel atualizar a tarefa.");
    }
  }

  return (
    <main className="min-h-screen bg-surface">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">IntelliTasks</p>
            <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">Gestao de tarefas</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Organize tarefas por categoria, acompanhe status e mantenha uma visao rapida das pendencias.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:min-w-[520px]">
            <SummaryCard label="Total" value={summary.total} />
            <SummaryCard label="Pendentes" value={summary.pending} tone="amber" />
            <SummaryCard label="Andamento" value={summary.inProgress} tone="blue" />
            <SummaryCard label="Concluidas" value={summary.done} tone="green" />
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[390px_1fr]">
          <form className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-soft" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-ink">{editingId ? "Editar tarefa" : "Nova tarefa"}</h2>
              {editingId ? (
                <button
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  type="button"
                  onClick={resetForm}
                >
                  Cancelar
                </button>
              ) : null}
            </div>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Titulo</span>
                <input
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Ex: Entregar atividade"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Descricao</span>
                <textarea
                  className="mt-1 min-h-24 w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Detalhe o que precisa ser feito"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Categoria</span>
                  <select
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    value={form.categoryId}
                    onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Status</span>
                  <select
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    value={form.status}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, status: event.target.value as TaskStatus }))
                    }
                  >
                    {Object.entries(statusLabels).map(([status, label]) => (
                      <option key={status} value={status}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Data de vencimento</span>
                <input
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  type="date"
                  value={form.dueDate}
                  onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))}
                />
              </label>

              <button
                className="w-full rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
                disabled={isSaving || categories.length === 0}
                type="submit"
              >
                {isSaving ? "Salvando..." : editingId ? "Salvar alteracoes" : "Criar tarefa"}
              </button>
            </div>
          </form>

          <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-ink">Tarefas</h2>
                <p className="mt-1 text-sm text-slate-600">
                  {tasks.length} de {summary.total} tarefas exibidas
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[440px]">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Filtrar categoria</span>
                  <select
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    value={categoryFilter}
                    onChange={(event) => setCategoryFilter(event.target.value)}
                  >
                    <option value="all">Todas</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Filtrar status</span>
                  <select
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value as "all" | TaskStatus)}
                  >
                    <option value="all">Todos</option>
                    {Object.entries(statusLabels).map(([status, label]) => (
                      <option key={status} value={status}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {error ? (
              <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            ) : null}

            <div className="mt-5 grid gap-4">
              {isLoading ? (
                <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
                  <h3 className="text-base font-semibold text-ink">Carregando tarefas</h3>
                  <p className="mt-2 text-sm text-slate-600">Buscando dados persistidos no banco local.</p>
                </div>
              ) : tasks.length ? (
                tasks.map((task) => {
                  const category = getCategory(task.categoryId);

                  return (
                    <article
                      className="rounded-lg border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
                      key={task.id}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700"
                              style={{ color: category.color }}
                            >
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: category.color }}
                              />
                              {category.name}
                            </span>
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusClasses[task.status]}`}
                            >
                              {statusLabels[task.status]}
                            </span>
                          </div>
                          <h3 className="mt-3 text-base font-semibold text-ink">{task.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{task.description || "Sem descricao."}</p>
                          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                            Vencimento: {task.dueDate ? formatDate(task.dueDate) : "Nao informado"}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 sm:justify-end">
                          <button
                            className="rounded-md border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
                            type="button"
                            onClick={() => toggleDone(task.id)}
                          >
                            {task.status === "done" ? "Reabrir" : "Concluir"}
                          </button>
                          <button
                            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
                            type="button"
                            onClick={() => startEditing(task)}
                          >
                            Editar
                          </button>
                          <button
                            className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                            type="button"
                            onClick={() => deleteTask(task.id)}
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
                  <h3 className="text-base font-semibold text-ink">Nenhuma tarefa encontrada</h3>
                  <p className="mt-2 text-sm text-slate-600">Ajuste os filtros ou crie uma nova tarefa.</p>
                </div>
              )}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  tone = "slate",
}: {
  label: string;
  value: number;
  tone?: "slate" | "amber" | "blue" | "green";
}) {
  const tones = {
    slate: "border-slate-200 bg-white text-slate-700",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    blue: "border-blue-200 bg-blue-50 text-blue-800",
    green: "border-emerald-200 bg-emerald-50 text-emerald-800",
  };

  return (
    <div className={`rounded-lg border p-3 ${tones[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function createEmptyForm(categories: CategoryDTO[]): TaskFormInput {
  return {
    title: "",
    description: "",
    categoryId: categories[0]?.id ?? "",
    status: "pending",
    dueDate: "",
  };
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}`;
}
