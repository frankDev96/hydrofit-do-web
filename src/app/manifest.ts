import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Hydrofit.do Web',
        short_name: 'HydroFit',
        description: 'Log water and follow your HydroFit.do hydration plan.',
        start_url: '/',
        display: 'standalone',
        background_color: '#F7F9FC',
        theme_color: '#0077ff',
    };
}
