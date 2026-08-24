import type { ElementType, ReactNode } from "react";
import type { ComponentType } from "react";
import type { AnimatePresenceProps, Transition } from "motion/react";
import type { MotionProps } from "motion/react";

type PresenceFadeAs = ElementType;

type PresenceFadeProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  duration?: number;
  ease?: Transition["ease"];
  initial?: boolean;
  mode?: AnimatePresenceProps["mode"];
  stateKey: string;
};

type CachedMotionComponent = ComponentType<
  MotionProps & { className?: string; children?: ReactNode }
>;

export type { CachedMotionComponent, PresenceFadeAs, PresenceFadeProps };
