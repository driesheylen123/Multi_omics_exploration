import { scaleDiverging } from 'd3-scale';
import { interpolateRdBu } from 'd3-scale-chromatic';

export const colorScale = scaleDiverging().interpolator(interpolateRdBu);
