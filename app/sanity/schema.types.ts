export declare const internalGroqTypeReferenceTo: unique symbol;


export type SanityImageAssetReference = {
  _ref: string;
  _type: "reference";
  _weak?: boolean;
  [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
};

export type ArticleImage = {
  _type: "articleImage";
  asset?: SanityImageAssetReference;
  media?: unknown;
  hotspot?: SanityImageHotspot;
  crop?: SanityImageCrop;
  alt?: string;
  caption?: string;
};

export type Badge = {
  _type: "badge";
  label?: string;
  color?: "default" | "blue" | "green" | "orange";
};

export type FeatureList = {
  _type: "featureList";
  items?: Array<{
    title?: string;
    description?: string;
    badge?: string;
    color?: "default" | "blue" | "green" | "orange";
    _key: string;
  }>;
};

export type Benchmark = {
  _type: "benchmark";
  items?: Array<{
    label?: string;
    before?: string;
    after?: string;
    improvement?: string;
    _key: string;
  }>;
};

export type ComparisonTable = {
  _type: "comparisonTable";
  columns?: Array<string>;
  rows?: Array<{
    cells?: Array<string>;
    _key: string;
  }>;
};

export type Notice = {
  _type: "notice";
  type?: "tip" | "info" | "warning";
  title?: string;
  body?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "normal";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }>;
};

export type CodeBlock = {
  _type: "codeBlock";
  language?: string;
  code?: string;
};

export type RichText = Array<
  | {
      children?: Array<
        | {
            marks?: Array<string>;
            text?: string;
            _type: "span";
            _key: string;
          }
        | ({
            _key: string;
          } & Badge)
      >;
      style?: "normal" | "h2" | "h3" | "blockquote";
      listItem?: "bullet" | "number";
      markDefs?: Array<{
        href?: string;
        _type: "link";
        _key: string;
      }>;
      level?: number;
      _type: "block";
      _key: string;
    }
  | ({
      _key: string;
    } & CodeBlock)
  | ({
      _key: string;
    } & Notice)
  | ({
      _key: string;
    } & ComparisonTable)
  | ({
      _key: string;
    } & Benchmark)
  | ({
      _key: string;
    } & FeatureList)
  | ({
      _key: string;
    } & Badge)
  | ({
      _key: string;
    } & ArticleImage)
>;

export type SiteSettings = {
  _id: string;
  _type: "siteSettings";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  siteTitle?: string;
  description?: string;
  navigation?: Array<{
    label?: string;
    href?: string;
    _key: string;
  }>;
  projectsTitle?: string;
  projectsIntroduction?: string;
  blogTitle?: string;
  blogIntroduction?: string;
};

export type Project = {
  _id: string;
  _type: "project";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  href?: string;
  date?: string;
  description?: string;
  image?: {
    asset?: SanityImageAssetReference;
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    alt?: string;
    _type: "image";
  };
  repositoryImageUrl?: string;
  commits?: number;
  language?: string;
  order?: number;
  featured?: boolean;
};

export type SanityImageCrop = {
  _type: "sanity.imageCrop";
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export type SanityImageHotspot = {
  _type: "sanity.imageHotspot";
  x?: number;
  y?: number;
  height?: number;
  width?: number;
};

export type ProfileReference = {
  _ref: string;
  _type: "reference";
  _weak?: boolean;
  [internalGroqTypeReferenceTo]?: "profile";
};

export type Post = {
  _id: string;
  _type: "post";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  slug?: Slug;
  excerpt?: string;
  coverImage?: {
    asset?: SanityImageAssetReference;
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    alt?: string;
    _type: "image";
  };
  publishedAt?: string;
  category?: string;
  tags?: Array<string>;
  author?: ProfileReference;
  body?: RichText;
  seoTitle?: string;
  seoDescription?: string;
};

export type Profile = {
  _id: string;
  _type: "profile";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name?: string;
  greeting?: string;
  role?: string;
  avatar?: {
    asset?: SanityImageAssetReference;
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    alt?: string;
    _type: "image";
  };
  summary?: string;
  introduction?: string;
  biography?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "normal" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "blockquote";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }>;
  education?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "normal" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "blockquote";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }>;
  focus?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "normal" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "blockquote";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }>;
  skills?: Array<string>;
  github?: string;
  linkedin?: string;
  instagram?: string;
};

export type Slug = {
  _type: "slug";
  current?: string;
  source?: string;
};

export type SanityImagePaletteSwatch = {
  _type: "sanity.imagePaletteSwatch";
  background?: string;
  foreground?: string;
  population?: number;
  title?: string;
};

export type SanityImagePalette = {
  _type: "sanity.imagePalette";
  darkMuted?: SanityImagePaletteSwatch;
  lightVibrant?: SanityImagePaletteSwatch;
  darkVibrant?: SanityImagePaletteSwatch;
  vibrant?: SanityImagePaletteSwatch;
  dominant?: SanityImagePaletteSwatch;
  lightMuted?: SanityImagePaletteSwatch;
  muted?: SanityImagePaletteSwatch;
};

export type SanityImageDimensions = {
  _type: "sanity.imageDimensions";
  height?: number;
  width?: number;
  aspectRatio?: number;
};

export type SanityImageMetadata = {
  _type: "sanity.imageMetadata";
  location?: Geopoint;
  dimensions?: SanityImageDimensions;
  palette?: SanityImagePalette;
  lqip?: string;
  blurHash?: string;
  thumbHash?: string;
  hasAlpha?: boolean;
  isOpaque?: boolean;
};

export type SanityFileAsset = {
  _id: string;
  _type: "sanity.fileAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  originalFilename?: string;
  label?: string;
  title?: string;
  description?: string;
  altText?: string;
  sha1hash?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  uploadId?: string;
  path?: string;
  url?: string;
  source?: SanityAssetSourceData;
};

export type SanityAssetSourceData = {
  _type: "sanity.assetSourceData";
  name?: string;
  id?: string;
  url?: string;
};

export type SanityImageAsset = {
  _id: string;
  _type: "sanity.imageAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  originalFilename?: string;
  label?: string;
  title?: string;
  description?: string;
  altText?: string;
  sha1hash?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  uploadId?: string;
  path?: string;
  url?: string;
  metadata?: SanityImageMetadata;
  source?: SanityAssetSourceData;
};

export type Geopoint = {
  _type: "geopoint";
  lat?: number;
  lng?: number;
  alt?: number;
};

export type AllSanitySchemaTypes =
  | SanityImageAssetReference
  | ArticleImage
  | Badge
  | FeatureList
  | Benchmark
  | ComparisonTable
  | Notice
  | CodeBlock
  | RichText
  | SiteSettings
  | Project
  | SanityImageCrop
  | SanityImageHotspot
  | ProfileReference
  | Post
  | Profile
  | Slug
  | SanityImagePaletteSwatch
  | SanityImagePalette
  | SanityImageDimensions
  | SanityImageMetadata
  | SanityFileAsset
  | SanityAssetSourceData
  | SanityImageAsset
  | Geopoint;
