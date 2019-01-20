// V1 is used to convert an V0 (empty) config to a V1 config

function MainToV1(config) {
  const converted = { ...config };
  converted.configVersion = 1;
  converted.body = {
    "updates": {
      "autoUpdate": false,
    },
  };
  converted.revised = new Date();
  return converted;
}


const SchemaMainV1 = {
  "type": "object",
  "default": {},
  "required": ["configVersion", "revised", "body"],
  "properties": {
    "configVersion": {
      "type": "number",
      "default": 1,
    },
    "checksum": {
      "type": "string",
    },
    "revised": {
      "type": "string",
      "default": new Date(),
    },
    "body": {
      "type": "object",
      "default": {},
      "required": ["updates"],
      "properties": {
        "updates": {
          "type": "object",
          "default": {},
          "required": ["autoUpdate"],
          "properties": {
            "autoUpdate": {
              "type": "boolean",
              "default": false,
            },
          },
        },
        "appReserved": {// On config version increments, these settings will probably be reset (may track versioning to an extent for each subtree, allowing proper final transformers to be written). Once a new config version hits the next channel, this section should be empty.
          "type": "object",
          "default": {},
          "description": "Config namespaces that are not part of an official spec yet, but are used anyway. Most common for canary builds.",
        },
        "addonReserved": {
          "type": "object",
          "default": {},
          "description": "Config namespaces to be used for addons (when implemented). Names will be a hash of addon name and author, beyond that entirely up to discretion of addon developer",
        },
      },
    },
  },
};
// When I get to addons, each will probably actually have it's own config file, where author can provide schemas and transformers. Still use hash naming though...


// Matrix exports
export const converterMatrix = {
  "main": {
    "v1": MainToV1,
  },
};

export const schemaMatrix = {
  "main": {
    "v1": SchemaMainV1,
  },
};
