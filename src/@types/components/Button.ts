export type ButtonVariantType = 'save' | 'record' | 'delete';

export interface ButtonProps {
  variant: ButtonVariantType;
  onClick?(): void;
}
