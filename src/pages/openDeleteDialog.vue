<q-dialog v-model="openDeleteDialog">
  <q-card>
    <q-card-section>
      <div class="text-h6">
        Da li ste sigurni da želite obrisati ovaj materijal?
      </div>
    </q-card-section>
    <q-card-actions>
      <q-btn flat label="Ne" color="negative" @click="onCancelDelete" />
      <q-btn flat label="Da" color="primary" @click="onConfirmDelete" />
    </q-card-actions>
  </q-card>
</q-dialog>
const onDeleteRow = (material) => { materialToDelete.value = material; //
Postavlja materijal koji treba obrisati openDeleteDialog.value = true; // Otvara
dijalog };
