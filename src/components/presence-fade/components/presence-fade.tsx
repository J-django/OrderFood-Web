/* eslint-disable react-hooks/static-components -- motion.create requires a runtime component for polymorphic `as`. */
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/utils";
import type {
  CachedMotionComponent,
  PresenceFadeProps,
  PresenceFadeAs,
} from "../types";

const motionComponentCache = new Map<
  PresenceFadeAs,
  CachedMotionComponent
>();

function getMotionComponent(element: PresenceFadeAs) {
  let component = motionComponentCache.get(element);
  if (!component) {
    component = motion.create(element) as CachedMotionComponent;
    motionComponentCache.set(element, component);
  }
  return component;
}

function PresenceFade({
  as = "div",
  children,
  className,
  duration = 0.18,
  ease = "easeOut",
  initial = false,
  mode = "wait",
  stateKey,
}: PresenceFadeProps) {
  const MotionComponent = getMotionComponent(as);

  return (
    <AnimatePresence mode={mode} initial={initial}>
      <MotionComponent
        key={stateKey}
        className={cn(className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration, ease }}
      >
        {children}
      </MotionComponent>
    </AnimatePresence>
  );
}

export { PresenceFade };
