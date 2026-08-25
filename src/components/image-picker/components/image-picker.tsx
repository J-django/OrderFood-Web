import { useRef } from "react";
import type { ChangeEvent, ClipboardEvent } from "react";
import { ActionButton } from "@/components/action-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  pasteLabel = "粘贴图片",
  pastePlaceholder = "粘贴图片",
  classes,
  onChange,
  onDelete,
  onFileTooLarge,
  name,
  required,
  disabled,
}: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasImage = Boolean(src);

  function handleFile(file: File) {
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

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = "";
    if (file) handleFile(file);
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    const clipboard = event.clipboardData;
    const imageFile =
      Array.from(clipboard.items)
        .find((item) => item.kind === "file" && item.type.startsWith("image/"))
        ?.getAsFile() ??
      Array.from(clipboard.files).find((file) =>
        file.type.startsWith("image/"),
      );

    if (imageFile) {
      event.preventDefault();
      handleFile(imageFile);
      return;
    }

    const text = clipboard.getData("text").trim();
    if (text.startsWith("data:image/") || /^https?:\/\/\S+$/i.test(text)) {
      event.preventDefault();
      onChange(text);
    }
  }

  return (
    <div
      className={cn(
        "relative aspect-4/3 h-auto w-full overflow-hidden rounded-2xl bg-[#f8f8f8]",
        classes?.container,
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
          className={cn(
            "absolute inset-0 size-full object-cover",
            classes?.image,
          )}
        />
      ) : (
        <Button
          type="button"
          aria-label={selectLabel}
          onClick={() => inputRef.current?.click()}
          disablePressMotion={true}
          disabled={disabled}
          className={cn(
            "group size-full flex-col justify-center border-none bg-transparent px-0 text-sm text-[#999]",
            classes?.button,
          )}
        >
          <span className="absolute inset-0 grid place-items-center transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <span className="icon-[tabler--camera-plus] size-6 text-[#999]" />
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
          className={cn("absolute top-1 right-1 z-10", classes?.deleteButton)}
        >
          <span className="icon-[tabler--x] size-4" aria-hidden="true" />
        </ActionButton>
      ) : null}

      {!hasImage ? (
        <Input
          type="text"
          aria-label={pasteLabel}
          placeholder={pastePlaceholder}
          disabled={disabled}
          onPaste={handlePaste}
          className={cn(
            "absolute right-1 bottom-1 left-1 z-10 h-9 w-auto rounded-xl border-none bg-[#f8f8f8]",
            classes?.pasteInput,
          )}
        />
      ) : null}
    </div>
  );
}

export { ImagePicker };
