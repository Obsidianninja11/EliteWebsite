<script lang="ts">
	import type { components } from '$lib/api/api';
	import { Button } from '$ui/button';
	import * as Accordion from '$ui/accordion';
	import * as Popover from '$ui/popover';
	import { EventType } from '$lib/utils';
	import Crown from 'lucide-svelte/icons/crown';

	interface Props {
		owner?: boolean;
		event: components['schemas']['EventDetailsDto'];
		member: components['schemas']['EventMemberDto'] | components['schemas']['EventMemberDetailsDto'];
		rank?: number | undefined;
		running: boolean;
	}

	let { owner = false, event, member, rank = undefined, running }: Props = $props();

	const medalWeight = (medal: string) => {
		const data = event.data as { medalWeights?: Record<string, number> } | undefined;
		return data?.medalWeights?.[medal] ?? 0;
	};

	const earnedMedals = () => {
		const data = member.data as { earnedMedals?: Record<string, number> } | undefined;
		return [
			['Diamond', data?.earnedMedals?.['Diamond']],
			['Platinum', data?.earnedMedals?.['Platinum']],
			['Gold', data?.earnedMedals?.['Gold']],
			['Silver', data?.earnedMedals?.['Silver']],
			['Bronze', data?.earnedMedals?.['Bronze']],
		].filter(([, count]) => count) as [string, number][];
	};
</script>

<Accordion.Trigger class="w-full">
	<div id={member.playerUuid} class="flex w-full scroll-mt-64 flex-row justify-between align-middle">
		<div class="flex flex-row items-center gap-2 align-middle">
			{#if rank}
				<div class="text-green-800 dark:text-green-300">
					<p>
						<span class="text-sm sm:text-xl">#</span><span class="text-lg sm:text-2xl">{rank}</span>
					</p>
				</div>
			{/if}
			<img
				src="https://mc-heads.net/avatar/{member.playerUuid}"
				alt="Player Head"
				class="pixelated aspect-square h-8 w-8 rounded-sm"
			/>
			<p class="text-lg">{member.playerName}</p>
			{#if owner}
				<Popover.Mobile>
					{#snippet trigger()}
						<div class="flex flex-row items-end">
							<Crown size="sm" class="mt-1.5 w-4 text-yellow-400" />
						</div>
					{/snippet}
					<p class="text-lg font-semibold">Team Owner</p>
				</Popover.Mobile>
			{/if}
			{#if running}
				<Popover.Mobile>
					{#snippet trigger()}
						<div class="flex flex-col items-center justify-center">
							{#if member.status === 0}
								<div class="h-2 w-2 rounded-full bg-gray-300 dark:bg-zinc-700"></div>
							{/if}
							{#if member.status === 1}
								<div class="h-2 w-2 rounded-full bg-green-500 dark:bg-green-300"></div>
							{/if}
						</div>
					{/snippet}
					<div>
						{#if member.status === 0}
							<p class="text-lg font-semibold">Inactive Farmer</p>
							<p class="max-w-xs">
								{member.playerName} has not increased their score since last checked.
							</p>
						{/if}
						{#if member.status === 1}
							<p class="text-lg font-semibold">Actively Farming!</p>
							<p class="max-w-xs">{member.playerName} has increased their score since last checked!</p>
						{/if}
					</div>
				</Popover.Mobile>
			{/if}
		</div>
		<p class="block pr-2 text-lg">
			{#if member.score && +member.score > 0}
				{(+(member.score ?? 0)).toLocaleString()}
			{:else if running}
				<span class="text-red-800 dark:text-red-500">Zero!</span>
			{/if}
		</p>
	</div>
</Accordion.Trigger>
<Accordion.Content>
	<div class="flex w-full flex-col items-start gap-4 md:flex-row">
		{#if event.type === +EventType.Medals}
			<div class="flex w-full flex-col gap-1">
				{#each earnedMedals() as [medal, count]}
					<div class="flex flex-row items-center justify-between gap-2 p-1 even:rounded-sm even:bg-card">
						<div class="flex flex-row items-center gap-2">
							<img
								src="/images/medals/{medal.toLowerCase()}.webp"
								alt={medal}
								class="pixelated aspect-square"
							/>
							<p class="whitespace-nowrap font-semibold">{medal} <span>x{count}</span></p>
						</div>
						<p class="font-semibold">{count * medalWeight(medal)}</p>
					</div>
				{/each}
			</div>
		{/if}
		<div class="flex w-full flex-row items-center justify-between">
			<div>
				<p class="text-gray-500">Last Updated</p>
				<p>
					{member.lastUpdated
						? new Date(+(member.lastUpdated ?? 0) * 1000).toLocaleDateString() +
							' ' +
							new Date(+(member.lastUpdated ?? 0) * 1000).toLocaleTimeString()
						: 'Never Updated!'}
				</p>
			</div>
			<Button href="/@{member.playerUuid}/{member.profileId}">View Stats</Button>
		</div>
	</div>
</Accordion.Content>
