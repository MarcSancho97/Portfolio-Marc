<template>
  <div>
    <AppBanner>
      <template v-slot:title>
        <h1>Proyectos</h1>
      </template>

      <template v-slot:content>
        <p>Aquí podrás ver algunos de mis proyectos.</p>
      </template>
    </AppBanner>

    <section class="bg-gray-900 py-14 sm:py-16 md:py-20 text-white border-t border-gray-900">
      <div class="max-w-6xl mx-auto px-6 sm:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          <div
            v-for="project in projects"
            :key="project.id"
            class="bg-white/10 p-6 sm:p-8 rounded-2xl border border-gray-800 hover:border-gray-700 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center shadow-xl group"
          >
            <div
              v-if="project.image"
              class="mb-6 p-3 rounded-xl group-hover:scale-105 transition-transform duration-300"
            >
              <img
                :src="project.image"
                alt="Imagen del proyecto"
                class="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain"
                loading="lazy"
              />
            </div>

            <h2
              class="text-xl sm:text-2xl md:text-3xl font-semibold pt-2 sm:pt-4 mb-4 text-gray-100 leading-snug"
            >
              {{ project.title }}
            </h2>

            <p
              class="text-sm sm:text-base md:text-lg text-gray-400 whitespace-pre-line leading-relaxed mb-6 flex-grow"
            >
              {{ project.description }}
            </p>

            <div class="w-full mt-auto" v-if="project.link">
              <component
                :is="isInternalLink(project.link) ? 'router-link' : 'a'"
                :to="isInternalLink(project.link) ? project.link : undefined"
                :href="!isInternalLink(project.link) ? project.link : undefined"
                :target="!isInternalLink(project.link) ? '_blank' : undefined"
                :rel="!isInternalLink(project.link) ? 'noopener noreferrer' : undefined"
                class="w-full inline-block bg-gray-800 text-gray-200 border border-gray-700 px-5 py-3 font-semibold rounded-xl hover:bg-gray-900 text-white transition-all duration-200 text-center shadow-md"
              >
                Ver proyecto
              </component>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import AppBanner from '@/components/AppBanner.vue'

export default {
  name: 'ProjectsView',
  components: {
    AppBanner,
  },
  data() {
    return {
      projects: [
        {
          id: 1,
          title: 'To-Do List',
          description:
            'Aplicación para gestionar tareas diarias con opciones de agregar, editar, marcar como completadas y eliminar tareas. \n \n Desarrollada con Vue.',
          image: new URL('@/assets/images/images_projects/todoList.png', import.meta.url).href,
          link: '/ToDo',
        },
        {
          id: 2,
          title: 'Asistente IA',
          description:
            'Aplicación de chat impulsada por IA que responde preguntas sobre el perfil, experiencia y habilidades de Marc.  \n \n Desarrollada con Vue y OpenRouter.',
          image: new URL('@/assets/images/images_projects/iachat.png', import.meta.url).href,
          link: '/IAChat',
        },
        {
          id: 3,
          title: 'SmartNotes IA',
          description:
            'Notas locales potenciadas con inteligencia artificial para organizar ideas, editarlas y resumirlas al instante. \n \n  Desarrollada con Vue y OpenRouter.',
          image: new URL('@/assets/images/images_projects/smartnotes.png', import.meta.url).href,
          link: '/SmartNotes',
        },
      ],
    }
  },
  methods: {
    isInternalLink(link) {
      return typeof link === 'string' && !/^https?:\/\//.test(link)
    },
  },
}
</script>
