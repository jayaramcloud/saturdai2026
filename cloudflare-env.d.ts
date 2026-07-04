/// <reference path="./worker-configuration.d.ts" />

declare global {
  interface CloudflareEnv extends Cloudflare.Env {}
}

export {};
