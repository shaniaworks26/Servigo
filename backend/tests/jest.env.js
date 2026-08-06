// Ensure Jest runs with a test-specific environment early during module loading.
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.APP_ENV = process.env.APP_ENV || process.env.NODE_ENV;
