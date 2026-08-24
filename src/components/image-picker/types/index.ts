import type { ComponentProps } from "react";

type ImagePickerProps = {
  src?: string;
  alt?: string;
  accept?: string;
  maxSize?: number;
  selectLabel?: string;
  deleteLabel?: string;
  className?: string;
  onChange: (src: string) => void;
  onDelete: () => void;
  onFileTooLarge?: (file: File) => void;
} & Pick<ComponentProps<"input">, "name" | "required" | "disabled">;

export type { ImagePickerProps };
