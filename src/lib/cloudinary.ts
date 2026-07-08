// DEPRECATED - DO NOT USE. Cloudinary upload has been removed in favor of backend Kernel uploads.
export async function uploadToCloudinary(): Promise<string> {
  throw new Error("Cloudinary upload is deprecated. Use backend upload services instead.");
}
