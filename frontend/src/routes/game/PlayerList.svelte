<script lang="ts">
  import Button from '@/components/ui/button/button.svelte';
  import Input from '@/components/ui/input/input.svelte';
  import PlayerCard from './PlayerCard.svelte';

  import { UserIcon } from '@lucide/svelte';

  import { onMount } from 'svelte';
  import { cn } from '@/utils';

  import type { Player } from '@/game/types';
  import { getGameInstance } from '@/game/store';
  import { longTeamNames } from '@/game/game-text';

  const game = getGameInstance();

  let newPlayerName = $state('');
  let canAddPlayer = $derived($game.players.length < 6);
  let playersByTeam = $derived($game ? game.getPlayersByTeam() : []);
</script>

<p class="mb-2">
  <b>Players</b>
  ({$game.players.length})
</p>

<!-- Name input (temporary) -->
{#if !$game.gameStarted}
  <div class="flex gap-2">
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
        <div class={cn('size-4 rounded-full', index === 0 ? 'bg-red-700' : 'bg-blue-700')}></div>
        <div class="flex w-full justify-between gap-4">
          <p>{longTeamNames[index]}</p>
          <div class="text-muted-foreground flex items-center gap-2">
            {team.length}
            <UserIcon size={16} />
          </div>
        </div>
      </div>
      <div class="flex flex-col">
        {#each team as player (player.name)}
          <PlayerCard {...player} />
        {/each}
      </div>
    </div>
  {/each}

  <!-- Unassigned players -->
  {#if !$game.gameStarted}
    <div class="py-4">
      <div class="mb-1 flex items-center gap-2">
        <div class="size-4 rounded-full bg-gray-400"></div>
        <p>Unassigned</p>
      </div>
      <div class="flex flex-col">
        {#each $game.players.filter((p: Player) => p.team === -1) as player (player.name)}
          <PlayerCard {...player} />
        {/each}
      </div>
    </div>
  {/if}
</div>
