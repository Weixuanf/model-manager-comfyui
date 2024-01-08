export type Route = "root" | "customNodes" | "models";

export interface PanelPosition {
  top: number;
  left: number;
}

export type CivitiModel = {
  name: string;
  modelVersions: CivitiModelVersion;
};
export type CivitiModelGetResp = {
  items: Array<CivitiModel>;
};

export type CivitiModelVersion = {
  name: string;
  version: string;
  modelPath: string;
  modelType: string;
  modelVersion: string;
};

export namespace CivitiTypes {
  export type Model = {
    id: number;
    name: string;
    description: string;
    type: string;
    poi: boolean;
    nsfw: boolean;
    allowNoCredit: boolean;
    allowCommercialUse: string;
    allowDerivatives: boolean;
    allowDifferentLicense: boolean;
    stats: ModelStats;
    creator: ModelCreator;
    tags: string[];
    modelVersions: ModelVersion[];
  };

  type ModelVersion = {
    id: number;
    modelId: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    status: string;
    publishedAt: string;
    trainedWords: string[];
    trainingStatus: string | null;
    trainingDetails: string | null;
    baseModel: string;
    baseModelType: string;
    earlyAccessTimeFrame: number;
    description: string;
    vaeId: string | null;
    stats: ModelVersionStats;
    files: ModelFileVersion[];
    images: ModelVersionImage[];
    downloadUrl: string;
  };

  type ModelStats = {
    downloadCount: number;
    favoriteCount: number;
    commentCount: number;
    ratingCount: number;
    rating: number;
    tippedAmountCount: number;
  };

  type ModelCreator = {
    username: string;
    image: string;
  };

  type ModelVersionStats = {
    downloadCount: number;
    ratingCount: number;
    rating: number;
  };

  type ModelFileVersion = {
    id: number;
    sizeKB: number;
    name: string;
    type: string;
    metadata: FileMetadata;
    pickleScanResult: string;
    pickleScanMessage: string | null;
    virusScanResult: string;
    virusScanMessage: string | null;
    scannedAt: string;
    hashes: FileHashes;
    downloadUrl: string;
    primary: boolean;
  };

  type FileMetadata = {
    fp: string;
    size: string;
    format: string;
  };

  type FileHashes = {
    AutoV1: string;
    AutoV2: string;
    SHA256: string;
    CRC32: string;
    BLAKE3: string;
    AutoV3: string;
  };

  type ModelVersionImage = {
    id: number;
    url: string;
    nsfw: string;
    width: number;
    height: number;
    hash: string;
    type: string;
    metadata: ImageMetadata;
    meta: ImageMeta;
  };

  type ImageMetadata = {
    hash: string;
    size: number;
    width: number;
    height: number;
  };

  type ImageMeta = {
    seed: number;
    steps: number;
    prompt: string;
    sampler: string;
    cfgScale: number;
    negativePrompt: string;
  };
}
