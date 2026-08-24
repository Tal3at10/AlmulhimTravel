const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const withWeservParams = (wsrvUrl, width, quality) => {
  try {
    const u = new URL(wsrvUrl);
    if (!u.hostname.includes('wsrv.nl')) return wsrvUrl;

    const w = clamp(parseInt(width, 10) || 0, 16, 4096);
    const q = clamp(parseInt(quality, 10) || 0, 35, 90);

    // Only add/override params that affect payload size significantly
    if (!u.searchParams.get('w') || parseInt(u.searchParams.get('w'), 10) > w) {
      u.searchParams.set('w', String(w));
    }
    if (!u.searchParams.get('q') || parseInt(u.searchParams.get('q'), 10) > q) {
      u.searchParams.set('q', String(q));
    }
    if (!u.searchParams.get('output')) {
      u.searchParams.set('output', 'webp');
    }

    return u.toString();
  } catch {
    return wsrvUrl;
  }
};

export const getOptimizedImageUrl = (url, width = 800, quality = 80) => {
  if (!url) return '';

  // wsrv.nl: ensure it has the resizing/compression params (some DB images already store wsrv links without them)
  if (url.includes('wsrv.nl')) {
    return withWeservParams(url, width, quality);
  }

  // If it's a blob/data URI or local path, return as-is (can't resize without generating multiple local files)
  if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('/')) {
    return url;
  }

  // Cloudinary: Auto-format (WebP/AVIF), auto-quality, scaled width
  if (url.includes('res.cloudinary.com')) {
    // Check if the URL already has transformations
    if (url.includes('/upload/v')) {
      return url.replace('/upload/v', `/upload/f_auto,q_auto,w_${width}/v`);
    } else if (url.includes('/image/upload/')) {
      // Sometimes it doesn't have a version 'v' right after upload
      return url.replace('/image/upload/', `/image/upload/f_auto,q_auto,w_${width}/`);
    }
  }

  // Proxy external high-res images (Unsplash, Pexels, etc.) through wsrv.nl to compress to WebP
  if (url.startsWith('http')) {
    return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${clamp(parseInt(width, 10) || 0, 16, 4096)}&output=webp&q=${clamp(parseInt(quality, 10) || 0, 35, 90)}`;
  }

  return url;
};

export const getOptimizedImageSrcSet = (url, widths = [400, 800, 1200], quality = 75) => {
  if (!url) return '';
  const unique = Array.from(new Set(widths.filter(Boolean))).sort((a, b) => a - b);
  return unique.map((w) => `${getOptimizedImageUrl(url, w, quality)} ${w}w`).join(', ');
};
