import type { Metadata } from "next"

import { LoginView } from "@/components"

export const metadata: Metadata = {
  title: "Sign in - Ory NextJS Integration Example",
  description: "NextJS + React + Vercel + Ory",
}

export default function LoginPage() {
  return <LoginView />
}
