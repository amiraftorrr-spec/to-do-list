import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Cadence — Mindful Local Todo',
    short_name: 'Cadence',
    description: 'Intentional, human-crafted personal todo & weekly Saturday review, 100% offline.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fbfaf8',
    theme_color: '#1c1917',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
