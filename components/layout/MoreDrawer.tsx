'use client'

import { X, ShieldCheck, FileText, LogOut, Settings, HelpCircle, User, MessageCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface MoreDrawerProps {
  isOpen: boolean
  onClose: () => void
  user: any
}

export default function MoreDrawer({ isOpen, onClose, user }: MoreDrawerProps) {
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-[280px] bg-white z-[101] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-black text-gray-800">Menú</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Opciones de Figumatch</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* User Quick Info */}
        {user && (
          <div className="p-6 bg-blue-600 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-xl font-bold backdrop-blur-md">
                {user.user_metadata?.full_name?.[0] || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold truncate">{user.user_metadata?.full_name || 'Coleccionista'}</p>
                <p className="text-[10px] opacity-70 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <Link 
            href="/settings" 
            onClick={onClose}
            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 text-gray-700 font-bold transition-all active:scale-95"
          >
            <Settings size={20} className="text-gray-400" />
            Configuración
          </Link>
          
          <Link 
            href="/privacidad" 
            onClick={onClose}
            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 text-gray-700 font-bold transition-all active:scale-95"
          >
            <ShieldCheck size={20} className="text-blue-500" />
            Privacidad
          </Link>

          <Link 
            href="/condiciones" 
            onClick={onClose}
            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 text-gray-700 font-bold transition-all active:scale-95"
          >
            <FileText size={20} className="text-orange-500" />
            Términos y Condiciones
          </Link>

          <Link 
            href="/ayuda" 
            onClick={onClose}
            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 text-gray-700 font-bold transition-all active:scale-95"
          >
            <HelpCircle size={20} className="text-purple-500" />
            Centro de Ayuda
          </Link>
        </div>

        {/* Footer / Logout */}
        <div className="p-6 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl font-black transition-all active:scale-95 hover:bg-red-100"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
          <p className="text-center text-[10px] text-gray-300 mt-4 font-bold uppercase tracking-widest">
            Figumatch v1.0.0
          </p>
        </div>
      </div>
    </>
  )
}
