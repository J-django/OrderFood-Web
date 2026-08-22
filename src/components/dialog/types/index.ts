import type { CSSProperties, ReactNode } from "react";

type DialogEvents = {
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
};

type DialogClasses = {
  overlay?: string;
  container?: string;
  header?: string;
  content?: string;
  footer?: string;
  cancelButton?: string;
  confirmButton?: string;
};

type DialogStyles = {
  overlay?: CSSProperties;
  container?: CSSProperties;
  header?: CSSProperties;
  content?: CSSProperties;
  footer?: CSSProperties;
  cancelButton?: CSSProperties;
  confirmButton?: CSSProperties;
};

type DialogProps = DialogEvents & {
  open: boolean;
  title?: ReactNode;
  content?: ReactNode;
  children?: ReactNode;
  showConfirm?: boolean;
  showCancel?: boolean;
  confirmText?: string;
  cancelText?: string;
  maskClosable?: boolean;
  classes?: DialogClasses;
  styles?: DialogStyles;
};

export type { DialogClasses, DialogEvents, DialogProps, DialogStyles };
