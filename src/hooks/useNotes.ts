import { useContext } from 'react';
import { NotesContext } from '../contexts';

export function useNotes() {
  return useContext(NotesContext);
}
