<script>
	
	import { csv } from 'd3';
	import Matrix from "./components/Matrix.svelte";
	import Network from "./components/Network.svelte";
	
	let dataset;

	csv('data/protein_network_correlation_big.csv').then(function(data) {
		dataset = data;
		console.log(dataset);
	})
		
</script>


<!-- Bug: Components don't work at the same time yet. 
	I think is due to the fact that labels are extracted in both Matrix.svelte and Network.Svelte .
	Hence, I'd like to create an additional data engeneering component that can be imported in all visuals components  -->
<h1>Network Brush</h1>
{#if dataset}
	<!-- <Matrix data={dataset} width={1000} height={800}/> -->
	<Network data={dataset} width={1000} height={800} threshold={0.3} radius={5} />
{/if}
