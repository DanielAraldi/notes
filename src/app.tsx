import { ChangeEvent, useState } from 'react';
import { nanoid } from 'nanoid';
import { NewNoteCard, NoteCard } from './components';
import { LOGO } from './config';
import { NoteProps } from './@types';

export function App() {
  const [search, setSearch] = useState<string>('');
  const [notes, setNotes] = useState<NoteProps[]>(() => {
    const notesOnStorage = localStorage.getItem('notes');
    if (notesOnStorage) return JSON.parse(notesOnStorage);
    return [];
  });

  function handleNotesChange(newNotes: NoteProps[]): void {
    setNotes(newNotes);
    localStorage.setItem('notes', JSON.stringify(newNotes));
  }

  function onNoteCreated(content: string): void {
    const newNote: NoteProps = {
      id: nanoid(),
      date: new Date(),
      content,
    };

    handleNotesChange([newNote, ...notes]);
  }

  function onNoteDeleted(id: string): void {
    const newNotes = notes.filter(note => note.id !== id);
    handleNotesChange(newNotes);
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>): void {
    setSearch(event.target.value);
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
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map(({ id, ...rest }) => (
          <NoteCard key={id} id={id} {...rest} onNoteDeleted={onNoteDeleted} />
        ))}
      </div>
    </div>
  );
}
