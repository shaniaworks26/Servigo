const path = require('path');
const fs = require('fs');

module.exports = function resolver(request, options) {
  const defaultResolver = options.defaultResolver || require('jest-resolve/build/defaultResolver');

  // Only handle explicit .js relative imports here; leave everything else
  // to Jest's default resolver.
  if (!/^\.?\.?[\\/].+\.js$/.test(request)) {
    return defaultResolver(request, options);
  }

  // 1) Try resolving exactly relative to the importing file's directory.
  const direct = path.resolve(options.basedir, request);
  if (fs.existsSync(direct)) {
    return direct;
  }

  // 2) If import was '../.../something.js', try mapping into <rootDir>/backend/...
  const parentMatch = request.match(/^\.\.[\\/](.+)\.js$/);
  const rootDir = options.rootDir || process.cwd();
  if (parentMatch) {
    const candidate = path.resolve(rootDir, 'backend', parentMatch[1] + '.js');
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  // 3) If import was './something' and not found, try one directory up (common for generated tests)
  const dotMatch = request.match(/^\.\/[\\/]*(.+)\.js$/);
  if (dotMatch) {
    const parentDir = path.resolve(options.basedir, '..');
    const candidate = path.resolve(parentDir, dotMatch[1] + '.js');
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  // Fallback to default resolver
  return defaultResolver(request, options);
};
