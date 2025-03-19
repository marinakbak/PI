<template>
  <q-layout>
    <q-header>
      <q-toolbar>
        <q-toolbar-title>Dobrodošli u školu stranih jezika</q-toolbar-title>
        <q-btn flat dense @click="goHome" icon="home" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "LoginLayout",
  methods: {
    goHome() {
      this.$router.push("/");
    },
  },
};
</script>
