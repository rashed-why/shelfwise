import { existsSync, mkdirSync } from 'fs';
import { writeFileSync } from 'fs';
import { extname, join } from 'path';

export const USER_UPLOAD_DIR = join(process.cwd(), 'public', 'users');

export function ensureUserUploadDirectory() {
  if (!existsSync(USER_UPLOAD_DIR)) {
    mkdirSync(USER_UPLOAD_DIR, { recursive: true });
  }
}

export function getProfileImagePath(filename: string) {
  return `/users/${filename}`;
}

export function saveProfileImageFile(file: Express.Multer.File): string {
  ensureUserUploadDirectory();

  const extension = extname(file.originalname);
  const filename = `${Date.now()}${extension}`;
  const profileImage = getProfileImagePath(filename);
  const filePath = join(USER_UPLOAD_DIR, filename);

  writeFileSync(filePath, file.buffer);

  return profileImage;
}
