<template>
  <div
    class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center"
  >
    <div class="error-container">
      <!-- Dodavanje ilustracije ili ikone -->
      <img
        src="https://via.placeholder.com/300x300.png?text=404"
        alt="404 illustration"
        class="q-mb-md"
        style="max-width: 100%; height: auto"
      />

      <div
        class="text-h1"
        style="font-size: 30vh; text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6)"
      >
        404
      </div>

      <div class="text-h2" style="opacity: 0.7; margin-bottom: 20px">
        Oops, stranica nije pronađena!
      </div>

      <div class="text-body2" style="opacity: 0.6">
        Nemoj se brinuti, tu smo da te vratimo na pravi put!
      </div>

      <div class="q-mt-xl">
        <q-btn
          color="white"
          text-color="blue"
          unelevated
          to="/"
          label="Go Home"
          no-caps
          class="q-mr-sm"
        />
        <q-btn
          color="white"
          text-color="blue"
          unelevated
          @click="goBack"
          label="Go Back"
          no-caps
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
defineOptions({
  name: "ErrorNotFound",
});

// Router instance for navigation
const router = useRouter();

// Function to go back to the previous page
const goBack = () => {
  router.back();
};
</script>

<style scoped>
.error-container {
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* Hover efekti za gumb */
.q-btn:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}
</style>
