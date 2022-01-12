<script>
	
	import Sidebar from './components/Sidebar.svelte';
	import Matrix from "./components/Matrix.svelte";
	import Network from "./components/Network.svelte";
	import DataProcessing from "./components/DataProcessing.svelte";

	// import TestComponent from "./components/TestComponent.svelte";
	
		
</script>

<div class="d-flex flex-row flex-nowrap">
	<Sidebar></Sidebar>
	<DataProcessing>
		<div class="flex-grow-1" id="heatmap">
			<Matrix width={700} height={700} />
		</div>
		<div class="flex-grow-1" id="network">
			<Network width={700} height={700} radius={5} />
		</div>
	</DataProcessing>
</div>







