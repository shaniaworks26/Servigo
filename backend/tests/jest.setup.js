import { stopMetricsCollection } from '../services/metricsService.js';

// Jest global setup for backend integration tests
// Add shared test environment configuration here.

// Increase timeout for longer backend integration tests.
globalThis.jest?.setTimeout(30000);

globalThis.afterAll?.(() => {
  stopMetricsCollection();
});
