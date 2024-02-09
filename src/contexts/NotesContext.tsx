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

  function getNoteTimestamp(note: NoteProps | null) {
    return note ? new Date(note.date).getTime() : 0;
  }

  function handleNotesChange(newNotes: NoteProps[]): void {
    setNotes(newNotes);
    localStorage.setItem('notes', JSON.stringify(newNotes));
  }

  function handleCreateNote(content: string): void {
    const newNote: NoteProps = {
      id: nanoid(),
      date: new Date(),
      content: content.trim(),
    };

    handleNotesChange([newNote, ...notes]);
  }

  function handleDeleteNote(id: string): void {
    const newNotes = notes.filter(note => note.id !== id);
    handleNotesChange(newNotes);
  }

  function handleUpdateNote(id: string, content: string): void {
    const notesUpdated = notes
      .map(note =>
        note.id === id
          ? Object.assign(note, {
              date: new Date(),
              content: content.trim(),
            })
          : note
      )
      .sort(
        (currentNote, nextNote) =>
          getNoteTimestamp(nextNote) - getNoteTimestamp(currentNote)
      );

    handleNotesChange(notesUpdated);
  }

  return (
    <NotesContext.Provider
      value={{ notes, handleCreateNote, handleDeleteNote, handleUpdateNote }}
    >
      {children}
    </NotesContext.Provider>
  );
}
