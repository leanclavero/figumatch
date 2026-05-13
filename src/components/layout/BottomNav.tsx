'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Repeat, User } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Buscar', href: '/search', icon: Search },
    { name: 'Canjes', href: '/trades', icon: Repeat },
    { name: 'Perfil', href: '/profile', icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50 pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center gap-1 ${
              isActive ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
