import { writable } from 'svelte/store';

export const input_file = writable([]);
export const renderVisuals = writable(false);
export const simulationPause = writable(false);
export const threshold = writable(.5);
export const radius = writable(4);
export const linkage = writable("none");
export const selectedNodes = writable([]);
export const highlighted = writable([]);