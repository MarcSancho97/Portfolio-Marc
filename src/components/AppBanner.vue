<template>
  <header
    class="relative flex flex-col items-center justify-center h-56 sm:h-72 md:h-[400px] bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center px-4 sm:px-6 py-8 sm:py-10 shadow-md"
  >
    <!-- Capa decorativa -->
    <div class="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>

    <!-- Contenido -->
    <div class="relative z-10 max-w-4xl w-full space-y-3">
      <h1 class="text-xl sm:text-3xl md:text-5xl font-bold leading-tight tracking-tight">
        <slot name="title" />
      </h1>
      <p class="text-sm sm:text-base md:text-xl opacity-90 leading-relaxed font-medium">
        <slot name="content" />
      </p>
    </div>
  </header>
</template>

<script setup></script>

<style scoped></style>
