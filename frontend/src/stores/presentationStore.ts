import { create } from 'zustand';
import type { SessionState, StylePreview, GenerationProgress } from '../types';

interface PresentationState {
  sessionId: string | null;
  currentHTML: string | null;
  slideCount: number;
  sessionState: SessionState;
  stylePreviews: StylePreview[];
  selectedStyleId: string | null;
  generationProgress: GenerationProgress | null;

  setSessionId: (id: string) => void;
  setHTML: (html: string) => void;
  setSlideCount: (count: number) => void;
  setSessionState: (state: SessionState) => void;
  setStylePreviews: (previews: StylePreview[]) => void;
  setSelectedStyle: (id: string) => void;
  setGenerationProgress: (progress: GenerationProgress | null) => void;
  reset: () => void;
}

export const usePresentationStore = create<PresentationState>((set) => ({
  sessionId: null,
  currentHTML: null,
  slideCount: 0,
  sessionState: 'content_discovery',
  stylePreviews: [],
  selectedStyleId: null,
  generationProgress: null,

  setSessionId: (id: string) => set({ sessionId: id }),
  setHTML: (html: string) => set({ currentHTML: html }),
  setSlideCount: (count: number) => set({ slideCount: count }),
  setSessionState: (state: SessionState) => set({ sessionState: state }),
  setStylePreviews: (previews: StylePreview[]) => set({ stylePreviews: previews }),
  setSelectedStyle: (id: string) => set({ selectedStyleId: id }),
  setGenerationProgress: (progress: GenerationProgress | null) =>
    set({ generationProgress: progress }),
  reset: () =>
    set({
      sessionId: null,
      currentHTML: null,
      slideCount: 0,
      sessionState: 'content_discovery',
      stylePreviews: [],
      selectedStyleId: null,
      generationProgress: null,
    }),
}));
