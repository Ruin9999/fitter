import axios from 'axios';
import fs from 'fs/promises';
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  return `${str.slice(0, maxLength - 3)} ...`;
}

export async function imageToBase64(imagePathOrUrl: string): Promise<string> {
  let imageBuffer: Buffer;

  if (imagePathOrUrl.startsWith('http://') || imagePathOrUrl.startsWith('https://')) {
    const response = await axios.get(imagePathOrUrl, { responseType: 'arraybuffer' });
    imageBuffer = Buffer.from(response.data, 'binary');
  } else {
    imageBuffer = await fs.readFile(imagePathOrUrl);
  }

  return imageBuffer.toString('base64');
}