import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'zh', name: '中文', flag: '🇨🇳', dir: 'ltr' },
];

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'default' | 'glassy' | 'footer';
}

export default function LanguageSwitcher({ className = '', variant = 'default' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr';
    setIsOpen(false);
  };

  const baseClasses = variant === 'glassy' 
    ? 'bg-black/60 backdrop-blur-xl border border-white/20 hover:bg-black/80' 
    : variant === 'footer'
    ? 'bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-white/10'
    : 'bg-white/10 border border-white/10 hover:bg-white/20';

  const buttonClasses = `flex items-center gap-2 px-3 py-2 rounded-lg text-white/80 hover:text-white transition-all duration-200 text-sm ${baseClasses} ${className}`;

  const dropdownClasses = variant === 'glassy' || variant === 'footer'
    ? 'bg-black/80 backdrop-blur-xl border border-white/20'
    : 'bg-black/90 backdrop-blur-xl border border-white/20';

  // Footer opens UP (above the button), others open DOWN
  const dropdownPosition = variant === 'footer' 
    ? 'bottom-auto top-0 -translate-y-full mb-1' 
    : 'top-full mt-2';

  // Chevron - footer points up when closed (menu opens up), header points down (menu opens down)
  const chevronRotation = variant === 'footer'
    ? (isOpen ? '' : '-rotate-180')  // Closed: point up, Open: point down
    : (isOpen ? 'rotate-180' : ''); // Closed: point down, Open: point up

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClasses}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLang.name}</span>
        <span className="sm:hidden">{currentLang.flag}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${chevronRotation}`} />
      </button>

      {isOpen && (
        <div className={`absolute ${dropdownPosition} right-0 min-w-[180px] ${dropdownClasses} rounded-xl overflow-hidden shadow-xl z-50`}>
          <ul role="listbox" aria-label="Language options">
            {languages.map((lang) => (
              <li key={lang.code}>
                <button
                  onClick={() => handleLanguageChange(lang.code)}
                  role="option"
                  aria-selected={lang.code === i18n.language}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-colors ${
                    lang.code === i18n.language
                      ? 'text-[#0082D8] bg-[#0082D8]/10'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm font-medium">{lang.name}</span>
                  {lang.code === 'ar' && <span className="text-xs text-white/40 ml-auto">RTL</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}