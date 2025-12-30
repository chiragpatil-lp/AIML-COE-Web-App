import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

function Avatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="avatar" className={cn("avatar", className)} {...props} />
  );
}

interface AvatarImageProps
  extends Omit<React.ComponentProps<"img">, "src" | "width" | "height"> {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

function AvatarImage({ className, alt = "", src, ...props }: AvatarImageProps) {
  return (
    <Image
      data-slot="avatar-image"
      className={cn("rounded-full", className)}
      alt={alt}
      src={src}
      width={40}
      height={40}
      {...props}
    />
  );
}

function AvatarFallback({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-fallback"
      className={cn(
        "placeholder rounded-full bg-base-300 text-base-content",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
