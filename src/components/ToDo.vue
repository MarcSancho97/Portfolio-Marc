<template>
  <div class="h-screen bg-gradient-to-r from-blue-500 to-blue-950 text-white flex flex-col">
    <div class="max-w-6xl mx-auto w-full py-16 flex-1 overflow-y-auto p-1">
      <h1 class="text-3xl font-bold mb-6 text-center">To-Do List</h1>

      <!-- Add Task Form -->
      <form @submit.prevent="addTask" class="flex flex-col md:flex-row gap-2 mb-8">
        <input
          v-model="newTaskText"
          class="flex-1 p-3 rounded bg-white/10 focus:ring-2 focus:ring-blue-300"
          placeholder="New task…"
        />
        <select
          v-model="newTaskStatus"
          class="p-3 rounded bg-white/10 backdrop-blur text-white/80 focus:ring-2 focus:ring-blue-300"
        >
          <option value="" disabled selected>Selecciona un estado</option>
          <option value="pending" class="text-black">Pendiente</option>
          <option value="completed" class="text-black">Completado</option>
        </select>
        <button
          class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded transition focus:ring-2 focus:ring-blue-300"
        >
          Añadir
        </button>
      </form>

      <!-- Edit Alert -->
      <div
        v-if="showEditHint && !suppressEditHint"
        class="bg-yellow-500/80 border border-yellow-400 text-yellow-900 p-4 rounded mb-6 flex items-center justify-between"
      >
        <span>💡 Haz doble click en una tarea para editarla. </span>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" v-model="suppressEditHint" @change="onCheckboxChange" />
          No mostrar de nuevo
        </label>
      </div>

      <!-- Task Columns -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Pending Tasks -->
        <div
          class="bg-white/10 p-4 rounded-xl shadow backdrop-blur"
          @dragover.prevent
          @drop="(event) => handleDrop(event, 'pending')"
        >
          <h2 class="text-xl font-semibold mb-3">Pendientes</h2>
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
                'flex justify-between items-center bg-white/5 p-2 rounded cursor-move transition-all duration-200',
                dragOverTaskId === task.id
                  ? 'border-2 border-blue-400 scale-[1.02] bg-blue-400/20'
                  : 'border-2 border-transparent',
              ]"
            >
              <div class="flex items-center gap-3 flex-1">
                <span class="text-blue-200 font-bold w-6">
                  {{ index + 1 }}
                </span>

                <div class="flex-1">
                  <span
                    v-if="editingTaskId !== task.id"
                    @dblclick="startEditing(task)"
                    class="block cursor-pointer"
                  >
                    {{ task.text }}
                  </span>

                  <input
                    v-else
                    v-model="editedTaskText"
                    @keyup.enter="saveEdit(task)"
                    @blur="saveEdit(task)"
                    @keyup.esc="cancelEdit"
                    class="w-full p-1 rounded bg-white/20 text-white focus:outline-none"
                  />
                </div>
              </div>

              <button @click="deleteById(task.id)" class="text-red-300 hover:text-red-500 ml-2">
                ✖
              </button>
            </li>
          </ul>
        </div>

        <!-- Completed Tasks -->
        <div
          class="bg-white/10 p-4 rounded-xl shadow backdrop-blur"
          @dragover.prevent
          @drop="(event) => handleDrop(event, 'completed')"
        >
          <h2 class="text-xl font-semibold mb-3">Completadas</h2>
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
                'flex justify-between items-center bg-white/5 p-2 rounded backdrop-blur cursor-move transition-all duration-200',
                dragOverTaskId === task.id
                  ? 'border-2 border-blue-400 scale-[1.02] bg-blue-400/20'
                  : 'border-2 border-transparent',
              ]"
            >
              <div class="flex items-center gap-3 flex-1">
                <span class="text-white text-xs">
                  {{ index + 1 }}
                </span>

                <div class="flex-1">
                  <span
                    v-if="editingTaskId !== task.id"
                    @dblclick="startEditing(task)"
                    :class="{ 'line-through text-gray-300': task.completed }"
                    class="block cursor-pointer"
                  >
                    {{ task.text }}
                  </span>

                  <input
                    v-else
                    v-model="editedTaskText"
                    @keyup.enter="saveEdit(task)"
                    @blur="saveEdit(task)"
                    @keyup.esc="cancelEdit"
                    class="w-full p-1 rounded bg-white/20 text-white focus:outline-none"
                  />
                </div>
              </div>

              <button @click="deleteById(task.id)" class="text-red-300 hover:text-red-500 ml-2">
                ✖
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- All Tasks View -->
      <div class="bg-white/10 p-4 rounded-xl shadow backdrop-blur mt-4">
        <h2 class="text-xl font-semibold mb-3">Todas las tareas</h2>
        <ul class="space-y-2">
          <li
            v-for="(task, index) in taskList"
            :key="task.id"
            class="flex justify-between items-center bg-white/5 p-2 rounded backdrop-blur"
          >
            <div class="flex items-center gap-3 flex-1">
              <span class="text-white text-xs">
                {{ index + 1 }}
              </span>

              <div class="flex-1">
                <span
                  v-if="editingTaskId !== task.id"
                  @dblclick="startEditing(task)"
                  :class="{ 'line-through text-gray-300': task.completed }"
                  class="block cursor-pointer"
                >
                  {{ task.text }}
                </span>

                <input
                  v-else
                  v-model="editedTaskText"
                  @keyup.enter="saveEdit(task)"
                  @blur="saveEdit(task)"
                  @keyup.esc="cancelEdit"
                  class="w-full p-1 rounded bg-white/20 text-white focus:outline-none"
                />
              </div>
            </div>

            <button @click="deleteById(task.id)" class="text-red-300 hover:text-red-500 ml-2">
              ✖
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
  const index = taskList.value.findIndex((t) => t.id === id)
  if (index !== -1) {
    taskList.value.splice(index, 1)
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
