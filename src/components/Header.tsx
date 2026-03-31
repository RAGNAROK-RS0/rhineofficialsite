import { R } from './GFX';

export default function Header() {
  return (
    <header className="navbar bg-base-100/30 backdrop-blur-md fixed top-0 z-50 px-8 border-b border-white/10">
      <div className="flex-1">
        <a className="btn btn-ghost hover:bg-transparent px-0 gap-3">
          <div className="w-10">
            {R()}
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Rhine Solution
          </span>
        </a>
      </div>
      <div className="flex-none hidden lg:block">
        <ul className="menu menu-horizontal px-1 gap-2 text-white/80 font-medium">
          <li><a className="hover:text-white transition-colors">Services</a></li>
          <li><a className="hover:text-white transition-colors">Technology</a></li>
          <li><a className="hover:text-white transition-colors">Projects</a></li>
          <li>
            <a className="btn btn-primary btn-sm rounded-full px-6 ml-4">
              Get in Touch
            </a>
          </li>
        </ul>
      </div>
      {/* Mobile Dropdown */}
      <div className="flex-none lg:hidden">
        <div className="dropdown dropdown-end">
          <button className="btn btn-ghost btn-circle text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
          <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52">
            <li><a>Services</a></li>
            <li><a>Technology</a></li>
            <li><a>Projects</a></li>
            <li><a>Contact</a></li>
          </ul>
        </div>
      </div>
    </header>
  );
}
