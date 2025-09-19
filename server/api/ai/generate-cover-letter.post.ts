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
    
    Skapa ett professionellt och personligt brev som:
    1. Är skrivet på svenska
    2. Är anpassat för den specifika positionen och företaget
    3. Framhäver relevanta färdigheter och erfarenheter
    4. Har en professionell ton
    5. Är cirka 3-4 stycken långt
    6. Inkluderar en stark öppning och avslutning
    
    Formatera det som ett komplett brev med datum, mottagare och avslutning.
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Du är en expert på att skriva professionella personliga brev på svenska. Skapa alltid välstrukturerade och övertygande brev som är anpassade för den specifika positionen."
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
