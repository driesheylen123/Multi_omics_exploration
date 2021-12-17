<script>
	
	import Menu from './components/Menu.svelte';
	import Matrix from "./components/Matrix.svelte";
	import Network from "./components/Network.svelte";
	import DataProcessing from "./components/DataProcessing.svelte";

	// import TestComponent from "./components/TestComponent.svelte";
	
	
		
</script>


<h1>Network Brush</h1>
<DataProcessing>
	<!-- <TestComponent></TestComponent> -->
	<Menu/>
	<div>
		<Matrix width={1000} height={800}/>
		<Network width={1000} height={800} radius={5} />
	</div>
</DataProcessing>




