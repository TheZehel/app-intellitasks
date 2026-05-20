import IntelliTasksWorkspace from "@/components/intellitasks-workspace";
import { getIntelliTasksData } from "@/lib/intellitasks-data";

export const dynamic = "force-dynamic";

export default async function CalendarioPage() {
  const data = await getIntelliTasksData();

  return <IntelliTasksWorkspace initialData={data} view="calendar" />;
}
