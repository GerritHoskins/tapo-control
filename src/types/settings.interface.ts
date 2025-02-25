export interface AirExchangeSettings {
  interval: number;
  duration: number;
}

export interface VpdTarget {
  min: number | null;
  max: number | null;
}

export type VpdModes = {
  [key: string]: [number, number];
};

export interface MaxHumidityLevels {
  propagation: number;
  vegetative: number;
  flowering: number;
}

export interface DeviceConfig {
  ip: string;
  type: "h100" | "p100" | "p115"; // Restrict known device types
}

export interface DeviceMap {
  sensor_hub: DeviceConfig;
  exhaust: DeviceConfig;
  humidifier: DeviceConfig;
  dehumidifier: DeviceConfig;
}

export interface ActionMap {
  [key: number]: string;
}

export interface ConfigSettingsResponse {
  KPA_TOLERANCE: number;
  LEAF_TEMP_OFFSET: number;
  VPD_TARGET: VpdTarget;
  VPD_MODES: VpdModes;
  ACTION_MAP: ActionMap;
  MAX_HUMIDITY_LEVELS: MaxHumidityLevels;
  DEVICE_MAP: DeviceMap;
  WS_URL: string;
}
