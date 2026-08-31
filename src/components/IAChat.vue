<template>
  <AppBanner>
    <template #title>
      <h1 class="text-6xl font-bold">Chatea con mi asistente</h1>
    </template>
    <template #content>
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
        class="h-[500px] overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white/95 to-blue-50/50 chat-history"
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
          <div class="prose prose-sm max-w-none" v-html="parseMarkdown(message.content)"></div>
          <!-- Hora del mensaje -->
          <p class="text-xs mt-1 opacity-70 text-right">
            {{
              message.time?.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            }}
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
            :disabled="isLoading"
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
import { ref, computed, onMounted, nextTick } from 'vue'
import axios from 'axios'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import AppBanner from './AppBanner.vue'

/* ---------------- CONFIG ---------------- */

const API_URL = 'https://portfolio-marc-zeta.vercel.app/api/chat'

/* ---------------- STATE ---------------- */
const userInput = ref('')
const isLoading = ref(false)
const messages = ref([])

/* ---------------- SEND MESSAGE ---------------- */

const sendMessage = async () => {
  if (isLoading.value) return

  const message = userInput.value.trim()
  if (!message) return

  isLoading.value = true

  try {
    await addMessage({
      role: 'user',
      content: message,
    })

    userInput.value = ''

    const history = messages.value
      .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-10)
      .map((m) => ({
        role: m.role,
        content: m.content,
      }))

    /* Petición al backend en Vercel */
    const response = await axios.post(API_URL, { history }, { timeout: 60000 })
    const aiResponse = response?.data?.content

    if (!aiResponse) {
      throw new Error('Respuesta vacía')
    }

    await addMessage({
      role: 'assistant',
      content: aiResponse,
    })
  } catch (error) {
    console.error(error)

    await addMessage({
      role: 'assistant',
      content: '⚠️ Error conectando con el asistente.',
      isError: true,
    })
  } finally {
    isLoading.value = false
  }
}

/* ---------------- MARKDOWN ---------------- */

const parseMarkdown = (text) => {
  if (!text) return ''

  return DOMPurify.sanitize(marked.parse(text))
}

/* ---------------- SCROLL ---------------- */

const scrollToBottom = async () => {
  await nextTick()

  const container = document.querySelector('.chat-history')

  if (container) {
    container.scrollTop = container.scrollHeight
  }
}

/* ---------------- ADD MESSAGE ---------------- */

const addMessage = async (message) => {
  messages.value.push({
    ...message,
    time: new Date(),
  })

  await scrollToBottom()
}

/* ---------------- QUICK SUGGESTIONS ---------------- */

const quickSuggestions = computed(() => [
  '¿Qué tecnologías dominas?',
  'Cuéntame sobre tus proyectos',
  '¿Dónde has trabajado?',
  '¿Qué estudiaste?',
  '¿Cómo contactarte?',
])

const handleQuickSuggestion = async (suggestion) => {
  if (isLoading.value) return

  userInput.value = suggestion

  await sendMessage()
}

/* ---------------- INIT ---------------- */

onMounted(async () => {
  await addMessage({
    role: 'assistant',
    content: `
# 👋 Hola

Soy el asistente virtual de Marc.

¿En qué puedo ayudarte?
`,
  })
})
</script>

<style scoped>
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

:deep(.list-disc li) {
  margin-left: 1em;
  padding-left: 0.5em;
}

:deep(.prose) {
  max-width: none;
}

:deep(.inline-flex) {
  display: inline-flex;
}

:deep(.prose a) {
  color: #2563eb;
  font-weight: 650;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s ease;
}

:deep(.prose a:hover) {
  color: #1d4ed8;
  text-decoration-thickness: 2px;
}
/* --- ANIMACIÓN DE APARICIÓN PARA LOS MENSAJES --- */
:deep(.chat-history > div) {
  animation: fadeInMessage 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInMessage {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* --- ESTILO MEJORADO PARA LOS ENLACES --- */
:deep(.prose a) {
  color: #2563eb;
  font-weight: 650;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

:deep(.prose a:hover) {
  color: #1d4ed8;
  background-color: rgba(37, 99, 235, 0.05);
  padding-left: 2px;
  padding-right: 2px;
  border-radius: 4px;
}
</style>
