import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/utils";
import type { DialogProps } from "../types";

function Dialog(props: DialogProps) {
  const {
    open,
    title,
    content,
    children,
    showConfirm = true,
    showCancel = true,
    confirmText = "确认",
    cancelText = "取消",
    maskClosable = true,
    classes,
    styles,
    onConfirm,
    onCancel,
    onClose,
  } = props;

  function handleClose() {
    onClose?.();
  }

  function handleOverlayClick() {
    if (!maskClosable) return;
    handleClose();
  }

  function handleCancel() {
    onCancel?.();
    handleClose();
  }

  function handleConfirm() {
    onConfirm?.();
  }

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            data-slot="dialog-overlay"
            className={cn(
              "absolute inset-0 bg-black/50 backdrop-blur-[2px]",
              classes?.overlay,
            )}
            style={styles?.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={handleOverlayClick}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === "string" ? title : undefined}
            data-slot="dialog-container"
            className={cn(
              "relative mx-6 w-full max-w-80 overflow-hidden rounded-3xl bg-white shadow-xl",
              classes?.container,
            )}
            style={styles?.container}
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {title ? (
              <div
                data-slot="dialog-header"
                className={cn(
                  "text-4.5 px-4 pt-4 text-center font-bold text-stone-900 select-none",
                  classes?.header,
                )}
                style={styles?.header}
              >
                {title}
              </div>
            ) : null}

            <div
              data-slot="dialog-content"
              className={cn(
                "text-3.5 max-h-[60dvh] overflow-y-auto overscroll-contain px-5 pt-4 pb-2 text-center leading-relaxed text-stone-600",
                !title && "pt-5",
                classes?.content,
              )}
              style={styles?.content}
            >
              {content}
              {children}
            </div>

            {showConfirm || showCancel ? (
              <div
                data-slot="dialog-footer"
                className={cn(
                  "grid grid-cols-2 gap-3 p-3",
                  !showCancel && "grid-cols-1",
                  classes?.footer,
                )}
                style={styles?.footer}
              >
                {showCancel ? (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className={cn(
                      "text-4 h-10 rounded-full bg-stone-100 text-stone-600 transition-colors select-none active:bg-stone-200",
                      classes?.cancelButton,
                    )}
                    style={styles?.cancelButton}
                  >
                    {cancelText}
                  </button>
                ) : null}

                {showConfirm ? (
                  <button
                    type="button"
                    onClick={handleConfirm}
                    className={cn(
                      "text-primary text-4 h-10 rounded-full font-bold transition-colors select-none active:opacity-80",
                      classes?.confirmButton,
                    )}
                    style={styles?.confirmButton}
                  >
                    {confirmText}
                  </button>
                ) : null}
              </div>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

export { Dialog };
