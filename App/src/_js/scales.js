import { get } from 'svelte/store';
import { scaleDiverging, scaleOrdinal } from 'd3-scale';
import { interpolateRdBu, schemeTableau10 } from 'd3-scale-chromatic';

import { maxDepth } from '../stores';

export const colorScale_edges = scaleDiverging().interpolator(interpolateRdBu);
export const colorScale_clusters = scaleOrdinal().domain([...Array(get(maxDepth)).keys()]).unknown("grey").range(schemeTableau10);