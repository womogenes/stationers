<script lang="ts">
  import { Button } from '@/components/ui/button';
  import PlayerList from './PlayerList.svelte';
  import HackPanel from './HackPanel.svelte';

  import { getGameInstance } from '@/game/store';
  import { roundText } from '@/game/game-text';

  const game = getGameInstance();
  const isGameStartReady = $derived($game && game.isGameStartReady());
</script>

<div class="flex h-full justify-between gap-4">
  <div class="flex flex-col items-start gap-5 p-4">
    <div>
      <h1 class="text-2xl font-bold">Stationers</h1>
    </div>

    <div>
      <b>Round: {roundText[$game.round]?.name}</b>
      <p>{roundText[$game.round]?.description}</p>
    </div>

    {#if !$game.gameStarted}
      <Button onclick={() => game.send(['start-game', []])} disabled={!isGameStartReady}>
        Start Game
      </Button>
    {/if}
  </div>

  <!-- Right column -->
  <div class="flex w-96 shrink-0 flex-col border-l">
    <div class="mb-auto p-4">
      <PlayerList />
    </div>

    <div class="shrink-0 border-t p-4">
      <HackPanel />
    </div>
  </div>
</div>
