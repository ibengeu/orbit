import type { User } from "@/lib/orbit/types";

export const YOU = "u_me";
export const STORAGE_KEY = "orbit:v1";

export const REACTIONS = ["👍", "❤️", "😂", "🎉", "👀", "🙌"] as const;

export const EMOJIS = [
  "👍",
  "🎉",
  "✅",
  "👀",
  "🔥",
  "🙏",
  "😮",
  "👏",
  "💯",
  "🐛",
  "📌",
  "⏳",
  "😅",
  "🤝",
  "💡",
  "🚀",
] as const;

export const USERS: User[] = [
  {
    id: "u_me",
    name: "Alex Morgan",
    handle: "alex",
    initials: "AM",
    title: "Product",
    presence: "online",
    status: "Launch desk",
  },
  { id: "priya", name: "Priya Shah", handle: "priya", initials: "PS", title: "Engineering", presence: "online" },
  {
    id: "noah",
    name: "Noah Adeyemi",
    handle: "noah",
    initials: "NA",
    title: "Design",
    presence: "away",
    status: "Reviewing crops",
  },
  { id: "jules", name: "Jules Ortega", handle: "jules", initials: "JO", title: "Program", presence: "online" },
  { id: "lena", name: "Lena Park", handle: "lena", initials: "LP", title: "Design", presence: "online" },
  { id: "samir", name: "Samir Okonkwo", handle: "samir", initials: "SO", title: "Engineering", presence: "offline" },
  { id: "avery", name: "Avery Quinn", handle: "avery", initials: "AQ", title: "Launch", presence: "online" },
  {
    id: "kai",
    name: "Kai Nakamura",
    handle: "kai",
    initials: "KN",
    title: "Support",
    presence: "away",
    status: "On tickets",
  },
  { id: "mina", name: "Mina Brooks", handle: "mina", initials: "MB", title: "Operations", presence: "online" },
  { id: "theo", name: "Theo Marlow", handle: "theo", initials: "TM", title: "Research", presence: "offline" },
];

export const AVATAR_CLASS: Record<string, string> = {
  u_me: "bg-avatar-alex",
  priya: "bg-avatar-priya",
  noah: "bg-avatar-noah",
  jules: "bg-avatar-jules",
  lena: "bg-avatar-lena",
  samir: "bg-avatar-samir",
  avery: "bg-avatar-avery",
  kai: "bg-avatar-kai",
  mina: "bg-avatar-mina",
  theo: "bg-avatar-theo",
};
