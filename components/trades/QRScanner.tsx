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

    let scanner: Html5QrcodeScanner | null = null
    
    // Small timeout to ensure DOM element is ready
    const timer = setTimeout(() => {
      try {
        scanner = new Html5QrcodeScanner(
          'qr-reader',
          { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true,
            supportedScanTypes: [0], // 0 = QR_CODE
            videoConstraints: {
              facingMode: "environment"
            }
          },
          /* verbose= */ false
        )

        scanner.render(
          (decodedText) => {
            if (scanner) {
              scanner.clear().catch(console.error)
            }
            onClose()
            // Ensure we handle local vs remote URLs
            if (decodedText.startsWith('http')) {
              router.push(decodedText)
            } else {
              router.push(`/trades/${decodedText}`)
            }
          },
          (err) => {
            // Continuous scanning errors, ignore
          }
        )
      } catch (e: any) {
        console.error('Scanner init error:', e)
        setError('No se pudo acceder a la cámara. Asegúrate de dar permisos y usar HTTPS.')
      }
    }, 500)

    return () => {
      clearTimeout(timer)
      if (scanner) {
        scanner.clear().catch(console.error)
      }
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
          {error ? (
            <p className="text-xs text-red-500 font-bold">{error}</p>
          ) : (
            <p className="text-sm text-gray-500">Apunta a la pantalla del otro usuario.</p>
          )}
        </div>

        <div className="w-full aspect-square bg-gray-100 rounded-3xl overflow-hidden relative border-4 border-blue-600 shadow-2xl">
          <div id="qr-reader" className="w-full h-full" />
          {!error && (
            <div className="absolute inset-0 border-[40px] border-black/10 pointer-events-none flex items-center justify-center">
               <div className="w-full h-full border-2 border-blue-400/30 animate-pulse" />
            </div>
          )}
        </div>

        {!error && (
          <div className="mt-8 flex items-center gap-3 text-blue-600 font-bold bg-blue-50 px-6 py-3 rounded-2xl">
            <Camera size={20} />
            <span className="text-sm tracking-tight">Buscando código...</span>
          </div>
        )}
      </div>
    </div>
  )
}
