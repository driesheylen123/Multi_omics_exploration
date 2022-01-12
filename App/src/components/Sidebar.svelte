<script>
    import { threshold, linkage } from '../stores.js';

    const methods = ["none", "single", "complete", "average"];
</script>

<div id="sidebar" class="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark">
    <div class="d-flex align-items-center mb-3 mb-md-0 me-md-auto mt-4 display-6">
        Network Brush
    </div>
    <hr>
    <form class="mb-auto mt-4">
        <div class="mb-4">
            <label for="formFile" class="form-label">Input File</label>
            <input class="form-control" type="file" id="formFile">
        </div>
        <div class="mb-4">
            <label for="threshold" class="form-label">Threshold: {$threshold}</label>
            <input type="range" class="form-range" min="0" max="1" step="0.01" bind:value={$threshold} id="threshold">
        </div>
        <div class="mb-4">
            <label for="clustering-method" class="form-label">Select Clustering</label>
            <select bind:value={$linkage} class="form-select" id="clustering-method">
                {#each methods as method}
                    <option value={method}>{method}</option>
                {/each}
            </select>
        </div>
        <button class="btn btn-primary">Run</button>
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