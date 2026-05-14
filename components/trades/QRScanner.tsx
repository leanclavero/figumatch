'use client'

import { useEffect, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { X, Camera } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function QRScanner({ isOpen, onClose }: Props) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      /* verbose= */ false
    )

    scanner.render(
      (decodedText) => {
        // Success
        scanner.clear()
        onClose()
        router.push(decodedText)
      },
      (err) => {
        // Error is continuous while scanning, so we don't show it unless it's critical
      }
    )

    return () => {
      scanner.clear().catch(console.error)
    }
  }, [isOpen, onClose, router])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm" />
      
      <div className="relative bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl flex flex-col items-center">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full text-gray-500 z-10"
        >
          <X size={20} />
        </button>

        <div className="text-center space-y-2 mb-8">
          <h3 className="text-xl font-black text-gray-800">Escanear Match</h3>
          <p className="text-sm text-gray-500">Apunta a la pantalla del otro usuario para ver sus figuritas.</p>
        </div>

        <div className="w-full aspect-square bg-gray-100 rounded-3xl overflow-hidden relative border-4 border-blue-600 shadow-2xl">
          <div id="qr-reader" className="w-full h-full" />
          <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none flex items-center justify-center">
             <div className="w-full h-full border-2 border-blue-400 opacity-50 animate-pulse" />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3 text-blue-600 font-bold bg-blue-50 px-6 py-3 rounded-2xl">
          <Camera size={20} />
          <span className="text-sm tracking-tight">Buscando código...</span>
        </div>
      </div>
    </div>
  )
}
