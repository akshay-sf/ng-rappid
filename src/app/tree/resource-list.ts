import { FormType, ResourceList } from "./types";

export const resourceList: ResourceList = {
  appNode: {
    id: "appNode",
    name: "appNode",
    label: "",
    type: "root",
    contentType: FormType.ApplicationForm,
    allowedTargets: [FormType.RoleForm],
  },
  role: {
    id: "role",
    name: "role",
    label: "Role",
    type: "component",
    contentType: FormType.RoleForm,
    imgSrc: "assets/role.svg",
    allowedSources: [FormType.ApplicationForm],
    size: { height: 36, width: 36 },
  },
  image: {
    id: "image",
    name: "image",
    label: "Image",
    type: "resource",
    contentType: FormType.ImageForm,
    imgSrc: "assets/image.svg",
    isOnlyLeafView: true,
    allowedSources: [FormType.RoleForm],
    size: { height: 24, width: 24 },
  },
  compute: {
    id: "compute",
    name: "compute",
    label: "Compute",
    type: "resource",
    contentType: FormType.ComputeForm,
    imgSrc: "assets/compute.svg",
    isOnlyLeafView: true,
    allowedSources: [FormType.RoleForm],
    size: { height: 24, width: 24 },
  },
  storage: {
    id: "storage",
    name: "storage",
    label: "Storage",
    type: "resource",
    contentType: FormType.StorageForm,
    imgSrc: "assets/HDD.svg",
    isOnlyLeafView: true,
    allowedSources: [FormType.RoleForm],
    size: { height: 24, width: 24 },
  },
  services: {
    id: "services",
    name: "services",
    label: "Services",
    type: "resource",
    contentType: FormType.ServicesForm,
    imgSrc: "assets/services.svg",
    isOnlyLeafView: true,
    allowedSources: [FormType.RoleForm],
    size: { height: 24, width: 24 },
  },
  volumes: {
    id: "volume",
    name: "volume",
    label: "Volume",
    type: "resource",
    contentType: FormType.VolumesForm,
    imgSrc: "assets/volume.svg",
    isOnlyLeafView: true,
    allowedSources: [FormType.RoleForm],
    size: { height: 24, width: 24 },
  },
  vNodeHooks: {
    id: "vNodeHooks",
    name: "vNodeHooks",
    label: "V-Node Hooks",
    type: "lifecycle",
    contentType: FormType.VNodeHooksForm,
    imgSrc: "assets/vnodehook.svg",
    isOnlyLeafView: true,
    allowedSources: [FormType.RoleForm],
    size: { height: 24, width: 24 },
  },
  sidecars: {
    id: "sideCars",
    name: "sideCars",
    label: "Side Cars",
    type: "lifecycle",
    contentType: FormType.SidecarsForm,
    imgSrc: "assets/sidecar.svg",
    isOnlyLeafView: true,
    allowedSources: [FormType.RoleForm],
    size: { height: 24, width: 24 },
  },
  initContainer: {
    id: "initContainer",
    name: "initContainer",
    label: "Init Container",
    type: "lifecycle",
    contentType: FormType.InitContainerForm,
    imgSrc: "assets/init-container.svg",
    isOnlyLeafView: true,
    allowedSources: [FormType.RoleForm],
    size: { height: 24, width: 24 },
  },
  probing: {
    id: "probing",
    name: "probing",
    label: "Probing",
    type: "lifecycle",
    contentType: FormType.ProbingForm,
    imgSrc: "assets/probing.svg",
    isOnlyLeafView: true,
    allowedSources: [FormType.RoleForm],
    size: { height: 24, width: 24 },
  },
  redis: {
    id: "redis",
    name: "redis",
    label: "Redis",
    type: "pre_configured",
    contentType: FormType.RedisForm,
    imgSrc: "assets/redis.svg",
    isOnlyLeafView: true,
    allowedSources: [FormType.RoleForm],
    size: { height: 24, width: 24 },
  },
  nginx: {
    id: "nginx",
    name: "nginx",
    label: "Nginx",
    type: "pre_configured",
    contentType: FormType.NginxForm,
    imgSrc: "assets/nginx.svg",
    isOnlyLeafView: true,
    allowedSources: [FormType.RoleForm],
    size: { height: 24, width: 24 },
  },
  mysql: {
    id: "mysql",
    name: "mysql",
    label: "MySql",
    type: "pre_configured",
    contentType: FormType.MysqlForm,
    imgSrc: "assets/mysql.svg",
    isOnlyLeafView: true,
    allowedSources: [FormType.RoleForm],
    size: { height: 24, width: 24 },
  },
  minio: {
    id: "miniio",
    name: "miniio",
    label: "MiniIO",
    type: "pre_configured",
    contentType: FormType.MinioForm,
    imgSrc: "assets/minio.svg",
    isOnlyLeafView: true,
    allowedSources: [FormType.RoleForm],
    size: { height: 24, width: 24 },
  },
};
