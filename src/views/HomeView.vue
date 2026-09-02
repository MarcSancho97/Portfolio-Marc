<template>
  <div>
    <AppBanner>
      <template v-slot:title>
        <h1>Bienvenido a mi Portfolio</h1>
      </template>

      <template v-slot:content>
        <p>Aquí podrás conocer más sobre mis habilidades y proyectos.</p>
      </template>
    </AppBanner>

    <SkillsSection />

    <section class="bg-gray-900 text-white py-14 sm:py-16 relative border-t border-gray-800">
      <div
        class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"
      ></div>

      <div
        class="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-around gap-12"
      >
        <div
          v-for="(section, index) in sections"
          :key="index"
          class="bg-white/10 p-6 rounded-xl hover:scale-105 transition-transform flex flex-col items-center text-center"
        >
          <router-link :to="section.route" class="block w-full">
            <img
              :src="section.image"
              :alt="section.alt"
              class="rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg border border-gray-800"
            />
          </router-link>

          <div class="w-full mt-6">
            <h3
              class="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 sm:mb-4 pt-2 w-full min-h-[3rem] sm:min-h-[3.5rem] md:min-h-[4rem]"
            >
              {{ section.title }}
            </h3>

            <p
              class="mb-4 italic text-sm sm:text-base md:text-lg max-w-xs mx-auto text-gray-400 leading-relaxed"
            >
              {{ section.description }}
            </p>

            <router-link
              :to="section.route"
              class="w-full inline-block bg-gray-800 text-gray-200 border border-gray-700 px-5 py-3 font-semibold rounded-xl hover:bg-gray-900 text-white transition-all duration-200 text-center shadow-md"
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
