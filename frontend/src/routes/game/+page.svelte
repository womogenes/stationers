<script lang="ts">
  import Button from '@/components/ui/button/button.svelte';
  import Input from '@/components/ui/input/input.svelte';

  import PlayerList from './PlayerList.svelte';

  import { getGameInstance } from '@/game/store';
  import { roundText } from '@/game/game-text';

  const game = getGameInstance();

  let newPlayerName = $state('');
  let canAddPlayer = $derived($game.players.length < 6);
</script>

<div class="flex flex-col items-start gap-6">
  <div>
    <h1 class="text-xl font-bold">Stationers</h1>
  </div>

  <div>
    <b>Round: {roundText[$game.round]?.name}</b>
    <p>{roundText[$game.round]?.description}</p>
  </div>

  <div class="w-full max-w-96">
    <p class="mb-2">
      <b>
        {$game.players.length}
        {$game.players.length === 1 ? 'player' : 'players'}
      </b>
      {!canAddPlayer && ' (game full)'}
    </p>

    <div class="mb-2 flex gap-2">
      <Input
        type="text"
        placeholder="Name"
        bind:value={newPlayerName}
        onkeydown={(e) => {
          if (e.key !== 'Enter') return;
          try {
            game.send(['add-player', [newPlayerName]]);
            newPlayerName = '';
          } catch {}
        }}
        disabled={!canAddPlayer}
      />

      <Button
        onclick={() => game.send(['add-player', [newPlayerName]])}
        disabled={!newPlayerName || !canAddPlayer}
      >
        Add
      </Button>
    </div>

    <!-- Player list menu -->
    <PlayerList />
  </div>
</div>
