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

  // 1. Responder inmediatamente a peticiones OPTIONS (Preflight)
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
    const body = await req.json()
    const { history } = body || {}

    if (!history || !Array.isArray(history)) {
      return new Response(JSON.stringify({ error: 'El historial es obligatorio' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Falta la API Key en el servidor' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
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
      return new Response(JSON.stringify({ error: data }), {
        status: openRouterRes.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const aiResponse = data?.choices?.[0]?.message?.content
    return new Response(JSON.stringify({ content: aiResponse }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error en el servidor', details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}
