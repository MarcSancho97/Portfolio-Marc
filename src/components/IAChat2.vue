<template>
  <AppBanner>
    <template v-slot:title>
      <h1 class="text-6xl font-bold">Chatea con mi asistente</h1>
    </template>
    <template v-slot:content>
      <p class="mt-4 italic">Conoce más sobre mi experiencia, proyectos y habilidades.</p>
    </template>
  </AppBanner>

  <section
    class="min-h-screen bg-gradient-to-br from-blue-500 to-blue-950 py-8 px-4 sm:px-6 lg:px-8"
  >
    <div
      class="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden"
    >
      <!-- Cabecera del chat -->
      <div class="bg-gradient-to-r from-blue-500 to-blue-950 p-4 text-white">
        <div class="flex items-center space-x-3">
          <div class="relative">
            <div class="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <span
              class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"
            ></span>
          </div>
          <div>
            <h1 class="font-bold text-lg">Asistente de Marc</h1>
            <p class="text-xs opacity-80">Desarrollador Full-Stack</p>
          </div>
        </div>
      </div>

      <!-- Área de chat -->
      <div
        class="h-[500px] overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white/95 to-blue-50/50"
      >
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="[
            'rounded-xl p-4 max-w-[85%] relative',
            message.role === 'user'
              ? 'ml-auto bg-white text-black rounded-br-none'
              : message.isError
                ? 'bg-red-50 border border-red-200 text-red-800'
                : 'bg-white shadow-sm border border-gray-300 rounded-bl-none',
          ]"
        >
          <div v-html="message.content" class="prose prose-sm max-w-none"></div>

          <!-- Hora del mensaje -->
          <p class="text-xs mt-1 opacity-70 text-right">
            {{ new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
          </p>
        </div>

        <!-- Indicador de carga -->
        <div v-if="isLoading" class="flex justify-start">
          <div
            class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 max-w-[85%] rounded-bl-none"
          >
            <div class="flex space-x-2">
              <div class="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
              <div
                class="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                style="animation-delay: 0.2s"
              ></div>
              <div
                class="w-2 h-2 rounded-full bg-blue-600 animate-bounce"
                style="animation-delay: 0.4s"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sugerencias rápidas -->
      <div
        v-if="quickSuggestions.length && !isLoading"
        class="px-4 pt-2 pb-1 bg-white/80 border-t border-gray-200"
      >
        <div class="flex flex-wrap gap-2">
          <button
            v-for="(suggestion, index) in quickSuggestions"
            :key="index"
            @click="handleQuickSuggestion(suggestion)"
            class="text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-3 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>

      <!-- Input de usuario -->
      <div class="p-4 bg-white border-t border-gray-200">
        <form @submit.prevent="sendMessage" class="flex gap-2">
          <div class="relative flex-1">
            <input
              v-model="userInput"
              type="text"
              placeholder="Escribe tu pregunta..."
              class="w-full border border-gray-300 rounded-full pl-5 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm"
              :disabled="isLoading"
            />
            <button
              v-if="userInput"
              type="button"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600"
              @click="userInput = ''"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
          <button
            type="submit"
            :disabled="isLoading || !userInput.trim()"
            class="bg-gradient-to-r from-blue-600 to-blue-950 text-white p-3 rounded-full shadow-lg shadow-gray-400 transition-all transform hover:bg-indigo-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:scale-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import AppBanner from './AppBanner.vue'

const userInput = ref('')
const isLoading = ref(false)

// Datos completos actualizados
const myInfo = {
  name: 'Marc',
  age: '27',
  location: 'Sant Carles de la Ràpita, Tarragona, Cataluña, España',
  role: 'Desarrollador Full-Stack',
  specialization: 'Desarrollo de aplicaciones web',

  technicalSkills: {
    frontend: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'Tailwind', 'VueJS'],
    backend: ['PHP', 'Laravel', 'MySQL', 'Python', 'jQuery', 'Firebase'],
    tools: ['Git', 'Docker'],
  },

  softSkills: ['Trabajo en equipo', 'Resolución de problemas', 'Proactividad'],

  featuredProjects: [
    {
      name: 'To-Do List',
      description: 'Una aplicación para organizar tus tareas',
      tech: ['Vue 3', 'TailwindCSS'],
      impact: 'Te ayuda a organizar tus tareas.',
      url: '',
    },
    {
      name: 'Asistente virtual con IA',
      description: 'Un asistente virtual desarrollado con IA que puedes configurar con tus datos.',
      tech: ['Vue 3', 'TailwindCSS', 'OpenRouter'],
      github: '',
    },
  ],

  workExperience: [
    {
      company: 'Lo Barril',
      position: 'Camarero',
      period: 'Mayo 2017 - Septiembre 2017',
      responsibilities: [
        'Atención al cliente',
        'Servicio de alimentos y bebidas',
        'Mantenimiento del área',
      ],
    },
    {
      company: 'Bonsai',
      position: 'Camarero',
      period: 'Marzo 2018 - Junio 2018',
      responsibilities: ['Atención a clientes', 'Preparación de cócteles'],
    },
    {
      company: 'Lo Barril',
      position: 'Camarero',
      period: 'Noviembre 2017 - Mayo 2019',
      responsibilities: ['Atención al cliente', 'Responsable de caja'],
    },
    {
      company: 'Bonsai',
      position: 'Camarero',
      period: 'Octubre 2019 - Marzo 2020',
      responsibilities: ['Atención al cliente', 'Coordinación de turnos'],
    },
    {
      company: 'La taverna del Mar',
      position: 'Camarero',
      period: 'Junio 2021 - Septiembre 2021',
      responsibilities: ['Atención al cliente', 'Servicio en terraza'],
    },
    {
      company: 'Pizzeria Mar y Luz',
      position: 'Camarero',
      period: 'Octubre 2021 - Noviembre 2021 (Apertura)',
      responsibilities: ['Atención al cliente', 'Organización de eventos'],
    },
    {
      company: 'Prácticas en AKX Development',
      position: 'Desarrollador Web',
      period: 'Año 2021 (SMR - Desarrollo Web)',
      responsibilities: ['Desarrollo frontend', 'Mantenimiento de sitios web'],
    },
    {
      company: 'Tamashi',
      position: 'Camarero',
      period: 'Mayo 2023 - Noviembre 2023',
      responsibilities: ['Atención al cliente', 'Servicio en barra'],
    },
    {
      company: 'Prácticas en Pymeralia',
      position: 'Desarrollador Web',
      period: 'Año 2023 (DAW - Desarrollo Web)',
      responsibilities: ['Desarrollo full-stack', 'Implementación de APIs'],
    },
    {
      company: 'Pymeralia',
      position: 'Desarrollador Web',
      period: 'Agosto 2024 - Febrero 2025',
      responsibilities: ['Desarrollo de aplicaciones web', 'Optimización de código'],
    },
    {
      company: 'Can Paquita',
      position: 'Camarero',
      period: 'Mayo 2024 - Agosto 2024',
      responsibilities: ['Atención al cliente', 'Servicio en comedor'],
    },
  ],

  education: [
    {
      institution: 'INS Montsià',
      degree: 'Sistemas Microinformáticos y Redes',
      period: 'Septiembre 2019 - Julio 2021',
      highlights: [
        'Configuración de redes locales',
        'Administración de sistemas',
        'Seguridad informática básica',
      ],
    },
    {
      institution: 'INS Montsià',
      degree: 'Desarrollo de Aplicaciones Web',
      period: 'Septiembre 2021 - Julio 2023',
      highlights: [
        'Programación frontend',
        'Desarrollo backend',
        'Gestión de bases de datos',
        'Proyecto final: Aplicación de testos para ciberseguridad + Red Social que conecta con la Blockchain (Swarm)',
      ],
    },
  ],

  contact: {
    email: 'marcsancho97@gmail.com',
    linkedin: 'linkedin.com/in/marc-dev',
    github: 'github.com/marc-dev',
  },

  hobbies: ['Hacer deporte', 'Viajar', 'Programar'],
  languages: ['Español (nativo)', 'Catalán (nativo)', 'Inglés (intermedio B2)'],
}

// Sugerencias rápidas
const quickSuggestions = computed(() => [
  '¿Qué tecnologías dominas?',
  'Cuéntame sobre tus proyectos',
  '¿Dónde has trabajado?',
  '¿Qué estudiaste?',
  '¿Cómo contactarte?',
  '¿Cuáles son tus hobbies?',
  '¿Qué idiomas hablas?',
])

// Mensajes iniciales
const messages = ref([
  {
    role: 'assistant',
    content: `👋 ¡Hola! Soy el asistente de Marc Sancho, Desarrollador Full-Stack.

Puedes preguntarme sobre:
<br>
<br>
🏢 Experiencia profesional <br>
💻 Habilidades técnicas<br>
🚀 Proyectos destacados<br>
📚 Formación académica<br>
🌍 Idiomas<br>
🎯 Hobbies e intereses<br>
📬 Datos de contacto<br>
<br>
¿En qué puedo ayudarte hoy?`,
    specialContent: null,
  },
])

const handleQuickSuggestion = (suggestion) => {
  userInput.value = suggestion
  setTimeout(() => {
    sendMessage()
  }, 50)
}

// Componentes para respuestas visuales
const SkillBadge = (skill) => {
  return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-1 mb-1">${skill}</span>`
}

const ProjectCard = (project) => {
  return `
  <div class="border rounded-lg p-4 mb-3 bg-white shadow-sm hover:shadow-md transition-shadow">
    <h3 class="font-bold text-lg text-indigo-700">${project.name}</h3>
    <p class="text-gray-600 mb-2">${project.description}</p>
    <div class="flex flex-wrap">
      ${project.tech.map((tech) => SkillBadge(tech)).join('')}
    </div>
  </div>`
}

const ExperienceItem = (job) => {
  return `
  <div class="border-l-4 border-indigo-200 pl-4 mb-4">
    <h3 class="font-bold text-gray-800">${job.position} @ ${job.company}</h3>
    <p class="text-sm text-gray-500 mb-1">${job.period}</p>
    <ul class="list-disc list-inside text-gray-700 space-y-1">
      ${job.responsibilities
        .filter((r) => r.trim())
        .map((resp) => `<li>${resp}</li>`)
        .join('')}
    </ul>
  </div>`
}

// Manejo de preguntas frecuentes con respuestas enriquecidas
const handleCommonQuestions = (question) => {
  const lowerQ = question.toLowerCase()

  if (
    lowerQ.includes('tecnologías') ||
    lowerQ.includes('habilidades') ||
    lowerQ.includes('qué sabes') ||
    lowerQ.includes('stack')
  ) {
    return {
      role: 'assistant',
      content: `💻 <strong>Habilidades Técnicas</strong>:
<br><br>
🖥️ <strong>Frontend</strong>:
${myInfo.technicalSkills.frontend.map(SkillBadge).join('')}

<br><br>⚙️ <strong>Backend</strong>:
${myInfo.technicalSkills.backend.map(SkillBadge).join('')}

<br><br>🛠️ <strong>Herramientas</strong>:
${myInfo.technicalSkills.tools.map(SkillBadge).join('')}

<br><br>🤝 <strong>Habilidades Blandas</strong>:
${myInfo.softSkills.map((skill) => `<span class="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm mr-2 mb-2">${skill}</span>`).join('')}`,
      specialContent: null,
    }
  }

  if (lowerQ.includes('proyectos') || lowerQ.includes('trabajos') || lowerQ.includes('portfolio')) {
    return {
      role: 'assistant',
      content: `🚀 <strong>Proyectos Destacados</strong>:

${myInfo.featuredProjects.map(ProjectCard).join('')}`,
      specialContent: null,
    }
  }

  if (
    lowerQ.includes('experiencia') ||
    lowerQ.includes('trabajado') ||
    lowerQ.includes('trabajos anteriores') ||
    lowerQ.includes('laboral')
  ) {
    const devJobs = myInfo.workExperience.filter((job) => job.position.includes('Desarrollador'))

    return {
      role: 'assistant',
      content: `💼 <strong>Experiencia Profesional Relevante</strong>:

${
  devJobs.length > 0
    ? devJobs.map(ExperienceItem).join('')
    : 'Actualmente estoy enfocado en ganar más experiencia en desarrollo. ¡Pronto habrá novedades!'
}`,
      specialContent: null,
    }
  }

  if (
    lowerQ.includes('estudios') ||
    lowerQ.includes('educación') ||
    lowerQ.includes('formación') ||
    lowerQ.includes('académica') ||
    lowerQ.includes('estudiaste')
  ) {
    return {
      role: 'assistant',
      content: `📚 <strong>Formación Académica</strong>:

${myInfo.education
  .map(
    (edu) => `
<div class="bg-gray-50 p-4 rounded-lg mb-3">
  <h3 class="font-bold text-lg text-gray-800">${edu.degree}</h3>
  <p class="text-indigo-600">${edu.institution} <span class="text-gray-400 text-sm">(${edu.period})</span></p>
  <ul class="mt-2 space-y-1">
    ${edu.highlights
      .map(
        (hl) => `<li class="flex items-start">
      <svg class="h-4 w-4 text-green-500 mr-1 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      ${hl}
    </li>`,
      )
      .join('')}
  </ul>
</div>
`,
  )
  .join('')}`,
      specialContent: null,
    }
  }

  if (
    lowerQ.includes('contact') ||
    lowerQ.includes('linkedin') ||
    lowerQ.includes('github') ||
    lowerQ.includes('correo') ||
    lowerQ.includes('email')
  ) {
    return {
      role: 'assistant',
      content: `📬 <strong>Contacto</strong>:

<div class="space-y-3">
  <div class="flex items-center">
    <span class="bg-blue-100 p-2 rounded-full mr-3">
      <svg class="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z"/>
      </svg>
    </span>
    <span class="font-medium">Email:</span> <a href="mailto:${myInfo.contact.email}" class="text-indigo-600 ml-1">${myInfo.contact.email}</a>
  </div>

  <div class="flex items-center">
    <span class="bg-blue-100 p-2 rounded-full mr-3">
      <svg class="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    </span>
    <span class="font-medium">LinkedIn:</span> <a href="https://${myInfo.contact.linkedin}" target="_blank" class="text-indigo-600 ml-1">${myInfo.contact.linkedin}</a>
  </div>

  <div class="flex items-center">
    <span class="bg-gray-800 p-2 rounded-full mr-3">
      <svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    </span>
    <span class="font-medium">GitHub:</span> <a href="https://${myInfo.contact.github}" target="_blank" class="text-indigo-600 ml-1">${myInfo.contact.github}</a>
  </div>
</div>`,
      specialContent: null,
    }
  }

  if (lowerQ.includes('hobbies') || lowerQ.includes('intereses') || lowerQ.includes('aficiones')) {
    return {
      role: 'assistant',
      content: `🎯 <strong>Hobbies e Intereses</strong>:
<br><br>
${myInfo.hobbies.map((h) => `• ${h.charAt(0).toUpperCase() + h.slice(1)}`).join('<br>')}
<br><br>
${
  myInfo.hobbies.some((h) => h.includes('programar'))
    ? '💻 <em>Además de programar profesionalmente, también lo disfruto como hobby personal.</em>'
    : ''
}`,
      specialContent: null,
    }
  }

  if (lowerQ.includes('idiomas') || lowerQ.includes('lenguajes') || lowerQ.includes('hablas')) {
    return {
      role: 'assistant',
      content: `🌍 <strong>Idiomas</strong>:
<br><br>
${myInfo.languages.map((lang) => `• ${lang}`).join('<br>')}
<br><br>
${
  myInfo.languages.some((l) => l.includes('Inglés'))
    ? '📚 <em>Actualmente sigo mejorando mi nivel de inglés mediante cursos y práctica constante.</em>'
    : ''
}`,
      specialContent: null,
    }
  }

  if (lowerQ.includes('ubicación') || lowerQ.includes('localización') || lowerQ.includes('vives')) {
    return {
      role: 'assistant',
      content: `📍 <strong>Ubicación</strong>:
<br><br>
Actualmente resido en: <strong>${myInfo.location}</strong>
<br><br>
${
  myInfo.location.includes('Tarragona')
    ? '🏖️ <em>Zona costera con buena conexión a Barcelona y comunidades tech emergentes.</em>'
    : ''
}`,
      specialContent: null,
    }
  }

  if (lowerQ.includes('hola') || lowerQ.includes('buenos') || lowerQ.includes('buenas')) {
    return {
      role: 'assistant',
      content: `👋 <strong>¡Hola!</strong> Soy el asistente de Marc Sancho, ${myInfo.role}.
<br><br>
Puedes preguntarme sobre:
<br><br>
• Mis <strong>habilidades técnicas</strong> 💻<br>
• <strong>Proyectos</strong> destacados 🚀<br>
• <strong>Experiencia</strong> profesional 🏢<br>
• <strong>Formación</strong> académica 📚<br>
• <strong>Idiomas</strong> que domino 🌍<br>
• Mis <strong>hobbies</strong> e intereses personales 🎯<br>
• Cómo <strong>contactarme</strong> 📬
<br><br>
¿En qué puedo ayudarte hoy?`,
      specialContent: null,
    }
  }

  if (
    lowerQ.includes('quién eres') ||
    lowerQ.includes('sobre ti') ||
    lowerQ.includes('presentación')
  ) {
    const devExperienceCount = myInfo.workExperience.filter((exp) =>
      exp.position.includes('Desarrollador'),
    ).length

    return {
      role: 'assistant',
      content: `👨‍💻 <strong>Sobre Marc Sancho</strong>:
<br><br>
<strong>${myInfo.role}</strong> especializado en ${myInfo.specialization}
<br><br>
📌 ${myInfo.age} años | ${myInfo.location}
<br><br>
💼 ${devExperienceCount} ${devExperienceCount === 1 ? 'experiencia' : 'experiencias'} relevante${devExperienceCount === 1 ? '' : 's'} en desarrollo
<br><br>
🎓 ${myInfo.education.map((e) => e.degree).join(' + ')}
<br><br>
🌍 ${myInfo.languages.length} idiomas dominados
<br><br>
¿Qué aspecto de mi perfil te gustaría conocer mejor?`,
      specialContent: null,
    }
  }

  return null
}

const sendMessage = async () => {
  try {
    if (!userInput.value.trim() || isLoading.value) return

    isLoading.value = true
    const currentMessage = userInput.value

    // Agregar mensaje del usuario
    messages.value.push({
      role: 'user',
      content: currentMessage,
    })
    userInput.value = ''

    // Manejar preguntas comunes primero
    const commonResponse = handleCommonQuestions(currentMessage)
    if (commonResponse) {
      messages.value.push(commonResponse)
      isLoading.value = false
      return
    }

    // Llamada a la API para otras preguntas
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mixtral-8x7b-instruct',
        messages: [
          {
            role: 'system',
            content: `Eres un asistente que responde preguntas sobre Marc Sancho. Responde de manera amable, profesional y visualmente atractiva usando markdown. Destaca información importante con negritas y usa emojis relevantes.`,
          },
          ...messages.value.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        ],
        temperature: 0.3,
        max_tokens: 350,
      },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.href,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      },
    )

    messages.value.push({
      role: 'assistant',
      content: response.data.choices[0].message.content.replace(
        /\*\*(.*?)\*\*/g,
        '<strong>$1</strong>',
      ),
    })
  } catch (error) {
    console.error('Error:', error)
    messages.value.push({
      role: 'assistant',
      content: `⚠️ Ocurrió un error al procesar tu pregunta.

Por favor, intenta de nuevo o formula tu pregunta de otra manera.`,
      isError: true,
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style>
.chat-history {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
}

.chat-history::-webkit-scrollbar {
  width: 6px;
}

.chat-history::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.chat-history::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

.chat-history::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}

.loading-spinner {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  border: 0.25rem solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Mejora para listas en las respuestas */
ul.list-disc li {
  margin-left: 1em;
  padding-left: 0.5em;
}
</style>
