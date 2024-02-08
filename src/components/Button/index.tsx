import { ButtonProps, ButtonVariantType } from '../../@types';

export function Button({ variant, onClick }: ButtonProps) {
  const deleteButton: JSX.Element = (
    <button
      type='button'
      className='w-full bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium group'
      onClick={onClick}
    >
      Deseja{' '}
      <span className='text-red-400 group-hover:underline'>
        apagar essa nota
      </span>
      ?
    </button>
  );

  const recordButton: JSX.Element = (
    <button
      type='button'
      onClick={onClick}
      className='w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100'
    >
      <div className='size-3 rounded-full bg-red-500 animate-pulse' />
      Gravando! (clique p/ interromper)
    </button>
  );

  const saveButton: JSX.Element = (
    <button
      type='submit'
      className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500'
    >
      Salvar nota
    </button>
  );

  const buttons: Record<ButtonVariantType, JSX.Element> = {
    delete: deleteButton,
    record: recordButton,
    save: saveButton,
  };

  return buttons[variant];
}
