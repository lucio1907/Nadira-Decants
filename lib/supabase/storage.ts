import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Extracts the file path from a Supabase Storage public URL.
 * Example: https://xyz.supabase.co/storage/v1/object/public/productos/1712534400-image.webp
 * Returns: 1712534400-image.webp
 */
export function getPathFromPublicUrl(url: string, bucketName: string = "productos"): string | null {
  try {
    if (!url || typeof url !== "string") return null;
    
    // Only process URLs that seem to be from Supabase storage
    if (!url.includes("/storage/v1/object/public/")) return null;
    
    const parts = url.split(`${bucketName}/`);
    if (parts.length < 2) return null;
    
    // The path is everything after the bucket name
    return parts[1];
  } catch (error) {
    console.error("Error parsing Supabase URL:", error);
    return null;
  }
}

/**
 * Deletes multiple files from a Supabase Storage bucket by their public URLs.
 */
export async function deleteFilesFromStorage(
  supabase: SupabaseClient, 
  urls: string[], 
  bucketName: string = "productos"
) {
  if (!urls || urls.length === 0) return;

  const paths = urls
    .map(url => getPathFromPublicUrl(url, bucketName))
    .filter((path): path is string => path !== null);

  if (paths.length === 0) return;

  console.log(`Eliminando ${paths.length} archivos del bucket ${bucketName}:`, paths);
  
  const { error } = await supabase.storage
    .from(bucketName)
    .remove(paths);

  if (error) {
    console.error(`Error al eliminar archivos de storage (${bucketName}):`, error);
  } else {
    console.log(`Archivos eliminados exitosamente de ${bucketName}`);
  }
}
