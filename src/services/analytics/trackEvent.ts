import { ENABLE_ANALYTICS } from "@/constants/config";

export type AnalyticsEventName =
  | "chat_pasted"
  | "analysis_started"
  | "analysis_completed"
  | "task_confirmed"
  | "task_created"
  | "task_completed"
  | "task_deleted";

export type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

export function trackEvent(eventName: AnalyticsEventName, payload: AnalyticsPayload = {}) {
  if (!ENABLE_ANALYTICS) return;

  if (process.env.NODE_ENV === "development") {
    console.info("[analytics]", eventName, payload);
  }
}
