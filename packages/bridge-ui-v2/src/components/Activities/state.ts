import { writable } from 'svelte/store';

import type { BridgeTransaction } from '$libs/bridge';
import type { RelayerBlockInfo } from '$libs/relayer/types';

export const transactionStore = writable<BridgeTransaction[]>([]);

export const blockInfoStore = writable<RelayerBlockInfo[]>([]);

// We want to keep track of the previous block info so we can calculate
// the time it takes for the relayer to process a block
export let prevBlockInfoStore: RelayerBlockInfo[] = [];
blockInfoStore.subscribe((newBlockInfoStore) => {
  prevBlockInfoStore = newBlockInfoStore;
});
