/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

interface Window {
  gtag: (event: string, command: string, params: Record<string, any>) => void;
}