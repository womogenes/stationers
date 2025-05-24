<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Stationers</title>
</svelte:head>

<div class="h-screen p-4">
	{@render children()}
</div>
