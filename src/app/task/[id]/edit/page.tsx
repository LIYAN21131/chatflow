import { TaskEditorView } from "@/features/task-management/views";

type TaskEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TaskEditPage({ params }: TaskEditPageProps) {
  const { id } = await params;
  return <TaskEditorView taskId={id} />;
}
