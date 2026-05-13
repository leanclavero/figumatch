'use client'

import { useState } from 'react'
import StickerGrid from './StickerGrid'
import { ChevronRight, ChevronDown } from 'lucide-react'

interface Sticker {
  id: number
  team: string
  sticker_number: string
  player_name: string | null
  rarity: string
}

interface Props {
  allStickers: Sticker[]
  ownedStickersMap: Record<number, number>
  userId: string
  onUpdateCount: (stickerId: number, newCount: number) => void
}

export default function TeamSummaryList({ allStickers, ownedStickersMap, userId, onUpdateCount }: Props) {
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null)

  // Group stickers by team DYNAMICALLY
  const teamsMap = allStickers.reduce((acc, sticker) => {
    if (!acc[sticker.team]) {
      acc[sticker.team] = []
    }
    acc[sticker.team].push(sticker)
    return acc
  }, {} as Record<string, Sticker[]>)

  const teams = Object.keys(teamsMap).sort()

  return (
    <div className="space-y-3">
      {teams.map((team) => {
        const teamStickers = teamsMap[team]
        
        // Strictly sort stickers A-Z alphabetically
        const sortedTeamStickers = [...teamStickers].sort((a, b) => 
          a.sticker_number.localeCompare(b.sticker_number)
        )
        
        const ownedInTeam = teamStickers.filter(s => (ownedStickersMap[s.id] || 0) > 0).length
        const totalInTeam = teamStickers.length
        
        const duplicatesInTeam = teamStickers.reduce((acc, s) => {
          const count = ownedStickersMap[s.id] || 0
          return acc + (count > 1 ? count - 1 : 0)
        }, 0)

        const isExpanded = expandedTeam === team
        const progress = Math.round((ownedInTeam / totalInTeam) * 100)

        return (
          <div key={team} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button
              onClick={() => setExpandedTeam(isExpanded ? null : team)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xs font-black text-blue-600 border border-blue-100">
                  {team.substring(0, 3).toUpperCase()}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex justify-between items-center pr-2">
                    <h3 className="text-sm font-bold text-gray-800">{team}</h3>
                    {duplicatesInTeam > 0 && (
                      <span className="text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-black">
                        +{duplicatesInTeam}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full max-w-[80px] overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-300" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">
                      {ownedInTeam}/{totalInTeam}
                    </span>
                  </div>
                </div>
              </div>
              {isExpanded ? (
                <ChevronDown className="text-gray-300" size={18} />
              ) : (
                <ChevronRight className="text-gray-300" size={18} />
              )}
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 pt-2 bg-gray-50/30 border-t border-gray-50">
                <StickerGrid 
                  stickers={sortedTeamStickers} 
                  userStickers={ownedStickersMap} 
                  userId={userId}
                  onUpdateCount={onUpdateCount}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
