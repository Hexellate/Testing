// V1 is used to convert an V0 (empty) config to a V1 config

function MainToV1(config) {
  const converted = { ...config };
  converted.configVersion = 1;
  converted.body = {};
  converted.revised = new Date();
  return converted;
}


const SchemaMainV1 = {
  "type": "object",
  // "additionalProperties": false,
  "required": ["configVersion", "revised", "body"],
  "items": {
    "configVersion": {
      "type": "number",
    },
    "checksum": {
      "type": "string",
    },
    "revised": {
      "type": "string",
    },
    "body": {
      "type": "object",
    },
  },
};


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
