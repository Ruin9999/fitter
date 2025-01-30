import { imageFileRouter } from "@/app/api/uploadthing/core";
import { generateUploadButton, generateUploadDropzone } from "@uploadthing/react";

export const UploadButton = generateUploadButton<imageFileRouter>();
export const UploadDropzone = generateUploadDropzone<imageFileRouter>();