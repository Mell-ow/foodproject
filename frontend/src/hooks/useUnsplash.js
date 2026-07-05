import { useState, useEffect } from 'react';

// Category-to-Unsplash query map for better image results
const QUERY_MAP = {
  'Burger':        'gourmet burger',
  'Pizza':         'italian pizza',
  'Falooda':       'falooda indian dessert drink',
  'Ice Cream':     'ice cream scoop',
  'Cake & Brownie':'chocolate brownie cake dessert',
  'Sandwich':      'sandwich bread',
  'Pasta & Momos': 'pasta momos dumplings',
  'BBQ':           'bbq grilled chicken',
  'Maggi & Rolls': 'maggi noodles rolls',
};

/**
 * Fetches an Unsplash image for a given food item.
 * Falls back gracefully when API key is absent or request fails.
 * Uses process.env.REACT_APP_UNSPLASH_KEY (Create React App).
 */
const useUnsplash = (itemName, category) => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    if (!itemName) {
      setLoading(false);
      return;
    }

    const KEY = process.env.REACT_APP_UNSPLASH_KEY;
    if (!KEY || KEY === 'your_unsplash_access_key_here') {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const fetchImage = async () => {
      setLoading(true);
      setError(null);
      try {
        // Prefer category-level query for richer results
        const query = QUERY_MAP[category] || `${itemName} food`;
        const url   = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape&client_id=${KEY}`;
        const res   = await fetch(url);

        if (!res.ok) throw new Error(`Unsplash ${res.status}`);
        const data = await res.json();

        if (!cancelled && data.results?.length > 0) {
          // Pick a random result from top 3 so cards look varied
          const idx = Math.floor(Math.random() * Math.min(3, data.results.length));
          setImageUrl(data.results[idx].urls.small);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchImage();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemName]);

  return { imageUrl, loading, error };
};

export default useUnsplash;
