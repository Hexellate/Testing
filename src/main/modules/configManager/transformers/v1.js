// V1 is used to convert an V0 (empty) config to a V1 config

function MainToV1(config) {
  return config;
}


const SchemaMainV1 = {
  "type": "object",
  "additionalProperties": false,
  "required": ["configVersion", "checksum", "body"],
  "items": {
    "configVersion": {
      "type": "number",
    },
    "checksum": {
      "type": "string",
    },
    "revised": {
      "type": "date",
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
