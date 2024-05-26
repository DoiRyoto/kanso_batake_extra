import { Tag } from "@/type";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function urlDecode(text: string) {
  return decodeURIComponent(text);
}

export function createTags(tag: string, userId: string): Tag[] {
  if (tag.length === 0) return [];

  const now = Date();
  const rowTags = tag.split(",");
  const tags = rowTags.map((tag) => {
    return {
      id: -1,
      name: tag,
      user_id: userId,
      created_at: now,
    };
  });

  return tags;
}
