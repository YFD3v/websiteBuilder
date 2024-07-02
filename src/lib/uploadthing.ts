import {
  generateUploadButton,
  generateUploadDropzone,
  generateUploader,
  generateComponents,
} from "@uploadthing/react";
import { generateReactHelpers } from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton();
export const UploadDropzone = generateUploadDropzone();
export const Uploader = generateUploader();
export const { useUploadThing, uploadFiles } = generateReactHelpers();
