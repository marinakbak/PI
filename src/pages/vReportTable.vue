<template>
  <q-page>
    <div class="q-pa-md">
      <!-- Ovdje pozivamo generički izvještaj -->
      <ReportTable
        :data="students"
        :columns="columns"
        :statusOptions="status"
        :courseOptions="courses"
        title="Izvještaj o polaznicima"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "boot/axios";
import ReportTable from "src/pages/vReportTable.vue"; // Import generičke komponente

const status = ["Pohađa", "Završio", "Odustao"];
const selectedStatus = ref(null);
const students = ref([]); // Lista svih polaznika
const columns = [
  { name: "ID_polaznika_tecaja", label: "ID", field: "ID_polaznika_tecaja" },
  {
    name: "ImePrezime_polaznika",
    label: "Ime i prezime",
    field: "ImePrezime_polaznika",
  },
  { name: "Status_polaznika", label: "Status", field: "Status_polaznika" },
  { name: "Adresa_polaznika", label: "Adresa", field: "Adresa_polaznika" },
  { name: "Kontakt_polaznika", label: "Kontakt", field: "Kontakt_polaznika" },
  {
    name: "Datum_upisa_polaznika",
    label: "Upisan",
    field: "Datum_upisa_polaznika",
  },
];

const courses = ref([]);

onMounted(async () => {
  try {
    const result = await api.get("/POLAZNIK_TECAJA");
    students.value = result.data;
    const courseResult = await api.get("/TECAJ");
    courses.value = courseResult.data.map((course) => ({
      label: course.naziv,
      value: course.id,
    }));
  } catch (error) {
    console.error(error);
  }
});
</script>
