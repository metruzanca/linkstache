import vercel from "solid-start-vercel"
import solid from "solid-start/vite";
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    
  },
  plugins: [
    solid({
      ssr: false,
      adapter: vercel({})
    })
  ],
});
