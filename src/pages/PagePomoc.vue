<template>
  <q-page class="q-pa-md flex flex-center">
    <div class="pomoc-wrapper">
      <q-toolbar class="bg-primary text-white shadow-2">
        <q-toolbar-title>Pomoć i dokumentacija</q-toolbar-title>
      </q-toolbar>

      <div class="q-pa-md">
        <p>Ovdje možete pregledati korisnički priručnik:</p>

        <!-- Pregled PDF-a unutar aplikacije -->
        <iframe
          src="/help.pdf"
          width="100%"
          height="700px"
          style="border: 1px solid #ccc; border-radius: 8px"
        ></iframe>

        <!-- Gumb za preuzimanje -->
        <div class="q-mt-md">
          <q-btn
            label="Preuzmi PDF"
            icon="file_download"
            color="primary"
            href="/help.pdf"
            target="_blank"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "PagePomoc",
});
</script>

<style scoped>
.pomoc-wrapper {
  background-color: white;
  border-radius: 12px;
  max-width: 900px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
