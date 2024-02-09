import { Pencil } from 'lucide-react';
import { HeadingProps, HeadingVariantType } from '../../@types';

export function Heading({ text, variant = 'default', onClick }: HeadingProps) {
  const classnames: Record<HeadingVariantType, string> = {
    highlight: 'text-slate-200',
    default: 'text-slate-300',
    edit: 'text-slate-300',
  };

  const textSlateColor = classnames[variant];

  return (
    <span
      className={`flex items-center gap-2 text-sm font-medium ${textSlateColor}`}
    >
      {text}

      {variant === 'edit' && (
        <button
          type='button'
          className={`size-3.5 ${textSlateColor} hover:text-slate-100`}
          onClick={onClick}
        >
          <Pencil className='size-full' />
        </button>
      )}
    </span>
  );
}
