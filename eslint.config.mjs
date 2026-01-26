import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import { dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const compat = new FlatCompat({ baseDirectory: __dirname })

export default [
  js.configs.recommended,
  ...compat.extends("next/core-web-vitals", "next/typescript"),
]
