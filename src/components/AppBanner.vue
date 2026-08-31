<template>
  <header
    class="relative flex flex-col items-center justify-center h-56 sm:h-72 md:h-[400px] text-white text-center px-4 sm:px-6 py-8 sm:py-10 shadow-md overflow-hidden"
  >
    <!-- Imagen de fondo utilizando la variable importada -->
    <img
      :src="bannerImg"
      alt="Hero Banner"
      class="absolute inset-0 w-full h-full object-cover object-center"
    />

    <!-- Oscurecido general sobre toda la imagen -->
    <div class="absolute inset-0 bg-black/30"></div>

    <!-- Caja contenedora del texto con fondo semitransparente (Glassmorphism) -->
    <div
      class="relative z-10 max-w-3xl w-full p-6 sm:p-8 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl space-y-3"
    >
      <h1
        class="text-xl sm:text-3xl md:text-5xl font-bold leading-tight tracking-tight drop-shadow"
      >
        <slot name="title" />
      </h1>
      <p
        class="text-sm sm:text-base md:text-xl text-slate-100 opacity-95 leading-relaxed font-medium drop-shadow"
      >
        <slot name="content" />
      </p>
    </div>
  </header>
</template>

<script setup>
// Importamos la imagen desde src/assets/images/banners/banner.jpeg
import bannerImg from '@/assets/images/banners/banner.jpeg'
</script>

<style scoped></style>
