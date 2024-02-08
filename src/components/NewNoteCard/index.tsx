import { useState, ChangeEvent, FormEvent, useTransition } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { NewNoteCardProps } from '../../@types';

let speechRecognition: SpeechRecognition | null = null;

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [shouldShowOnboarding, setShouldShowOnboarding] =
    useState<boolean>(true);
  const [content, setContent] = useState<string>('');

  const [, startTransition] = useTransition();

  function handleStartEditor(): void {
    setShouldShowOnboarding(false);
  }

  function handleResetEditor(): void {
    if (speechRecognition) speechRecognition.stop();

    startTransition(() => {
      setContent('');
      setIsRecording(false);
      setShouldShowOnboarding(true);
    });
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>): void {
    setContent(event.target.value);

    if (!event.target.value) setShouldShowOnboarding(true);
  }

  function handleSaveNote(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (shouldShowOnboarding) return;
    else if (!shouldShowOnboarding && !content.trim()) {
      toast.warning('Nota não pode ser salva se estiver em branco!');
      return;
    }

    onNoteCreated(content);

    setContent('');
    setShouldShowOnboarding(true);

    toast.success('Nota criada com sucesso!');
  }

  function handleStartRecording(): void {
    const isSpeechRecognitionAPIAvailable =
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

    if (!isSpeechRecognitionAPIAvailable) {
      toast.warning(
        'Infelizmente seu navegador não suporta a API de gravação!'
      );
      return;
    }

    setIsRecording(true);
    setShouldShowOnboarding(false);

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new SpeechRecognitionAPI();
    speechRecognition.lang = 'pt-BR';
    // Record voice user no-stop
    speechRecognition.continuous = true;
    // Find the biggest alternative of the word for text
    speechRecognition.maxAlternatives = 1;
    // Show the result after each word is pronounced
    speechRecognition.interimResults = true;

    speechRecognition.onresult = event => {
      const transcription = Array.from(event.results).reduce(
        (previousText, currentText) =>
          previousText.concat(currentText[0].transcript),
        ''
      );

      setContent(transcription);
    };

    speechRecognition.onerror = event => {
      console.error(event);
      toast.error('Um erro desconhecido aconteceu durante a gravação!');
      speechRecognition!.stop();

      setContent('');
    };

    speechRecognition.start();
  }

  function handleStopRecording(): void {
    startTransition(() => setIsRecording(false));

    if (speechRecognition) speechRecognition.stop();
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className='rounded-md text-left flex flex-col bg-slate-700 p-5 gap-3 overflow-hidden outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
        <span className='text-sm font-medium text-slate-200'>
          Adicionar nota
        </span>

        <p className='text-sm leading-6 text-slate-400'>
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
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

          <form onSubmit={handleSaveNote} className='flex-1 flex flex-col'>
            <div className='flex flex-1 flex-col gap-3 p-5'>
              <span className='text-sm font-medium text-slate-300'>
                Adicionar nota
              </span>

              {shouldShowOnboarding ? (
                <p className='text-sm leading-6 text-slate-400'>
                  Comece{' '}
                  <button
                    type='button'
                    onClick={handleStartRecording}
                    className='font-medium text-lime-400 hover:underline'
                  >
                    gravando uma nota
                  </button>{' '}
                  em áudio ou se preferir{' '}
                  <button
                    type='button'
                    onClick={handleStartEditor}
                    className='font-medium text-lime-400 hover:underline'
                  >
                    utilize apenas texto
                  </button>
                  .
                </p>
              ) : (
                <textarea
                  autoFocus
                  value={content}
                  className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none'
                  onChange={handleContentChanged}
                />
              )}
            </div>

            {isRecording ? (
              <button
                type='button'
                onClick={handleStopRecording}
                className='w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100'
              >
                <div className='size-3 rounded-full bg-red-500 animate-pulse' />
                Gravando! (clique p/ interromper)
              </button>
            ) : (
              <button
                type='submit'
                className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500'
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
