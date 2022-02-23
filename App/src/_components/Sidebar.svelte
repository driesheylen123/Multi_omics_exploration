<script>

    import { toggle_sidebar, _data, threshold_edges, edge_width, threshold_clust, node_variables, link_variables, color_method_nodes, color_method_edges, domain_min, domain_max, domain_center, maxDepth, radius, linkage, renderVisuals, simulationPause } from '../stores.js';
    import { onMount } from 'svelte';
    import { interpolateRdBu } from "d3-scale-chromatic";
    
    const cluster_methods = ["none", "single", "complete", "average"];
    let color_options_nodes = ["fixed", "clusters"];
    $: color_options_nodes = ["fixed", "clusters", ...$node_variables];
    let color_options_edges = ["fixed"];
    $: color_options_edges = ["fixed", ...$link_variables];

    // Togglers
    let root, expand_clust, expand_styling_matrix, expand_styling_graph;
	onMount(() => {
		root = document.querySelector(":root");
	})
	function toggle_clust() {
		if (!expand_clust) {
			root.style.setProperty("--arrow-item-1-transformation", 'rotate(90deg)');
			expand_clust = !expand_clust;
		} else {
			root.style.setProperty("--arrow-item-1-transformation", 'rotate(0)');
			expand_clust = !expand_clust;
		}
	}
	function toggle_styling_matrix() {
		if (!expand_styling_matrix) {
			root.style.setProperty("--arrow-item-2-transformation", 'rotate(90deg)');
			expand_styling_matrix = !expand_styling_matrix;
		} else {
			root.style.setProperty("--arrow-item-2-transformation", 'rotate(0)');
			expand_styling_matrix = !expand_styling_matrix;
		}
	}
    function toggle_styling_graph() {
		if (!expand_styling_graph) {
			root.style.setProperty("--arrow-item-3-transformation", 'rotate(90deg)');
			expand_styling_graph = !expand_styling_graph;
		} else {
			root.style.setProperty("--arrow-item-3-transformation", 'rotate(0)');
			expand_styling_graph = !expand_styling_graph;
		}
	}
    
    // Buttons
    let run_btn, pause_btn, reset_btn;    
    function eventHandler_runBtn() {
        run_btn.disabled = true;
        pause_btn.disabled = false;
        reset_btn.disabled = false;
        $renderVisuals = true;
        $simulationPause = false;
    }
    function eventHandler_pauseBtn() {
        run_btn.disabled = false;
        pause_btn.disabled = true;
        reset_btn.disabled = false;
        $simulationPause = true;
    }
    function eventHandler_resetBtn() {
        run_btn.disabled = false;
        pause_btn.disabled = true;
        reset_btn.disabled = true;
        $renderVisuals = false;
    }

    $: {
        if (pause_btn) {
            if ($renderVisuals) {
                pause_btn.disabled = $simulationPause ? true : false;
                run_btn.disabled = $simulationPause ? false : true;
            }
        }
    }

    // Input File
    let file;
	const reader = new FileReader()
	$: {
		if (file) {
            if (file.length > 0) {
                reader.readAsText(file[0]);
            }
		}
	}
	reader.onload = function (event) {
        $_data = JSON.parse(event.target.result);
        run_btn.disabled = false;
	}
	reader.onprogress = function (event) {
		if (event.loaded && event.total) {
			const percent = (event.loaded / event.total) * 100;
			console.log(`Loaded: ${Math.round(percent)}%`);
		}
	};

</script>

<div class="bg-dark text-light" class:toggled={$toggle_sidebar} id="sidebar-wrapper">
    <div class="sidebar-heading text-center py-4 fs-4 fw-bold border-bottom">Network Brush</div>
    <div class="controls">
        <div class="mt-4 mb-2 mx-3">
            <label for="formFile" class="form-label">Input File</label>
            <input class="form-control" type="file" bind:files={file} id="formFile" accept=".json">
        </div>
        <div class="mt-4 mb-2 mx-3">
            <label for="threshold_edges" class="form-label">Threshold edges: {$threshold_edges}</label>
            <input type="range" class="form-range" min="0" max="1" step="0.01" bind:value={$threshold_edges} id="threshold_edges">
        </div>
        <ul class="list-unstyled my-3">
            <li class="ps-2 mb-1 item-1 clustering-controls">
                <button class="btn btn-toggle align-items-center rounded collapsed mb-2" data-bs-toggle="collapse" data-bs-target="#collapse-clustering" aria-expanded="false" aria-controls="collapse-clustering" on:click={toggle_clust}>
                    Clustering
                </button>
                <div class="collapse" id="collapse-clustering">
                    <div class="mb-2 mx-3">
                        <label for="clustering-method" class="form-label">Select clustering</label>
                        <select bind:value={$linkage} class="form-select" id="clustering-method">
                            {#each cluster_methods as method}
                                <option value={method}>{method}</option>
                            {/each}
                        </select>
                    </div>
                    <div class="mb-2 mx-3">
                        <label for="threshold_clust" class="form-label">Threshold clustering: {$threshold_clust}</label>
                        <input type="range" class="form-range" min="0" max={$maxDepth} step="1" bind:value={$threshold_clust} id="threshold_clust">    
                    </div>
                </div>
            </li>
            <li class="ps-2 mb-1 item-2 matrix-styling">
                <button class="btn btn-toggle align-items-center rounded collapsed mb-2" data-bs-toggle="collapse" data-bs-target="#collapse-styling-matrix" aria-expanded="false" aria-controls="collapse-styling-matrix" on:click={toggle_styling_matrix}>
                    Matrix Styling
                </button>
                <div class="collapse" id="collapse-styling-matrix">
                    <div class="mb-2 mx-3 fw-bold">Domain colorscale</div>
                    <div class="mb-2 mx-3 domain-values-input">
                        <label for="c-domain-min" class="form-label">min value</label>
                        <input type="number" class="form-control" min="-1" max="0" step="0.01" bind:value={$domain_min} id="c-domain-min">    
                    </div>
                    <div class="mb-2 mx-3 domain-values-input">
                        <label for="c-domain-center" class="form-label">center value</label>
                        <input type="number" class="form-control" min={$domain_min} max={$domain_max} step="0.01" bind:value={$domain_center} id="c-domain-center">    
                    </div>
                    <div class="mb-2 mx-3 domain-values-input">
                        <label for="c-domain-max" class="form-label">max value</label>
                        <input type="number" class="form-control" min="0" max="1" step="0.01" bind:value={$domain_max} id="c-domain-max">    
                    </div>
                    <div class="mb-2 mx-3 color-legend">
                        <svg width="100%" height={50}>
                            <defs>
                                <linearGradient id="linear-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stop-color={interpolateRdBu(0)}></stop>
                                    <stop offset="50%" stop-color={interpolateRdBu(0.5)}></stop>
                                    <stop offset="100%" stop-color={interpolateRdBu(1)}></stop>
                                </linearGradient>
                            </defs>
                            <rect width="100%" height="30%" fill="url(#linear-gradient)"></rect>
                            <g class="axis">
                                <line class="domain" x1="0%" x2="100%"></line>
                                <g class="tick tick-first" >
                                    <line x1="0%" x2="0%" y1="0" y2="6"></line>
                                    <text x="0%" y="11" dy="0.71em">{$domain_min}</text>
                                </g>
                                <g class="tick tick-middle" >
                                    <line x1="50%" x2="50%" y1="0" y2="6"></line>
                                    <text x="50%" y="11" dy="0.71em">{$domain_center}</text>
                                </g>
                                <g class="tick tick-last" >
                                    <line x1="100%" x2="100%" y1="0" y2="6"></line>
                                    <text x="100%" y="11" dy="0.71em">{$domain_max}</text>
                                </g>
                            </g>
                        </svg>
                    </div>
                </div>
            </li>
            <li class="ps-2 mb-1 item-3 graph-styling">
                <button class="btn btn-toggle align-items-center rounded collapsed mb-2" data-bs-toggle="collapse" data-bs-target="#collapse-styling-graph" aria-expanded="false" aria-controls="collapse-styling-graph" on:click={toggle_styling_graph}>
                    Graph Styling
                </button>
                <div class="collapse" id="collapse-styling-graph">
                    <div class="mb-2 mx-3 fw-bold">Nodes</div>
                    <div class="mb-2 mx-3">
                        <label for="node-radius" class="form-label">Radius: {$radius}</label>
                        <input type="range" class="form-range" min="1" max="20" step="1" bind:value={$radius} id="node-radius">
                    </div>
                    <div class="mb-2 mx-3">
                        <label for="color-method-nodes" class="form-label">Color variable</label>
                        <select bind:value={$color_method_nodes} class="form-select" id="color-method-nodes">
                            {#each color_options_nodes as option}
                                <option value={option}>{option}</option>
                            {/each}
                        </select>    
                    </div>
                    <div class="mt-3 mb-2 mx-3 fw-bold">Edges</div>
                    <div class="mb-2 mx-3">
                        <label for="edge-width" class="form-label">Width: {$edge_width}</label>
                        <input type="range" class="form-range" min="1" max="10" step="1" bind:value={$edge_width} id="edge-width">
                    </div>
                    <div class="mb-2 mx-3">
                        <label for="color-method-edges" class="form-label">Color variable</label>
                        <select bind:value={$color_method_edges} class="form-select" id="color-method-edges">
                            {#each color_options_edges as option}
                                <option value={option}>{option}</option>
                            {/each}
                        </select>    
                    </div>
                </div>
            </li>
            <div class="mt-3 mx-3">
                <button type="button" class="btn btn-primary" bind:this={run_btn} on:click={eventHandler_runBtn} disabled>Run</button>
                <button type="button" class="btn btn-primary" bind:this={pause_btn} on:click={eventHandler_pauseBtn} disabled>Pause</button>
                <button type="button" class="btn btn-primary" bind:this={reset_btn} on:click={eventHandler_resetBtn} disabled>Reset</button>    
            </div>
        </ul>
    </div> 
</div>

<style>
    :root {
        --arrow-item-1-transformation: rotate(0);
        --arrow-item-2-transformation: rotate(0);
        --arrow-item-3-transformation: rotate(0);
    }
    #sidebar-wrapper {
        min-height: 100vh;
        margin-left: -15rem;
        -webkit-transition: margin 0.25s ease-out;
        -moz-transition: margin 0.25s ease-out;
        -o-transition: margin 0.25s ease-out;
        transition: margin 0.25s ease-out;
    }
    #sidebar-wrapper .sidebar-heading {
        padding: 0.875rem 1.25rem;
        font-size: 1.2rem;
    }
    #sidebar-wrapper .controls {
        width: 15rem;
    }
    #sidebar-wrapper.toggled {
        margin-left: 0;
    }
    .btn-toggle {
        display: inline-flex;
        align-items: center;
        padding: .25rem .5rem;
        font-weight: 600;
        color: rgb(255, 255, 255);
        background-color: transparent;
        border: 0;
    }
    .btn-toggle:hover,
    .btn-toggle:focus {
        color: rgb(255, 255, 255);
        background-color: transparent;
    }
    .btn-toggle::before {
        width: 1.25em;
        line-height: 0;
        content: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 14l6-6-6-6'/%3e%3c/svg%3e");
        transition: transform .35s ease;
        transform-origin: .5em 50%;
    }
    .item-1 .btn-toggle::before {
        transform: var(--arrow-item-1-transformation);
    }
    .item-2 .btn-toggle::before {
        transform: var(--arrow-item-2-transformation);
    }
    .item-3 .btn-toggle::before {
        transform: var(--arrow-item-3-transformation);
    }
    @media (min-width: 768px) {
        #sidebar-wrapper {
            margin-left: 0;
        }
        #sidebar-wrapper.toggled {
            margin-left: -15rem;
        }
    }
    .axis {
        transform: translate(0%, 40%);
    }
    .domain {
        stroke: white;
        stroke-width: 1px;
    }
    .tick-first {
        transform: translate(.5,0);
    }
    .tick-middle, .tick-last {
        transform: translate(-.5,0);
    }
    .tick line {
        stroke: white;
        stroke-width: 1px;
    }
    .tick text {
        fill: white;
        font-size: small;
    }
    .tick-first text {
        text-anchor: start;
    }
    .tick-middle text {
        text-anchor: middle;
    }
    .tick-last text {
        text-anchor: end;
    }
</style>