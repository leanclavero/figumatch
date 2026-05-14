'use client'

import { QRCodeSVG } from 'qrcode.react'
import { X, Share2, Check } from 'lucide-react'
import { useState } from 'react'

interface Props {
  userId: string
  isOpen: boolean
  onClose: () => void
}

export default function QRModal({ userId, isOpen, onClose }: Props) {
  const [copied, setCopied] = useState(false)
  const tradeUrl = `${window.location.origin}/trades/${userId}`

  const handleAction = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Figumatch - Mi Perfil de Canje',
          text: 'Mira mis figuritas repetidas y las que me faltan para cambiar!',
          url: tradeUrl
        })
      } catch (err) {
        console.log('Share cancelled or failed')
      }
    } else {
      navigator.clipboard.writeText(tradeUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center space-y-2 mb-8">
          <h3 className="text-xl font-black text-gray-800 tracking-tight">Tu Código Match</h3>
          <p className="text-sm text-gray-500 px-4 leading-relaxed">
            Muestra este código para que otros vean qué figuritas tienes para canjear.
          </p>
        </div>

        <div className="bg-blue-50 p-8 rounded-[32px] flex flex-col items-center justify-center border-2 border-blue-100 shadow-inner">
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-blue-50">
            <QRCodeSVG 
              value={tradeUrl}
              size={180}
              level="H"
              includeMargin={false}
              className="rounded-lg"
            />
          </div>
        </div>

        <div className="mt-8">
          <button 
            onClick={handleAction}
            className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all duration-300 ${
              copied ? 'bg-green-600 text-white' : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {copied ? (
              <>
                <Check size={20} />
                ¡Enlace Copiado!
              </>
            ) : (
              <>
                <Share2 size={20} />
                Compartir Mi Perfil
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
