<script>

    import { getContext } from 'svelte';

    const {threshold} = getContext('threshold');

</script>


<input type="range" bind:value={$threshold} min="0" max="1">