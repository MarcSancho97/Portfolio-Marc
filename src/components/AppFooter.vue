<template>
  <footer class="bg-gray-800 text-white py-6">
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- Contenedor de las 3 columnas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 px-2">
        <!-- Columna 1 -->
        <div>
          <h3 class="text-lg font-semibold mb-3">------------------</h3>
          <p class="text-sm"></p>
        </div>

        <!-- Columna 2 -->
        <div>
          <h3 class="text-lg font-semibold mb-3">Enlaces Útiles</h3>
          <ul class="space-y-2">
            <li><router-link to="/" class="text-sm hover:text-gray-400">Inicio</router-link></li>
            <li>
              <router-link to="/projects" class="text-sm hover:text-gray-400"
                >Proyectos</router-link
              >
            </li>
            <li>
              <router-link to="/contact" class="text-sm hover:text-gray-400">Contacto</router-link>
            </li>
          </ul>
        </div>

        <!-- Columna 3 -->
        <div>
          <h3 class="text-lg font-semibold mb-3">Contacto</h3>
          <ul class="space-x-4">
            <li class="inline">
              <i class="fa-brands fa-square-github text-3xl hover:text-gray-400"></i>
            </li>
            <li class="inline">
              <i class="fa-brands fa-linkedin text-3xl hover:text-gray-400"></i>
            </li>
            <li class="inline">
              <i class="fa-solid fa-at text-3xl hover:text-gray-400"></i>
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
/* Si deseas usar iconos, puedes agregar Font Awesome o cualquier otra librería de iconos */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css');
</style>
