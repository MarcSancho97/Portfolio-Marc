<template>
  <div>
    <!-- Banner -->
    <AppBanner>
      <template v-slot:title>
        <h1 class="text-5xl font-bold">Contacto</h1>
      </template>
      <template v-slot:content>
        <p class="mt-4 italic">¿Quieres contactarme? Aquí te dejo mis datos.</p>
      </template>
    </AppBanner>

    <!-- Sección de contacto -->
    <section class="bg-gradient-to-r from-blue-500 to-blue-950 py-16 text-white">
      <div
        class="max-w-5xl mx-auto bg-white/10 p-12 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
      >
        <!-- Datos de contacto -->
        <div class="space-y-6">
          <h2 class="text-3xl font-semibold mb-4">Datos de contacto</h2>
          <div class="space-y-6 text-lg">
            <!-- GitHub -->
            <div
              class="flex items-center gap-4 bg-white/10 rounded-xl p-4 hover:bg-white/20 transition"
            >
              <div class="bg-white/20 rounded-full p-3 flex items-center justify-center">
                <i class="fa-brands fa-github text-2xl text-white"></i>
              </div>
              <div class="flex-1">
                <a
                  href="https://github.com/marcsancho97"
                  target="_blank"
                  class="block font-medium hover:underline"
                >
                  github.com/marcsancho97
                </a>
              </div>
            </div>

            <!-- LinkedIn -->
            <div
              class="flex items-center gap-4 bg-white/10 rounded-xl p-4 hover:bg-white/20 transition"
            >
              <div class="bg-white/20 rounded-full p-3 flex items-center justify-center">
                <i class="fa-brands fa-linkedin text-2xl text-white"></i>
              </div>
              <div class="flex-1">
                <a
                  href="https://www.linkedin.com/in/marc-sancho-garcia-98a317274/"
                  target="_blank"
                  class="block font-medium hover:underline"
                >
                  linkedin.com/in/marc-sancho-garcia
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulario -->
        <div>
          <h2 class="text-3xl font-semibold mb-6">Formulario de contacto</h2>

          <form @submit.prevent="submitForm" class="space-y-4">
            <input
              v-model="name"
              type="text"
              placeholder="Tu nombre"
              class="w-full p-3 border border-white rounded-md bg-transparent placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
              required
              :disabled="isSubmitting"
            />
            <input
              v-model="email"
              type="email"
              placeholder="Tu correo electrónico"
              class="w-full p-3 border border-white rounded-md bg-transparent placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
              required
              :disabled="isSubmitting"
            />
            <textarea
              v-model="message"
              rows="5"
              placeholder="Tu mensaje"
              class="w-full p-3 border border-white rounded-md bg-transparent placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
              required
              :disabled="isSubmitting"
            ></textarea>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full bg-white text-blue-900 px-4 py-3 font-semibold rounded-md hover:bg-gray-200 transition shadow-lg disabled:opacity-70"
            >
              {{ isSubmitting ? 'Enviando...' : 'Enviar mensaje' }}
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import AppBanner from '@/components/AppBanner.vue'

export default {
  name: 'ContactView',
  components: {
    AppBanner,
  },
  data() {
    return {
      name: '',
      email: '',
      message: '',
      isSubmitting: false, // Controla el estado del botón
    }
  },
  methods: {
    async submitForm() {
      this.isSubmitting = true

      try {
        // Hacemos la petición POST a FormSubmit en modo AJAX
        const response = await fetch(
          'https://formsubmit.co/ajax/2daa486a923c7fe320d879d615c7c350',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              _subject: `¡Nuevo mensaje de ${this.name} en tu Portfolio!`,
              Nombre: this.name,
              Email: this.email,
              Mensaje: this.message,
            }),
          },
        )

        if (response.ok) {
          alert('¡Gracias por tu mensaje! Te responderé lo antes posible ✉️')
          // Limpiamos el formulario
          this.name = ''
          this.email = ''
          this.message = ''
        } else {
          alert('Hubo un problema al enviar el mensaje. Por favor, inténtalo de nuevo.')
        }
      } catch (error) {
        console.error(error)
        alert('Error de conexión. Revisa tu internet e inténtalo de nuevo.')
      } finally {
        this.isSubmitting = false
      }
    },
  },
}
</script>
