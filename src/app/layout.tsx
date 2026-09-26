import '@/dev-flag';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { AppShell } from '@/components/app-shell';
import { HydroProvider } from '@/components/hydro-context';
import { ThemeRoot } from '@/components/theme-root';
import './globals.css';

const inter = localFont({
    src: [
        { path: '../../public/fonts/Inter-Regular.ttf', weight: '400' },
        { path: '../../public/fonts/Inter-SemiBold.ttf', weight: '600' },
        { path: '../../public/fonts/Inter-Bold.ttf', weight: '700' },
    ],
    variable: '--font-inter',
    display: 'swap',
});

const sora = localFont({
    src: '../../public/fonts/Sora-SemiBold.ttf',
    variable: '--font-sora',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Hydrofit.do Web',
    description:
        'HydroFit.do on the web. Log water, follow your daily plan, and review stats. Your data stays in this browser.',
    applicationName: 'Hydrofit.do Web',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
    return (
        <html lang="en" className={`${inter.variable} ${sora.variable} h-full`}>
            <body className="min-h-full bg-[var(--bg)] text-[var(--text)] antialiased">
                <ThemeRoot>
                    <HydroProvider>
                        <AppShell>{children}</AppShell>
                    </HydroProvider>
                </ThemeRoot>
            </body>
        </html>
    );
}
