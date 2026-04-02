import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  open: boolean;
  onClose: () => void;
  themeColor?: string;
  onLogin?: () => void;
  onRegister?: () => void;
  anchor?: 'right' | 'top';
  onHoverEnter?: () => void;
  onHoverLeave?: () => void;
};

export default function SideMenu({
  open,
  onClose,
  themeColor,
  onLogin,
  onRegister,
  anchor = 'right',
  onHoverEnter,
  onHoverLeave,
}: Props) {
  const [visible, setVisible] = useState(open);
  useEffect(() => setVisible(open), [open]);
  const navigate = useNavigate();

  // Updated glass styles to match header/footer
  const mobileGlass = 'bg-white/5 backdrop-blur-md backdrop-saturate-125 border-l border-white/10';
  const topGlass = 'bg-white/5 backdrop-blur-md backdrop-saturate-125 border-b border-white/10';

  const nav = [
    {
      title: 'Services',
      items: ['Web Development', 'Cloud Infrastructure', 'IT Consulting', 'Digital Transformation'],
      note: 'Covers the core offerings.',
    },
    {
      title: 'Solutions',
      items: ['Enterprise Software', 'AI & Automation', 'Cybersecurity Suite', 'Data Analytics'],
      note: "Highlights packaged or industry-specific solutions.",
    },
    {
      title: 'Technology',
      items: ['WebGPU / 3D Rendering', 'Blockchain / Web3', 'IoT & Edge Computing', 'Custom APIs'],
      note: 'Focuses on the tools, platforms, and innovation.',
    },
    {
      title: 'Resources',
      items: ['Case Studies', 'Documentation', 'Blog / Insights', 'Support & Community'],
      note: 'Provides value-added content and support.',
    },
  ];

  const handleItemClick = (category: string, item: string) => {
    onClose();
    const slug = item.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    navigate(`/${category.toLowerCase()}/${slug}`);
  };

  if (anchor === 'right') {
    return (
      <div
        onMouseEnter={() => onHoverEnter?.()}
        onMouseLeave={() => onHoverLeave?.()}
        className={`fixed top-0 right-0 h-full w-[320px] max-w-[92vw] z-[60] transform transition-transform duration-300 ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!visible}
      >
        <div className={`${mobileGlass} h-full flex flex-col shadow-2xl`}>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-white/20 flex items-center justify-center text-white font-bold">R</div>
              <div className="text-white font-semibold">Rhine</div>
            </div>

            {/* Login & Register buttons – clearly labeled */}
            <div className="flex items-center gap-2">
              <button
                onClick={onLogin}
                className="px-3 py-1.5 text-sm font-medium text-white/90 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Login"
              >
                Login
              </button>
              <button
                onClick={onRegister}
                className="px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full hover:opacity-90 transition-colors"
                aria-label="Register"
              >
                Register
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-white/10 text-white"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M6 6l12 12M6 18L18 6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <nav className="flex-1 overflow-auto px-6 py-8">
            <ul className="space-y-6">
              {nav.map((section) => (
                <li key={section.title}>
                  <div className="text-sm text-white/60 uppercase tracking-wider mb-2">{section.title}</div>
                  <div className="space-y-2">
                    {section.items.map((it) => (
                      <button
                        key={it}
                        onClick={() => handleItemClick(section.title, it)}
                        className="block w-full text-left text-xl font-semibold text-white/95 hover:text-white transition-colors"
                      >
                        {it}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-white/10 text-white/70 text-sm flex items-center justify-between">
            <div>© 2026 Rhine</div>
            <div className="flex gap-3">
              <a className="hover:text-white">X/Twitter</a>
              <a className="hover:text-white">LinkedIn</a>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className={`fixed inset-0 z-50 ${visible ? '' : 'hidden'} bg-black/40`}
          aria-hidden={!visible}
        />
      </div>
    );
  }

  // top anchored panel (desktop)
  return (
    <div
      onMouseEnter={() => onHoverEnter?.()}
      onMouseLeave={() => onHoverLeave?.()}
      className={`fixed left-0 right-0 top-0 z-[58] transform transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
      aria-hidden={!visible}
      style={{ WebkitBackdropFilter: 'none' }}
    >
      <div
        className={`${topGlass} mx-auto max-w-[1800px] w-full h-[340px] shadow-2xl`}
        role="dialog"
        aria-modal="true"
      >
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-sm bg-white/20 flex items-center justify-center text-white font-bold">R</div>
              <div className="text-white font-semibold">Rhine</div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="btn btn-ghost btn-sm text-white" aria-label="Close">
                Close
              </button>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-3 gap-6 p-6 text-white/90">
            {nav.map((section) => (
              <div key={section.title} className="space-y-3">
                <h3 className="text-sm uppercase tracking-widest text-white/60">{section.title}</h3>
                <div className="space-y-1">
                  {section.items.map((it) => (
                    <button
                      key={it}
                      onClick={() => handleItemClick(section.title, it)}
                      className="block hover:text-white"
                    >
                      {it}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-white/10 flex items-center justify-between text-white/70">
            <div className="text-sm">© 2026 Rhine Solution</div>
            <div className="flex gap-3">
              <button onClick={onLogin} className="btn btn-ghost btn-sm">
                Login
              </button>
              <button onClick={onRegister} className="btn btn-primary btn-sm">
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}