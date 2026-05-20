"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CategoryDTO, TaskDTO, TaskFormInput, TaskStatus } from "@/lib/domain/types";
import { formatDate, getCategory, getTasksByStatus, statusLabels, type IntelliTasksData } from "@/lib/intellitasks-model";

type WorkspaceView = "dashboard" | "tasks" | "kanban" | "calendar";

type ModalState =
  | {
      mode: "create";
      task: null;
    }
  | {
      mode: "edit";
      task: TaskDTO;
    };

const navItems = [
  { href: "/", label: "Painel", icon: "IN", view: "dashboard" },
  { href: "/tarefas", label: "Tarefas", icon: "LT", view: "tasks" },
  { href: "/kanban", label: "Kanban", icon: "KB", view: "kanban" },
  { href: "/calendario", label: "Calendario", icon: "CL", view: "calendar" },
];

const statusOrder: TaskStatus[] = ["pending", "in_progress", "done"];

const statusTone: Record<TaskStatus, string> = {
  pending: "bg-tertiary/15 text-tertiary",
  in_progress: "bg-secondary/15 text-secondary",
  done: "bg-emerald-400/15 text-emerald-300",
};

export default function IntelliTasksWorkspace({
  initialData,
  view,
}: {
  initialData: IntelliTasksData;
  view: WorkspaceView;
}) {
  const [tasks, setTasks] = useState(initialData.tasks);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const data = useMemo<IntelliTasksData>(() => {
    const summary = {
      total: tasks.length,
      pending: tasks.filter((task) => task.status === "pending").length,
      inProgress: tasks.filter((task) => task.status === "in_progress").length,
      done: tasks.filter((task) => task.status === "done").length,
    };

    return { ...initialData, tasks, summary };
  }, [initialData, tasks]);

  function openNewTask() {
    setError("");
    setModal({ mode: "create", task: null });
  }

  function openTask(task: TaskDTO) {
    setError("");
    setModal({ mode: "edit", task });
  }

  async function saveTask(input: TaskFormInput) {
    const editingTask = modal?.mode === "edit" ? modal.task : null;
    const response = await fetch(editingTask ? `/api/tasks/${editingTask.id}` : "/api/tasks", {
      method: editingTask ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
    const payload = (await response.json()) as { task?: TaskDTO; message?: string };

    if (!response.ok || !payload.task) {
      throw new Error(payload.message ?? "Nao foi possivel salvar a tarefa.");
    }

    setTasks((current) =>
      editingTask
        ? current.map((task) => (task.id === editingTask.id ? payload.task as TaskDTO : task))
        : [payload.task as TaskDTO, ...current],
    );
    setModal(null);
  }

  async function moveTask(taskId: string, status: TaskStatus) {
    const task = tasks.find((item) => item.id === taskId);

    if (!task || task.status === status) {
      return;
    }

    const previousTasks = tasks;
    setTasks((current) => current.map((item) => (item.id === taskId ? { ...item, status } : item)));

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...task, status }),
      });
      const payload = (await response.json()) as { task?: TaskDTO; message?: string };

      if (!response.ok || !payload.task) {
        throw new Error(payload.message ?? "Nao foi possivel mover a tarefa.");
      }

      setTasks((current) => current.map((item) => (item.id === taskId ? payload.task as TaskDTO : item)));
    } catch (requestError) {
      setTasks(previousTasks);
      setError(requestError instanceof Error ? requestError.message : "Nao foi possivel mover a tarefa.");
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background text-on-background">
      <aside className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-64px)] w-64 flex-col border-r border-outline-variant bg-surface-container-low px-4 py-6 md:flex">
        <div className="mb-6 px-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-container text-xs font-bold text-on-primary-container">
              IT
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface">IntelliTasks</p>
              <p className="text-xs text-on-surface-variant">Gestao de tarefas</p>
            </div>
          </div>
        </div>

        <button
          className="mb-6 flex items-center justify-center rounded-lg bg-primary-container px-4 py-2 text-sm font-semibold text-on-primary-container transition hover:bg-primary"
          type="button"
          onClick={openNewTask}
        >
          Nova tarefa
        </button>

        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const isActive = item.view === view;

            return (
              <Link
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "border-l-4 border-primary bg-secondary-container text-[#00344e]"
                    : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
                }`}
                href={item.href}
                key={item.href}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded bg-surface-container-high text-[10px] font-bold">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-outline-variant pt-4 text-xs text-on-surface-variant">
          <p>Organizacao simples</p>
          <p>Foco no que importa</p>
        </div>
      </aside>

      <div className="md:pl-64">
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {error ? (
            <div className="mb-4 rounded-lg border border-red-400/30 bg-red-950/40 px-4 py-3 text-sm font-semibold text-red-200">
              {error}
            </div>
          ) : null}
          {view === "dashboard" ? <DashboardView data={data} onNewTask={openNewTask} onOpenTask={openTask} /> : null}
          {view === "tasks" ? <TaskListView data={data} onNewTask={openNewTask} onOpenTask={openTask} /> : null}
          {view === "kanban" ? (
            <KanbanView
              data={data}
              draggingId={draggingId}
              onDragStart={setDraggingId}
              onDropTask={(status) => {
                if (draggingId) {
                  void moveTask(draggingId, status);
                }
                setDraggingId(null);
              }}
              onNewTask={openNewTask}
              onOpenTask={openTask}
            />
          ) : null}
          {view === "calendar" ? <CalendarView data={data} onNewTask={openNewTask} onOpenTask={openTask} /> : null}
        </main>
      </div>

      {modal ? (
        <TaskModal
          categories={initialData.categories}
          modal={modal}
          onClose={() => setModal(null)}
          onSave={saveTask}
        />
      ) : null}
    </div>
  );
}

function DashboardView({
  data,
  onNewTask,
  onOpenTask,
}: {
  data: IntelliTasksData;
  onNewTask: () => void;
  onOpenTask: (task: TaskDTO) => void;
}) {
  const upcoming = data.tasks.filter((task) => task.dueDate && task.status !== "done").slice(0, 4);

  return (
    <div className="space-y-6">
      <PageHeader
        actionLabel="Nova tarefa"
        eyebrow="Painel"
        title="Bom dia, Allison."
        description="Veja o andamento das tarefas, prazos e prioridades do projeto."
        onAction={onNewTask}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Total" value={data.summary.total} detail="tarefas cadastradas" />
        <MetricCard label="Pendentes" value={data.summary.pending} detail="aguardando inicio" tone="tertiary" />
        <MetricCard label="Em andamento" value={data.summary.inProgress} detail="em execucao" tone="secondary" />
        <MetricCard label="Concluidas" value={data.summary.done} detail="finalizadas" tone="success" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
        <section className="app-card rounded-lg p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-on-surface">Prioridades proximas</h2>
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">Hoje</span>
          </div>
          <div className="space-y-3">
            {(upcoming.length ? upcoming : data.tasks.slice(0, 4)).map((task) => (
              <TaskRow categories={data.categories} key={task.id} task={task} onOpenTask={onOpenTask} />
            ))}
          </div>
        </section>

        <section className="app-card rounded-lg p-5">
          <h2 className="text-lg font-semibold text-on-surface">Distribuicao</h2>
          <div className="mt-5 space-y-4">
            {statusOrder.map((status) => {
              const amount = getTasksByStatus(data.tasks, status).length;
              const percent = data.summary.total ? Math.round((amount / data.summary.total) * 100) : 0;

              return (
                <div key={status}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-on-surface-variant">{statusLabels[status]}</span>
                    <span className="font-semibold text-on-surface">{percent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-container-highest">
                    <div className="h-2 rounded-full bg-primary-container" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function TaskListView({
  data,
  onNewTask,
  onOpenTask,
}: {
  data: IntelliTasksData;
  onNewTask: () => void;
  onOpenTask: (task: TaskDTO) => void;
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        actionLabel="Nova tarefa"
        eyebrow="Lista"
        title="Tarefas"
        description="Tabela densa para revisar status, categoria e prazo de cada atividade."
        onAction={onNewTask}
      />

      <section className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-surface-container-highest text-xs uppercase tracking-wide text-on-surface-variant">
            <tr>
              <th className="px-4 py-3">Tarefa</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3 text-right">Vencimento</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/70 text-sm">
            {data.tasks.map((task) => {
              const category = getCategory(data.categories, task.categoryId);

              return (
                <tr
                  className="cursor-pointer transition hover:bg-surface-variant/40"
                  key={task.id}
                  onClick={() => onOpenTask(task)}
                >
                  <td className="px-4 py-4">
                    <p className="font-semibold text-on-surface">{task.title}</p>
                    <p className="mt-1 text-xs text-on-surface-variant">{task.description || "Sem descricao."}</p>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-2 text-on-surface-variant">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: category.color }} />
                      {category.name}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right text-on-surface-variant">{formatDate(task.dueDate)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function KanbanView({
  data,
  draggingId,
  onDragStart,
  onDropTask,
  onNewTask,
  onOpenTask,
}: {
  data: IntelliTasksData;
  draggingId: string | null;
  onDragStart: (taskId: string) => void;
  onDropTask: (status: TaskStatus) => void;
  onNewTask: () => void;
  onOpenTask: (task: TaskDTO) => void;
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        actionLabel="Nova tarefa"
        eyebrow="Quadro"
        title="Kanban"
        description="Arraste tarefas entre colunas ou abra um card para editar em modal."
        onAction={onNewTask}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {statusOrder.map((status) => {
          const tasks = getTasksByStatus(data.tasks, status);

          return (
            <section
              className={`rounded-lg border border-outline-variant bg-surface-container-low p-4 transition ${
                draggingId ? "ring-1 ring-primary/40" : ""
              }`}
              key={status}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => onDropTask(status)}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">
                  {statusLabels[status]} <span className="text-outline">{tasks.length}</span>
                </h2>
                <button className="text-primary" type="button" onClick={onNewTask}>
                  +
                </button>
              </div>
              <div className="space-y-3">
                {tasks.map((task) => {
                  const category = getCategory(data.categories, task.categoryId);

                  return (
                    <article
                      className="cursor-grab rounded-lg border border-outline-variant bg-surface-container p-4 transition hover:bg-surface-container-high active:cursor-grabbing"
                      draggable
                      key={task.id}
                      onClick={() => onOpenTask(task)}
                      onDragStart={() => onDragStart(task.id)}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-secondary">{category.name}</span>
                        <span className="text-xs text-outline">...</span>
                      </div>
                      <h3 className="text-sm font-semibold leading-5 text-on-surface">{task.title}</h3>
                      <p className="mt-2 text-xs leading-5 text-on-surface-variant">{task.description || "Sem descricao."}</p>
                      <div className="mt-4 flex items-center justify-between text-xs text-on-surface-variant">
                        <span>{formatDate(task.dueDate)}</span>
                        <span className="rounded-full bg-primary-container px-2 py-1 text-[10px] font-bold text-on-primary-container">
                          IA
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function CalendarView({
  data,
  onNewTask,
  onOpenTask,
}: {
  data: IntelliTasksData;
  onNewTask: () => void;
  onOpenTask: (task: TaskDTO) => void;
}) {
  const datedTasks = data.tasks.filter((task) => task.dueDate);
  const days = Array.from({ length: 35 }, (_, index) => index + 1);

  return (
    <div className="space-y-6">
      <PageHeader
        actionLabel="Nova tarefa"
        eyebrow="Calendario"
        title="Maio 2026"
        description="Prazos do projeto organizados em uma grade mensal."
        onAction={onNewTask}
      />

      <section className="rounded-lg border border-outline-variant bg-surface-container-low p-4">
        <div className="mb-2 grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wide text-on-surface-variant">
          {["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"].map((day) => (
            <div className="py-2" key={day}>
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const tasks = datedTasks.filter((task) => Number(task.dueDate.split("-")[2]) === day);

            return (
              <div className="min-h-28 rounded border border-outline-variant bg-background/50 p-2" key={day}>
                <div className="mb-2 text-xs font-semibold text-on-surface-variant">{day}</div>
                <div className="space-y-1">
                  {tasks.slice(0, 2).map((task) => (
                    <button
                      className="block w-full rounded bg-primary-container/70 px-2 py-1 text-left text-[10px] font-semibold text-on-primary-container"
                      key={task.id}
                      type="button"
                      onClick={() => onOpenTask(task)}
                    >
                      {task.title}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function TaskModal({
  categories,
  modal,
  onClose,
  onSave,
}: {
  categories: CategoryDTO[];
  modal: ModalState;
  onClose: () => void;
  onSave: (input: TaskFormInput) => Promise<void>;
}) {
  const [form, setForm] = useState<TaskFormInput>(() => ({
    title: modal.task?.title ?? "",
    description: modal.task?.description ?? "",
    categoryId: modal.task?.categoryId ?? categories[0]?.id ?? "",
    status: modal.task?.status ?? "pending",
    dueDate: modal.task?.dueDate ?? "",
  }));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!form.title.trim()) {
      setError("Informe o titulo da tarefa.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      await onSave({ ...form, title: form.title.trim() });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Nao foi possivel salvar a tarefa.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-10 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-lg border border-outline-variant bg-surface-container text-on-surface shadow-app-modal">
        <div className="flex items-center justify-between border-b border-outline-variant px-5 py-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
            {modal.mode === "create" ? "Nova tarefa" : "Editar tarefa"}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-md border border-outline-variant px-3 py-1.5 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-variant hover:text-on-surface"
              type="button"
              onClick={onClose}
            >
              Fechar
            </button>
            <button
              className="rounded-md bg-primary-container px-3 py-1.5 text-sm font-semibold text-on-primary-container transition hover:bg-primary"
              disabled={isSaving}
              type="button"
              onClick={handleSave}
            >
              {isSaving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>

        <div className="px-8 py-7">
          <input
            className="w-full border-none bg-transparent text-4xl font-bold tracking-normal text-on-surface outline-none placeholder:text-on-surface-variant"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Titulo da tarefa"
          />

          <div className="mt-8 grid gap-3 border-y border-outline-variant py-5 text-sm">
            <PropertyRow label="Status">
              <select
                className="w-full rounded-md border border-outline-variant bg-background px-3 py-2 text-on-surface outline-none focus:border-primary"
                value={form.status}
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as TaskStatus }))}
              >
                {statusOrder.map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status]}
                  </option>
                ))}
              </select>
            </PropertyRow>
            <PropertyRow label="Categoria">
              <select
                className="w-full rounded-md border border-outline-variant bg-background px-3 py-2 text-on-surface outline-none focus:border-primary"
                value={form.categoryId}
                onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </PropertyRow>
            <PropertyRow label="Vencimento">
              <input
                className="w-full rounded-md border border-outline-variant bg-background px-3 py-2 text-on-surface outline-none focus:border-primary"
                type="date"
                value={form.dueDate}
                onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))}
              />
            </PropertyRow>
          </div>

          <label className="mt-6 block">
            <span className="text-sm font-semibold text-on-surface-variant">Descricao</span>
            <textarea
              className="mt-2 min-h-44 w-full resize-y rounded-lg border border-outline-variant bg-background px-4 py-3 text-sm leading-6 text-on-surface outline-none placeholder:text-on-surface-variant focus:border-primary"
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="Escreva os detalhes da tarefa..."
            />
          </label>

          {error ? (
            <div className="mt-4 rounded-md border border-red-400/30 bg-red-950/40 px-4 py-3 text-sm font-medium text-red-200">
              {error}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function PropertyRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[140px_1fr] sm:items-center">
      <span className="font-semibold text-on-surface-variant">{label}</span>
      {children}
    </div>
  );
}

function PageHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  onAction,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <header className="flex flex-col justify-between gap-4 border-b border-outline-variant pb-6 md:flex-row md:items-end">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-primary">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal text-on-surface">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">{description}</p>
      </div>
      {actionLabel && onAction ? (
        <button
          className="w-fit rounded-lg bg-primary-container px-4 py-2 text-sm font-semibold text-on-primary-container transition hover:bg-primary"
          type="button"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      ) : null}
    </header>
  );
}

function MetricCard({
  label,
  value,
  detail,
  tone = "primary",
}: {
  label: string;
  value: number;
  detail: string;
  tone?: "primary" | "secondary" | "tertiary" | "success";
}) {
  const toneClass = {
    primary: "text-primary",
    secondary: "text-secondary",
    tertiary: "text-tertiary",
    success: "text-emerald-300",
  }[tone];

  return (
    <div className="app-card rounded-lg p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">{label}</p>
      <p className={`mt-3 text-3xl font-bold ${toneClass}`}>{value}</p>
      <p className="mt-1 text-xs text-on-surface-variant">{detail}</p>
    </div>
  );
}

function TaskRow({
  task,
  categories,
  onOpenTask,
}: {
  task: TaskDTO;
  categories: CategoryDTO[];
  onOpenTask: (task: TaskDTO) => void;
}) {
  const category = getCategory(categories, task.categoryId);

  return (
    <button
      className="w-full rounded-lg border border-outline-variant bg-surface-container p-4 text-left transition hover:bg-surface-container-high"
      type="button"
      onClick={() => onOpenTask(task)}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-on-surface">{task.title}</p>
          <p className="mt-1 text-xs text-on-surface-variant">{category.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={task.status} />
          <span className="text-xs text-on-surface-variant">{formatDate(task.dueDate)}</span>
        </div>
      </div>
    </button>
  );
}

function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusTone[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
