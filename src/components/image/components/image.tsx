import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/utils";
import type { ImageProps, ImageStatus } from "../types";

function Image(props: ImageProps) {
  const { src, alt, classes, children, styles, onLoad, onError } = props;
  const [imageStatus, setImageStatus] = useState<ImageStatus | null>(null);
  const hasSource = Boolean(src);
  const hasResolvedCurrentSource = imageStatus?.src === src;
  const statusValue = hasResolvedCurrentSource ? imageStatus?.value : undefined;
  const isLoaded = statusValue === "loaded";
  const hasError = !hasSource || statusValue === "error";
  const isLoading = hasSource && !isLoaded && !hasError;
  const overlayContent = children ? (
    children({ error: hasError, loading: isLoading })
  ) : hasError ? (
    <span className="icon-[tdesign--image-error] size-5" />
  ) : (
    <span className="icon-[line-md--loading-loop] size-5" />
  );

  function handleLoad() {
    setImageStatus({ src, value: "loaded" });
    onLoad?.();
  }

  function handleError() {
    setImageStatus({ src, value: "error" });
    onError?.();
  }

  return (
    <div
      className={cn("relative flex overflow-hidden", classes?.container)}
      style={styles?.container}
    >
      <motion.img
        key={src ?? "__image-empty__"}
        src={src}
        alt={alt}
        className={cn("size-full object-contain", classes?.image)}
        style={{
          ...styles?.image,
          display: hasSource ? "block" : "none",
          visibility: isLoaded ? "visible" : "hidden",
        }}
        onLoad={handleLoad}
        onError={handleError}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />

      <AnimatePresence>
        {!isLoaded ? (
          <motion.div
            key={hasError ? "error" : "loading"}
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-white/70 text-[#999] backdrop-blur-xs",
              classes?.overlay,
            )}
            style={styles?.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {overlayContent}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export { Image };
