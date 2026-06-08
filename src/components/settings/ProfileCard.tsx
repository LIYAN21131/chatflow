"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Camera, UserRound } from "lucide-react";
import { Card } from "@/components/ui";

const PROFILE_NAME_KEY = "chat-task-assistant.profileName";
const PROFILE_AVATAR_KEY = "chat-task-assistant.profileAvatar";

type ProfileCardProps = {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  continuousDays: number;
};

export function ProfileCard({
  totalTasks,
  completedTasks,
  completionRate,
  continuousDays,
}: ProfileCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nickname, setNickname] = useState("任务整理用户");
  const [draftName, setDraftName] = useState("任务整理用户");
  const [avatar, setAvatar] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  const profileStats = [
    { label: "累计创建", value: String(totalTasks) },
    { label: "已完成", value: String(completedTasks) },
    { label: "完成率", value: `${completionRate}%` },
    { label: "连续完成", value: `${continuousDays}天` },
  ] as const;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedName = window.localStorage.getItem(PROFILE_NAME_KEY);
      const savedAvatar = window.localStorage.getItem(PROFILE_AVATAR_KEY);

      if (savedName) {
        setNickname(savedName);
        setDraftName(savedName);
      }

      if (savedAvatar) {
        setAvatar(savedAvatar);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleSaveProfile = () => {
    const nextName = draftName.trim() || "任务整理用户";
    setNickname(nextName);
    setDraftName(nextName);
    window.localStorage.setItem(PROFILE_NAME_KEY, nextName);
    setIsEditing(false);
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") return;
      setAvatar(result);
      window.localStorage.setItem(PROFILE_AVATAR_KEY, result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-100"
            aria-label="上传头像"
          >
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="用户头像" className="size-full object-cover" />
            ) : (
              <UserRound size={28} />
            )}
            <span className="absolute bottom-0 right-0 grid size-5 place-items-center rounded-full bg-blue-600 text-white ring-2 ring-white">
              <Camera size={11} />
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />

          <div className="min-w-0">
            {isEditing ? (
              <input
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                className="h-9 w-full rounded-xl border border-blue-100 bg-blue-50 px-3 text-[16px] font-semibold text-slate-900 outline-none focus:border-blue-400"
              />
            ) : (
              <p className="truncate text-[17px] font-semibold text-slate-950">{nickname}</p>
            )}
            <p className="mt-1 text-sm leading-5 text-slate-500">高效整理每一次聊天任务</p>
          </div>
        </div>

        <button
          onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
          className="h-8 shrink-0 rounded-full bg-blue-50 px-3 text-xs font-semibold text-blue-600"
        >
          {isEditing ? "保存" : "编辑"}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-2 border-t border-slate-100 pt-4">
        {profileStats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-slate-50 px-1 py-2 text-center">
            <p className="text-[18px] font-bold text-slate-950">{stat.value}</p>
            <p className="mt-1 text-[11px] leading-4 text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
