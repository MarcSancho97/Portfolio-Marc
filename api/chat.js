export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  const corsHeaders = {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    'Access-Control-Allow-Headers':
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
  }

  // 1. Responder a peticiones preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método no permitido' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    let history = []

    // Lectura segura del body
    try {
      const bodyText = await req.text()
      const body = bodyText ? JSON.parse(bodyText) : {}
      history = body.history || []
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Formato JSON inválido en la petición' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!Array.isArray(history)) {
      return new Response(JSON.stringify({ error: 'El historial debe ser un array' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      console.error('OPENROUTER_API_KEY no encontrada en process.env')
      return new Response(
        JSON.stringify({ error: 'Falta OPENROUTER_API_KEY en las variables de entorno de Vercel' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    const myInfo = {
      name: 'Marc Sancho',
      role: 'Desarrollador Full-Stack',
      location: 'La Ràpita, Tarragona, Cataluña, España',
      skills: {
        frontend: ['HTML5', 'CSS3', 'JavaScript', 'VueJS', 'TailwindCSS'],
        backend: ['PHP', 'Laravel', 'MySQL', 'Python'],
        tools: ['Git', 'Docker'],
      },
      projects: [
        { name: 'To-Do List', tech: ['Vue 3', 'TailwindCSS'] },
        { name: 'Asistente virtual con IA', tech: ['Vue 3', 'OpenRouter'] },
      ],
      experience: ['Pymeralia', 'AKX Development'],
      studies: [
        'Desarrollo de Aplicaciones Web - Amposta - INS Montsia',
        'Sistemas Microinformáticos y Redes - Amposta - INS Montsia',
      ],
      languages: ['Español', 'Catalán', 'Inglés B2'],
      hobbies: ['Programar', 'Viajar', 'Hacer deporte'],
      contact: {
        email: 'marcsancho97@gmail.com',
        github: 'github.com/marc-dev',
      },
    }

    const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://marcsancho97.github.io/Portfolio-Marc/',
        'X-Title': 'Portfolio Marc Sancho',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Eres el asistente virtual de Marc Sancho.\n\n${JSON.stringify(myInfo, null, 2)}`,
          },
          ...history,
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    const data = await openRouterRes.json()

    if (!openRouterRes.ok) {
      console.error('Respuesta de error de OpenRouter:', data)
      return new Response(
        JSON.stringify({ error: 'Error devuelto por la API de OpenRouter', details: data }),
        {
          status: openRouterRes.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    const aiResponse = data?.choices?.[0]?.message?.content
    return new Response(JSON.stringify({ content: aiResponse }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error no capturado en Edge Function:', error)
    return new Response(
      JSON.stringify({ error: 'Error interno en la Edge Function', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
}
