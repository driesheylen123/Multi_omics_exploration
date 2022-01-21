import { writable } from 'svelte/store';

export const _data = writable([]);
export const threshold = writable(.5);
export const radius = writable(4);
export const linkage = writable("none");
export const renderVisuals = writable(false);
export const simulationPause = writable(false);
export const toHighlight = writable([]);
export const nodeFilter = writable([]);