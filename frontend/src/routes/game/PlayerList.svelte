<script lang="ts">
  import Button from '@/components/ui/button/button.svelte';
  import { cn } from '@/utils';

  import { Trash2Icon } from '@lucide/svelte';

  import { shortTeamNames } from '@/game/game-text';
  import { getGameInstance } from '@/game/store';

  const game = getGameInstance();
</script>

{#if $game.players.length > 0}
  <div class="flex flex-col gap-2">
    {#each $game.players as player}
      <div class="flex items-center rounded-md">
        <!-- Circle with player name -->
        <div class="mr-8 flex items-center gap-2">
          <div
            class={cn(
              'size-4 rounded-full transition-colors',
              player.team === -1 ? 'bg-gray-400' : player.team === 0 ? 'bg-red-700' : 'bg-blue-700',
            )}
          ></div>
          <span>{player.name}</span>
        </div>

        <Button
          class="mr-4 w-32"
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

        <Button
          class="size-8"
          variant="ghost"
          onclick={() => game.send(['remove-player', [player.name]])}
        >
          <Trash2Icon />
        </Button>
      </div>
    {/each}
  </div>
{:else}
  <p class="text-muted-foreground">No players added</p>
{/if}
