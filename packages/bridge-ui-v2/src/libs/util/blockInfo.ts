import type { BlockInfo } from '$libs/relayer';

export function getTimeToProcess(
  bridgeTxBlockNumber: number,
  blockInfo: BlockInfo,
  prevBlockInfo: BlockInfo,
  interval: number,
) {
  if (bridgeTxBlockNumber <= blockInfo.latestProcessedBlock) return 0;

  const distanceToBlock = bridgeTxBlockNumber - blockInfo.latestProcessedBlock;

  // At what speed the relayer is processing blocks
  const blocksPerSecond = (blockInfo.latestProcessedBlock - prevBlockInfo.latestProcessedBlock) / interval;

  return distanceToBlock / blocksPerSecond; // amount of milliseconds for the relayer to reach bridgeTx block
}
