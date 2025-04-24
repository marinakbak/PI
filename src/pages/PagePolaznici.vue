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
        @update:selected="onSelectedRow"
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
          <q-btn
            color="blue"
            label="Polaznici na tečaju"
            @click="onShowPolazniciNaTecaju"
            icon="school"
          />
        </template>
        <template v-slot:bottom-row>
          <q-inner-loading :showing="loading" label="Učitavanje..." />
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

    <!-- Dijalog za potvrdu brisanja -->
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

    <!-- Dijalog za prikaz polaznika na tečaju -->
    <q-dialog v-model="showPolazniciNaTecaju" maximized>
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">Polaznici na tečajevima</div>
          <q-space />
          <q-btn
            icon="close"
            flat
            round
            dense
            @click="showPolazniciNaTecaju = false"
          />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-table
            :rows="polazniciNaTecaju"
            :columns="columnsPolaznikNaTecaju"
            row-key="ID_polaznika_na_tecaju"
            flat
            :loading="loading"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "boot/axios";
import { useRouter } from "vue-router";

const router = useRouter();

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

const columnsPolaznikNaTecaju = [
  {
    name: "Naziv_tecaja",
    label: "Tečaj",
    align: "left",
    field: "Naziv_tecaja",
    sortable: true,
  },
  {
    name: "ImePrezime_polaznika",
    label: "Polaznik",
    align: "left",
    field: "ImePrezime_polaznika",
    sortable: true,
  },
  {
    name: "Datum_upisa_polaznika",
    label: "Datum upisa",
    align: "right",
    field: "Datum_upisa_polaznika",
    sortable: true,
    format: (val) => new Intl.DateTimeFormat("hr-HR").format(new Date(val)),
  },
];

// State
const students = ref([]);
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
const showPolazniciNaTecaju = ref(false);
const polazniciNaTecaju = ref([]);
const loading = ref(false);

// Fetch data
const onRead = async () => {
  try {
    loading.value = true;
    const result = await api.get("/POLAZNIK_TECAJA");
    students.value = result.data;
    student.value = [];
    showForm.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const onShowPolazniciNaTecaju = async () => {
  try {
    loading.value = true;
    const result = await api.get("/POLAZNIK_NA_TECAJU");
    polazniciNaTecaju.value = result.data;
    showPolazniciNaTecaju.value = true;
  } catch (error) {
    console.error("Greška pri dohvaćanju polaznika na tečaju", error);
  } finally {
    loading.value = false;
  }
};

// Row actions
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

const onEditRow = () => {
  if (student.value.length > 0) {
    editStudent.value = { ...student.value[0] };
    showForm.value = true;
  } else {
    alert("Nema odabranog polaznika za izmjenu");
  }
};

const onDeleteRow = () => {
  deleteDialog.value = true;
};

const confirmDelete = async () => {
  try {
    await api.delete("/POLAZNIK_TECAJA", {
      data: { ID_polaznika_tecaja: student.value[0].ID_polaznika_tecaja },
    });
    onRead();
    student.value = [];
  } catch (error) {
    console.error(error);
  }
  deleteDialog.value = false;
};

const onClose = () => {
  showForm.value = false;
};

const onSave = async () => {
  try {
    if (editStudent.value.ID_polaznika_tecaja === null) {
      await api.post("/POLAZNIK_TECAJA", editStudent.value);
    } else {
      await api.put("/POLAZNIK_TECAJA", editStudent.value);
    }
    onRead();
    onClose();
  } catch (error) {
    console.error("Greška pri spremanju", error);
  }
};

const onSelectedRow = () => {
  editStudent.value = { ...student.value[0] };
};

onMounted(() => {
  // onRead se poziva ručno klikom na gumb
});
</script>

<style lang="sass" scoped>
.q-btn
  margin-top: 10px

.q-table
  max-width: 100%
</style>
