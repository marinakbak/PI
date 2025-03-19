<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        title="Tečajevi"
        :rows="tecajevi"
        :columns="columns"
        row-key="Sifra_tecaja"
        flat
        selection="single"
        v-model:selected="selectedTecaj"
        @update:selected="onSelectionRow"
      >
        <template v-slot:top>
          <q-btn color="primary" label="Pročitaj" @click="onRead" icon="book" />
          <q-space />
          <q-btn
            color="primary"
            label="Novi tečaj"
            @click="onAddRow"
            icon="add_circle"
          />
          <q-btn
            v-if="selectedTecaj.length !== 0"
            class="q-ml-sm"
            color="green"
            label="Izmijeni tečaj"
            @click="onEditRow"
            icon="edit"
          />
          <q-btn
            v-if="selectedTecaj.length !== 0"
            class="q-ml-sm"
            color="red"
            label="Obriši tečaj"
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
            <q-select
              filled
              v-model="editTecaj.ID_nastavnika"
              :options="nastavnici"
              option-value="ID_nastavnika"
              option-label="ImePrezime_nastavnika"
              emit-value
              map-options
              label="Nastavnik"
            />
            <q-input
              filled
              v-model="editTecaj.Naziv_tecaja"
              label="Naziv tečaja *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Naziv je obavezan']"
              stack-label
            />
            <q-input
              filled
              v-model="editTecaj.Opis_tecaja"
              label="Opis tečaja"
              type="textarea"
            />
            <q-input
              filled
              v-model="editTecaj.Cijena_tecaja"
              label="Cijena tečaja (EUR)"
              type="number"
              lazy-rules
              :rules="[(val) => val > 0 || 'Cijena mora biti veća od 0']"
              @blur="
                editTecaj.Cijena_tecaja =
                  parseFloat(editTecaj.Cijena_tecaja) || 0
              "
            />
            <q-select
              filled
              v-model="editTecaj.Trajanje_tecaja"
              :options="['20', '40']"
              label="Trajanje tečaja (sati)"
            />

            <div>
              <q-btn
                label="Spremi"
                type="submit"
                color="primary"
                :loading="isSaving"
                icon="save"
              />
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

defineOptions({
  name: "TecajPage",
});

const columns = [
  {
    name: "ID_nastavnika",
    required: true,
    label: "Nastavnik",
    align: "left",
    field: "ID_nastavnika",
    sortable: true,
    format: (val) => {
      const nastavnik = nastavnici.value.find(
        (nastavnik) => nastavnik.ID_nastavnika === val
      );
      return nastavnik
        ? `${val} - ${nastavnik.ImePrezime_nastavnika}`
        : `${val} - Nepoznato`;
    },
  },
  {
    name: "Naziv_tecaja",
    required: true,
    label: "Naziv",
    align: "left",
    field: "Naziv_tecaja",
    sortable: true,
  },
  {
    name: "Opis_tecaja",
    required: false,
    label: "Opis",
    align: "left",
    field: "Opis_tecaja",
  },
  {
    name: "Cijena_tecaja",
    required: true,
    label: "Cijena (EUR)",
    align: "right",
    field: "Cijena_tecaja",
    sortable: true,
  },
  {
    name: "Trajanje_tecaja",
    required: true,
    label: "Trajanje (sati)",
    align: "right",
    field: "Trajanje_tecaja",
    sortable: true,
  },
];

const tecajevi = ref([]);
const selectedTecaj = ref([]);
const editTecaj = ref({});
const showForm = ref(false);
const nastavnici = ref([]);
const isSaving = ref(false);

const onRead = async () => {
  try {
    const result = await api.get("/TECAJ");

    const rezz = await api.get("/NASTAVNIK");
    nastavnici.value = rezz.data;

    tecajevi.value = result.data;
  } catch (error) {
    console.error("Greška prilikom učitavanja podataka:", error);
  }
};

const onDeleteRow = async () => {
  const confirmation = confirm("Jeste li sigurni da želite obrisati tečaj?");
  if (!confirmation) return;

  try {
    const result = await api.delete("/TECAJ", {
      data: {
        Sifra_tecaja: selectedTecaj.value[0].Sifra_tecaja,
      },
    });
    onRead();
    selectedTecaj.value = [];
  } catch (error) {
    console.error("Greška prilikom brisanja:", error);
  }
};

const onAddRow = () => {
  editTecaj.value = {
    Sifra_tecaja: null,
    Naziv_tecaja: "",
    Opis_tecaja: "",
    Cijena_tecaja: null,
    Trajanje_tecaja: "20",
    ID_nastavnika: null,
  };
  showForm.value = true;
};

const onEditRow = () => {
  editTecaj.value = { ...selectedTecaj.value[0] };
  showForm.value = true;
};

const onClose = () => {
  editTecaj.value = {};
  showForm.value = false;
};

const onSelectionRow = () => {
  if (selectedTecaj.value.length > 0) {
    editTecaj.value = { ...selectedTecaj.value[0] };
  }
};

const onSave = async () => {
  if (
    !editTecaj.value.ID_nastavnika ||
    !editTecaj.value.Naziv_tecaja ||
    !editTecaj.value.Cijena_tecaja ||
    !editTecaj.value.Trajanje_tecaja
  ) {
    alert("Sva polja moraju biti popunjena.");
    return;
  }

  isSaving.value = true;

  try {
    if (editTecaj.value.Sifra_tecaja === null) {
      await api.post("/TECAJ", editTecaj.value);
    } else {
      await api.put("/TECAJ", editTecaj.value);
    }
    onRead();
    onClose();
  } catch (error) {
    console.error("Greška prilikom spremanja:", error);
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  onRead();
});
</script>
