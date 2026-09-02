<template>
  <div>
    <AppBanner>
      <template v-slot:title>
        <h1>Contacto</h1>
      </template>
      <template v-slot:content>
        <p>¿Quieres contactarme? Conecta conmigo o envíame un mensaje.</p>
      </template>
    </AppBanner>

    <section class="bg-gray-800 py-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div
          class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-xl flex flex-col justify-between border border-white/10"
        >
          <div>
            <h2 class="text-2xl font-bold text-white mb-4">Perfil Profesional</h2>
            <p class="text-blue-100 text-sm mb-6 leading-relaxed">
              ¿Prefieres conectar de forma profesional o revisar mis repositorios de código? Echa un
              vistazo a mis perfiles.
            </p>

            <div class="space-y-4">
              <a
                href="https://www.linkedin.com/in/marc-sancho-garcia-98a317274/"
                target="_blank"
                class="flex items-center gap-4 bg-white/10 hover:bg-white/20 p-4 rounded-xl transition-all duration-300 group border border-white/5"
              >
                <div
                  class="bg-blue-600 group-hover:bg-blue-500 text-white rounded-full p-3 flex items-center justify-center transition-colors shadow-md"
                >
                  <i class="fa-brands fa-linkedin text-xl"></i>
                </div>
                <div>
                  <span class="block text-xs text-blue-200 uppercase tracking-wider font-semibold"
                    >Red Profesional</span
                  >
                  <span class="text-white font-medium text-sm">Marc Sancho García</span>
                </div>
              </a>

              <a
                href="https://github.com/marcsancho97"
                target="_blank"
                class="flex items-center gap-4 bg-white/10 hover:bg-white/20 p-4 rounded-xl transition-all duration-300 group border border-white/5"
              >
                <div
                  class="bg-gray-800 group-hover:bg-gray-700 text-white rounded-full p-3 flex items-center justify-center transition-colors shadow-md"
                >
                  <i class="fa-brands fa-github text-xl"></i>
                </div>
                <div>
                  <span class="block text-xs text-blue-200 uppercase tracking-wider font-semibold"
                    >Código Fuente</span
                  >
                  <span class="text-white font-medium text-sm">github.com/marcsancho97</span>
                </div>
              </a>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-white/10 text-center md:text-left">
            <p class="text-xs text-blue-200">📍 Ubicado en La Ràpita, Tarragona, Cataluña.</p>
          </div>
        </div>

        <div class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/10">
          <h2 class="text-2xl font-bold text-white mb-4">Envíame un mensaje</h2>

          <form @submit.prevent="submitForm" class="space-y-4">
            <input
              type="text"
              name="_honey"
              style="display: none"
              tabindex="-1"
              autocomplete="off"
            />

            <div>
              <input
                v-model="name"
                type="text"
                placeholder="Tu nombre"
                class="w-full p-3.5 border border-white/20 rounded-xl bg-white/5 text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/10 transition"
                required
                :disabled="isSubmitting"
              />
            </div>
            <div>
              <input
                v-model="email"
                type="email"
                placeholder="Tu correo electrónico"
                class="w-full p-3.5 border border-white/20 rounded-xl bg-white/5 text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/10 transition"
                required
                :disabled="isSubmitting"
              />
            </div>
            <div>
              <textarea
                v-model="message"
                rows="4"
                placeholder="¿Qué te gustaría comentarme?"
                class="w-full p-3.5 border border-white/20 rounded-xl bg-white/5 text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/10 transition resize-none"
                required
                :disabled="isSubmitting"
              ></textarea>
            </div>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full inline-block bg-gray-800 text-gray-200 border border-gray-700 px-5 py-3 font-semibold rounded-xl hover:bg-gray-900 text-white transition-all duration-200 text-center shadow-md"
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
      isSubmitting: false,
      mountTime: null,
    }
  },
  mounted() {
    this.mountTime = Date.now()
  },
  methods: {
    async submitForm() {
      const elapsedTime = Date.now() - this.mountTime
      if (elapsedTime < 4000) {
        alert('Por favor, tómate tu tiempo para redactar el mensaje.')
        return
      }

      const urlPattern = /https?:\/\/[^\s]+/gi
      if (urlPattern.test(this.message)) {
        alert('Por seguridad, no se permiten enlaces en el mensaje de contacto.')
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const emailDomain = this.email.split('@')[1]?.toLowerCase()
      const disposableDomains = [
        'mailinator.com',
        '10minutemail.com',
        'tempmail.com',
        'guerrillamail.com',
        'sharklasers.com',
        'trashmail.com',
      ]
      const localPart = this.email.split('@')[0]

      if (
        !emailRegex.test(this.email) ||
        disposableDomains.includes(emailDomain) ||
        localPart.length < 3 ||
        /([a-z])\1{4,}/.test(localPart)
      ) {
        alert('Por favor, introduce una dirección de correo electrónico real y válida.')
        return
      }

      this.isSubmitting = true

      try {
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
              _captcha: 'false',
              Nombre: this.name,
              Email: this.email,
              Mensaje: this.message,
            }),
          },
        )

        if (response.ok) {
          alert('¡Gracias por tu mensaje! Te responderé lo antes posible ✉️')
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
