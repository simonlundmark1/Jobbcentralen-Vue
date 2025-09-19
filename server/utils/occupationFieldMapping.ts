// Occupation field name to code mapping for Platsbanken API
// This mapping is based on the occupation field codes used by Platsbanken

export const occupationFieldNameToCode: Record<string, string> = {
  'Administration, ekonomi, juridik': '1',
  'Bygg och anläggning': '2', 
  'Data/IT': '3',
  'Försäljning, inköp, marknadsföring': '5',
  'Hantverksyrken': '6',
  'Hotell, restaurang, storhushåll': '7',
  'Hälso- och sjukvård': '8',
  'Industriell tillverkning': '9',
  'Installation, drift, underhåll': '10',
  'Kultur, media, design': '11',
  'Militärt arbete': '12',
  'Naturbruk': '13',
  'Naturvetenskapligt arbete': '14',
  'Pedagogik': '15',
  'Yrken med social inriktning': '16',
  'Transport': '17',
  'Yrken med teknisk inriktning': '18',
  'Säkerhetstjänst': '19',
  'Chefer och verksamhetsledare': '20',
  'Sanering och renhållning': '21'
}

export const occupationFieldCodeToName: Record<string, string> = Object.fromEntries(
  Object.entries(occupationFieldNameToCode).map(([name, code]) => [code, name])
)

/**
 * Convert occupation field name to code for API requests
 */
export function getOccupationFieldCode(occupationFieldName: string): string | undefined {
  // Try exact match first
  if (occupationFieldNameToCode[occupationFieldName]) {
    return occupationFieldNameToCode[occupationFieldName]
  }
  
  // Try case-insensitive match
  const lowerName = occupationFieldName.toLowerCase()
  for (const [name, code] of Object.entries(occupationFieldNameToCode)) {
    if (name.toLowerCase() === lowerName) {
      return code
    }
  }
  
  return undefined
}

/**
 * Convert occupation field code to name for display
 */
export function getOccupationFieldName(occupationFieldCode: string): string | undefined {
  return occupationFieldCodeToName[occupationFieldCode]
}

/**
 * Check if a string is an occupation field code (1-2 digits)
 */
export function isOccupationFieldCode(value: string): boolean {
  return /^\d{1,2}$/.test(value)
}

/**
 * Convert occupation field input to appropriate API parameter
 * Handles both names and codes
 */
export function normalizeOccupationFieldForAPI(occupationField: string): string {
  // If it's already a code, return as-is
  if (isOccupationFieldCode(occupationField)) {
    return occupationField
  }
  
  // Try to convert name to code
  const code = getOccupationFieldCode(occupationField)
  if (code) {
    return code
  }
  
  // If no mapping found, return the original value
  // The API might still handle it or return no results
  return occupationField
}
