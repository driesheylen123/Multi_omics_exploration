<script>
	
	import Sidebar from './components/Sidebar.svelte';
	import Matrix from "./components/Matrix.svelte";
	import Network from "./components/Network.svelte";
	import DataProcessing from "./components/DataProcessing.svelte";

	import { renderVisuals } from './stores.js';
		
</script>

<div class="d-flex flex-row flex-nowrap">
	<Sidebar></Sidebar>
	<DataProcessing>
		{#if $renderVisuals}
			<div class="flex-grow-1 align-self-center" id="heatmap">
				<Matrix></Matrix>
			</div>
			<div class="flex-grow-1 align-self-center" id="network">
				<Network></Network>
			</div>
		{/if}
	</DataProcessing>
</div>







