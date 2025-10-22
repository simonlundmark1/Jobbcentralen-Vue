import OpenAI from 'openai'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { profile } = body

    if (!profile) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Profile data is required'
      })
    }

    const config = useRuntimeConfig()
    const openai = new OpenAI({
      apiKey: config.openaiApiKey
    })

    const prompt = `
    Skapa ett modernt, professionellt CV på svenska baserat på följande information:
    
    Namn: ${profile.firstName} ${profile.lastName}
    E-post: ${profile.email}
    Telefon: ${profile.phone}
    Adress: ${profile.address}
    Sammanfattning: ${profile.summary}
    
    VIKTIGA KRAV:
    1. Inkludera endast kontaktuppgifter som faktiskt finns (namn, email, telefon, adress)
    2. Skriv INTE ut platshållare som [Företag], [Datum] etc
    3. Skapa ett välstrukturerat CV med följande sektioner:
       - Kontaktuppgifter (endast de vi har)
       - Professionell profil/Om mig
       - Arbetslivserfarenhet (baserat på sammanfattningen, realistiska exempel)
       - Utbildning (baserat på sammanfattningen)
       - Kompetenser/Färdigheter
       - Språk (om relevant från sammanfattningen)
    4. Var realistisk och naturlig - skriv som ett riktigt CV
    5. Formatera som ren text med tydliga rubriker och struktur
    6. Använd punktlistor där det är lämpligt
    
    Skapa NU ett professionellt CV.
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Du är en expert på att skriva moderna, professionella CV:n på svenska. Skapa naturliga och realistiska dokument utan platshållare. Fokusera på innehållet och personen bakom CV:t."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7
    })

    const generatedCV = completion.choices[0]?.message?.content

    if (!generatedCV) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to generate CV'
      })
    }

    return {
      success: true,
      cv: generatedCV
    }

  } catch (error) {
    console.error('Error generating CV:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate CV'
    })
  }
})
