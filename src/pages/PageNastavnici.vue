<template>
  <q-page>
    <div class="q-pa-md">
      <!-- Filter za pretragu -->
      <q-input v-model="filter" label="Pretraži nastavnike" class="q-mb-md" />

      <!-- Tablica za nastavnike -->
      <q-table
        title="Nastavnici"
        :rows="filteredNastavnici"
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
            color="green"
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
          <!-- Novi gumb za prikaz nastavnika na tečaju -->
          <q-btn
            color="blue"
            label="Nastavnici na tečaju"
            @click="onShowNastavniciNaTecaju"
            icon="school"
          />
        </template>
      </q-table>

      <!-- Dialog za nastavnike na tečaju -->
      <q-dialog v-model="showNastavniciNaTecaju">
        <q-card style="width: 800px; max-width: 90vw">
          <q-card-section>
            <div class="text-h6">Nastavnici na tečaju</div>
            <div class="text-subtitle2 text-grey">
              Pregled ukupnih sati po tečajevima
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <q-table
              :rows="nastavniciNaTecaju"
              :columns="columnsNaTecaju"
              row-key="id"
              flat
              bordered
            />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              flat
              label="Zatvori"
              color="primary"
              @click="showNastavniciNaTecaju = false"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Forma za novi/izmijenjeni nastavnik -->
      <div class="q-pa-md" v-if="showForm">
        <q-card flat bordered class="q-pa-sm">
          <q-card-section>
            <q-form @submit.prevent="onSave">
              <q-input
                filled
                v-model="editNastavnik.ImePrezime_nastavnika"
                label="Ime i prezime nastavnika"
                lazy-rules
                :rules="[(val) => !!val || 'Unesite ime i prezime nastavnika']"
                placeholder="Unesite ime i prezime nastavnika"
              />
              <q-input
                filled
                v-model="editNastavnik.Predmet_nastavnika"
                label="Predmet"
                lazy-rules
                :rules="[(val) => !!val || 'Unesite predmet nastavnika']"
                placeholder="Unesite predmet nastavnika"
              />
              <q-input
                filled
                v-model="editNastavnik.Titula_nastavnika"
                label="Titula nastavnika"
                placeholder="Unesite titulu nastavnika"
              />
              <q-input
                filled
                v-model="editNastavnik.Kontakt_nastavnika"
                label="E-mail nastavnika"
                :rules="[
                  (val) => !!val || 'Unesite e-mail adresu nastavnika',
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
    </div>

    <!-- Dialog za potvrdu brisanja -->
    <q-dialog v-model="showDeleteDialog">
      <q-card>
        <q-card-section>
          <div>Jeste li sigurni da želite obrisati nastavnika?</div>
        </q-card-section>
        <q-card-actions>
          <q-btn flat label="Otkaži" color="primary" @click="cancelDelete" />
          <q-btn flat label="Potvrdi" color="negative" @click="confirmDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Spinner dok se učitavaju podaci -->
    <q-spinner v-if="loading" />
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { api } from "boot/axios";

defineOptions({
  name: "PageNastavnici",
});

const router = useRouter();
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
const nastavniciNaTecaju = ref([]);
const nastavnik = ref([]);
const editNastavnik = ref({});
const showForm = ref(false);
const showNastavniciNaTecaju = ref(false);
const showDeleteDialog = ref(false);
const loading = ref(false);
const filter = ref("");

const columnsNaTecaju = [
  {
    name: "Naziv_tecaja",
    label: "Tečaj",
    align: "left",
    field: "Naziv_tecaja",
    sortable: true,
  },
  {
    name: "ImePrezime_nastavnika",
    label: "Nastavnik",
    align: "left",
    field: "ImePrezime_nastavnika",
    sortable: true,
  },
  {
    name: "Broj_sati_nastave",
    label: "Ukupno sati",
    align: "right",
    field: "Broj_sati_nastave",
    sortable: true,
  },
];

// Filtriranje nastavnika
const filteredNastavnici = computed(() => {
  return nastavnici.value.filter((nastavnik) => {
    return (
      nastavnik.ImePrezime_nastavnika.toLowerCase().includes(
        filter.value.toLowerCase()
      ) ||
      nastavnik.Predmet_nastavnika.toLowerCase().includes(
        filter.value.toLowerCase()
      ) ||
      nastavnik.Titula_nastavnika.toLowerCase().includes(
        filter.value.toLowerCase()
      )
    );
  });
});

// Dohvati sve nastavnike
const onRead = async () => {
  loading.value = true;
  try {
    const result = await api.get("/NASTAVNIK");
    nastavnici.value = result.data;
    nastavnik.value = [];
    showForm.value = false;
  } catch (error) {
    console.error("Greška pri dohvaćanju nastavnika", error);
  } finally {
    loading.value = false;
  }
};

// Dohvati nastavnike na tečaju i prikaži ih
const onShowNastavniciNaTecaju = async () => {
  loading.value = true;
  try {
    const result = await api.get("/NASTAVNIK_NA_TECAJU");
    nastavniciNaTecaju.value = result.data;
    showNastavniciNaTecaju.value = true;
  } catch (error) {
    console.error("Greška pri dohvaćanju nastavnika na tečaju", error);
  } finally {
    loading.value = false;
  }
};

// Brisanje nastavnika
const onDeleteRow = () => {
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  try {
    await api.delete("/NASTAVNIK", {
      data: { ID_nastavnika: nastavnik.value[0].ID_nastavnika },
    });
    await onRead();
  } catch (error) {
    console.error("Greška pri brisanju nastavnika", error);
  } finally {
    showDeleteDialog.value = false;
  }
};

const cancelDelete = () => {
  showDeleteDialog.value = false;
};

// Dodaj novi red
const onAddRow = () => {
  nastavnik.value = [];
  editNastavnik.value = {
    ID_nastavnika: null,
    ImePrezime_nastavnika: "",
    Predmet_nastavnika: "",
    Titula_nastavnika: "",
    Kontakt_nastavnika: "",
  };
  showForm.value = true;
};

// Izmijeni red
const onEditRow = () => {
  editNastavnik.value = { ...nastavnik.value[0] };
  showForm.value = true;
};

const onClose = () => {
  showForm.value = false;
};

const onSelectionRow = () => {
  editNastavnik.value = { ...nastavnik.value[0] };
};

const onSave = async () => {
  try {
    if (!editNastavnik.value.ID_nastavnika) {
      await api.post("/NASTAVNIK", editNastavnik.value);
    } else {
      await api.put("/NASTAVNIK", editNastavnik.value);
    }
    await onRead();
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
