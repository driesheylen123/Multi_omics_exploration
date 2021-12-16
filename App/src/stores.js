import { writable } from 'svelte/store';

export const threshold = writable(.3);
export const linkage = writable("none");
export const selectedNodes = writable([]);