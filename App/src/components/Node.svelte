<script>

    import { clickOutside } from '../click_outside.js';
    export let radius = 4;
    export let node;
    export let svg;

    console.log(node);

    // Functions
    function dragstarted(event) {
        console.log(event);
        dragged(event)
        document.addEventListener("mousemove", dragged);
    }

    function dragged(event) {
        const point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;

        const svgP = point.matrixTransform( svg.getScreenCTM().inverse() );

        node.fx = svgP.x;
        node.fy = svgP.y;
    }

    function dragended(event) {
    //   if (!event.active) simulation.alphaTarget(0);
      node.fx = null;
      node.fy = null;
      document.removeEventListener("mousemove", dragged);
    }

</script>

<circle class='node' 
        cx="{node.x}" 
        cy="{node.y}" 
        r={radius} 
        use:clickOutside
        on:mousedown={dragstarted} 
        on:outclick={dragended}
        on:mouseup={dragended}/>