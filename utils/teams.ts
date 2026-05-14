export const teamTranslations: Record<string, string> = {
  'Germany': 'Alemania',
  'Belgium': 'Bélgica',
  'Brazil': 'Brasil',
  'Croatia': 'Croacia',
  'Denmark': 'Dinamarca',
  'Spain': 'España',
  'USA': 'Estados Unidos',
  'France': 'Francia',
  'England': 'Inglaterra',
  'Italy': 'Italia',
  'Japan': 'Japón',
  'Morocco': 'Marruecos',
  'Mexico': 'México',
  'Netherlands': 'Países Bajos',
  'Poland': 'Polonia',
  'South Korea': 'Corea del Sur',
  'Switzerland': 'Suiza',
  'Turkey': 'Turquía',
  'Uruguay': 'Uruguay',
  'Coca-Cola': 'Coca Cola',
  'Coca Cola': 'Coca Cola',
  'FIFA': 'FIFA'
}

export const getTranslatedTeamName = (team: string) => teamTranslations[team] || team
