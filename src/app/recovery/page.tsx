import type { Metadata } from "next"

import { RecoveryView } from "@/components"

export const metadata: Metadata = {
  title: "Recover your account - Ory NextJS Integration Example",
  description: "NextJS + React + Vercel + Ory",
}

export default function RecoveryPage() {
  return <RecoveryView />
}
