'use client'

import { useMemo } from 'react'
import { Repeat, CheckCircle2, AlertCircle, TrendingUp, User as UserIcon } from 'lucide-react'
import { getTranslatedTeamName } from '@/utils/teams'

interface Sticker {
  id: number
  team: string
  sticker_number: string
  player_name: string | null
  rarity: string
}

interface InventoryItem {
  sticker_id: number
  count: number
}

interface Props {
  targetUserName: string
  targetUserId: string
  allStickers: Sticker[]
  targetInventory: InventoryItem[]
  myInventory: InventoryItem[]
}

export default function TradeComparison({ targetUserName, targetUserId, allStickers, targetInventory, myInventory }: Props) {
  
  const matches = useMemo(() => {
    const targetMap = new Map(targetInventory.map(i => [i.sticker_id, i.count]))
    const myMap = new Map(myInventory.map(i => [i.sticker_id, i.count]))

    // Stickers I HAVE (repeated) that HE NEEDS (0 count or not in inventory)
    const iGive = allStickers
      .filter(s => {
        const myCount = myMap.get(s.id) || 0
        const hisCount = targetMap.get(s.id) || 0
        return myCount > 1 && hisCount === 0
      })
      .sort((a, b) => {
        const numA = parseInt(a.sticker_number.replace(/\D/g, '')) || 0
        const numB = parseInt(b.sticker_number.replace(/\D/g, '')) || 0
        return numA - numB
      })

    // Stickers HE HAS (repeated) that I NEED (0 count or not in inventory)
    const heGives = allStickers
      .filter(s => {
        const hisCount = targetMap.get(s.id) || 0
        const myCount = myMap.get(s.id) || 0
        return hisCount > 1 && myCount === 0
      })
      .sort((a, b) => {
        const numA = parseInt(a.sticker_number.replace(/\D/g, '')) || 0
        const numB = parseInt(b.sticker_number.replace(/\D/g, '')) || 0
        return numA - numB
      })

    return { iGive, heGives }
  }, [allStickers, targetInventory, myInventory])

  const totalMatches = matches.iGive.length + matches.heGives.length

  return (
    <div className="space-y-6">
      {/* Target User Info */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-[32px] p-6 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
            <UserIcon size={32} />
          </div>
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Intercambio con</p>
            <h2 className="text-xl font-black">{targetUserName}</h2>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-green-500/20 p-1.5 rounded-lg text-green-400">
              <TrendingUp size={16} />
            </div>
            <span className="text-xs font-bold">{totalMatches} posibles matches</span>
          </div>
          <div className="bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg">
            Sincronizado
          </div>
        </div>
      </div>

      {/* Comparison Sections */}
      <div className="space-y-4">
        {/* HE HAS -> I NEED */}
        <section className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 className="font-black text-gray-800 leading-none">Él tiene para darte</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Repetidas que te faltan</p>
            </div>
          </div>

          {matches.heGives.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {matches.heGives.map(s => (
                <div key={s.id} className="bg-blue-50 border border-blue-100 p-3 rounded-2xl flex flex-col items-center">
                  <span className="text-[10px] font-black text-blue-600">{getTranslatedTeamName(s.team)}</span>
                  <span className="text-sm font-black text-gray-800">{s.sticker_number}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center text-center px-6">
              <AlertCircle className="text-gray-200 mb-2" size={40} />
              <p className="text-sm font-bold text-gray-400 italic">No tiene ninguna que te falte...</p>
            </div>
          )}
        </section>

        <div className="flex justify-center -my-4 relative z-10">
          <div className="bg-gray-800 text-white p-3 rounded-full shadow-xl border-4 border-white rotate-90">
            <Repeat size={24} />
          </div>
        </div>

        {/* I HAVE -> HE NEEDS */}
        <section className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-100 p-2.5 rounded-xl text-orange-600">
              <Repeat size={24} />
            </div>
            <div>
              <h3 className="font-black text-gray-800 leading-none">Tú tienes para darle</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Tus repetidas que le faltan</p>
            </div>
          </div>

          {matches.iGive.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {matches.iGive.map(s => (
                <div key={s.id} className="bg-orange-50 border border-orange-100 p-3 rounded-2xl flex flex-col items-center">
                  <span className="text-[10px] font-black text-orange-600">{getTranslatedTeamName(s.team)}</span>
                  <span className="text-sm font-black text-gray-800">{s.sticker_number}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center text-center px-6">
              <AlertCircle className="text-gray-200 mb-2" size={40} />
              <p className="text-sm font-bold text-gray-400 italic">No tienes nada que le falte...</p>
            </div>
          )}
        </section>
      </div>

      <button className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-blue-200 active:scale-95 transition-all mt-4">
        SOLICITAR CANJE
      </button>
    </div>
  )
}
