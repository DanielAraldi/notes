import { ChangeEvent, FormEvent, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { X } from 'lucide-react';
import { toast } from 'sonner';

import { NoteCardProps } from '../../@types';
import { Button, Heading } from '..';
import { useNotes } from '../../hooks';

export function NoteCard({ id, content, date, onNoteDeleted }: NoteCardProps) {
  const { handleUpdateNote } = useNotes();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentContent, setCurrentContent] = useState<string>(content);

  const dateDistanceToNow = formatDistanceToNow(date, {
    addSuffix: true,
    locale: ptBR,
  });

  function handleStartEdit(): void {
    setIsEditing(true);
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>): void {
    setCurrentContent(event.target.value);
  }

  function handleEditNote(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    handleUpdateNote(id, currentContent);
    setIsEditing(false);

    toast.success('Nota editada com sucesso!');
  }

  function handleResetEditor(): void {
    setIsEditing(false);
    setCurrentContent(content);
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className='rounded-md text-left flex flex-col bg-slate-800 p-5 gap-3 overflow-hidden relative outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
        <Heading text={dateDistanceToNow} />

        <p className='text-sm leading-6 text-slate-400'>{currentContent}</p>

        <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none' />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.DialogOverlay className='inset-0 fixed bg-black/50' />

        <Dialog.Content
          onEscapeKeyDown={handleResetEditor}
          onPointerDownOutside={handleResetEditor}
          className='fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none'
        >
          <Dialog.Close
            onClick={handleResetEditor}
            className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'
          >
            <X className='size-5' />
          </Dialog.Close>

          <form onSubmit={handleEditNote} className='flex-1 flex flex-col'>
            <div className='flex flex-1 flex-col gap-3 p-5 overflow-y-hidden'>
              <Heading
                variant='edit'
                text={dateDistanceToNow}
                onClick={handleStartEdit}
              />

              <textarea
                value={currentContent}
                disabled={!isEditing}
                className='flex-1 text-sm leading-6 bg-transparent resize-none outline-none text-slate-400 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-transparent'
                onChange={handleContentChanged}
              >
                {currentContent}
              </textarea>
            </div>

            {isEditing ? (
              <Button variant='save' />
            ) : (
              <Button variant='delete' onClick={() => onNoteDeleted(id)} />
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
