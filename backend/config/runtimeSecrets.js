const TRUE_VALUES = new Set(['1', 'true', 'yes', 'on']);

function asBool(value) {
  return TRUE_VALUES.has(String(value || '').toLowerCase());
}

export function getRuntimeSecretsConfig(env = process.env) {
  return {
    provider: env.SECRET_PROVIDER || 'env',
    enabled: asBool(env.SECRET_MANAGER_ENABLED),
    mappingJson: env.SECRET_MAPPING_JSON || '{}',
  };
}

export async function loadRuntimeSecrets(env = process.env) {
  // Minimal env-provider implementation: returns current env values.
  // Provider-specific managers can be added later without changing call sites.
  return {
    ...env,
  };
}

export default {
  getRuntimeSecretsConfig,
  loadRuntimeSecrets,
};
