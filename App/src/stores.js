import { writable } from 'svelte/store';

export const threshold = writable(.5);
export const linkage = writable("none");
export const selectedNodes = writable([]);
export const highlighted = writable([]);