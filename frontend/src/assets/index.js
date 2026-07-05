// Dynamically load all images in this folder and provide helpers
const images = {};

// Require all image files in this directory
const req = require.context('./', false, /\.(png|jpe?g|webp|gif)$/i);
req.keys().forEach((key) => {
  const module = req(key);
  const filename = key.replace('./', '');
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  const normalized = nameWithoutExt.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  images[normalized] = module.default || module;
});

function normalizeName(name) {
  return (name || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

// Try to find the best matching image for a given item name or category
export function findImageForItem(name, category) {
  const norm = normalizeName(name);
  if (images[norm]) return images[norm];

  // token match: find image that contains any significant token from the name
  const tokens = norm.split(' ').filter((t) => t.length > 2);
  for (const key of Object.keys(images)) {
    for (const t of tokens) {
      if (key.includes(t)) return images[key];
    }
  }

  // category match fallback
  const catNorm = normalizeName(category);
  for (const key of Object.keys(images)) {
    if (key.includes(catNorm.split(' ')[0])) return images[key];
  }

  return null;
}

export default images;

// Return image by filename (e.g. 'kids burger.jpg')
export function getByFilename(filename) {
  if (!filename) return null;
  const norm = filename.toLowerCase().replace(/\.[^/.]+$/, '').replace(/[^a-z0-9]+/g, ' ').trim();
  return images[norm] || null;
}
