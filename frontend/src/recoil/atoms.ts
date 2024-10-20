// atoms.ts
import { atom } from 'recoil';

export interface VideoContent {
  id: number;
  title: string;
  thumbnail: string | null;
  description: string;
  type: string;
}

export const selectedVideoState = atom<VideoContent | null>({
  key: 'selectedVideoState', // unique ID for this atom
  default: null, // initial state
});
