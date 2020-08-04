import tsconfig from '../tsconfig.json';
import * as path from 'path';
import {fileURLToPath} from 'url'
import {createRequire} from 'module'
const require = createRequire(fileURLToPath(import.meta.url))

const baseURL = "file:///" + path.resolve(path.dirname('') , tsconfig.compilerOptions.baseUrl);


const esm = require('../node_modules/ts-node/dist/esm')

const hooks = esm.registerAndCreateEsmHooks()

function doesAliasMatch(path,specifier) {
    if(path.alias.endsWith("*") && path.replacement.endsWith("*")) {
        return specifier.startsWith(path.alias.slice(0, -1));
    } else if(!path.alias.endsWith("*") && !path.replacement.endsWith("*")){
        return (path.alias === specifier);
    }
    return false
}

function findAlias(specifier) {
    const paths = tsconfig.compilerOptions.paths;
    let found = undefined;
    Object.keys(paths).forEach(function(path) {
        let temp = {alias: path, replacement: paths[path][0]};
        if(doesAliasMatch(temp,specifier)){
            found = temp;
        }            
    });
    return found;
}

function aliasSpecifier(alias, specifier) {
    if(alias.alias.endsWith("*")) {
        return specifier.replace(alias.alias.slice(0, -1), alias.replacement.slice(0, -1));
    } else {
        return specifier.replace(alias.alias, alias.replacement);
    }
}


export function resolve(specifier, context, defaultResolve) {
  const { parentURL = baseURL + "/server.ts" } = context;

  //console.log("Look: ",  specifier);

  const alias = findAlias(specifier);

  if (alias !== undefined) {
    // const tspecifier = specifier;
    specifier = aliasSpecifier(alias, specifier);    
    let relativpath = path.relative(path.dirname(parentURL), baseURL);
    if(relativpath === "") relativpath = ".";
    specifier = "./" + relativpath + "/" + specifier.replace("./", "");
    // console.log("found alias " + tspecifier + " -> " + specifier);
  }
  return hooks.resolve(specifier, context, defaultResolve)
}

export function getFormat(url, context, defaultGetFormat) {
    return hooks.getFormat(url, context, defaultGetFormat);
}

export function transformSource(source, context, defaultTransformSource) {
    return hooks.transformSource(source, context, defaultTransformSource);
}