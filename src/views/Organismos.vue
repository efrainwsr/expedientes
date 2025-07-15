<script setup>
    import { ref } from 'vue';
    import OrganismosFrm from '../components/OrganismosFrm.vue';
    import OrganismosTable from '../components/OrganismosTable.vue';


const orgTable = ref(null);
const userToEdit = ref(null);
const modalVisible = ref(false); // Controlamos la visibilidad desde el padre

const refreshOrgTable = () => {
    if (orgTable.value && orgTable.value.refreshOrg) {
        orgTable.value.refreshOrg();
    }
};

const cargarDatosUsuario = (data) => {
    userToEdit.value = data;
    modalVisible.value = true; // Mostramos el modal al cargar datos
    console.log('Datos del usuario cargados:', userToEdit.value);
};

const cerrarModal = () => {
    modalVisible.value = false;
    userToEdit.value = null;
};
</script>
        

<template>
    <OrganismosFrm @org-created="refreshOrgTable" />
    <OrganismosTable @refresh="refreshOrgTable" ref="orgTable" />
</template>