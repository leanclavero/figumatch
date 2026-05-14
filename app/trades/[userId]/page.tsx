import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import TradeComparison from '@/components/trades/TradeComparison'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Props {
  params: {
    userId: string
  }
}

export default async function TradePage({ params }: Props) {
  const { userId: targetUserId } = params
  const supabase = await createClient()

  const { data: { user: currentUser } } = await supabase.auth.getUser()

  if (!currentUser) {
    redirect('/login')
  }

  if (currentUser.id === targetUserId) {
    redirect('/')
  }

  // Fetch all stickers (catalog)
  const { data: allStickers } = await supabase
    .from('stickers')
    .select('*')
    .order('team', { ascending: true })
    .order('sticker_number', { ascending: true })

  // Fetch Target User stickers
  const { data: targetUserStickers } = await supabase
    .from('user_stickers')
    .select('*')
    .eq('user_id', targetUserId)

  // Fetch Current User stickers
  const { data: currentUserStickers } = await supabase
    .from('user_stickers')
    .select('*')
    .eq('user_id', currentUser.id)

  // Fetch Target User Profile info
  const { data: targetProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', targetUserId)
    .single()

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/" className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <h1 className="text-xl font-black text-gray-800">Comparar Canje</h1>
      </div>

      <TradeComparison 
        targetUser={targetProfile}
        allStickers={allStickers || []}
        targetInventory={targetUserStickers || []}
        myInventory={currentUserStickers || []}
      />
    </div>
  )
}
