import { defineConfig } from "windicss/helpers"

export default defineConfig({
  attributify: true,
  extract: {
    include: ["src/**/*.{vue,jsx,tsx}"]
  }
})
