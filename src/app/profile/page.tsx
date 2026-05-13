'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, User, Settings, ShieldCheck } from 'lucide-react'

export default function ProfilePage() {
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto py-6">
      <div className="flex items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="bg-blue-100 p-4 rounded-2xl text-blue-600">
          <User size={32} />
        </div>
        <div>
          <h1 className="text-xl font-bold">Mi Perfil</h1>
          <p className="text-sm text-gray-500">Configuración de cuenta</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3 text-gray-700 font-medium">
            <Settings size={20} className="text-gray-400" />
            <span>Ajustes</span>
          </div>
        </button>

        <button className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3 text-gray-700 font-medium">
            <ShieldCheck size={20} className="text-gray-400" />
            <span>Privacidad y Seguridad</span>
          </div>
        </button>

        <button 
          onClick={handleLogout}
          className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100 shadow-sm hover:bg-red-100 transition-colors mt-4"
        >
          <div className="flex items-center gap-3 text-red-600 font-bold">
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </div>
        </button>
      </div>

      <div className="mt-auto text-center p-8 opacity-40">
        <p className="text-xs font-bold uppercase tracking-widest">Mundial 2026 App</p>
        <p className="text-[10px]">v1.0.0 - Alpha</p>
      </div>
    </div>
  )
}
