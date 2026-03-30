/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_N8N_BASE_URL: string;
  readonly VITE_N8N_PROCESS_TRANSCRIPT: string;
  readonly VITE_N8N_GET_INSIGHTS: string;
  readonly VITE_N8N_GET_ACTION_ITEMS: string;
  readonly VITE_N8N_GET_FEATURE_REQUESTS: string;
  readonly VITE_N8N_SUBSCRIBE_EMAIL: string;
  readonly VITE_APP_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
