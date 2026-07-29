<template>
  <section class="bg-gradient-to-r from-blue-500 to-blue-950 py-16 text-white">
    <div class="max-w-6xl mx-auto px-4 text-center">
      <h2 class="text-4xl font-bold mb-6">Mi enfoque en cada proyecto</h2>
      <p class="italic mb-12 mx-auto">
        Combino experiencia técnica y creatividad para desarrollar soluciones web claras,
        funcionales y adaptadas a cada necesidad. Mi objetivo es entregar resultados sólidos,
        eficientes y fáciles de usar, siempre buscando la mejor forma de resolver retos y ofrecer un
        producto de calidad.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(item, index) in workPrinciples"
          :key="index"
          class="bg-white/10 p-6 rounded-xl hover:scale-105 transition-transform flex flex-col items-center text-center"
        >
          <img
            :src="item.img"
            :alt="item.title"
            class="w-20 h-20 mb-4 object-contain"
            loading="lazy"
          />
          <h3 class="h-16 text-2xl font-semibold pt-4 mb-6">{{ item.title }}</h3>
          <p class="flex-grow">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const workPrinciples = [
  {
    title: 'Autonomía y resolución',
    description:
      'Investigo, analizo y soluciono obstáculos para que los proyectos avancen con calidad y sin interrupciones.',
    img: new URL('@/assets/images/icons_skills/autonomy.png', import.meta.url).href,
  },
  {
    title: 'Stack moderno y completo',
    description:
      'Desarrollo con Vue 3, Laravel, TailwindCSS, Docker y Git para ofrecer aplicaciones robustas y mantenibles.',
    img: new URL('@/assets/images/icons_skills/technology.png', import.meta.url).href,
  },
  {
    title: 'Diseño responsivo',
    description:
      'Construyo interfaces que se adaptan a todo tipo de dispositivos para brindar siempre la mejor experiencia.',
    img: new URL('@/assets/images/icons_skills/responsive.png', import.meta.url).href,
  },
  {
    title: 'Código limpio y mantenible',
    description:
      'Me esfuerzo en escribir código claro, estructurado y fácil de actualizar o ampliar en el futuro.',
    img: new URL('@/assets/images/icons_skills/clean.png', import.meta.url).href,
  },
  {
    title: 'Experiencia real',
    description:
      'He trabajado en proyectos reales que requieren responsabilidad, calidad y compromiso continuo en el desarrollo.',
    img: new URL('@/assets/images/icons_skills/experience.png', import.meta.url).href,
  },
  {
    title: 'Pasión por el desarrollo',
    description:
      'Disfruto resolviendo problemas y creando soluciones elegantes que combinan funcionalidad y buen diseño.',
    img: new URL('@/assets/images/icons_skills/passion.png', import.meta.url).href,
  },
]
</script>
