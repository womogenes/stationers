<script lang="ts">
  import Pawn from './Pawn.svelte';
  import type { Pawn as PawnType } from '@/game/types';
  import { getGameInstance } from '@/game/store';
  const game = getGameInstance();
</script>

<!-- Grid of 15 squares -->
<div class="grid w-full grid-cols-5 grid-rows-3 border">
  {#each Array(15) as _, idx}
    <div class="flex flex-col gap-2 border px-4 py-2 pb-4">
      <!-- Square title + description -->
      <div>
        <p class="font-bold">{$game.shops[idx]?.name}</p>
      </div>

      <!-- Pawns -->
      <div class="flex flex-wrap gap-1">
        {#each $game.pawns.filter((p: PawnType) => p.square === idx) as pawn}
          <Pawn {pawn} active={idx === $game.round} />
        {/each}
      </div>
    </div>
  {/each}
</div>
