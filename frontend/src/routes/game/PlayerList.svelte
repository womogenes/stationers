<script lang="ts">
  import Button from '@/components/ui/button/button.svelte';
  import Input from '@/components/ui/input/input.svelte';
  import PlayerCard from './PlayerCard.svelte';

  import { cn } from '@/utils';

  import { LONG_TEAM_NAMES, SHORT_TEAM_NAMES } from '@/game/game-text';
  import type { Player } from '@/game/types';
  import { getGameInstance } from '@/game/store';

  import { UserIcon } from '@lucide/svelte';

  const game = getGameInstance();

  let newPlayerName = $state('');
  let canAddPlayer = $derived($game.players.length < 6);

  // Grab players by team (unassigned players are team 2, only shown if game not started)
  let playersByTeam = $derived(
    ($game?.gameStarted ? [0, 1] : [0, 1, 2]).map((team) =>
      $game?.players.filter((p: Player) => p.team === team),
    ),
  );
</script>

<p class="mb-2">
  <b>Players</b>
  ({$game.players.length})
</p>

<!-- Name input (temporary) -->
{#if !$game.gameStarted}
  <div class="mb-1 flex w-full gap-2">
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
{/if}

<div class="flex flex-col divide-y">
  {#each playersByTeam as team, index}
    <div class="py-4">
      <div class="mb-1 flex items-center gap-2">
        <div
          class={cn(
            'size-3 shrink-0 rounded-full',
            index === 2 ? 'bg-gray-400' : index === 0 ? 'bg-red-700' : 'bg-blue-700',
          )}
        ></div>
        <div class="flex w-full justify-between gap-4">
          <p class="font-bold">{index < 2 ? SHORT_TEAM_NAMES[index] : 'Unassigned'}</p>
          <div class="text-muted-foreground flex items-center gap-2">
            {team.length}
            <UserIcon size={16} />
          </div>
        </div>
      </div>
      <div class="flex flex-col">
        {#each team as player}
          <PlayerCard {...player} />
        {/each}
      </div>
    </div>
  {/each}
</div>
