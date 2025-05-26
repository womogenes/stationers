<script lang="ts">
  import Button from '@/components/ui/button/button.svelte';
  import Input from '@/components/ui/input/input.svelte';

  import { cn } from '@/utils';

  import { Trash2Icon } from '@lucide/svelte';

  import { shortTeamNames } from '@/game/game-text';
  import { getGameInstance } from '@/game/store';

  const game = getGameInstance();

  let newPlayerName = $state('');
  let canAddPlayer = $derived($game.players.length < 6);
</script>

<p class="mb-2">
  <b>Players</b>
  ({$game.players.length}{#if $game.players.length >= 6}, full{/if})
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

{#if $game.players.length > 0}
  <div class="flex flex-col gap-2">
    {#each $game.players as player (player.name)}
      <div class="flex items-center rounded-md">
        <!-- Circle with player name -->
        <div class="mr-auto flex items-center gap-2 overflow-hidden pr-8">
          <div
            class={cn(
              'size-4 shrink-0 rounded-full transition-colors',
              player.team === -1 ? 'bg-gray-400' : player.team === 0 ? 'bg-red-700' : 'bg-blue-700',
            )}
          ></div>
          <span class="overflow-hidden overflow-ellipsis whitespace-nowrap">{player.name}</span>
        </div>

        <Button
          class="mr-2 w-32"
          variant={player.team !== -1 ? (player.team === 0 ? 'red' : 'blue') : 'outline'}
          size="sm"
          onclick={() => game.send(['assign-team', [player.name, 1 - Math.max(player.team, 0)]])}
        >
          {#if player.team === -1}
            Choose Team
          {:else}
            {shortTeamNames[player.team]}
          {/if}
        </Button>

        {#if !$game.gameStarted}
          <Button
            class="size-8"
            variant="outline"
            onclick={() => game.send(['remove-player', [player.name]])}
          >
            <Trash2Icon />
          </Button>
        {/if}
      </div>
    {/each}
  </div>
{:else}
  <p class="text-muted-foreground">No players added</p>
{/if}
