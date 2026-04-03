import React from 'react';
import { githubIcon, twitterIcon } from './GFX';

type Props = {
  themeColor?: string;
};

export default function Footer({ themeColor = '#4f46e5' }: Props) {
  return (
    <footer className="relative z-10 px-6 py-8 bg-black bg-opacity-60 border-t border-white/6">
      <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="status-dot w-2 h-2 rounded-full" style={{ backgroundColor: themeColor, boxShadow: `0 0 10px ${themeColor}` }}></div>
          <div className="text-sm text-white/70">© 2026 Rhine Solution</div>
        </div>

        <div className="flex items-center gap-6">
          <a href="/privacy" className="text-white/60 hover:text-white text-sm">Privacy Policy</a>
          <a href="/terms" className="text-white/60 hover:text-white text-sm">Terms of Service</a>
          <a href="#" className="text-white/60 hover:text-white">{githubIcon()}</a>
          <a href="#" className="text-white/60 hover:text-white">{twitterIcon()}</a>
        </div>
      </div>
    </footer>
  );
}
