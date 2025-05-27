<script lang="ts">
  import Button from '@/components/ui/button/button.svelte';

  import { ArrowUpDownIcon, Trash2Icon } from '@lucide/svelte';

  import type { Player } from '@/game/types';
  import { getGameInstance } from '@/game/store';

  const game = getGameInstance();

  let player: Player = $props();
</script>

<div class="flex h-8 items-center rounded-md">
  <!-- Circle with player name -->
  <div class="mr-auto flex items-center overflow-hidden pr-8">
    <span class="overflow-hidden overflow-ellipsis whitespace-nowrap">{player.name}</span>
  </div>

  <!-- SETUP BUTTONS -->
  {#if !$game.gameStarted}
    <!-- Team select button -->
    <Button
      class="size-8"
      variant="outline"
      onclick={() => game.send(['assign-team', [player.name, `${1 - Math.min(player.team, 1)}`]])}
    >
      <ArrowUpDownIcon />
    </Button>

    <Button
      class="size-8"
      variant="outline"
      onclick={() => game.send(['remove-player', [player.name]])}
    >
      <Trash2Icon />
    </Button>
  {/if}
</div>
