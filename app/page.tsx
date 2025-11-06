'use client'

import { useState } from 'react'
import BioBuilder from './components/BioBuilder'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <BioBuilder />
    </main>
  )
}
