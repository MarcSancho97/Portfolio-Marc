<template>
  <header>
    <!-- Navbar Principal -->
    <nav class="hidden md:flex space-x-2 bg-gradient-to-r from-blue-600 to-blue-950 shadow-lg py-2">
      <div class="container mx-auto flex justify-end items-center max-w-6xl py-1">
        <!-- Menú en pantallas grandes (a partir de tablet) -->
        <div class="">
          <router-link
            to="/"
            class="text-white px-4 py-2 rounded transition duration-300 hover:bg-blue-700"
            >Inicio</router-link
          >
          <router-link
            to="/projects"
            class="text-white px-4 py-2 rounded transition duration-300 hover:bg-blue-700"
            >Proyectos</router-link
          >
          <router-link
            to="/contact"
            class="text-white px-4 py-2 rounded transition duration-300 hover:bg-blue-700"
            >Contacto</router-link
          >
        </div>
      </div>
    </nav>

    <!-- Botón Hamburguesa con Imagen Personalizada -->
    <button
      @click="toggleMenu"
      class="border-2 fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-full shadow-lg z-50 md:hidden"
    >
      <img src="@/assets/images/icons/burger-bar.png" alt="Menú" class="w-10 h-10" />
    </button>

    <!-- Menú Desplegable -->
    <div
      v-if="isMenuOpen"
      class="fixed bottom-16 left-1/2 transform -translate-x-1/2 w-64 bg-white text-gray-900 rounded-lg shadow-lg p-4 z-50 md:hidden"
    >
      <ul class="space-y-4 text-center">
        <li>
          <router-link to="/" class="block" @click="toggleMenu"> Inicio </router-link>
        </li>
        <li>
          <router-link to="/projects" class="block" @click="toggleMenu"> Proyectos </router-link>
        </li>
        <li>
          <router-link to="/contact" class="block" @click="toggleMenu"> Contacto </router-link>
        </li>
      </ul>
      <button @click="toggleMenu" class="mt-4 w-full bg-blue-800 text-white py-2 rounded-lg">
        X
      </button>
    </div>

    <!-- Fondo Oscuro al Abrir el Menú (No en pantallas mayores a mobile) -->
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
