import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDb() {
  console.log('--- VALIDACIÓN DE ÁLBUM ---')
  
  // Total Stickers
  const { count: totalStickers } = await supabase
    .from('stickers')
    .select('*', { count: 'exact', head: true })

  // Total Teams
  const { data: teamsData } = await supabase
    .from('stickers')
    .select('team')

  const teams = [...new Set(teamsData?.map(s => s.team))]
  
  console.log(`Total de figuritas: ${totalStickers}`)
  console.log(`Total de selecciones/secciones: ${teams.length}`)
  
  // Count by team (First 5 and Special ones)
  const teamCounts: Record<string, number> = {}
  teamsData?.forEach(s => {
    teamCounts[s.team] = (teamCounts[s.team] || 0) + 1
  })

  console.log('\nDistribución por sección:')
  Object.entries(teamCounts).sort().forEach(([team, count]) => {
    console.log(`- ${team}: ${count} figuritas`)
  })
}

checkDb()
