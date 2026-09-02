<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col p-6">
    <div class="max-w-4xl mx-auto w-full flex-1 overflow-y-auto">
      <header class="mb-8 text-center">
        <h1 class="text-3xl font-bold tracking-tight">To-Do List</h1>
        <p class="text-gray-400 text-sm mt-1">
          Gestiona tus tareas diarias de forma rápida y organizada
        </p>
      </header>

      <section
        class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/10 mb-8"
      >
        <h2 class="text-xl font-semibold mb-4 text-gray-200">Nueva Tarea</h2>
        <form @submit.prevent="addTask" class="flex flex-col md:flex-row gap-3">
          <input
            v-model="newTaskText"
            class="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
            placeholder="Escribe una nueva tarea..."
            required
          />
          <select
            v-model="newTaskStatus"
            class="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="" disabled selected>Selecciona un estado</option>
            <option value="pending" class="bg-gray-900 text-white">Pendiente</option>
            <option value="completed" class="bg-gray-900 text-white">Completado</option>
          </select>
          <button
            type="submit"
            class="inline-block bg-gray-800 text-gray-200 border border-gray-700 px-5 py-3 font-semibold rounded-xl hover:bg-gray-900 text-white transition-all duration-200 text-center shadow-md"
          >
            Añadir
          </button>
        </form>
      </section>

      <div
        v-if="showEditHint && !suppressEditHint"
        class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/10"
      >
        <span
          >💡 <strong>Tip:</strong> Haz doble clic en cualquier tarea para editarla
          directamente.</span
        >
        <label
          class="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white transition"
        >
          <input
            type="checkbox"
            v-model="suppressEditHint"
            @change="onCheckboxChange"
            class="rounded bg-gray-900 border-gray-700 text-indigo-600 focus:ring-indigo-500"
          />
          No mostrar de nuevo
        </label>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div
          class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/10"
          @dragover.prevent
          @drop="(event) => handleDrop(event, 'pending')"
        >
          <h2 class="text-lg font-semibold mb-3 text-indigo-300 flex items-center gap-2">
            <i class="fa-solid fa-clock text-indigo-400"></i> Pendientes
          </h2>
          <ul class="space-y-2">
            <li
              v-for="(task, index) in pendingTasks"
              :key="task.id"
              draggable="true"
              @dragstart="handleDragStart($event, task.id)"
              @dragover.prevent="dragOverTaskId = task.id"
              @dragleave="dragOverTaskId = null"
              @drop="handleReorderDrop($event, task.id, false)"
              :class="[
                'flex justify-between items-center bg-gray-900/60 border p-3 rounded-lg cursor-move transition-all duration-200',
                dragOverTaskId === task.id
                  ? 'border-indigo-400 scale-[1.02] bg-indigo-950/40'
                  : 'border-gray-700/60 hover:border-gray-600',
              ]"
            >
              <div class="flex items-center gap-3 flex-1">
                <span class="text-indigo-400 font-bold text-sm w-5"> {{ index + 1 }}. </span>
                <div class="flex-1">
                  <span
                    v-if="editingTaskId !== task.id"
                    @dblclick="startEditing(task)"
                    class="block cursor-pointer text-gray-200 text-sm"
                  >
                    {{ task.text }}
                  </span>
                  <input
                    v-else
                    v-model="editedTaskText"
                    @keyup.enter="saveEdit(task)"
                    @blur="saveEdit(task)"
                    @keyup.esc="cancelEdit"
                    class="w-full bg-gray-900 border border-indigo-500 rounded px-2 py-1 text-white text-sm focus:outline-none"
                    autofocus
                  />
                </div>
              </div>
              <button
                @click="deleteById(task.id)"
                class="text-gray-500 hover:text-red-400 transition ml-2 p-1"
                title="Eliminar tarea"
              >
                <i class="fa-solid fa-trash-can text-xs"></i>
              </button>
            </li>
          </ul>
        </div>

        <div
          class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/10"
          @dragover.prevent
          @drop="(event) => handleDrop(event, 'completed')"
        >
          <h2 class="text-lg font-semibold mb-3 text-emerald-300 flex items-center gap-2">
            <i class="fa-solid fa-circle-check text-emerald-400"></i> Completadas
          </h2>
          <ul class="space-y-2">
            <li
              v-for="(task, index) in completedTasks"
              :key="task.id"
              draggable="true"
              @dragstart="handleDragStart($event, task.id)"
              @dragover.prevent="dragOverTaskId = task.id"
              @dragleave="dragOverTaskId = null"
              @drop="handleReorderDrop($event, task.id, task.completed)"
              :class="[
                'flex justify-between items-center bg-gray-900/60 border p-3 rounded-lg cursor-move transition-all duration-200',
                dragOverTaskId === task.id
                  ? 'border-emerald-400 scale-[1.02] bg-emerald-950/40'
                  : 'border-gray-700/60 hover:border-gray-600',
              ]"
            >
              <div class="flex items-center gap-3 flex-1">
                <span class="text-emerald-400 font-bold text-xs w-5"> {{ index + 1 }}. </span>
                <div class="flex-1">
                  <span
                    v-if="editingTaskId !== task.id"
                    @dblclick="startEditing(task)"
                    :class="{ 'line-through text-gray-500': task.completed }"
                    class="block cursor-pointer text-gray-300 text-sm"
                  >
                    {{ task.text }}
                  </span>
                  <input
                    v-else
                    v-model="editedTaskText"
                    @keyup.enter="saveEdit(task)"
                    @blur="saveEdit(task)"
                    @keyup.esc="cancelEdit"
                    class="w-full bg-gray-900 border border-emerald-500 rounded px-2 py-1 text-white text-sm focus:outline-none"
                    autofocus
                  />
                </div>
              </div>
              <button
                @click="deleteById(task.id)"
                class="text-gray-500 hover:text-red-400 transition ml-2 p-1"
                title="Eliminar tarea"
              >
                <i class="fa-solid fa-trash-can text-xs"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/10">
        <h2 class="text-lg font-semibold mb-3 text-gray-200 flex items-center gap-2">
          <i class="fa-solid fa-list-check text-gray-400"></i> Todas las tareas
        </h2>
        <ul class="space-y-2">
          <li
            v-for="(task, index) in taskList"
            :key="task.id"
            class="flex justify-between items-center bg-gray-900/60 border border-gray-700/60 p-3 rounded-lg transition"
          >
            <div class="flex items-center gap-3 flex-1">
              <span class="text-gray-400 font-bold text-xs w-5"> {{ index + 1 }}. </span>
              <div class="flex-1">
                <span
                  v-if="editingTaskId !== task.id"
                  @dblclick="startEditing(task)"
                  :class="{ 'line-through text-gray-500': task.completed }"
                  class="block cursor-pointer text-gray-300 text-sm"
                >
                  {{ task.text }}
                </span>
                <input
                  v-else
                  v-model="editedTaskText"
                  @keyup.enter="saveEdit(task)"
                  @blur="saveEdit(task)"
                  @keyup.esc="cancelEdit"
                  class="w-full bg-gray-900 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none"
                  autofocus
                />
              </div>
            </div>
            <button
              @click="deleteById(task.id)"
              class="text-gray-500 hover:text-red-400 transition ml-2 p-1"
              title="Eliminar tarea"
            >
              <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const taskList = ref([])
const editingTaskId = ref(null)
const editedTaskText = ref('')
const showEditHint = ref(true)
const suppressEditHint = ref(false)
const newTaskText = ref('')
const newTaskStatus = ref('pending')
const dragOverTaskId = ref(null)

onMounted(() => {
  const savedTasks = localStorage.getItem('tasks')

  if (savedTasks) {
    taskList.value = JSON.parse(savedTasks)
  }

  const hideHint = localStorage.getItem('hideEditHint')

  if (hideHint === 'true') {
    suppressEditHint.value = true
    showEditHint.value = false
  } else {
    showEditHint.value = true
  }
})

watch(
  taskList,
  (newTaskList) => {
    localStorage.setItem('tasks', JSON.stringify(newTaskList))
  },
  { deep: true },
)

function handleReorderDrop(event, targetId, completedStatus) {
  const draggedId = Number(event.dataTransfer.getData('text/plain'))

  if (draggedId === targetId) return

  const draggedTask = taskList.value.find((t) => t.id === draggedId)
  const targetTask = taskList.value.find((t) => t.id === targetId)

  if (!draggedTask || !targetTask) return

  draggedTask.completed = completedStatus

  const draggedIndex = taskList.value.findIndex((t) => t.id === draggedId)
  const targetIndex = taskList.value.findIndex((t) => t.id === targetId)

  const [removed] = taskList.value.splice(draggedIndex, 1)

  taskList.value.splice(targetIndex, 0, removed)

  dragOverTaskId.value = null
}

function deleteById(id) {
  const task = taskList.value.find((t) => t.id === id)
  const taskName = task ? ` "${task.text}"` : ''

  if (window.confirm(`¿Estás seguro de que deseas eliminar la tarea${taskName}?`)) {
    const index = taskList.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      taskList.value.splice(index, 1)
    }
  }
}

const pendingTasks = computed(() => taskList.value.filter((t) => !t.completed))
const completedTasks = computed(() => taskList.value.filter((t) => t.completed))

function startEditing(task) {
  editingTaskId.value = task.id
  editedTaskText.value = task.text
}

function saveEdit(task) {
  if (editedTaskText.value.trim()) {
    task.text = editedTaskText.value.trim()
  }
  editingTaskId.value = null
}

function cancelEdit() {
  editingTaskId.value = null
}

function onCheckboxChange() {
  if (suppressEditHint.value) {
    showEditHint.value = false
    localStorage.setItem('hideEditHint', 'true')
  } else {
    showEditHint.value = true
    localStorage.removeItem('hideEditHint')
  }
}

function addTask() {
  const text = newTaskText.value.trim()
  if (!text) return

  taskList.value.push({
    id: Date.now(),
    text,
    completed: newTaskStatus.value === 'completed',
  })

  newTaskText.value = ''
  newTaskStatus.value = 'pending'

  if (!suppressEditHint.value) {
    showEditHint.value = true
  }
}

function handleDragStart(event, id) {
  event.dataTransfer.setData('text/plain', String(id))
}

function handleDrop(event, targetStatus) {
  const id = Number(event.dataTransfer.getData('text/plain'))
  const task = taskList.value.find((t) => t.id === id)
  if (task) {
    task.completed = targetStatus === 'completed'
  }
}
</script>
