function MainToV1(config) {
  return config;
}

function RenderToV1(config) {
  return config;
}

function BackendToV1(config) {
  return config;
}


const SchemaMainV1 = {
  "type": "object",
  "additionalProperties": false,
  "required": ["configVersion"],
  "items": {
    "configVersion": {
      "type": "number",
    },
  },
};
const SchemaRenderV1 = {
  "type": "object",
  "additionalProperties": false,
  "required": ["configVersion"],
  "items": {
    "configVersion": {
      "type": "number",
    },
  },
};
const SchemaBackendV1 = {
  "type": "object",
  "additionalProperties": false,
  "required": ["configVersion"],
  "items": {
    "configVersion": {
      "type": "number",
    },
  },
};

// Matrix exports
export const converterMatrix = {
  "main": {
    "v1": MainToV1,
  },
  "render": {
    "v1": RenderToV1,
  },
  "backend": {
    "v1": BackendToV1,
  },
};

export const schemaMatrix = {
  "main": {
    "v1": SchemaMainV1,
  },
  "render": {
    "v1": SchemaRenderV1,
  },
  "backend": {
    "v1": SchemaBackendV1,
  },
};
