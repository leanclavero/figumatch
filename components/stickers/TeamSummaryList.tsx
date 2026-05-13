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
  ownedStickersMap: Map<number, number>
  userId: string
}

export default function TeamSummaryList({ allStickers, ownedStickersMap, userId }: Props) {
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null)

  // Group stickers by team
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
        const ownedInTeam = teamStickers.filter(s => (ownedStickersMap.get(s.id) || 0) > 0).length
        const totalInTeam = teamStickers.length
        const isExpanded = expandedTeam === team
        const progress = Math.round((ownedInTeam / totalInTeam) * 100)

        return (
          <div key={team} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button
              onClick={() => setExpandedTeam(isExpanded ? null : team)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-lg font-bold text-gray-400 border border-gray-100">
                  {team.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-bold text-gray-800">{team}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full max-w-[60px] overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
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
                <ChevronDown className="text-gray-400" size={20} />
              ) : (
                <ChevronRight className="text-gray-400" size={20} />
              )}
            </button>

            {isExpanded && (
              <div className="px-5 pb-5 pt-2 bg-gray-50/50 border-t border-gray-50">
                <StickerGrid 
                  stickers={teamStickers} 
                  userStickers={ownedStickersMap} 
                  userId={userId}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
