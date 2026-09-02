<template>
  <AppBanner>
    <template v-slot:title>
      <h1>To-Do List</h1>
    </template>

    <template v-slot:content>
      <p>
        Esto es un organizador de tareas en el cual puedes hacer arrastrar y soltar para modificar
        el estado de las tareas
      </p>
    </template>
  </AppBanner>
  <ToDo />
</template>

<script setup>
import ToDo from '@/components/ToDo.vue'
import AppBanner from '@/components/AppBanner.vue'
</script>
