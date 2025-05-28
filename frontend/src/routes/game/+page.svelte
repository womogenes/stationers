<script lang="ts">
  import { Button } from '@/components/ui/button';
  import PlayerList from './PlayerList.svelte';
  import HackPanel from './HackPanel.svelte';
  import GameBoard from './GameBoard.svelte';

  import { getGameInstance } from '@/game/store';
  import { ROUND_TEXT } from '@/game/game-text';

  const game = getGameInstance();
  const isGameStartReady = $derived($game && game.isGameStartReady());
</script>

<div class="flex h-full justify-between overflow-hidden">
  <!-- Column -->
  <div class="flex w-60 shrink-0 flex-col border-r">
    <div class="mb-auto p-4">
      <PlayerList />
    </div>

    <div class="p-4">
      <HackPanel />
    </div>
  </div>

  <div class="flex w-full flex-col items-start gap-4 p-4">
    <div>
      <h1 class="text-2xl font-bold">Stationers</h1>
    </div>

    <div class="grid w-full grid-cols-2 gap-4">
      <div>
        <b>{ROUND_TEXT[$game.round]?.name}</b>
        <p>{ROUND_TEXT[$game.round]?.description}</p>
      </div>
    </div>

    {#if !$game.gameStarted}
      <Button onclick={() => game.send(['start-game', []])} disabled={!isGameStartReady}>
        Start Game
      </Button>
    {/if}

    <!-- Game board -->
    {#if $game.gameStarted}
      <div class="flex min-h-0 w-full flex-1 flex-col gap-2">
        <p class="text-lg font-bold">Game Board</p>
        <div class="flex-1 overflow-y-auto">
          <GameBoard />
        </div>
      </div>
    {/if}
  </div>
</div>
