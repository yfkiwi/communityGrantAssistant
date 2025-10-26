/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EVENTLABS_API_KEY: string;
  readonly VITE_EVENTLABS_ENDPOINT: string;
  readonly VITE_OPENAI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
