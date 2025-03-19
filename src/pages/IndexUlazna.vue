<template>
  <div class="q-pa-md full-page">
    <!-- Prazan sadržaj kako bi se prikazala samo pozadinska slika -->
  </div>
</template>

<script setup>
// Prikaz samo pozadine
</script>

<style scoped>
/* Stilizacija za prikaz pozadinske slike */
.q-page {
  background-image: url("~@/assets/photo.jpg"); /* slika koju sam dodala
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh; /* Visina stranice na cijeli ekran */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Centriranje sadržaja stranice */
.full-page {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
}
</style>
