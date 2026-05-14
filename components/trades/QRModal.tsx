'use client'

import { QRCodeSVG } from 'qrcode.react'
import { X, Share2, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface Props {
  userId: string
  isOpen: boolean
  onClose: () => void
}

export default function QRModal({ userId, isOpen, onClose }: Props) {
  const [copied, setCopied] = useState(false)
  const tradeUrl = `${window.location.origin}/trades/${userId}`

  const handleCopy = () => {
    navigator.clipboard.writeText(tradeUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
          className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full text-gray-500"
        >
          <X size={20} />
        </button>

        <div className="text-center space-y-2 mb-8">
          <h3 className="text-xl font-black text-gray-800">Tu Código Match</h3>
          <p className="text-sm text-gray-500">Muestra este código para que otros vean qué figuritas pueden intercambiar contigo.</p>
        </div>

        <div className="bg-blue-50 p-6 rounded-[32px] flex flex-col items-center justify-center border-2 border-blue-100 shadow-inner">
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <QRCodeSVG 
              value={tradeUrl}
              size={200}
              level="H"
              includeMargin={false}
              className="rounded-lg"
            />
          </div>
          <div className="mt-6 w-full bg-white/50 border border-blue-100 rounded-2xl px-4 py-3 flex items-center justify-between">
            <span className="text-[10px] font-bold text-blue-600 truncate mr-4">
              {tradeUrl}
            </span>
            <button 
              onClick={handleCopy}
              className="p-2 bg-blue-600 text-white rounded-lg shadow-md active:scale-95 transition-all"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        <div className="mt-8">
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Figumatch - Mi Perfil de Canje',
                  text: 'Mira mis figuritas repetidas y las que me faltan para cambiar!',
                  url: tradeUrl
                })
              }
            }}
            className="w-full bg-gray-800 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <Share2 size={20} />
            Compartir Enlace
          </button>
        </div>
      </div>
    </div>
  )
}
