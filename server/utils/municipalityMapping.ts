// Municipality name to code mapping for Platsbanken API
// This mapping is based on the Swedish municipality codes used by Platsbanken

export const municipalityNameToCode: Record<string, string> = {
  // Major cities
  'Stockholm': '0180',
  'Göteborg': '1480', 
  'Malmö': '1280',
  'Uppsala': '0380',
  'Västerås': '1980',
  'Örebro': '1880',
  'Linköping': '0580',
  'Helsingborg': '1283',
  'Jönköping': '0680',
  'Norrköping': '0581',
  'Lund': '1281',
  'Umeå': '2480',
  'Gävle': '2180',
  'Borås': '1490',
  'Södertälje': '0181',
  'Eskilstuna': '0484',
  'Halmstad': '1380',
  'Växjö': '0780',
  'Karlstad': '1780',
  'Sundsvall': '2281',
  
  // Additional municipalities
  'Solna': '0184',
  'Karlskrona': '1080',
  'Täby': '0160',
  'Nacka': '0182',
  'Danderyd': '0162',
  'Lidingö': '0186',
  'Huddinge': '0136',
  'Botkyrka': '0127',
  'Haninge': '0136',
  'Tyresö': '0138',
  'Värmdö': '0120',
  'Österåker': '0117',
  'Nykvarn': '0140',
  'Salem': '0128',
  'Ekerö': '0125',
  'Norrtälje': '0188',
  'Sigtuna': '0191',
  'Upplands Väsby': '0114',
  'Vallentuna': '0115',
  'Upplands-Bro': '0139',
  'Järfälla': '0123',
  'Sundbyberg': '0183'
}

export const municipalityCodeToName: Record<string, string> = Object.fromEntries(
  Object.entries(municipalityNameToCode).map(([name, code]) => [code, name])
)

/**
 * Convert municipality name to code for API requests
 */
export function getMunicipalityCode(municipalityName: string): string | undefined {
  // Try exact match first
  if (municipalityNameToCode[municipalityName]) {
    return municipalityNameToCode[municipalityName]
  }
  
  // Try case-insensitive match
  const lowerName = municipalityName.toLowerCase()
  for (const [name, code] of Object.entries(municipalityNameToCode)) {
    if (name.toLowerCase() === lowerName) {
      return code
    }
  }
  
  return undefined
}

/**
 * Convert municipality code to name for display
 */
export function getMunicipalityName(municipalityCode: string): string | undefined {
  return municipalityCodeToName[municipalityCode]
}

/**
 * Check if a string is a municipality code (4 digits)
 */
export function isMunicipalityCode(value: string): boolean {
  return /^\d{4}$/.test(value)
}

/**
 * Convert municipality input to appropriate API parameter
 * Handles both names and codes
 */
export function normalizeMunicipalityForAPI(municipality: string): string {
  // If it's already a code, return as-is
  if (isMunicipalityCode(municipality)) {
    return municipality
  }
  
  // Try to convert name to code
  const code = getMunicipalityCode(municipality)
  if (code) {
    return code
  }
  
  // If no mapping found, return the original value
  // The API might still handle it or return no results
  return municipality
}
