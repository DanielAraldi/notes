import { ChangeEvent, useState } from 'react';
import { toast } from 'sonner';
import { NewNoteCard, NoteCard } from './components';
import { LOGO } from './config';
import { NoteProps } from './@types';
import { useNotes } from './hooks';

export function App() {
  const { notes, handleCreateNote, handleDeleteNote } = useNotes();

  const [search, setSearch] = useState<string>('');

  function handleSearch(event: ChangeEvent<HTMLInputElement>): void {
    setSearch(event.target.value);
  }

  function onNoteDeleted(id: string): void {
    handleDeleteNote(id);

    toast.success('Nota apagada com sucesso!');
  }

  const filteredNotes: NoteProps[] = search
    ? notes.filter(note =>
        note.content
          .trim()
          .toLocaleLowerCase()
          .includes(search.trim().toLocaleLowerCase())
      )
    : notes;

  return (
    <div className='mx-auto max-w-6xl my-12 space-y-6 px-5'>
      <img src={LOGO} alt='Notes' />

      <form className='w-full'>
        <input
          value={search}
          type='text'
          placeholder='Busque em suas notas...'
          className='w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500'
          onChange={handleSearch}
        />
      </form>

      <div className='h-px bg-slate-700' />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]'>
        <NewNoteCard onNoteCreated={handleCreateNote} />

        {filteredNotes.map(({ id, ...rest }) => (
          <NoteCard key={id} id={id} {...rest} onNoteDeleted={onNoteDeleted} />
        ))}
      </div>
    </div>
  );
}
