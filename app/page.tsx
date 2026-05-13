import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import StickerGrid from '@/components/stickers/StickerGrid'
import { Trophy, Users, Star } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all stickers and user's inventory
  const { data: allStickers } = await supabase
    .from('stickers')
    .select('*')
    .order('team', { ascending: true })

  const { data: userStickers } = await supabase
    .from('user_stickers')
    .select('*')
    .eq('user_id', user.id)

  const ownedStickersMap = new Map(
    userStickers?.map((us) => [us.sticker_id, us.count]) || []
  )

  const totalStickers = allStickers?.length || 0
  const ownedCount = userStickers?.filter(s => s.count > 0).length || 0
  const completionPercentage = Math.round((ownedCount / totalStickers) * 100) || 0

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header / Stats */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 text-white shadow-xl shadow-blue-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">¡Hola, {user.user_metadata.full_name}!</h1>
            <p className="text-blue-100 text-sm opacity-90">Tu álbum del Mundial 2026</p>
          </div>
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
            <Trophy className="text-yellow-400" size={24} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span>Progreso de Colección</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-yellow-400 h-full rounded-full transition-all duration-1000" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-[10px] text-blue-100 text-right">
            {ownedCount} de {totalStickers} figuritas
          </p>
        </div>
      </section>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
            <Star size={20} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-medium">Repetidas</p>
            <p className="text-lg font-bold text-gray-800">
              {userStickers?.reduce((acc, curr) => acc + (curr.count > 1 ? curr.count - 1 : 0), 0) || 0}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-medium">Zona</p>
            <p className="text-sm font-bold text-gray-800 truncate">
              Argentina
            </p>
          </div>
        </div>
      </div>

      {/* Stickers Grid */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Mi Álbum</h2>
          <button className="text-blue-600 text-sm font-bold">Ver Todo</button>
        </div>
        <StickerGrid 
          stickers={allStickers || []} 
          userStickers={ownedStickersMap} 
          userId={user.id}
        />
      </section>
    </div>
  )
}
