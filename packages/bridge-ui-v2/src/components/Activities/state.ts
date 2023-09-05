import { writable } from 'svelte/store';

import type { BridgeTransaction } from '$libs/bridge';
import type { RelayerBlockInfo } from '$libs/relayer/types';

export const transactionStore = writable<BridgeTransaction[]>([]);

export const blockInfoStore = writable<RelayerBlockInfo[]>([]);
