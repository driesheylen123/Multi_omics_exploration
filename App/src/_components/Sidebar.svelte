<script>

    import { toggle_sidebar, _data, threshold_edges, edge_width, threshold_clust, color_method, color_scale_nodes, color_scale_edges, maxDepth, radius, linkage, renderVisuals, simulationPause } from '../stores.js';
    import { onMount } from 'svelte';
    
    const methods = ["none", "single", "complete", "average"];
    const color_options = ["clusters", "variable", "none"];
    const color_scales = ["scheme1", "scheme2", "scheme3"];

    // Togglers
    let root, expand_clust, expand_styling;
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
	function toggle_styling() {
		if (!expand_styling) {
			root.style.setProperty("--arrow-item-2-transformation", 'rotate(90deg)');
			expand_styling = !expand_styling;
		} else {
			root.style.setProperty("--arrow-item-2-transformation", 'rotate(0)');
			expand_styling = !expand_styling;
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

    // Input File
    let file;
	const reader = new FileReader()
	$: {
		if (file) {
			reader.readAsText(file[0]);
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
            <li class="ps-2 mb-1 item-1">
                <button class="btn btn-toggle align-items-center rounded collapsed mb-2" data-bs-toggle="collapse" data-bs-target="#collapse-clustering" aria-expanded="false" aria-controls="collapse-clustering" on:click={toggle_clust}>
                    Clustering
                </button>
                <div class="collapse" id="collapse-clustering">
                    <div class="mb-2 mx-3">
                        <label for="clustering-method" class="form-label">Select clustering</label>
                        <select bind:value={$linkage} class="form-select" id="clustering-method">
                            {#each methods as method}
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
            <li class="ps-2 mb-1 item-2">
                <button class="btn btn-toggle align-items-center rounded collapsed mb-2" data-bs-toggle="collapse" data-bs-target="#collapse-styling" aria-expanded="false" aria-controls="collapse-styling" on:click={toggle_styling}>
                    Styling
                </button>
                <div class="collapse" id="collapse-styling">
                    <div class="mb-2 mx-3 fw-bold">Nodes</div>
                    <div class="mb-2 mx-3">
                        <label for="node-radius" class="form-label">Radius: {$radius}</label>
                        <input type="range" class="form-range" min="1" max="20" step="1" bind:value={$radius} id="node-radius">
                    </div>
                    <div class="mb-2 mx-3">
                        <label for="color-method" class="form-label">Color variable</label>
                        <select bind:value={$color_method} class="form-select" id="color-method">
                            {#each color_options as option}
                                <option value={option}>{option}</option>
                            {/each}
                        </select>    
                    </div>
                    <div class="mb-2 mx-3">
                        <label for="color-scale-nodes" class="form-label">Color scale</label>
                        <select bind:value={$color_scale_nodes} class="form-select" id="color-scale-nodes">
                            {#each color_scales as scale}
                                <option value={scale}>{scale}</option>
                            {/each}
                        </select>
                    </div>
                    <div class="mt-3 mb-2 mx-3 fw-bold">Edges</div>
                    <div class="mb-2 mx-3">
                        <label for="edge-width" class="form-label">Width: {$edge_width}</label>
                        <input type="range" class="form-range" min="1" max="10" step="1" bind:value={$edge_width} id="edge-width">
                    </div>
                    <div class="mb-2 mx-3">
                        <label for="color-scale-edges" class="form-label">Color scale</label>
                        <select bind:value={$color_scale_edges} class="form-select" id="color-scale-edges">
                            {#each color_scales as scale}
                                <option value={scale}>{scale}</option>
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
    @media (min-width: 768px) {
        #sidebar-wrapper {
            margin-left: 0;
        }
        #sidebar-wrapper.toggled {
            margin-left: -15rem;
        }
    }
</style>