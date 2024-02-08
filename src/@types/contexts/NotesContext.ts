import { NoteProps } from '..';

export interface NotesContextProps {
  notes: NoteProps[];
  handleCreateNote(content: string): void;
  handleDeleteNote(id: string): void;
}
