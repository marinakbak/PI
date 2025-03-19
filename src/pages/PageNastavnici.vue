<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        title="Nastavnici"
        :rows="nastavnici"
        :columns="columns"
        row-key="ID_nastavnika"
        flat
        selection="single"
        v-model:selected="nastavnik"
        @update:selected="onSelectionRow"
      >
        <template v-slot:top>
          <q-btn color="primary" label="Pročitaj" @click="onRead" icon="book" />
          <q-space />
          <q-btn
            color="primary"
            label="Novi nastavnik"
            @click="onAddRow"
            icon="add_circle"
          />

          <q-btn
            v-if="nastavnik.length !== 0"
            class="q-ml-sm"
            color="primary"
            label="Izmijeni nastavnika"
            @click="onEditRow"
            icon="edit"
          />

          <q-btn
            v-if="nastavnik.length !== 0"
            class="q-ml-sm"
            color="red"
            label="Obriši nastavnika"
            @click="onDeleteRow"
            icon="delete"
          />
        </template>
      </q-table>
    </div>

    <div class="q-pa-md" v-if="showForm">
      <q-card flat bordered class="q-pa-sm">
        <q-card-section>
          <q-form @submit="onSave">
            <q-input
              filled
              v-model="editNastavnik.ImePrezime_nastavnika"
              label="Ime i prezime nastavnika"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Unesite ime i prezime nastavnika',
              ]"
              placeholder="Unesite ime i prezime nastavnika"
            />
            <q-input
              filled
              v-model="editNastavnik.Predmet_nastavnika"
              label="Predmet"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Unesite predmet nastavnika',
              ]"
              placeholder="Unesite predmet nastavnika"
            />
            <q-input
              filled
              v-model="editNastavnik.Titula_nastavnika"
              label="Titula nastavnika"
              placeholder="Unesite titulu nastavnika"
            />

            <!-- Kontakt polje sada predstavlja e-mail -->
            <q-input
              filled
              v-model="editNastavnik.Kontakt_nastavnika"
              label="E-mail nastavnika"
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Unesite e-mail adresu nastavnika',
                (val) =>
                  /.+@.+\..+/.test(val) || 'E-mail nije u ispravnom formatu',
              ]"
              placeholder="Unesite e-mail adresu nastavnika"
            />

            <div class="q-mt-md">
              <q-btn
                label="Spremi"
                type="submit"
                color="primary"
                class="q-mr-sm"
              />
              <q-btn label="Zatvori" color="secondary" @click="onClose" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "boot/axios";

defineOptions({
  name: "PageNastavnik",
});

const columns = [
  {
    name: "ImePrezime_nastavnika",
    required: true,
    label: "Ime i prezime nastavnika",
    align: "left",
    field: "ImePrezime_nastavnika",
    sortable: true,
  },
  {
    name: "Predmet_nastavnika",
    required: true,
    label: "Predmet",
    align: "left",
    field: "Predmet_nastavnika",
    sortable: true,
  },
  {
    name: "Titula_nastavnika",
    label: "Titula",
    align: "left",
    field: "Titula_nastavnika",
    sortable: true,
  },
  {
    name: "Kontakt_nastavnika",
    label: "E-mail",
    align: "left",
    field: "Kontakt_nastavnika",
    sortable: true,
  },
];

const nastavnici = ref([]);
const nastavnik = ref([]);
const editNastavnik = ref({});
const showForm = ref(false);

const onRead = async () => {
  try {
    const result = await api.get("/NASTAVNIK");
    nastavnici.value = result.data;
    nastavnik.value = [];
    showForm.value = false;
  } catch (error) {
    console.error("Greška pri dohvaćanju nastavnika", error);
  }
};

const onDeleteRow = async () => {
  try {
    const confirmation = confirm(
      "Jeste li sigurni da želite obrisati nastavnika?"
    );
    if (!confirmation) return;

    const result = await api.delete("/NASTAVNIK", {
      data: {
        ID_nastavnika: nastavnik.value[0].ID_nastavnika,
      },
    });
    onRead();
    nastavnik.value = [];
  } catch (error) {
    console.error("Greška pri brisanju nastavnika", error);
  }
};

const onAddRow = () => {
  nastavnik.value = [];
  editNastavnik.value = {
    ID_nastavnika: null,
    ImePrezime_nastavnika: "",
    Predmet_nastavnika: null,
    Titula_nastavnika: "",
    Kontakt_nastavnika: "", // Ovdje unosimo e-mail
  };
  showForm.value = true;
};

const onEditRow = () => {
  editNastavnik.value = Object.assign({}, nastavnik.value[0]);
  showForm.value = true;
};

const onClose = () => {
  editNastavnik.value = {
    ID_nastavnika: null,
    ImePrezime_nastavnika: null,
    Predmet_nastavnika: null,
    Titula_nastavnika: null,
    Kontakt_nastavnika: null, // E-mail će biti uključen u ovaj dio
  };
  showForm.value = false;
};

const onSelectionRow = () => {
  editNastavnik.value = Object.assign({}, nastavnik.value[0]);
};

const onSave = async () => {
  try {
    if (!editNastavnik.value.ID_nastavnika) {
      await api.post("/NASTAVNIK", editNastavnik.value);
    } else {
      await api.put("/NASTAVNIK", editNastavnik.value);
    }
    onRead();
  } catch (error) {
    console.error("Greška pri spremanju nastavnika", error);
  }
};

onMounted(() => {
  onRead();
});
</script>

<style lang="sass" scoped>
.q-btn
  margin-top: 10px

.q-table
  max-width: 100%
</style>
