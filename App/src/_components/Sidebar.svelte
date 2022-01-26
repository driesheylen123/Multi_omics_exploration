<script>
import { element } from 'svelte/internal';


    import { _data, threshold_edges, threshold_clust, maxDepth, radius, linkage, renderVisuals, simulationPause } from '../stores.js';
    const methods = ["none", "single", "complete", "average"];
    
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

<div id="sidebar" class="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark">
    <div class="d-flex align-items-center mb-3 mb-md-0 me-md-auto mt-4 display-6">
        Network Brush
    </div>
    <hr>
    <form class="mb-auto mt-4">
        <div class="mb-4">
            <label for="formFile" class="form-label">Input File</label>
            <input class="form-control" type="file" bind:files={file} id="formFile" accept=".json">
        </div>
        <div class="mb-4">
            <label for="threshold_edges" class="form-label">Threshold edges: {$threshold_edges}</label>
            <input type="range" class="form-range" min="0" max="1" step="0.01" bind:value={$threshold_edges} id="threshold_edges">
        </div>
        <div class="mb-4">
            <label for="node-radius" class="form-label">Node radius: {$radius}</label>
            <input type="range" class="form-range" min="1" max="20" step="1" bind:value={$radius} id="node-radius">
        </div>
        <div class="mb-4">
            <label for="clustering-method" class="form-label">Select Clustering</label>
            <select bind:value={$linkage} class="form-select" id="clustering-method">
                {#each methods as method}
                    <option value={method}>{method}</option>
                {/each}
            </select>
        </div>
        <div class="mb-4">
            <label for="threshold_clust" class="form-label">Threshold clustering: {$threshold_clust}</label>
            <input type="range" class="form-range" min="0" max={$maxDepth} step="1" bind:value={$threshold_clust} id="threshold_clust">
        </div>
        <button type="button" class="btn btn-primary" bind:this={run_btn} on:click={eventHandler_runBtn} disabled>Run</button>
        <button type="button" class="btn btn-primary" bind:this={pause_btn} on:click={eventHandler_pauseBtn} disabled>Pause</button>
        <button type="button" class="btn btn-primary" bind:this={reset_btn} on:click={eventHandler_resetBtn} disabled>Reset</button>

    </form>
    <div>
        <a href="#" class="text-white text-decoration-none">Documentation</a>
    </div>
    <hr>
    <div class="dropdown">
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer" class="d-flex align-items-center text-white text-decoration-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-github me-2" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            GitHub
        </a>
    </div>
</div>

<style>
    #sidebar {
        width: 280px;
        height: 100vh;
    }
</style>