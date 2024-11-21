import type { Metadata } from 'next'

import { PageError } from '@/pkg'

export const metadata: Metadata = {
  title: 'Error - Ory NextJS Integration Example',
  description: 'An error occurred during the request',
}

export default function Error() {
  return <PageError />
}