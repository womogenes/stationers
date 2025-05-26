<script lang="ts">
  import PlayerList from './PlayerList.svelte';

  import { getGameInstance } from '@/game/store';
  import { roundText } from '@/game/game-text';

  const game = getGameInstance();
</script>

<div class="flex h-full justify-between gap-4">
  <div class="flex flex-col items-start p-4">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Stationers</h1>
    </div>

    <div>
      <b>Round: {roundText[$game.round]?.name}</b>
      <p>{roundText[$game.round]?.description}</p>
    </div>
  </div>

  <!-- Right column -->
  <div class="w-full max-w-96 border-l p-4">
    <PlayerList />
  </div>
</div>
