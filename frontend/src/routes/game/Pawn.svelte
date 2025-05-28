<script lang="ts">
  import { cn } from '@/utils';

  import { UserRoundIcon } from '@lucide/svelte';

  const { pawn, active } = $props();
</script>

<div
  class={cn(
    'text-background flex items-center gap-2 rounded-full px-3 py-1 text-sm',
    pawn.team === 0 ? 'bg-red-700' : 'bg-blue-700',
  )}
>
  <UserRoundIcon size={12} />
  {pawn.player}
</div>
