export default async function handler(req, res) {
  // Cabeceras CORS de respuesta
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
  )

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  try {
    let body = req.body
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body)
      } catch (e) {}
    }

    const { history } = body || {}

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      console.error('OPENROUTER_API_KEY no encontrada en process.env')
      return res
        .status(500)
        .json({ error: 'Falta la API Key en las variables de entorno de Vercel' })
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
      projects: {
        githubRepository: 'https://github.com/marcsancho97',
        list: [
          { name: 'To-Do List', tech: ['Vue 3', 'TailwindCSS'] },
          { name: 'Asistente virtual con IA', tech: ['Vue 3', 'OpenRouter'] },
        ],
      },
      experience: ['Pymeralia', 'AKX Development'],
      studies: [
        'Desarrollo de Aplicaciones Web - Amposta - INS Montsia',
        'Sistemas Microinformáticos y Redes - Amposta - INS Montsia',
      ],
      languages: ['Español', 'Catalán', 'Inglés B2'],
      hobbies: ['Programar', 'Viajar', 'Hacer deporte'],
      contact: {
        email: 'marcsancho97@gmail.com',
        linkedin: 'https://www.linkedin.com/in/marc-sancho-garcia-98a317274/',
      },
      instructions: [
        'Si te preguntan por proyectos, código fuente o repositorios de Marc, ofrece su GitHub (https://github.com/marcsancho97).',
        'Si te preguntan cómo contactar con Marc o por sus redes profesionales, proporciona su email y su LinkedIn, pero NO su GitHub salvo que pidan ver su código.',
      ],
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
          ...(history || []),
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    const data = await openRouterRes.json()

    if (!openRouterRes.ok) {
      return res.status(openRouterRes.status).json({ error: data })
    }

    const aiResponse = data?.choices?.[0]?.message?.content || 'No se recibió respuesta.'
    return res.status(200).json({ content: aiResponse })
  } catch (error) {
    console.error('Error en Serverless Function:', error)
    return res.status(500).json({ error: 'Error interno del servidor', details: error.message })
  }
}
