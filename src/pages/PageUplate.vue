<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        title="Uplate"
        :rows="uplate"
        :columns="columns"
        row-key="ID_uplate"
        flat
      >
        <template v-slot:top>
          <q-btn color="primary" label="Pročitaj" @click="onRead" icon="book" />
          <q-space />
          <q-btn
            color="primary"
            label="Dodaj Uplatu"
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
              v-model="editUplata.Iznos_uplate"
              label="Iznos uplate (EUR)"
              type="number"
            />
            <q-input
              filled
              v-model="editUplata.Datum_uplate"
              label="Datum uplate"
              type="date"
            />
            <q-select
              filled
              v-model="editUplata.ID_polaznika_tecaja"
              :options="polaznici"
              option-value="ID_polaznika_tecaja"
              option-label="ImePrezime_polaznika"
              emit-value
              map-options
              label="Polaznik"
            />
            <q-select
              filled
              v-model="editUplata.Sifra_tecaja"
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
    name: "Iznos_uplate",
    label: "Iznos (EUR)",
    field: "Iznos_uplate",
    align: "right",
    sortable: true,
  },
  {
    name: "Datum_uplate",
    label: "Datum",
    field: "Datum_uplate",
    align: "left",
    sortable: true,
    format: (val) => new Intl.DateTimeFormat("hr-HR").format(new Date(val)),
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

const uplate = ref([]);
const editUplata = ref({});
const showForm = ref(false);
const polaznici = ref([]);
const tecajevi = ref([]);

const onRead = async () => {
  try {
    const result = await api.get("/UPLATE");
    uplate.value = result.data;

    const polazniciRes = await api.get("/POLAZNIK_TECAJA");
    polaznici.value = polazniciRes.data;

    const tecajeviRes = await api.get("/TECAJ");
    tecajevi.value = tecajeviRes.data;
  } catch (error) {
    console.error("Greška pri dohvaćanju podataka:", error);
  }
};

const onAddRow = () => {
  editUplata.value = {
    Iznos_uplate: null,
    Datum_uplate: "",
    Sifra_tecaja: null,
    ID_polaznika_tecaja: null,
  };
  showForm.value = true;
};

const onClose = () => {
  editUplata.value = {};
  showForm.value = false;
};

const onSave = async () => {
  try {
    await api.post("/UPLATE", editUplata.value);
    onRead();
    onClose();
  } catch (error) {
    console.error("Greška pri spremanju uplate:", error);
  }
};

onMounted(() => {
  onRead();
});
</script>
