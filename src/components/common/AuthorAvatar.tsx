import React from "react";
import { PLACEHOLDER_AVATAR } from "../../constants/placeholders";

interface AuthorAvatarProps {
  src?: string | null;
  alt?: string;
  className?: string;
}

/**
 * Reusable AuthorAvatar component.
 * Displays the provided image URL or falls back to PLACEHOLDER_AVATAR ("ĐANG CẬP NHẬT").
 */
export default function AuthorAvatar({
  src,
  alt = "Tác giả",
  className = "w-full h-full object-cover",
}: AuthorAvatarProps) {
  const imageSrc = src && src.trim() !== "" ? src : PLACEHOLDER_AVATAR;

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
}
