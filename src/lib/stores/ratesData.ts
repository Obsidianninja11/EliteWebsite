import { browser } from '$app/environment';
import { Crop, type FarmingTool } from 'farming-weight';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

interface RatesData {
	v: number;
	settings: boolean;
	tool?: FarmingTool;
	communityCenter: number;
	selectedPet?: string;
	strength: number;
	exported: Record<Crop, boolean>;
}

// Initialize the store with the data from localStorage if it exists
const defaultData = {
	v: 1,
	settings: true,
	communityCenter: 0,
	strength: 0,
	exported: {
		[Crop.Cactus]: false,
		[Crop.Carrot]: false,
		[Crop.CocoaBeans]: false,
		[Crop.Melon]: false,
		[Crop.Mushroom]: false,
		[Crop.NetherWart]: false,
		[Crop.Potato]: false,
		[Crop.Pumpkin]: false,
		[Crop.SugarCane]: false,
		[Crop.Wheat]: false,
	} as Record<Crop, boolean>,
} as RatesData;

export function initRatesData(data = defaultData) {
	if (browser) {
		const savedRatesData = localStorage.getItem('ratesData');

		if (savedRatesData) {
			data = JSON.parse(savedRatesData) as RatesData;
		}
	}

	const store = writable<RatesData>(data);

	store.subscribe((rates) => {
		if (browser) {
			localStorage.setItem('ratesData', JSON.stringify(rates));
		}
	});

	setContext('ratesData', store);
}

export function getRatesData() {
	const store = getContext<Writable<RatesData>>('ratesData');

	store.update((rates) => {
		if (!rates || rates.v !== defaultData.v) {
			rates = defaultData;
		}

		return rates;
	});

	if (store) return store;

	initRatesData();
	return getContext<Writable<RatesData>>('ratesData');
}
