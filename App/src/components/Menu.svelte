<script>

    import { getContext } from 'svelte';
    import { threshold, linkage } from '../stores.js';

    const methods = ["none", "single", "complete", "average"];

</script>


<!-- <input type="range" bind:value={$threshold} min="0" max="1"> -->
<select bind:value={$linkage}>
    {#each methods as method}
        <option value={method}>
            {method}
        </option>
    {/each}
</select>