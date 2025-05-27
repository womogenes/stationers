<script lang="ts">
  import Button from '@/components/ui/button/button.svelte';

  import { getGameInstance, resetGameInstance } from '@/game/store';

  const game = getGameInstance();

  const addPlayers = () => {
    game.send(['add-player', ['Alice']]);
    game.send(['add-player', ['Bob']]);
    game.send(['add-player', ['Charlie']]);
    game.send(['add-player', ['David']]);
    game.send(['add-player', ['Eve']]);
    game.send(['add-player', ['Frank']]);

    game.send(['assign-team', ['Alice', '0']]);
    game.send(['assign-team', ['Bob', '1']]);
    game.send(['assign-team', ['Charlie', '0']]);
    game.send(['assign-team', ['David', '1']]);
    game.send(['assign-team', ['Eve', '0']]);
    game.send(['assign-team', ['Frank', '1']]);
  };
</script>

<div class="flex flex-col gap-2">
  <p><b>Hack Panel</b></p>

  <div class="grid grid-cols-3 gap-2">
    <Button onclick={addPlayers} disabled={$game.players.length > 0}>Add players</Button>
    <Button onclick={resetGameInstance}>Reset game</Button>
  </div>
</div>
