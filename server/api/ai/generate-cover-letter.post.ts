import OpenAI from 'openai'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { profile, jobTitle, companyName, jobDescription } = body

    if (!profile || !jobTitle || !companyName) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Profile data, job title, and company name are required'
      })
    }

    const config = useRuntimeConfig()
    const openai = new OpenAI({
      apiKey: config.openaiApiKey
    })

    const prompt = `
    Skapa ett personligt brev på svenska för följande jobbansökan:
    
    Sökande:
    - Namn: ${profile.firstName} ${profile.lastName}
    - E-post: ${profile.email}
    - Telefon: ${profile.phone}
    - Sammanfattning: ${profile.summary}
    
    Jobinformation:
    - Position: ${jobTitle}
    - Företag: ${companyName}
    ${jobDescription ? `- Jobbeskrivning: ${jobDescription}` : ''}
    
    Mall (om tillgänglig): ${profile.coverLetterTemplate || 'Ingen mall tillgänglig'}
    
    VIKTIGA KRAV:
    1. Skriv ett naturligt och mänskligt personligt brev på svenska
    2. Börja DIREKT med "Hej" eller hälsning - INGEN adressblock
    3. Inkludera INTE kontaktuppgifter, adresser eller formella brevhuvuden
    4. Inkludera INTE platshållare som [Adress], [Datum], [Postnummer] etc
    5. Fokusera på innehållet: varför personen är lämplig för jobbet
    6. Använd personens faktiska namn (${profile.firstName} ${profile.lastName}) om det passar naturligt i texten
    7. Matcha jobbeskrivningen noga och koppla personens erfarenhet till kraven
    8. Ha en naturlig, entusiastisk och professionell ton
    9. Gör brevet cirka 3-4 stycken långt
    10. Avsluta med "Med vänliga hälsningar," följt av personens namn
    11. Skriv som om en riktig människa skriver brevet, inte som en mall
    
    Exempel på bra början:
    "Hej,
    
    Jag heter ${profile.firstName} och jag är mycket intresserad av tjänsten som ${jobTitle} hos ${companyName}..."
    
    Skapa NU ett personligt brev som följer dessa krav EXAKT.
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Du är en expert på att skriva naturliga, mänskliga personliga brev på svenska. Skriv aldrig som en mall eller med platshållare. Skapa personliga, genuina brev som låter som de är skrivna av en riktig person, inte av AI. Inkludera aldrig adressblock, datum eller formella brevhuvuden. Fokusera på innehållet och personen bakom ansökan."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    })

    const generatedCoverLetter = completion.choices[0]?.message?.content

    if (!generatedCoverLetter) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to generate cover letter'
      })
    }

    return {
      success: true,
      coverLetter: generatedCoverLetter
    }

  } catch (error) {
    console.error('Error generating cover letter:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate cover letter'
    })
  }
})
