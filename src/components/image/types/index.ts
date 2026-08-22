import type { CSSProperties, ReactNode } from "react";

type ImageStatusValue = "loaded" | "error";

type ImageStatus = {
  src?: string;
  value: ImageStatusValue;
};

type ImageChildrenRender = (status: {
  error: boolean;
  loading: boolean;
}) => ReactNode;

type ImageEvents = {
  onLoad?: () => void;
  onError?: () => void;
};

type ImageClasses = {
  container?: string;
  image?: string;
  overlay?: string;
};

type ImageStyles = {
  container?: CSSProperties;
  image?: CSSProperties;
  overlay?: CSSProperties;
};

type ImageProps = ImageEvents & {
  src?: string;
  alt?: string;
  classes?: ImageClasses;
  children?: ImageChildrenRender;
  styles?: ImageStyles;
};

export type {
  ImageChildrenRender,
  ImageClasses,
  ImageEvents,
  ImageProps,
  ImageStatus,
  ImageStatusValue,
  ImageStyles,
};
