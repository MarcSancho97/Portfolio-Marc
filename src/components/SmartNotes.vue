<template>
  <!-- Banner integrado -->
  <AppBanner>
    <template #title>
      <h1>SmartNotes AI</h1>
    </template>
    <template #content>
      <p>Organiza tus ideas, edítalas y resúmelas al instante con inteligencia artificial.</p>
    </template>
  </AppBanner>
  <div class="min-h-screen bg-gray-900 text-white p-6">
    <div class="max-w-4xl mx-auto">
      <header class="mb-8 text-center">
        <h2 class="text-3xl font-bold tracking-tight">SmartNotes</h2>
      </header>

      <section class="bg-gray-800 p-6 rounded-xl shadow-lg mb-8 border border-gray-700">
        <h2 class="text-xl font-semibold mb-4 text-gray-200">Nueva Nota</h2>
        <form @submit.prevent="addNote" class="space-y-4">
          <div>
            <input
              v-model="newTitle"
              type="text"
              placeholder="Título de la nota..."
              required
              class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <textarea
              v-model="newContent"
              rows="3"
              placeholder="Escribe el contenido de tu nota aquí..."
              required
              class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
            ></textarea>
          </div>
          <button
            type="submit"
            class="bg-gray-700 hover:bg-gray-900 text-white font-medium px-5 py-2 rounded-lg transition duration-300"
          >
            Guardar Nota
          </button>
        </form>
      </section>

      <section>
        <h2 class="text-xl font-semibold mb-4 text-gray-200">Tus Notas</h2>

        <div
          v-if="notes.length === 0"
          class="text-gray-500 text-center py-8 bg-gray-800/50 rounded-xl border border-dashed border-gray-700"
        >
          No tienes notas guardadas todavía. ¡Crea la primera arriba!
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="(note, index) in notes"
            :key="index"
            class="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col justify-between shadow-md relative group"
          >
            <!-- MODO EDICIÓN -->
            <div v-if="editingIndex === index" class="space-y-3 mb-4">
              <input
                v-model="editTitle"
                type="text"
                class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-lg font-bold focus:outline-none focus:border-indigo-500"
              />
              <textarea
                v-model="editContent"
                rows="3"
                class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-indigo-500"
              ></textarea>
              <div class="flex space-x-2">
                <button
                  @click="updateNote(index)"
                  class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition"
                >
                  Guardar
                </button>
                <button
                  @click="cancelEdit"
                  class="bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-medium px-3 py-1.5 rounded-lg transition"
                >
                  Cancelar
                </button>
              </div>
            </div>

            <!-- MODO LECTURA -->
            <div v-else>
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-lg text-indigo-300">{{ note.title }}</h3>
                <div class="flex space-x-2 text-gray-500">
                  <button
                    @click="startEdit(index)"
                    class="hover:text-indigo-400 transition"
                    title="Editar nota"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    @click="deleteNote(index)"
                    class="hover:text-red-400 transition"
                    title="Eliminar nota"
                  >
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
              <p class="text-gray-300 text-sm whitespace-pre-line mb-4">{{ note.content }}</p>
            </div>

            <div class="mt-auto pt-3 border-t border-gray-700">
              <div
                v-if="note.aiSummary"
                class="bg-gray-900/80 p-3 rounded-lg text-xs text-emerald-300 mb-3 border border-emerald-900/50"
              >
                <span class="font-semibold block mb-1 text-emerald-400"
                  ><i class="fa-solid fa-wand-magic-sparkles"></i> Análisis / Explicación IA:</span
                >
                {{ note.aiSummary }}
              </div>

              <button
                @click="summarizeNote(index)"
                :disabled="note.loading"
                class="w-full bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-medium py-2 px-3 rounded-lg transition flex items-center justify-center space-x-2"
              >
                <i v-if="note.loading" class="fa-solid fa-spinner animate-spin"></i>
                <i v-else class="fa-solid fa-brain"></i>
                <span>{{ note.loading ? 'Analizando nota...' : 'Resumir / Explicar con IA' }}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import AppBanner from './AppBanner.vue'

const API_URL = 'https://portfolio-marc-zeta.vercel.app/api/chat'

const newTitle = ref('')
const newContent = ref('')
const notes = ref([])

const editingIndex = ref(null)
const editTitle = ref('')
const editContent = ref('')

onMounted(() => {
  const savedNotes = localStorage.getItem('smart_notes')
  if (savedNotes) {
    try {
      notes.value = JSON.parse(savedNotes)
    } catch (e) {
      console.error('Error al cargar notas:', e)
    }
  }
})

const saveToLocalStorage = () => {
  localStorage.setItem('smart_notes', JSON.stringify(notes.value))
}

const addNote = () => {
  if (!newTitle.value.trim() || !newContent.value.trim()) return

  notes.value.unshift({
    title: newTitle.value,
    content: newContent.value,
    aiSummary: null,
    loading: false,
  })

  newTitle.value = ''
  newContent.value = ''
  saveToLocalStorage()
}

const deleteNote = (index) => {
  const note = notes.value[index]
  const noteTitle = note ? ` "${note.title}"` : ''

  if (window.confirm(`¿Estás seguro de que deseas eliminar la nota${noteTitle}?`)) {
    if (editingIndex.value === index) {
      cancelEdit()
    } else if (editingIndex.value > index) {
      editingIndex.value--
    }
    notes.value.splice(index, 1)
    saveToLocalStorage()
  }
}

const startEdit = (index) => {
  editingIndex.value = index
  editTitle.value = notes.value[index].title
  editContent.value = notes.value[index].content
}

const cancelEdit = () => {
  editingIndex.value = null
  editTitle.value = ''
  editContent.value = ''
}

const updateNote = (index) => {
  if (!editTitle.value.trim() || !editContent.value.trim()) return

  notes.value[index].title = editTitle.value
  notes.value[index].content = editContent.value

  saveToLocalStorage()
  cancelEdit()
}

const summarizeNote = async (index) => {
  const note = notes.value[index]
  note.loading = true

  try {
    const history = [
      {
        role: 'system',
        content:
          'Eres un asistente útil y analítico. Si la nota es larga o tiene suficiente texto, genérale un resumen conciso en un párrafo corto o viñetas. Si la nota es muy corta, abstracta o no se puede resumir formalmente, provee una explicación, contexto, interpretación o ampliación útil sobre lo que ha escrito el usuario.',
      },
      {
        role: 'user',
        content: `Analiza y resume o explica la siguiente nota: Título: ${note.title}\nContenido: ${note.content}`,
      },
    ]

    const response = await axios.post(API_URL, { history }, { timeout: 60000 })
    const aiResponse = response?.data?.content

    if (!aiResponse) {
      throw new Error('Respuesta vacía')
    }

    note.aiSummary = aiResponse
    saveToLocalStorage()
  } catch (error) {
    console.error('Error al conectar con la API de IA:', error)
    alert('⚠️ Error conectando con el asistente para procesar la nota.')
  } finally {
    note.loading = false
  }
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css');
</style>
