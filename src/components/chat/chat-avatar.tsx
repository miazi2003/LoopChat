import { Users } from "lucide-react";

type ChatAvatarProps = {
  name: string;
  isGroup?: boolean;
  size?: "sm" | "md" | "lg";
};

const colorClasses = [
  "bg-[#dcefe3] text-[#23713a]",
  "bg-[#e5e8f7] text-[#4d5c94]",
  "bg-[#f7e7d8] text-[#945f32]",
  "bg-[#f3dfe8] text-[#8b4863]",
  "bg-[#dcecef] text-[#34717a]"
];

const sizeClasses = {
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-12 w-12 text-base"
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "LC";
}

function getColorClass(name: string) {
  const value = Array.from(name).reduce(
    (total, character) => total + character.charCodeAt(0),
    0
  );

  return colorClasses[value % colorClasses.length];
}

export function ChatAvatar({
  name,
  isGroup = false,
  size = "md"
}: ChatAvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${
        sizeClasses[size]
      } ${isGroup ? "bg-[#dcefe3] text-[#23713a]" : getColorClass(name)}`}
    >
      {isGroup ? <Users size={size === "sm" ? 16 : 19} /> : getInitials(name)}
    </span>
  );
}
