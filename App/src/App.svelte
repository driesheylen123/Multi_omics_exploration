<script>
	
	import Sidebar from './_components/Sidebar.svelte';
	import Navbar from './_components/Navbar.svelte';
	import Heatmap from './_components/Heatmap.svelte';
	import Network from './_components/Network.svelte';

	import { _data, renderVisuals } from './stores.js';

</script>
 
<div class="d-flex" id="wrapper">
	<Sidebar></Sidebar>
	<!-- Page Content -->
	<div id="page-content-wrapper">
		<Navbar></Navbar>
		<div class="container-fluid px-4">
			{#if $renderVisuals}
				<div class="row my-5">
					<div class="col-xl-6">
						<h3 class="fs-4 mb-3">Adjacency Matrix</h3>
						<Heatmap data={$_data}></Heatmap>
					</div>
					<div class="col-xl-6">
						<h3 class="fs-4 mb-3">Graph</h3>
						<Network data={$_data}></Network>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	#wrapper {
		overflow-x: hidden;
	}
	#page-content-wrapper {
		min-width: 100vw;
	}
	@media (min-width: 768px) {
		#page-content-wrapper {
			min-width: 0;
			width: 100%;
		}
	}
</style>







