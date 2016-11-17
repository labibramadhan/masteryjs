import glob from 'glob';
import path from 'path';

import routesSetup from '../setup/routes';

const bootPlugins = async (server) => {
  // retrieve all available package plugins
  const pluginPath = path.resolve(path.join(__dirname, '..', 'plugins'));
  const pluginGlob = path.resolve(path.join(pluginPath, '**', '*.js'));
  const plugins = glob.sync(pluginGlob);
  for (const plugin of plugins) { // eslint-disable-line no-restricted-syntax
    // eslint-disable-next-line global-require,import/no-dynamic-require
    await server.register(require(plugin));
  }
};

const bootRoutes = async (server) => {
  // retrieve all available routes, pass the models from sequelize as a single parameter
  const allRoutes = await routesSetup(server.plugins['hapi-sequelize'].db.getModels());
  server.route(allRoutes);
};

const bootScripts = async (server) => {
  const bootPath = path.resolve(path.join(__dirname, '..', 'setup', 'boot'));
  const bootGlob = path.resolve(path.join(bootPath, '**', '*.js'));

  // retrieve all available boot scripts
  const bootFiles = glob.sync(bootGlob);
  for (const bootFile of bootFiles) { // eslint-disable-line no-restricted-syntax
    // execute the boot script
    await require(bootFile)(server); // eslint-disable-line global-require,import/no-dynamic-require
  }
};

export const bootServer = async (server) => {
  // boot local plugins from /plugins/**/*.js
  await bootPlugins(server);

  // boot all routes from /component/**/*Routes.js
  await bootRoutes(server);

  // boot all boot scripts from /setup/boot/**/*.js
  await bootScripts(server);
};

export const getPackage = () => {
  const rootPath = path.resolve(path.join(__dirname, '..', '..'));

  // return the contents of /package.json
  return require(path.join(rootPath, 'package.json')); // eslint-disable-line global-require,import/no-dynamic-require
};

export const concatToJoiObject = (joiObject, candidate) => {
  if (!candidate) return joiObject;
  else if (candidate.isJoi) return joiObject.concat(candidate);
  return joiObject.keys(candidate);
};
