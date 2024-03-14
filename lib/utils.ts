import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function urlDecode(text:string) {
  return decodeURIComponent(text);
}

export function delEmpty_tag(tag: string): string[] {
  let tags = tag.split(",")
  if ((tags && tags.length !== 0)){
    tags = tags.filter(item => item.trim() !== '');
  }
  return tags
}