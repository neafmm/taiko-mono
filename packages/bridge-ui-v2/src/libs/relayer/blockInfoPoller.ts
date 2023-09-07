import { EventEmitter } from 'events';

import { relayerBlockInfoPoller } from '$config';
import { PUBLIC_RELAYER_URL } from '$env/static/public';
import { getLogger } from '$libs/util/logger';
import { nextTick } from '$libs/util/nextTick';

import type { RelayerBlockInfo } from './types';

export enum PollingEvent {
  STOP = 'stop',
  BLOCK_INFO = 'blockinfo',
}

const log = getLogger('bridge:relayer:blockInfoPoller');

const RELAYER_BLOCKINFO_API = `${PUBLIC_RELAYER_URL}/blockInfo`;

export function startPolling(runImmediately = false) {
  let interval: Maybe<ReturnType<typeof setInterval>>;
  const emitter = new EventEmitter();

  const stopPolling = () => {
    if (interval) {
      log('Stop polling for block info');

      // Clean up
      clearInterval(interval);

      interval = null;
      emitter.emit(PollingEvent.STOP);
    }
  };

  const destroy = () => {
    stopPolling();
    emitter.removeAllListeners();
  };

  const pollingFn = async () => {
    try {
      const response = await fetch(RELAYER_BLOCKINFO_API);
      const data = (await response.json()) as { data: RelayerBlockInfo[] };
      emitter.emit(PollingEvent.BLOCK_INFO, data?.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!interval) {
    log('Starting polling for block info');
    interval = setInterval(pollingFn, relayerBlockInfoPoller.interval);

    // setImmediate isn't standard
    if (runImmediately) {
      // We run the polling function in the next tick so we can
      // attach listeners before the polling function is called
      nextTick(pollingFn);
    }
  } else {
    log('Already polling for block info');
  }

  return { destroy, emitter };
}
