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
        <!-- Datos de contacto (embellecido) -->
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
                  href="https://github.com/iMarc-97"
                  target="_blank"
                  class="block font-medium hover:underline"
                >
                  github.com/iMarc-97
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
            />
            <input
              v-model="email"
              type="email"
              placeholder="Tu correo electrónico"
              class="w-full p-3 border border-white rounded-md bg-transparent placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <textarea
              v-model="message"
              rows="5"
              placeholder="Tu mensaje"
              class="w-full p-3 border border-white rounded-md bg-transparent placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
              required
            ></textarea>
            <button
              type="submit"
              class="w-full bg-white text-blue-900 px-4 py-3 font-semibold rounded-md hover:bg-gray-200 transition"
            >
              Enviar mensaje
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
    }
  },
  methods: {
    submitForm() {
      // Aquí puedes manejar el envío, como enviar a un backend o mostrar una alerta
      console.log('Formulario enviado:', {
        nombre: this.name,
        email: this.email,
        mensaje: this.message,
      })
      this.name = ''
      this.email = ''
      this.message = ''
      alert('Gracias por tu mensaje ✉️')
    },
  },
}
</script>
