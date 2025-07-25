<script setup>
    import { ref } from 'vue';
    import DelitosFrm from '../components/DelitosFrm.vue';
    import DelitosTable from '../components/DelitosTable.vue';
    import DelitosEdit from '../components/DelitosEdit.vue';


const delitosTable = ref(null);
const delitoToEdit = ref(null);
const modalVisible = ref(false); // Controlamos la visibilidad desde el padre

const refreshDelitoTable = () => {
    if (delitosTable.value && delitosTable.value.refreshDelito) {
        delitosTable.value.refreshDelito(); //Funcion en DelitosTable.vue para obtener los delitos
    }
};

const cargarDatosDelitos = (data) => {
    console.log('Datos del delito cargados:', data);
    delitoToEdit.value = data;
    modalVisible.value = true; // Mostramos el modal al cargar datos
};

const cerrarModal = () => {
    modalVisible.value = false;
    delitoToEdit.value = null;
};
</script>
        

<template>
    <DelitosFrm @delito-created="refreshDelitoTable" :initialDelitoData="delitoToEdit" />
    <DelitosTable @cargar-delitos="cargarDatosDelitos" ref="delitosTable" />
    <DelitosEdit v-if="modalVisible" 
                    :visible="modalVisible" 
                    :delitoData="delitoToEdit" 
                    @close="cerrarModal" 
                    @refresh="refreshDelitoTable" />
</template>