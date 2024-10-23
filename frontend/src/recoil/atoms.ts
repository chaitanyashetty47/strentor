// atoms.ts
import { atom } from 'recoil';
import { Courses } from '@/types/types';

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

export const courseState = atom<Courses | null>({
  key: 'courseState',
  default: null,
});
