/// <reference types="vite/client" />

interface Window {
  gtag: (event: string, command: string, params: Record<string, any>) => void;
}