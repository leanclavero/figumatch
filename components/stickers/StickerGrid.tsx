'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Plus, Minus, Info } from 'lucide-react'

interface Sticker {
  id: number
  team: string
  sticker_number: string
  player_name: string | null
  rarity: string
}

interface Props {
  stickers: Sticker[]
  userStickers: Map<number, number>
  userId: string
  onUpdateCount: (stickerId: number, newCount: number) => void
}

export default function StickerGrid({ stickers, userStickers, userId, onUpdateCount }: Props) {
  const supabase = createClient()

  const updateCount = async (stickerId: number, delta: number) => {
    const currentCount = userStickers.get(stickerId) || 0
    const newCount = Math.max(0, currentCount + delta)
    
    if (newCount === currentCount) return

    // Notify parent immediately for reactive UI
    onUpdateCount(stickerId, newCount)

    const { error } = await supabase
      .from('user_stickers')
      .upsert({
        user_id: userId,
        sticker_id: stickerId,
        count: newCount
      }, { onConflict: 'user_id,sticker_id' })

    if (error) {
      console.error('Error updating sticker count:', error)
      // Rollback parent state
      onUpdateCount(stickerId, currentCount)
    }
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {stickers.map(sticker => {
        const count = userStickers.get(sticker.id) || 0
        const isOwned = count > 0
        const isRare = sticker.rarity !== 'common'

        return (
          <div 
            key={sticker.id}
            className={`relative p-3 rounded-xl border-2 transition-all flex flex-col ${
              isOwned 
                ? 'bg-white border-blue-100 shadow-sm' 
                : 'bg-gray-100 border-transparent grayscale opacity-50'
            } ${isRare && isOwned ? 'ring-1 ring-yellow-400 ring-offset-1' : ''}`}
          >
            <div className="flex flex-col gap-0.5 mb-2">
              <span className="text-[9px] font-black text-blue-600 leading-none">{sticker.sticker_number}</span>
              <p className="text-[10px] font-bold text-gray-800 line-clamp-1 leading-tight">
                {sticker.player_name?.split(' ').pop() || 'Figu'}
              </p>
            </div>

            <div className="flex items-center justify-between mt-auto gap-1">
              <button 
                onClick={() => updateCount(sticker.id, -1)}
                className="p-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <Minus size={10} />
              </button>
              <span className={`text-xs font-black ${count > 1 ? 'text-orange-600' : 'text-gray-800'}`}>
                {count}
              </span>
              <button 
                onClick={() => updateCount(sticker.id, 1)}
                className="p-1 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
              >
                <Plus size={10} />
              </button>
            </div>

            {isRare && (
              <div className="absolute -top-1 -right-1 bg-yellow-400 p-0.5 rounded-full shadow-sm">
                <StarBadge />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function StarBadge() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
