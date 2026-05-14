'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Repeat, User, QrCode, ScanLine, Smartphone, Menu, Users } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import QRModal from '../trades/QRModal'
import QRScanner from '../trades/QRScanner'
import MoreDrawer from './MoreDrawer'

export default function BottomNav() {
  const pathname = usePathname()
  const [showQRMenu, setShowQRMenu] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  if (pathname === '/login' || pathname === '/signup') {
    return null
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser(user)
    })
  }, [supabase.auth])

  const navItems = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Amigos', href: '/friends', icon: Users },
    { name: 'Perfil', href: user ? `/trades/${user.id}` : '/profile', icon: User },
    { name: 'Más', href: '#', icon: Menu, onClick: (e: any) => { e.preventDefault(); setShowMoreMenu(true); } },
  ]

  return (
    <>
      {/* QR Menu Backdrop */}
      {showQRMenu && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55]" 
          onClick={() => setShowQRMenu(false)}
        />
      )}

      {/* QR Menu Options */}
      <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-3 transition-all duration-300 ${
        showQRMenu ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-10 pointer-events-none'
      }`}>
        <button 
          onClick={() => {
            setShowQRMenu(false)
            setShowQRScanner(true)
          }}
          className="bg-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100 active:scale-95 transition-all"
        >
          <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
            <ScanLine size={20} />
          </div>
          <span className="font-bold text-gray-800">Leer QR</span>
        </button>
        <button 
          onClick={() => {
            setShowQRMenu(false)
            setShowQRModal(true)
          }}
          className="bg-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100 active:scale-95 transition-all"
        >
          <div className="bg-purple-100 p-2 rounded-xl text-purple-600">
            <Smartphone size={20} />
          </div>
          <span className="font-bold text-gray-800">Mostrar QR</span>
        </button>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex justify-between items-center z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        {/* Left items */}
        <div className="flex justify-around flex-1">
          {navItems.slice(0, 2).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center gap-1 min-w-[50px] ${
                  isActive ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-black uppercase tracking-tighter">{item.name}</span>
              </Link>
            )
          })}
        </div>

        {/* Center QR Button */}
        <div className="relative -top-8 px-2">
          <button 
            onClick={() => setShowQRMenu(!showQRMenu)}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-all active:scale-90 ${
              showQRMenu ? 'bg-gray-800 text-white rotate-45' : 'bg-blue-600 text-white'
            }`}
          >
            <QrCode size={32} className={showQRMenu ? '-rotate-45' : ''} />
          </button>
        </div>

        {/* Right items */}
        <div className="flex justify-around flex-1">
          {navItems.slice(2).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            const content = (
              <>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-black uppercase tracking-tighter">{item.name}</span>
              </>
            )

            if (item.onClick) {
              return (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className="flex flex-col items-center gap-1 min-w-[50px] text-gray-400"
                >
                  {content}
                </button>
              )
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center gap-1 min-w-[50px] ${
                  isActive ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                {content}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Modals & Drawer */}
      {user && (
        <QRModal 
          userId={user.id} 
          isOpen={showQRModal} 
          onClose={() => setShowQRModal(false)} 
        />
      )}
      <QRScanner 
        isOpen={showQRScanner} 
        onClose={() => setShowQRScanner(false)} 
      />
      <MoreDrawer 
        isOpen={showMoreMenu} 
        onClose={() => setShowMoreMenu(false)} 
        user={user}
      />
    </>
  )
}
