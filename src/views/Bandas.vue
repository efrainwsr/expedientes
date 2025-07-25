<script setup>
    import { ref } from 'vue';
    import BandasFrm from '../components/BandasFrm.vue';
    import BandasTable from '../components/BandasTable.vue';
    import BandasEdit from '../components/BandasEdit.vue';


const bandasTable = ref(null);
const bandaToEdit = ref(null);
const modalVisible = ref(false); // Controlamos la visibilidad desde el padre

const refreshBandasTable = () => {
    if (bandasTable.value && bandasTable.value.refreshBandas) {
        bandasTable.value.refreshBandas(); //Funcion en bandasTable.vue para obtener los organismos
    }
};

const cargarDatosBanda = (data) => {
    console.log('Datos de la banda cargados:', data);
    bandaToEdit.value = data;
    modalVisible.value = true; // Mostramos el modal al cargar datos
};

const cerrarModal = () => {
    modalVisible.value = false;
    bandaToEdit.value = null;
};
</script>
        

<template>
    <BandasFrm @banda-created="refreshBandasTable" :initialBandasData="bandaToEdit" />
    <BandasTable @cargar-banda="cargarDatosBanda" ref="bandasTable" />
    <BandasEdit v-if="modalVisible" 
                    :visible="modalVisible" 
                    :bandaData="bandaToEdit" 
                    @close="cerrarModal" 
                    @refresh="refreshBandasTable" />
</template>