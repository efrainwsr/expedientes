<script setup>
    import { ref } from 'vue';
    import OrganismosFrm from '../components/OrganismosFrm.vue';
    import OrganismosTable from '../components/OrganismosTable.vue';
    import OrganismosEdit from '../components/OrganismosEdit.vue';


const orgTable = ref(null);
const orgToEdit = ref(null);
const modalVisible = ref(false); // Controlamos la visibilidad desde el padre

const refreshOrgTable = () => {
    if (orgTable.value && orgTable.value.refreshOrg) {
        orgTable.value.refreshOrg(); //Funcion en orgTable.vue para obtener los organismos
    }
};

const cargarDatosOrg = (data) => {
    console.log('Datos del organismo cargados:', data);
    orgToEdit.value = data;
    modalVisible.value = true; // Mostramos el modal al cargar datos
};

const cerrarModal = () => {
    modalVisible.value = false;
    orgToEdit.value = null;
};
</script>
        

<template>
    <OrganismosFrm @org-created="refreshOrgTable" :initialOrgData="orgToEdit" />
    <OrganismosTable @cargar-org="cargarDatosOrg" ref="orgTable" />
    <OrganismosEdit v-if="modalVisible" 
                    :visible="modalVisible" 
                    :orgData="orgToEdit" 
                    @close="cerrarModal" 
                    @refresh="refreshOrgTable" />
</template>