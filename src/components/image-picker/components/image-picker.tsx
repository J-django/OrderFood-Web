import { useRef } from "react";
import type { ChangeEvent } from "react";
import { ActionButton } from "@/components/action-button";
import { Button } from "@/components/ui/button";
import { IMAGE_MAX_SIZE } from "@/constants";
import { cn } from "@/utils";
import type { ImagePickerProps } from "../types";

function ImagePicker({
  src,
  alt,
  accept = "image/*",
  maxSize = IMAGE_MAX_SIZE,
  selectLabel = "选择图片",
  deleteLabel = "删除图片",
  className,
  onChange,
  onDelete,
  onFileTooLarge,
  name,
  required,
  disabled,
}: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasImage = Boolean(src);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    if (file.size > maxSize) {
      onFileTooLarge?.(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onChange(reader.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div
      className={cn(
        "relative aspect-4/3 h-auto w-full overflow-hidden rounded-2xl bg-[#f8f8f8]",
        className,
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        name={name}
        required={required && !hasImage}
        disabled={disabled}
        className="hidden"
        onChange={handleFileChange}
      />

      {hasImage ? (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <Button
          type="button"
          aria-label={selectLabel}
          onClick={() => inputRef.current?.click()}
          disablePressMotion={true}
          disabled={disabled}
          className="group size-full flex-col justify-center border-none bg-transparent px-0 text-sm text-[#999]"
        >
          <span className="absolute inset-0 grid place-items-center transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <span className="icon-[lucide--camera] size-6 text-[#999]" />
          </span>
        </Button>
      )}

      {hasImage ? (
        <ActionButton
          type="button"
          variant="danger"
          aria-label={deleteLabel}
          onClick={onDelete}
          disabled={disabled}
          className="absolute top-1 right-1 z-10"
        >
          <span className="icon-[tabler--x] size-4" aria-hidden="true" />
        </ActionButton>
      ) : null}
    </div>
  );
}

export { ImagePicker };
