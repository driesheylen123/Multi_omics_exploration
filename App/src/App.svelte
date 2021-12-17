<script>
	
	import Menu from './components/Menu.svelte';
	import Matrix from "./components/Matrix.svelte";
	import Network from "./components/Network.svelte";
	import DataProcessing from "./components/DataProcessing.svelte";

	// import TestComponent from "./components/TestComponent.svelte";
	
	
		
</script>


<!-- Bug: Components don't work at the same time yet. 
	I think is due to the fact that labels are extracted in both Matrix.svelte and Network.Svelte .
	Hence, I'd like to create an additional data engeneering component that can be imported in all visuals components  -->
<h1>Network Brush</h1>
<DataProcessing>
	<!-- <TestComponent></TestComponent> -->
	<Menu/>
	<div>
		<Matrix width={1000} height={800}/>
		<Network width={1000} height={800} radius={5} />
	</div>
</DataProcessing>




