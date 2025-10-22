import { computed } from 'vue'

export interface Profile {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  summary: string
  cvFile: File | null
  coverLetterTemplate: string
}

const defaultCoverLetterTemplate = `Hej _____!

Mitt namn är _____ och jag skriver angående tjänsten som _____ hos er. Jag såg er annons på _____ och det lät mycket intressant. Jag är på jakt efter ett jobb med liknande beskrivning där jag kan få användning för min kompetens, men också utvecklas. Jag är utbildad _____ och har lång erfarenhet inom ___. Jag är övertygad om att jag skulle kunna hjälpa er med en hel del.

Hej på er!

Jag heter _____ och läste på _____ att ni söker nya medarbetare. Jag är en jätteduktig _____ med mycket energi och stor dedikation till _____. Nu jobbar jag som _____, men känner att jag vill vidareutvecklas i min karriär. Jag vet att jag har stor potential, mycket att erbjuda och jag är säker på att jag skulle vara fantastisk på det jobb ni erbjuder.

Hejsan!

Jag fann er annons på _____ och det låter som något för mig. Jag har en bakgrund som _____ och har jobbat ganska länge inom _____ med allt ifrån _____ till _____. Jag söker nu ett jobb som är mer i linje med den tjänst ni beskriver, och tror jag skulle kunna tillföra mycket hos er.`

export const useProfile = () => {
  // Use Nuxt's useState to create a global shared state
  const profile = useState<Profile>('user-profile', () => {
    // Try to load from localStorage immediately during initialization
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('jobbcentralen-profile')
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile)
          return {
            firstName: parsed.firstName || '',
            lastName: parsed.lastName || '',
            email: parsed.email || '',
            phone: parsed.phone || '',
            address: parsed.address || '',
            summary: parsed.summary || '',
            cvFile: null,
            coverLetterTemplate: parsed.coverLetterTemplate || defaultCoverLetterTemplate
          }
        } catch (error) {
          console.error('Error loading profile during initialization:', error)
        }
      }
    }
    
    // Fallback to empty profile
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      summary: '',
      cvFile: null,
      coverLetterTemplate: defaultCoverLetterTemplate
    }
  })

  const isProfileComplete = computed(() => {
    return !!(
      profile.value.firstName &&
      profile.value.lastName &&
      profile.value.email &&
      profile.value.phone &&
      profile.value.address &&
      profile.value.summary
    )
  })

  const canGenerateCV = computed(() => {
    return !!(
      profile.value.firstName &&
      profile.value.lastName &&
      profile.value.email
    )
  })

  const canGenerateCoverLetter = computed(() => {
    return profile.value.coverLetterTemplate.length > 0 || isProfileComplete.value
  })

  const loadProfile = () => {
    const savedProfile = localStorage.getItem('jobbcentralen-profile')
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile)
        Object.assign(profile.value, parsed)
        // If no cover letter template is saved, use the default
        if (!profile.value.coverLetterTemplate) {
          profile.value.coverLetterTemplate = defaultCoverLetterTemplate
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      }
    }
  }

  const saveProfile = () => {
    try {
      const profileToSave = { ...profile.value, cvFile: undefined }
      localStorage.setItem('jobbcentralen-profile', JSON.stringify(profileToSave))
      return true
    } catch (error) {
      console.error('Error saving profile:', error)
      return false
    }
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    return phoneRegex.test(phone) && phone.length >= 8
  }

  const getValidationErrors = () => {
    const errors: string[] = []
    
    if (!profile.value.firstName.trim()) {
      errors.push('Förnamn är obligatoriskt')
    }
    
    if (!profile.value.lastName.trim()) {
      errors.push('Efternamn är obligatoriskt')
    }
    
    if (!profile.value.email.trim()) {
      errors.push('E-post är obligatoriskt')
    } else if (!validateEmail(profile.value.email)) {
      errors.push('Ogiltig e-postadress')
    }
    
    if (!profile.value.phone.trim()) {
      errors.push('Telefonnummer är obligatoriskt')
    } else if (!validatePhone(profile.value.phone)) {
      errors.push('Ogiltigt telefonnummer')
    }
    
    return errors
  }

  return {
    profile,
    isProfileComplete,
    canGenerateCV,
    canGenerateCoverLetter,
    loadProfile,
    saveProfile,
    validateEmail,
    validatePhone,
    getValidationErrors
  }
}
