<template>
  <div class="q-pa-md flex flex-center">
    <q-form @submit.prevent="onLogin" class="login-form">
      <q-card class="bg-white shadow-4 rounded-borders">
        <!-- Naslov s efektom -->
        <q-card-section align="center">
          <div class="text-h5 text-primary q-pa-none">Prijava</div>
        </q-card-section>

        <!-- Polja za unos s ikonicama -->
        <q-card-section>
          <q-input
            filled
            type="email"
            v-model="email"
            label="Email"
            hint="Unesite vaš email"
            lazy-rules
            :rules="[emailRule]"
            class="q-mb-md"
            dense
          >
            <template v-slot:append>
              <q-icon name="mail" />
            </template>
          </q-input>

          <q-input
            filled
            type="password"
            v-model="password"
            label="Lozinka"
            hint="Unesite vašu lozinku"
            lazy-rules
            :rules="[passwordRule]"
            class="q-mb-md"
            dense
          >
            <template v-slot:append>
              <q-icon name="lock" />
            </template>
          </q-input>
        </q-card-section>

        <!-- Gumb za prijavu s animacijom na hover -->
        <q-card-actions align="center">
          <q-btn
            label="Prijava"
            type="submit"
            color="primary"
            class="full-width"
            :loading="loading"
            icon="login"
            rounded
          />
        </q-card-actions>
      </q-card>
    </q-form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "src/boot/firebase"; // Importiraj auth iz firebase.js

const email = ref("");
const password = ref("");
const loading = ref(false);
const router = useRouter();

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Pravilo za validaciju emaila
const emailRule = (val) =>
  emailPattern.test(val) || "Molimo unesite ispravan email";

// Pravilo za validaciju lozinke
const passwordRule = (val) =>
  (val && val.length > 0) || "Molimo unesite lozinku";

const onLogin = async () => {
  loading.value = true; // Pokreni loading
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    const user = userCredential.user;

    // Provjeri email i preusmjerenje na admin stranicu
    if (user.email === "admin@lingua.hr" || user.email === "admin1@lingua.hr") {
      // Ako je admin, preusmjerenje na admin panel unutar MainLayout-a
      router.push("/main");
    } else {
      // Ako email nije prepoznat, obavijest o pogrešnom korisniku
      router.app.$q.notify({
        type: "negative",
        message: "Ne prepoznajem korisnika.",
      });
    }
  } catch (error) {
    console.error("Greška kod prijave:", error);
    // Prikazivanje obavijesti o grešci
    router.app.$q.notify({
      type: "negative",
      message: "Prijava neuspješna.",
    });
  } finally {
    loading.value = false; // Završava loading
  }
};
</script>

<style scoped>
.login-form {
  max-width: 400px;
  width: 100%;
  padding: 20px;
}

.q-card {
  border-radius: 20px;
}

.q-input .q-field__control {
  font-size: 16px;
}

.q-btn {
  transition: all 0.2s ease-in-out;
}

.q-btn:hover {
  transform: scale(1.05);
}

.q-card-section {
  padding: 20px;
}

.bg-white {
  background-color: #fff !important;
}

.shadow-4 {
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
}

.rounded-borders {
  border-radius: 20px;
}
</style>
