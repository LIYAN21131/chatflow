"use client";

import { useRouter } from "next/navigation";
import { CircleAlert } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants/config";
import { useTaskStore } from "@/store/useTaskStore";

export function FailedView() {
  const router = useRouter();
  const clearChatText = useTaskStore((state) => state.clearChatText);

  return (
    <AppShell activeTab="识别" hideTab>
      <div className="flex min-h-[78dvh] flex-col justify-center">
        <EmptyState
          icon={<CircleAlert size={38} />}
          title="暂未识别到明确任务"
          description="可以尝试粘贴包含时间、事项、负责人等信息的聊天内容"
          actions={
            <>
              <Button
                onClick={() => {
                  clearChatText();
                  router.push(ROUTES.home);
                }}
              >
                重新粘贴
              </Button>
              <Button variant="secondary" onClick={() => router.push(`${ROUTES.task}/new/edit`)}>
                手动创建任务
              </Button>
            </>
          }
        />
      </div>
    </AppShell>
  );
}
