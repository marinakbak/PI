<template>
  <q-layout view="hHh lpR lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> Lingua - škola stranih jezika </q-toolbar-title>

        <!-- Ikona za povratak na naslovnu stranicu -->
        <q-btn
          flat
          dense
          round
          icon="home"
          aria-label="Naslovna"
          to="/"
          class="q-ml-md"
        />

        <!-- Gumb za korisnički profil -->
        <q-btn-dropdown flat dense icon="account_circle" class="q-ml-md">
          <q-list>
            <q-item clickable v-close-popup>
              <q-item-section>Profil</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>Postavke</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup @click="logout">
              <q-item-section>Odjava</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <div>Verzija {{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      class="bg-primary"
      :width="300"
      :breakpoint="767"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label class="text-white" header> Navigacija </q-item-label>
        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <!-- Wrapper za pozadinu -->
    <div class="background-wrapper">
      <!-- Glavni sadržaj -->
      <q-page-container>
        <!-- Animirana poruka dobrodošlice -->
        <q-banner
          v-if="showWelcomeMessage"
          inline-actions
          rounded
          class="bg-secondary text-white q-mb-md"
          @transitionend="onWelcomeMessageEnd"
        >
          Dobrodošli u Lingua! 🎉
        </q-banner>

        <router-view />
      </q-page-container>
    </div>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import EssentialLink from "components/EssentialLink.vue";

defineOptions({
  name: "MainLayout",
});

// Lista linkova za navigaciju
const linksList = [
  {
    title: "Nastavnici",
    caption: "Upravljanje nastavnicima",
    icon: "school",
    to: "/main/nastavnici",
  },
  {
    title: "Tečajevi",
    caption: "Upravljanje tečajevima",
    icon: "menu_book",
    to: "/main/tecajevi",
  },
  {
    title: "Polaznici",
    caption: "Upravljanje polaznicima",
    icon: "group",
    to: "/main/polaznici",
  },
  {
    title: "Ispitno polaganje",
    caption: "Polaganje ispita i ocjene",
    icon: "assignment",
    to: "/main/ispiti",
  },
  {
    title: "Izvješća",
    caption: "Izvješća i nalozi",
    icon: "event",
    to: "/main/izvjesca",
  },
  {
    title: "Uplate",
    caption: "Praćenje uplata",
    icon: "attach_money",
    to: "/main/uplate",
  },
  {
    title: "Kontakt",
    caption: "Kontaktirajte nas",
    icon: "contact_support",
    to: "/main/kontakt",
  },
  {
    title: "Pomoć",
    caption: "Korisnički priručnik",
    icon: "help_outline",
    to: "/main/pomoc",
  },
];

const leftDrawerOpen = ref(false);
const showWelcomeMessage = ref(true);

// Funkcija za toggle lijevog drawer-a
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

// Funkcija za odjavu
const logout = () => {
  console.log("Odjava korisnika");
  // Ovdje možeš dodati logiku za odjavu (npr. brisanje tokena, redirekciju, itd.)
};

// Skriva poruku dobrodošlice nakon što je animacija završena
const onWelcomeMessageEnd = () => {
  showWelcomeMessage.value = false;
};

// Uključivanje poruke dobrodošlice kada se komponenta montira
onMounted(() => {
  setTimeout(() => {
    showWelcomeMessage.value = false;
  }, 3000); // Poruka će se automatski sakriti nakon 3 sekunde
});
</script>

<style scoped>
/* Stil za pozadinu */
.background-wrapper {
  position: relative;
  height: 100vh;
  background-image: url("../assets/pozadina.PNG");
  background-size: cover;
  background-position: center top;
  display: flex;
  flex-direction: column;
  margin-top: 50px;
}

/* Stil za sadržaj */
q-page-container {
  z-index: 1;
  position: relative;
  background: rgba(255, 255, 255, 0.8); /* Svijetla pozadina za čitljivost */
  padding: 20px;
  border-radius: 10px;
  margin: 20px;
}

/* Opcionalno: Stil za centriranje sadržaja */
.pocetna {
  text-align: center;
  color: white;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
}
</style>
