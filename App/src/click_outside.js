export function clickOutside(node) {
	const handleClick = (event) => {
		if (!node.contains(event.target)) {
			node.dispatchEvent(new CustomEvent("outclick"));
		}
	};

	document.addEventListener("mouseup", handleClick, true);

	return {
		destroy() {
			document.removeEventListener("mouseup", handleClick, true);
		}
	};
}