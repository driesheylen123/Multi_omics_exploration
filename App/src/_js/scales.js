import { derived, get } from 'svelte/store';
import { color_scales_edges, color_scale_edges } from '../stores.js';
import { scaleDiverging } from 'd3-scale';
import { interpolateBrBG, interpolatePRGn, interpolatePiYG, interpolatePuOr, interpolateRdBu, interpolateRdGy, interpolateRdYlBu, interpolateRdYlGn, interpolateSpectral, interpolateBuGn, interpolateBuPu, interpolateGnBu, interpolateOrRd, interpolatePuBuGn, interpolatePuBu, interpolatePuRd, interpolateRdPu, interpolateYlGnBu, interpolateYlGn, interpolateYlOrBr, interpolateYlOrRd, interpolateBlues, interpolateGreens, interpolateGreys, interpolatePurples, interpolateReds, interpolateOranges, interpolateCividis, interpolateCubehelixDefault, interpolateRainbow, interpolateWarm, interpolateCool, interpolateSinebow, interpolateTurbo, interpolateViridis, interpolateMagma, interpolateInferno, interpolatePlasma } from 'd3-scale-chromatic';

export const colorScale_edges = scaleDiverging().domain([-1,0,1]).interpolator(interpolateRdBu);

// export const colorScale_edges = derived(color_scale_edges, ($color_scale_edges) => {
    
//     const colorScale_edges = scaleDiverging().domain([-1,0,1]);

//     switch (get(color_scale_edges)) {
//         case 'interpolateBrBG':
//             colorScale_edges.interpolator(interpolateBrBG);
//             break;
//         case 'interpolatePRGn':
//             colorScale_edges.interpolator(interpolatePRGn);
//             break;
//         case 'interpolatePiYG':
//             colorScale_edges.interpolator(interpolatePiYG);
//             break;
//         case 'interpolatePuOr':
//             colorScale_edges.interpolator(interpolatePuOr);
//             break;
//         case 'interpolateRdBu':
//             colorScale_edges.interpolator(interpolateRdBu);
//             break;
//         case 'interpolateRdGy':
//             colorScale_edges.interpolator(interpolateRdGy);
//             break;
//         case 'interpolateRdYlBu':
//             colorScale_edges.interpolator(interpolateRdYlBu);
//             break;
//         case 'interpolateRdYlGn':
//             colorScale_edges.interpolator(interpolateRdYlGn);
//             break;
//         case 'interpolateSpectral':
//             colorScale_edges.interpolator(interpolateSpectral);
//             break;
//         case 'interpolateBuGn':
//             colorScale_edges.interpolator(interpolateBuGn);
//             break;
//         case 'interpolateBuPu':
//             colorScale_edges.interpolator(interpolateBuPu);
//             break;
//         case 'interpolateGnBu':
//             colorScale_edges.interpolator(interpolateGnBu);
//             break;
//         case 'interpolateOrRd':
//             colorScale_edges.interpolator(interpolateOrRd);
//             break;
//         case 'interpolatePuBuGn':
//             colorScale_edges.interpolator(interpolatePuBuGn);
//             break;
//         case 'interpolatePuBu':
//             colorScale_edges.interpolator(interpolatePuBu);
//             break;
//         case 'interpolatePuRd':
//             colorScale_edges.interpolator(interpolatePuRd);
//             break;
//         case 'interpolateRdPu':
//             colorScale_edges.interpolator(interpolateRdPu);
//             break;
//         case 'interpolateYlGnBu':
//             colorScale_edges.interpolator(interpolateYlGnBu);
//             break;
//         case 'interpolateYlGn':
//             colorScale_edges.interpolator(interpolateYlGn);
//             break;
//         case 'interpolateYlOrBr':
//             colorScale_edges.interpolator(interpolateYlOrBr);
//             break;
//         case 'interpolateYlOrRd':
//             colorScale_edges.interpolator(interpolateYlOrRd);
//             break;
//         case 'interpolateBlues':
//             colorScale_edges.interpolator(interpolateBlues);
//             break;
//         case 'interpolateGreens':
//             colorScale_edges.interpolator(interpolateGreens);
//             break;
//         case 'interpolateGreys':
//             colorScale_edges.interpolator(interpolateGreys);
//             break;
//         case 'interpolatePurples':
//             colorScale_edges.interpolator(interpolatePurples);
//             break;
//         case 'interpolateReds':
//             colorScale_edges.interpolator(interpolateReds);
//             break;
//         case 'interpolateOranges':
//             colorScale_edges.interpolator(interpolateOranges);
//             break;
//         case 'interpolateCividis':
//             colorScale_edges.interpolator(interpolateCividis);
//             break;
//         case 'interpolateCubehelixDefault':
//             colorScale_edges.interpolator(interpolateCubehelixDefault);
//             break;
//         case 'interpolateRainbow':
//             colorScale_edges.interpolator(interpolateRainbow);
//             break;
//         case 'interpolateWarm':
//             colorScale_edges.interpolator(interpolateWarm);
//             break;
//         case 'interpolateCool':
//             colorScale_edges.interpolator(interpolateCool);
//             break;
//         case 'interpolateSinebow':
//             colorScale_edges.interpolator(interpolateSinebow);
//             break;
//         case 'interpolateTurbo':
//             colorScale_edges.interpolator(interpolateTurbo);
//             break;
//         case 'interpolateViridis':
//             colorScale_edges.interpolator(interpolateViridis);
//             break;
//         case 'interpolateMagma':
//             colorScale_edges.interpolator(interpolateMagma);
//             break;
//         case 'interpolateInferno':
//             colorScale_edges.interpolator(interpolateInferno);
//             break;
//         case 'interpolatePlasma':
//             colorScale_edges.interpolator(interpolatePlasma);
//     }

//     return colorScale_edges
    
// })
