import { NoteProps } from '..';

export interface NoteCardProps extends NoteProps {
  onNoteDeleted(id: string): void;
}
