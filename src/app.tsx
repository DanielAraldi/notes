import { useState } from 'react';
import { nanoid } from 'nanoid';
import { NewNoteCard, NoteCard } from './components';
import { LOGO } from './config';
import { NoteProps } from './@types';

export function App() {
  const [notes, setNotes] = useState<NoteProps[]>([]);

  function onNoteCreated(content: string): void {
    const newNote: NoteProps = {
      id: nanoid(),
      date: new Date(),
      content,
    };

    setNotes([newNote, ...notes]);
  }

  return (
    <div className='mx-auto max-w-6xl my-12 space-y-6'>
      <img src={LOGO} alt='Notes' />

      <form className='w-full'>
        <input
          type='text'
          placeholder='Busque em suas notas...'
          className='w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500'
        />
      </form>

      <div className='h-px bg-slate-700' />

      <div className='grid grid-cols-3 gap-6 auto-rows-[250px]'>
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {notes.map(({ id, ...rest }) => (
          <NoteCard key={id} {...rest} />
        ))}
      </div>
    </div>
  );
}
