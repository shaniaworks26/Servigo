let intervalHandle = null;

export function startMetricsCollection(intervalMs = 60_000) {
  if (intervalHandle) {
    return intervalHandle;
  }

  // No-op heartbeat keeps API stable for test/runtime imports.
  intervalHandle = setInterval(() => {}, intervalMs);
  if (typeof intervalHandle.unref === 'function') {
    intervalHandle.unref();
  }

  return intervalHandle;
}

export function stopMetricsCollection() {
  if (!intervalHandle) {
    return;
  }

  clearInterval(intervalHandle);
  intervalHandle = null;
}

export function getMetricsSnapshot() {
  return {
    active: intervalHandle !== null,
    collectedAt: new Date().toISOString(),
  };
}

export default {
  startMetricsCollection,
  stopMetricsCollection,
  getMetricsSnapshot,
};
