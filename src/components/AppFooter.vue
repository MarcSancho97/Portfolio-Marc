<template>
  <footer class="bg-gray-700 text-white py-8">
    <div class="container mx-auto px-4 max-w-6xl">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 px-2">
        <div>
          <h3 class="text-lg font-semibold mb-3">Sobre este sitio</h3>
          <p class="text-sm leading-relaxed">
            Web desarrollada con Vue.js y Tailwind CSS para mostrar mis proyectos, habilidades y
            forma de contacto profesional.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-3">Enlaces Útiles</h3>
          <ul class="space-y-2">
            <li>
              <router-link
                to="/"
                class="block px-3 py-1.5 rounded transition duration-300 hover:bg-gray-900 hover:text-white"
                >Inicio</router-link
              >
            </li>
            <li>
              <router-link
                to="/projects"
                class="block px-3 py-1.5 rounded transition duration-300 hover:bg-gray-900 hover:text-white"
                >Proyectos</router-link
              >
            </li>
            <li>
              <router-link
                to="/contact"
                class="block px-3 py-1.5 rounded transition duration-300 hover:bg-gray-900 hover:text-white"
                >Contacto</router-link
              >
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-3">Sígueme</h3>
          <ul class="flex space-x-4 items-center">
            <li>
              <a
                href="https://github.com/MarcSancho97"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-white transition duration-300"
                title="GitHub"
              >
                <i class="fa-brands fa-square-github text-3xl"></i>
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/marc-sancho-garcia-98a317274"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-white transition duration-300"
                title="LinkedIn"
              >
                <i class="fa-brands fa-linkedin text-3xl"></i>
              </a>
            </li>
            <li>
              <router-link
                to="/contact"
                class="hover:text-white transition duration-300 inline-block"
                title="Ir al formulario de contacto"
              >
                <i class="fa-solid fa-at text-3xl"></i>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterSection',
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css');
</style>
