import { PropsWithChildren, createContext, useState } from 'react';
import { nanoid } from 'nanoid';
import { NoteProps, NotesContextProps } from '../@types';

export const NotesContext = createContext({} as NotesContextProps);

export function NotesProvider({ children }: Required<PropsWithChildren>) {
  const [notes, setNotes] = useState<NoteProps[]>(() => {
    const notesOnStorage = localStorage.getItem('notes');
    if (notesOnStorage) return JSON.parse(notesOnStorage);
    return [];
  });

  function handleNotesChange(newNotes: NoteProps[]): void {
    setNotes(newNotes);
    localStorage.setItem('notes', JSON.stringify(newNotes));
  }

  function handleCreateNote(content: string): void {
    const newNote: NoteProps = {
      id: nanoid(),
      date: new Date(),
      content,
    };

    handleNotesChange([newNote, ...notes]);
  }

  function handleDeleteNote(id: string): void {
    const newNotes = notes.filter(note => note.id !== id);
    handleNotesChange(newNotes);
  }

  return (
    <NotesContext.Provider
      value={{ notes, handleCreateNote, handleDeleteNote }}
    >
      {children}
    </NotesContext.Provider>
  );
}
