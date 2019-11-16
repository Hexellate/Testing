/**
  * @module
  * @ignore
  */
// Exports all transformer functions
// Also exports an object with valid versions
// Every version MUST have a transformer function from prev version

/*
 Exports a versions object and a transform matrix, as well as schemas
 */


import * as v1 from "./v1";

/**
 * Matrix of supported versions
 */
export const versions = {
  "main": [1],
};

/**
 * Call with ConverterMatrix[type][vnumbertarget] (configtoconvert)
 * e.g. ConverterMatrix[main][v2] (config)
 */
export const converterMatrix = {
  ...v1.converterMatrix,
};

export const schemaMatrix = {
  ...v1.schemaMatrix,
};
