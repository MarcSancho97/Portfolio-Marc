<template>
  <div>
    <!-- Banner principal -->
    <AppBanner>
      <template v-slot:title>
        <h1 class="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight">
          Bienvenido a mi Portfolio
        </h1>
      </template>

      <template v-slot:content>
        <p class="mt-3 sm:mt-4 text-sm sm:text-lg md:text-xl italic opacity-90">
          Aquí podrás conocer más sobre mis habilidades y proyectos.
        </p>
      </template>
    </AppBanner>

    <!-- Sección de habilidades -->
    <SkillsSection />

    <!-- Sección de proyectos u otras secciones -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-950 text-white py-14 sm:py-16">
      <div
        class="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-around gap-12"
      >
        <div
          v-for="(section, index) in sections"
          :key="index"
          class="flex flex-col items-center text-center w-full"
        >
          <!-- Imagen -->
          <router-link :to="section.route" class="block w-full">
            <img
              :src="section.image"
              :alt="section.alt"
              class="rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg"
            />
          </router-link>

          <!-- Contenido -->
          <div class="w-full mt-6">
            <!-- Título con altura fija para uniformidad -->
            <h3
              class="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 sm:mb-4 pt-2 w-full min-h-[3rem] sm:min-h-[3.5rem] md:min-h-[4rem]"
            >
              {{ section.title }}
            </h3>

            <!-- Descripción ligeramente más pequeña y uniforme -->
            <p
              class="mb-4 italic text-sm sm:text-base md:text-lg max-w-xs mx-auto opacity-90 leading-relaxed"
            >
              {{ section.description }}
            </p>

            <!-- Botón -->
            <router-link
              :to="section.route"
              class="bg-white text-gray-900 px-4 py-2 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200 inline-block"
            >
              Ver más
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import AppBanner from '@/components/AppBanner.vue'
import SkillsSection from '@/components/SkillsSection.vue'
import projectImg from '@/assets/images/projects.png'
import contactImg from '@/assets/images/contact.jpg'

const sections = [
  {
    title: 'Proyectos',
    description: 'Explora mis proyectos y trabajos.',
    image: projectImg,
    alt: 'image_projects',
    route: '/projects',
  },
  {
    title: 'Contacto',
    description: 'Aquí están mis datos de contacto.',
    image: contactImg,
    alt: 'image_contact',
    route: '/contact',
  },
]
</script>
