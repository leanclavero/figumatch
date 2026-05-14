export const teamTranslations: Record<string, string> = {
  // Anfitriones
  'Canada': 'Canadá',
  'Mexico': 'México',
  'USA': 'Estados Unidos',
  
  // CONMEBOL
  'Argentina': 'Argentina',
  'Brazil': 'Brasil',
  'Uruguay': 'Uruguay',
  'Colombia': 'Colombia',
  'Ecuador': 'Ecuador',
  'Paraguay': 'Paraguay',
  'Chile': 'Chile',
  'Peru': 'Perú',
  'Venezuela': 'Venezuela',
  'Bolivia': 'Bolivia',

  // UEFA (Ejemplos de las más probables/tradicionales)
  'Germany': 'Alemania',
  'Belgium': 'Bélgica',
  'Croatia': 'Croacia',
  'Denmark': 'Dinamarca',
  'Spain': 'España',
  'France': 'Francia',
  'England': 'Inglaterra',
  'Italy': 'Italia',
  'Netherlands': 'Países Bajos',
  'Poland': 'Polonia',
  'Portugal': 'Portugal',
  'Serbia': 'Serbia',
  'Switzerland': 'Suiza',
  'Turkey': 'Turquía',
  'Norway': 'Noruega',
  'Sweden': 'Suecia',
  'Ukraine': 'Ucrania',

  // CONCACAF
  'Costa Rica': 'Costa Rica',
  'Panama': 'Panamá',
  'Jamaica': 'Jamaica',
  'Honduras': 'Honduras',

  // AFC (Asia)
  'Japan': 'Japón',
  'South Korea': 'Corea del Sur',
  'Australia': 'Australia',
  'Saudi Arabia': 'Arabia Saudita',
  'Iran': 'Irán',
  'Qatar': 'Qatar',
  'Iraq': 'Iraq',

  // CAF (África)
  'Morocco': 'Marruecos',
  'Senegal': 'Senegal',
  'Tunisia': 'Túnez',
  'Cameroon': 'Camerún',
  'Ghana': 'Ghana',
  'Egypt': 'Egipto',
  'Nigeria': 'Nigeria',
  'Algeria': 'Argelia',

  // OFC (Oceanía)
  'New Zealand': 'Nueva Zelanda',

  // Secciones Especiales
  'Coca-Cola': 'Coca Cola',
  'Coca Cola': 'Coca Cola',
  'FIFA': 'FIFA'
}

export const getTranslatedTeamName = (team: string) => teamTranslations[team] || team
