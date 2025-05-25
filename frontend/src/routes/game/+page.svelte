<script lang="ts">
  import Button from '@/components/ui/button/button.svelte';
  import { StationersGame } from '@/game/game';

  let game = new StationersGame();
</script>

<div class="flex flex-col items-start gap-2">
  <div>
    <h1 class="text-xl font-bold">Stationers</h1>
    <p>Testing interface</p>
  </div>

  <p>Round: {$game.round}</p>
  <Button onclick={() => game.send(['increment-round'])}>click me</Button>
</div>
