import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // 1. Mencegah error library "pino" (dipakai WalletConnect) saat build
  serverExternalPackages: ["pino", "pino-pretty", "thread-stream"],

  // 2. Konfigurasi Webpack untuk menangani dependensi Web3 yang sering error
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      "bufferutil": "commonjs bufferutil",
      "pino-pretty": "commonjs pino-pretty",
      "lokijs": "commonjs lokijs",
      "encoding": "commonjs encoding",
    });
    // Mengabaikan file map source yang sering bikin warning
    config.ignoreWarnings = [/Failed to parse source map/]; 
    return config;
  },
  
  // 3. (Opsional) Jika error TypeScript saat build menghalangi deploy, bisa di-skip sementara
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
};

export default nextConfig;