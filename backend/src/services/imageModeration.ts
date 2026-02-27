export async function isImageSafe(_filePath: string): Promise<{ safe: boolean; reason?: string }> {
  return { safe: true };
}
