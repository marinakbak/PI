<template>
  <q-page class="q-pa-md">
    <div class="q-pa-md">
      <q-select
        filled
        v-model="selectedReport"
        :options="reportOptions"
        label="Odaberite izvješće"
        @update:model-value="fetchReport"
      />
    </div>

    <q-table
      v-if="reportData.length > 0"
      :title="selectedReport"
      :rows="reportData"
      :columns="columns"
      row-key="id"
      flat
    />

    <!-- Dodani gumbi za preuzimanje -->
    <div v-if="reportData.length > 0" class="q-mt-md">
      <q-btn label="Preuzmi PDF" @click="downloadPDF" color="primary" />
      <q-btn
        label="Preuzmi Excel"
        @click="downloadExcel"
        color="secondary"
        class="q-ml-sm"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { api } from "boot/axios";
import * as XLSX from "xlsx"; // za Excel
import { jsPDF } from "jspdf"; // za PDF
import "jspdf-autotable"; // Importanje dodatka za autoTable

const selectedReport = ref(null);
const reportData = ref([]);

const reportOptions = [
  { label: "Uplate po tečajevima", value: "UPLATE" },
  { label: "Položeni ispiti po polaznicima", value: "ISPITNO_POLAGANJE" },
  { label: "Nastavnici i broj tečajeva", value: "NASTAVNIK" },
  {
    label: "Polaznici koji nisu položili ispit",
    value: "polaznici_ne_polozili",
  },
];

const columns = ref([]);

const fetchReport = async () => {
  if (!selectedReport.value) return;

  try {
    const result = await api.get(`/IZVJESCA/${selectedReport.value.value}`);
    reportData.value = result.data;

    // Define columns for the report type
    if (selectedReport.value.value === "UPLATE") {
      columns.value = [
        { name: "Naziv_tecaja", label: "Tečaj", field: "Naziv_tecaja" },
        { name: "Broj_uplata", label: "Broj uplata", field: "Broj_uplata" },
        {
          name: "Ukupan_iznos",
          label: "Ukupan iznos (€)",
          field: "Ukupan_iznos",
        },
        {
          name: "Zadnja_uplata",
          label: "Zadnja uplata",
          field: "Zadnja_uplata",
          format: (val) =>
            new Intl.DateTimeFormat("hr-HR").format(new Date(val)),
        },
      ];
    } else if (selectedReport.value.value === "ISPITNO_POLAGANJE") {
      columns.value = [
        {
          name: "ImePrezime_polaznika",
          label: "Polaznik",
          field: "ImePrezime_polaznika",
        },
        {
          name: "Broj_polozenih_ispita",
          label: "Broj ispita",
          field: "Broj_polozenih_ispita",
        },
        {
          name: "Prosjecna_ocjena",
          label: "Prosj. ocjena",
          field: "Prosjecna_ocjena",
        },
      ];
    } else if (selectedReport.value.value === "NASTAVNIK") {
      columns.value = [
        {
          name: "ImePrezime_nastavnika",
          label: "Nastavnik",
          field: "ImePrezime_nastavnika",
        },
        {
          name: "Broj_tecajeva",
          label: "Broj tečajeva",
          field: "Broj_tecajeva",
        },
      ];
    } else if (selectedReport.value.value === "polaznici_ne_polozili") {
      columns.value = [
        {
          name: "ImePrezime_polaznika",
          label: "Polaznik",
          field: "ImePrezime_polaznika",
        },
        { name: "Naziv_tecaja", label: "Tečaj", field: "Naziv_tecaja" },
        { name: "Ocjena", label: "Ocjena", field: "Ocjena" },
      ];
    } else {
      result = await api.get(`/IZVJESCA/${selectedReport.value.value}`);
      reportData.value = result.data;
    }
  } catch (error) {
    console.error("Greška prilikom dohvaćanja izvješća:", error);
  }
};

// Funkcija za preuzimanje izvještaja u PDF formatu
const downloadPDF = () => {
  const doc = new jsPDF();

  doc.text(selectedReport.value.label, 10, 10); // Naslov izvještaja
  const data = reportData.value.map((item) => Object.values(item).join(" | ")); // Mapiranje podataka

  doc.autoTable({
    startY: 20,
    head: [columns.value.map((col) => col.label)], // Naslovi kolona
    body: data.map((row) => row.split(" | ")), // Podaci po redovima
  });

  doc.save(`${selectedReport.value.label}.pdf`);
};

// Funkcija za preuzimanje izvještaja u Excel formatu
const downloadExcel = () => {
  const ws = XLSX.utils.json_to_sheet(reportData.value);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, selectedReport.value.label);
  XLSX.writeFile(wb, `${selectedReport.value.label}.xlsx`);
};
</script>
