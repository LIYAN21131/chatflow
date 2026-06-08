import { ReminderSettingsView } from "@/features/reminder";

type ReminderPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReminderPage({ params }: ReminderPageProps) {
  const { id } = await params;
  return <ReminderSettingsView taskId={id} />;
}
