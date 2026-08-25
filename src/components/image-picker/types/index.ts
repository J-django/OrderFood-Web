import type { ComponentProps } from "react";

type ImagePickerClasses = {
  container?: string;
  button?: string;
  image?: string;
  deleteButton?: string;
  pasteInput?: string;
};

type ImagePickerProps = {
  src?: string;
  alt?: string;
  accept?: string;
  maxSize?: number;
  selectLabel?: string;
  deleteLabel?: string;
  pasteLabel?: string;
  pastePlaceholder?: string;
  classes?: ImagePickerClasses;
  onChange: (src: string) => void;
  onDelete: () => void;
  onFileTooLarge?: (file: File) => void;
} & Pick<ComponentProps<"input">, "name" | "required" | "disabled">;

export type { ImagePickerClasses, ImagePickerProps };
