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
    Skapa ett professionellt CV på svenska baserat på följande information:
    
    Namn: ${profile.firstName} ${profile.lastName}
    E-post: ${profile.email}
    Telefon: ${profile.phone}
    Adress: ${profile.address}
    Sammanfattning: ${profile.summary}
    
    Skapa ett välstrukturerat CV med följande sektioner:
    1. Personlig information
    2. Professionell sammanfattning
    3. Arbetslivserfarenhet (skapa realistiska exempel baserat på sammanfattningen)
    4. Utbildning
    5. Färdigheter
    6. Språk
    
    Formatera det som ren text med tydliga rubriker och struktur.
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Du är en expert på att skriva professionella CV:n på svenska. Skapa alltid välstrukturerade och professionella dokument."
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
