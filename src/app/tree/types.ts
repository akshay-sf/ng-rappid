export enum FormType {
  ApplicationForm = "appNode",

  RoleForm = "role",

  ComputeForm = "compute",
  ImageForm = "image",
  StorageForm = "storage",
  ServicesForm = "services",
  VolumesForm = "volumes",

  SidecarsForm = "sidecars",
  VNodeHooksForm = "vNodeHooks",
  ProbingForm = "probing",
  InitContainerForm = "initContainer",

  RedisForm = "redis",
  NginxForm = "nginx",
  MysqlForm = "mysql",
  MinioForm = "minio",

  // Nested Forms
  EnvVarsForm = "env",
  AffinityRulesForm = "affinityRules",
  RoleAffinityForm = "roleAffinity",
  MetricsForm = "metrics",
  LoggingForm = "logging",
}

export type ResourceType =
  | "root"
  | "component"
  | "resource"
  | "lifecycle"
  | "pre_configured";

export type ResourceKeys =
  | "appNode"
  | "role"
  | "compute"
  | "image"
  | "storage"
  | "services"
  | "volumes"
  | "sidecars"
  | "vNodeHooks"
  | "probing"
  | "initContainer"
  | "redis"
  | "nginx"
  | "mysql"
  | "minio";

export interface ResourceItem {
  id: string;
  name: string;
  type: ResourceType;
  label: string;
  height?: number;
  contentType?: FormType;
  imgSrc?: string;
  contents?: ResourceItem[];
  version?: string;
  isOnlyLeafView?: boolean;
  allowedSources?: FormType[];
  allowedTargets?: FormType[];
}

export type ResourceList = Record<ResourceKeys, ResourceItem>;

export enum Direction {
  LEFT = "L",
  RIGHT = "R",
  TOP = "T",
  BOTTOM = "B",
}

export enum ElementAttrs {
  DIRECTION = "direction",
  HIDDEN = "hidden",
  COLLAPSED = "collapsed",
  COLLAPSED_LEFT = "collapsed-L",
  COLLAPSED_RIGHT = "collapsed-R",
  ERROR = "error",
}
