/**
 * Optimizes an avatar image URL by requesting a specific size dimension.
 * Specifically handles GitHub avatars by appending or modifying the 's' query parameter.
 *
 * @param url The original avatar image URL
 * @param size The desired size in pixels (width/height)
 * @returns The optimized URL string, or the original if it cannot be optimized
 */
export function getOptimizedAvatarUrl(url: string | null | undefined, size = 64): string {
  if (!url) return '';

  // If it's a GitHub avatar, request a resized version from their CDN
  if (url.includes('githubusercontent.com')) {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('s', size.toString());
      return urlObj.toString();
    } catch (e) {
      // Fallback if URL constructor fails (e.g. relative or malformed url)
      if (url.includes('?')) {
        const cleanUrl = url.replace(/([?&])s=\d+(&?)/, '$1').replace(/[?&]$/, '');
        return `${cleanUrl}${cleanUrl.includes('?') ? '&' : '?'}s=${size}`;
      }
      return `${url}?s=${size}`;
    }
  }

  return url;
}
