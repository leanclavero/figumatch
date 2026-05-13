import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import HomeDashboard from '@/components/stickers/HomeDashboard'

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all stickers ordered A-Z
  const { data: allStickers } = await supabase
    .from('stickers')
    .select('*')
    .order('team', { ascending: true })
    .order('sticker_number', { ascending: true })

  // Fetch user's inventory
  const { data: userStickers } = await supabase
    .from('user_stickers')
    .select('*')
    .eq('user_id', user.id)

  return (
    <HomeDashboard 
      initialAllStickers={allStickers || []} 
      initialUserStickers={userStickers || []} 
      user={user}
    />
  )
}
