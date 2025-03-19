<template>
  <div class="contact-wrapper">
    <div class="q-pa-md" style="max-width: 350px">
      <!-- Header for the contact page -->
      <q-toolbar class="bg-primary text-white shadow-2">
        <q-toolbar-title>Kontakt</q-toolbar-title>
      </q-toolbar>

      <!-- Contact List -->
      <q-list bordered>
        <!-- Adresa -->
        <q-item class="q-my-sm" clickable v-ripple @click="openAddress">
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">
              <q-icon name="location_on" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Adresa škole</q-item-label>
            <q-item-label caption lines="1">
              Ulica i broj, Grad, Država
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="location_on" color="blue" />
          </q-item-section>
        </q-item>

        <!-- Telefonski broj -->
        <q-item class="q-my-sm" clickable v-ripple @click="openPhone">
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">
              <q-icon name="phone" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Telefonski broj</q-item-label>
            <q-item-label caption lines="1">+123 456 789</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="call" color="green" />
          </q-item-section>
        </q-item>

        <!-- Email adresa -->
        <q-item class="q-my-sm" clickable v-ripple @click="openEmail">
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">
              <q-icon name="email" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Email adresa</q-item-label>
            <q-item-label caption lines="1"
              >kontakt@linguaschool.com</q-item-label
            >
          </q-item-section>

          <q-item-section side>
            <q-icon name="email" color="orange" />
          </q-item-section>
        </q-item>

        <q-separator />
        <q-item-label header>Socialne mreže</q-item-label>

        <!-- Facebook -->
        <q-item class="q-my-sm" clickable v-ripple @click="openFacebook">
          <q-item-section avatar>
            <q-avatar color="blue" text-color="white">
              <q-icon name="facebook" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Facebook</q-item-label>
            <q-item-label caption lines="1">/linguaschool</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="open_in_new" color="blue" />
          </q-item-section>
        </q-item>

        <!-- Twitter -->
        <q-item class="q-my-sm" clickable v-ripple @click="openTwitter">
          <q-item-section avatar>
            <q-avatar color="blue" text-color="white">
              <q-icon name="twitter" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Twitter</q-item-label>
            <q-item-label caption lines="1">@linguaschool</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="open_in_new" color="blue" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Definiraj linkove za kontakt
const addressLink = ref(
  "https://www.google.com/maps?q=Ulica+i+broj,+Grad,+Država"
);
const phoneLink = ref("tel:+123456789");
const emailLink = ref("mailto:kontakt@linguaschool.com");
const facebookLink = ref("https://www.facebook.com/linguaschool");
const twitterLink = ref("https://twitter.com/linguaschool");

// Metode za otvaranje linkova
const openAddress = () => {
  window.open(addressLink.value, "_blank");
};

const openPhone = () => {
  window.open(phoneLink.value, "_blank");
};

const openEmail = () => {
  window.open(emailLink.value, "_blank");
};

const openFacebook = () => {
  window.open(facebookLink.value, "_blank");
};

const openTwitter = () => {
  window.open(twitterLink.value, "_blank");
};
</script>

<style scoped>
/* Add white background and rounded borders */
.contact-wrapper {
  background-color: white;
  border-radius: 12px;
  padding: 16px; /* Add padding to create space inside the box */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Optional: Add a slight shadow for better visibility */
  max-width: 350px;
  margin: left; /* Center the menu */
}
</style>
