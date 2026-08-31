<template>
  <header>
    <nav
      class="hidden md:flex space-x-2 bg-gray-700 text-white shadow-lg py-2 border-b border-gray-700"
    >
      <div class="container mx-auto flex justify-end items-center max-w-6xl py-1">
        <div>
          <router-link
            to="/"
            class="text-gray-300 px-4 py-2 rounded transition duration-300 hover:bg-gray-900 text-white"
            >Inicio</router-link
          >
          <router-link
            to="/projects"
            class="text-gray-300 px-4 py-2 rounded transition duration-300 hover:bg-gray-900 text-white"
            >Proyectos</router-link
          >
          <router-link
            to="/contact"
            class="text-gray-300 px-4 py-2 rounded transition duration-300 hover:bg-gray-900 text-white"
            >Contacto</router-link
          >
        </div>
      </div>
    </nav>

    <button
      @click="toggleMenu"
      class="border border-gray-700 fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 p-4 rounded-full shadow-lg z-50 md:hidden"
    >
      <img src="@/assets/images/icons/burger-bar.png" alt="Menú" class="w-10 h-10 filter invert" />
    </button>

    <div
      v-if="isMenuOpen"
      class="fixed bottom-16 left-1/2 transform -translate-x-1/2 w-64 bg-gray-800 text-white border border-gray-700 rounded-lg shadow-lg p-4 z-50 md:hidden"
    >
      <ul class="space-y-4 text-center">
        <li>
          <router-link to="/" class="block text-gray-300 hover:text-white" @click="toggleMenu">
            Inicio
          </router-link>
        </li>
        <li>
          <router-link
            to="/projects"
            class="block text-gray-300 hover:text-white"
            @click="toggleMenu"
          >
            Proyectos
          </router-link>
        </li>
        <li>
          <router-link
            to="/contact"
            class="block text-gray-300 hover:text-white"
            @click="toggleMenu"
          >
            Contacto
          </router-link>
        </li>
      </ul>
      <button
        @click="toggleMenu"
        class="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
      >
        X
      </button>
    </div>

    <div
      v-if="isMenuOpen"
      @click="toggleMenu"
      class="fixed inset-0 bg-black opacity-50 z-40 hidden md:hidden"
    ></div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>
