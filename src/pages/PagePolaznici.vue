<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        title="Polaznici"
        :rows="students"
        :columns="columns"
        row-key="ID_polaznika_tecaja"
        flat
        selection="single"
        v-model:selected="student"
        @update:selected="onSelectionRow"
      >
        <template v-slot:top>
          <q-btn color="primary" label="Pročitaj" @click="onRead" />
          <q-space />
          <q-btn color="primary" label="Novi polaznik" @click="onAddRow" />
          <q-btn
            v-if="student.length !== 0"
            class="q-ml-sm"
            color="primary"
            label="Izmijeni polaznika"
            @click="onEditRow"
          />
          <q-btn
            v-if="student.length !== 0"
            class="q-ml-sm"
            color="red"
            label="Obriši polaznika"
            @click="onDeleteRow"
          />
        </template>
      </q-table>
    </div>

    <div class="q-pa-md" v-if="showForm">
      <q-card flat bordered class="q-pa-sm">
        <q-card-section>
          <q-form @submit.prevent="onSave">
            <q-input
              filled
              v-model="editStudent.ID_polaznika_tecaja"
              label="ID polaznika"
              readonly
            />
            <q-input
              filled
              v-model="editStudent.ImePrezime_polaznika"
              label="Ime i prezime polaznika"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Unesite ime i prezime polaznika',
              ]"
            />
            <q-select
              filled
              v-model="editStudent.Status_polaznika"
              :options="status"
              label="Status polaznika"
            />
            <q-input
              filled
              v-model="editStudent.Adresa_polaznika"
              label="Adresa polaznika"
            />
            <q-input
              filled
              v-model="editStudent.Kontakt_polaznika"
              label="Kontakt polaznika"
            />
            <q-input
              filled
              v-model="editStudent.Datum_upisa_polaznika"
              label="Datum upisa polaznika"
              type="date"
            />

            <div>
              <q-btn label="Spremi" type="submit" color="primary" />
              <q-btn
                label="Zatvori"
                color="primary"
                @click="onClose"
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>

    <q-dialog v-model="deleteDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Želite li zaista obrisati ovog polaznika?</div>
        </q-card-section>
        <q-card-actions>
          <q-btn flat label="Odustani" @click="deleteDialog = false" />
          <q-btn flat color="primary" label="Potvrdi" @click="confirmDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "boot/axios";

defineOptions({
  name: "StudentPage",
});

const status = ["Pohađa", "Završio", "Odustao"];

const columns = [
  {
    name: "ID_polaznika_tecaja",
    label: "ID",
    field: "ID_polaznika_tecaja",
    sortable: true,
  },
  {
    name: "ImePrezime_polaznika",
    label: "Ime i prezime",
    field: "ImePrezime_polaznika",
    sortable: true,
  },
  {
    name: "Status_polaznika",
    label: "Status",
    field: "Status_polaznika",
    sortable: true,
  },
  {
    name: "Adresa_polaznika",
    label: "Adresa",
    field: "Adresa_polaznika",
    sortable: true,
  },
  {
    name: "Kontakt_polaznika",
    label: "Kontakt",
    field: "Kontakt_polaznika",
    sortable: true,
  },
  {
    name: "Datum_upisa_polaznika",
    label: "Upisan",
    field: "Datum_upisa_polaznika",
    sortable: true,
    format: (val) => new Intl.DateTimeFormat("hr-HR").format(new Date(val)),
  },
];

const students = ref([]); // Inicijalno prazan niz
const student = ref([]);
const editStudent = ref({
  ID_polaznika_tecaja: null,
  ImePrezime_polaznika: "",
  Status_polaznika: "",
  Adresa_polaznika: "",
  Kontakt_polaznika: "",
  Datum_upisa_polaznika: "",
});

const showForm = ref(false);
const deleteDialog = ref(false);

// Funkcija za učitavanje podataka kad se klikne gumb "Pročitaj"
const onRead = async () => {
  try {
    const result = await api.get("/POLAZNIK_TECAJA");
    students.value = result.data; // Postavljanje podataka u students
    student.value = []; // Očistiti odabrani student
    showForm.value = false; // Zatvori formu ako je otvorena
  } catch (error) {
    console.error(error);
  }
};

// Funkcija za brisanje polaznika
const onDeleteRow = () => {
  deleteDialog.value = true;
};

const confirmDelete = async () => {
  try {
    await api.delete("/POLAZNIK_TECAJA", {
      data: { ID_polaznika_tecaja: student.value[0].ID_polaznika_tecaja },
    });
    onRead(); // Ponovno učitaj podatke
    student.value = []; // Očistiti odabrani student
  } catch (error) {
    console.error(error);
  }
  deleteDialog.value = false;
};

// Funkcija za dodavanje novog polaznika
const onAddRow = () => {
  student.value = [];
  editStudent.value = {
    ID_polaznika_tecaja: null,
    ImePrezime_polaznika: "",
    Status_polaznika: "",
    Adresa_polaznika: "",
    Kontakt_polaznika: "",
    Datum_upisa_polaznika: "",
  };
  showForm.value = true;
};

// Funkcija za uređivanje podataka odabranog polaznika
const onEditRow = () => {
  if (student.value.length > 0) {
    editStudent.value = { ...student.value[0] };
    showForm.value = true;
  } else {
    alert("Nema odabranog polaznika za izmjnu");
  }
};

// Funkcija za zatvaranje forme
const onClose = () => {
  editStudent.value = {
    ID_polaznika_tecaja: null,
    ImePrezime_polaznika: "",
    Status_polaznika: "",
    Adresa_polaznika: "",
    Kontakt_polaznika: "",
    Datum_upisa_polaznika: "",
  };
  showForm.value = false;
};

// Funkcija za spremanje podataka
const onSave = async () => {
  try {
    console.log("Podaci za spremanje:", editStudent.value);
    if (editStudent.value.ID_polaznika_tecaja === null) {
      await api.post("/POLAZNIK_TECAJA", editStudent.value);
    } else {
      await api.put("/POLAZNIK_TECAJA", editStudent.value);
    }
    onRead(); // Ponovno učitaj podatke
    onClose();
  } catch (error) {
    console.error("Greška pri spremanju", error);
  }
};

// Funkcija za postavljanje podataka za odabranog studenta
const onSelectedRow = () => {
  editStudent.value = { ...student.value[0] };
};

onMounted(() => {
  // Ne pozivam onRead() odmah, nego tek kad korisnik klikne gumb Pročitaj
});
</script>
