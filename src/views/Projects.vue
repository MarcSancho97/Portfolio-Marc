<template>
  <!-- Banner principal -->
  <AppBanner>
    <template v-slot:title>
      <h1 class="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight">Proyectos</h1>
    </template>

    <template v-slot:content>
      <p class="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl italic opacity-90">
        Aquí podrás ver algunos de mis proyectos.
      </p>
    </template>
  </AppBanner>

  <!-- Sección de proyectos -->
  <section class="bg-gradient-to-r from-blue-500 to-blue-950 py-14 sm:py-16 md:py-20 text-white">
    <div class="max-w-6xl mx-auto px-6 sm:px-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        <div
          v-for="project in projects"
          :key="project.id"
          class="bg-white/10 p-6 sm:p-8 rounded-2xl hover:scale-[1.03] transition-transform duration-300 flex flex-col items-center text-center shadow-lg"
        >
          <!-- Imagen del proyecto -->
          <img
            :src="project.image"
            alt="Imagen del proyecto"
            class="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-4 object-contain"
            loading="lazy"
          />

          <!-- Contenido -->
          <h2 class="text-xl sm:text-2xl md:text-3xl font-semibold pt-2 sm:pt-4 mb-4 leading-snug">
            {{ project.title }}
          </h2>

          <p class="text-base sm:text-lg md:text-xl opacity-90 leading-relaxed mb-6">
            {{ project.description }}
          </p>

          <!-- Botón -->
          <div>
            <div v-if="isInternalLink(project.link)">
              <router-link
                :to="project.link"
                class="inline-block bg-white text-gray-900 px-5 py-2.5 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                Ver proyecto
              </router-link>
            </div>
            <div v-else>
              <a
                :href="project.link"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-block bg-white text-gray-900 px-5 py-2.5 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                Ver proyecto
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
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
            'Aplicación para gestionar tareas diarias con opciones de agregar, editar, marcar como completadas y eliminar tareas. Desarrollada con Vue y localStorage.',
          image: new URL('@/assets/images/images_projects/todoList.png', import.meta.url).href,
          link: '/ToDo', // Ruta interna
        },
        {
          id: 2,
          title: 'Asistente Virtual Personalizado',
          description:
            'Aplicación de chat impulsada por IA que responde preguntas sobre el perfil, experiencia y habilidades de Marc. Desarrollada con Vue y OpenRouter',
          image: new URL('@/assets/images/images_projects/iachat.png', import.meta.url).href,
          link: '/IAChat',
        },
        {
          id: 3,
          title: 'Portfolio en línea',
          description: 'Sitio web personal desplegado.',
          image: '',
          link: '',
        },
      ],
    }
  },
  methods: {
    isInternalLink(link) {
      // Devuelve true si el enlace NO empieza con http o https
      return typeof link === 'string' && !/^https?:\/\//.test(link)
    },
  },
}
</script>
