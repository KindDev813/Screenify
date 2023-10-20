export const CAMERA_ALLOWED = "You can use your camera!";
export const CAMERA_BLOCKED = "Please allow permission of your camera!";
export const MICROPHONE_ALLOWED = "You can use your microphone!";
export const MICROPHONE_BLOCKED = "Please allow permission of your microphone!";

export const LABEL = {
  FULL_SCREEN: "Full Screen",
  WINDOW: "Window",
  CURRENT_TAB: "Current Tab",
  CAMERA_ONLY: "Camera only",
  CAMERA: "Camera",
  MICROPHONE: "Microphone",
  RECORDING_QUALITY: "Recording quality",
  TRIM: "Trim",
  CROP: "Crop",
  FINETUNE: "Finetune",
  FILTER: "Filter",
  ANNOTATE: "Annotate",
  STICKER: "Sticker",
};

export const QUALITYOPTIONS = [
  {
    label: "Low",
    value: "100000",
  },
  {
    label: "Medium",
    value: "3000000",
  },
  {
    label: "High",
    value: "5000000",
  },
];

export const XCOUNTERS = [1, 1.5, 2];

export const SHAPE_TYPES = {
  RECT: "rect",
  CIRCLE: "circle",
};

export const DEFAULTS_SHAPE_VALUE = {
  RECT: {
    STROKE: "#000000",
    FILL: "#0000",
    WIDTH: 150,
    HEIGHT: 100,
    ROTATION: 0,
    STROKEWIDTH: 2,
  },
  CIRCLE: {
    STROKE: "#000000",
    FILL: "#0000",
    RADIUS: 50,
    STROKEWIDTH: 2,
  },
};

export const LIMITS_SHAPE_VALUE = {
  RECT: {
    MAX: 1000,
    MIN: 10,
  },
  CIRCLE: {
    MAX: 500,
    MIN: 5,
  },
};

export const KEY_CODE = {
  RETURN_KEY: 13,
  ESCAPE_KEY: 27,
};

export const BLOB_LINKS = "get_blob_link";
export const RECORDING_DURATION = "recording_duration";

export const DRAG_DATA_KEY = "__drag_data_payload__";
