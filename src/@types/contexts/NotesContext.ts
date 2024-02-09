import { NoteProps } from '..';

export interface NotesContextProps {
  notes: NoteProps[];
  handleCreateNote(content: string): void;
  handleUpdateNote(id: string, content: string): void;
  handleDeleteNote(id: string): void;
}
