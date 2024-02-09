export type HeadingVariantType = 'default' | 'highlight' | 'edit';

export interface HeadingProps {
  text: string;
  variant?: HeadingVariantType;
  onClick?(): void;
}
