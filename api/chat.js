// api/chat.js
import axios from 'axios'

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

export default async function handler(req, res) {
  // 1. Establecer cabeceras CORS obligatorias para TODAS las respuestas
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  )

  // 2. Responder 200 OK inmediatamente a la petición previa del navegador (Preflight OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  try {
    const { history } = req.body || {}

    if (!history || !Array.isArray(history)) {
      return res.status(400).json({ error: 'El historial de mensajes es obligatorio' })
    }

    // Verificar que la variable de entorno está presente
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('Falta la variable de entorno OPENROUTER_API_KEY en Vercel')
      return res.status(500).json({ error: 'Error de configuración en el servidor' })
    }

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
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
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://marcsancho97.github.io/Portfolio-Marc/',
          'X-Title': 'Portfolio Marc Sancho',
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      },
    )

    const aiResponse = response?.data?.choices?.[0]?.message?.content
    return res.status(200).json({ content: aiResponse })
  } catch (error) {
    console.error('Error en OpenRouter Proxy:', error?.response?.data || error.message)
    return res.status(500).json({
      error: 'Error procesando la solicitud en el servidor',
      details: error?.response?.data || error.message,
    })
  }
}
