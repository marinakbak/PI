<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        title="Ispitna Polaganja"
        :rows="ispitnaPolaganja"
        :columns="columns"
        row-key="Datum_polaganja"
        flat
      >
        <template v-slot:top>
          <q-btn color="primary" label="Pročitaj" @click="onRead" icon="book" />
          <q-space />
          <q-btn
            color="primary"
            label="Dodaj Polaganje"
            @click="onAddRow"
            icon="add_circle"
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
              v-model="editPolaganje.Datum_polaganja"
              label="Datum polaganja"
              type="date"
            />
            <q-input
              filled
              v-model="editPolaganje.Ocjena"
              label="Ocjena"
              type="number"
            />
            <q-select
              filled
              v-model="editPolaganje.ID_polaznika_tecaja"
              :options="polaznici"
              option-value="ID_polaznika_tecaja"
              option-label="ImePrezime_polaznika"
              emit-value
              map-options
              label="Polaznik"
            />
            <q-select
              filled
              v-model="editPolaganje.Sifra_tecaja"
              :options="tecajevi"
              option-value="Sifra_tecaja"
              option-label="Naziv_tecaja"
              emit-value
              map-options
              label="Tečaj"
            />
            <div>
              <q-btn label="Spremi" type="submit" color="primary" icon="save" />
              <q-btn
                label="Zatvori"
                color="primary"
                @click="onClose"
                class="q-ml-sm"
                icon="close"
              />
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

const columns = [
  {
    name: "Datum_polaganja",
    label: "Datum",
    field: "Datum_polaganja",
    align: "left",
    sortable: true,
    format: (val) => new Intl.DateTimeFormat("hr-HR").format(new Date(val)),
  },
  {
    name: "Ocjena",
    label: "Ocjena",
    field: "Ocjena",
    align: "right",
    sortable: true,
  },
  {
    name: "ImePrezime_polaznika",
    label: "Polaznik",
    field: "ImePrezime_polaznika",
    align: "left",
  },
  {
    name: "Naziv_tecaja",
    label: "Tečaj",
    field: "Naziv_tecaja",
    align: "left",
  },
];

const ispitnaPolaganja = ref([]);
const editPolaganje = ref({});
const showForm = ref(false);
const polaznici = ref([]);
const tecajevi = ref([]);

const onRead = async () => {
  try {
    const result = await api.get("/ISPITNO_POLAGANJE");
    ispitnaPolaganja.value = result.data;

    const polazniciRes = await api.get("/POLAZNIK_TECAJA");
    polaznici.value = polazniciRes.data;

    const tecajeviRes = await api.get("/TECAJ");
    tecajevi.value = tecajeviRes.data;
  } catch (error) {
    console.error("Greška pri dohvaćanju podataka:", error);
  }
};

const onAddRow = () => {
  editPolaganje.value = {
    Datum_polaganja: "",
    Ocjena: null,
    Sifra_tecaja: null,
    ID_polaznika_tecaja: null,
  };
  showForm.value = true;
};

const onClose = () => {
  editPolaganje.value = {};
  showForm.value = false;
};

const onSave = async () => {
  try {
    await api.post("/ISPITNO_POLAGANJE", editPolaganje.value);
    onRead();
    onClose();
  } catch (error) {
    console.error("Greška pri spremanju polaganja:", error);
  }
};

onMounted(() => {
  onRead();
});
</script>
