<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="fullscreen bg-image flex flex-center">
        <div class="login-box">
          <q-toolbar-title class="text-white text-center">
            Dobrodošli!
          </q-toolbar-title>
          <q-btn
            label="Prijava za administratora"
            class="full-width q-mb-md"
            color="primary"
            @click="router.push('/login?role=admin')"
          />
          <q-btn
            label="Prijava za nastavnika"
            class="full-width"
            color="secondary"
            @click="router.push('/login?role=nastavnik')"
          />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<style scoped>
/* Postavlja sliku iz assets kao pozadinu */
.bg-image {
  background: url("../assets/pozadina.PNG") no-repeat center center;
  background-size: cover;
  height: 100vh;
}

/* Centrirana kutija za prijavu */
.login-box {
  background: rgba(0, 0, 0, 0.7);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
  text-align: center;
  max-width: 300px;
  width: 100%;
}

.text-white {
  color: white;
}
</style>
