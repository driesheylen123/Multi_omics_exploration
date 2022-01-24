<script>
	
	import Sidebar from './_components/Sidebar.svelte';
	import Heatmap from './_components/Heatmap.svelte';
	import Network from './_components/Network.svelte';
	import Dendogram from './_components/Dendogram.svelte';

	import { _data, renderVisuals, linkage } from './stores.js';
		
</script>

<div class="d-flex flex-row flex-nowrap">
	<Sidebar></Sidebar>
	{#if $renderVisuals}
		<div class="flex-grow-1 align-self-center mx-3 mh-100" id="heatmap">
			{#if $linkage !== "none"}
				<div>
					<Dendogram data={$_data}></Dendogram>
				</div>
			{/if}
			<div>
				<Heatmap data={$_data}></Heatmap>
			</div>
		</div>
		<div class="flex-grow-1 align-self-center mx-3 mh-100" id="network">
			<Network data={$_data}></Network>
		</div>
	{/if}
</div>

<style>
    
</style>







