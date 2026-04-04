/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TURNSTILE_SITEKEY?: string;
  readonly VITE_TURNSTILE_SITE_KEY?: string;
  // add other VITE_ environment variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
