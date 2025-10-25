import { APP_URL } from "@/constants";
import { Avatar, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

export const avatarVarients = cva("", {
  variants: {
    size: {
      default: "h-9 w-9",
      xs: "h-4 w-4",
      sm: "h-6 w-6",
      lg: "h-10 w-10",
      xlg: "h-[160px] w-[160px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface UserAvatarProps extends VariantProps<typeof avatarVarients> {
  imageUrl?: string;
  name: string;
  className?: string;
  onClick?: () => void;
}

export const UserAvatar = ({
  imageUrl,
  name,
  size,
  className,
  onClick,
}: UserAvatarProps) => {
  return (
    <Avatar className={cn(avatarVarients({size,className}))} onClick={onClick}>
      <AvatarImage src={imageUrl || `${APP_URL}/user_placeholder.svg`} alt={name} /> 
    </Avatar>
  );
};
