<script setup>
import AdminCrearUsuarioFrm from '../components/AdminCrearUsuarioFrm.vue'
import AdminVerUsuariosTable from '../components/AdminVerUsuariosTable.vue';
import AdminEditUsuario from '../components/AdminEditUsuario.vue';
import {ref} from 'vue';

const userTable = ref(null);
const userToEdit = ref(null);
const modalVisible = ref(false); // Controlamos la visibilidad desde el padre

const refreshUserTable = () => {
    if (userTable.value && userTable.value.refreshUsers) {
        userTable.value.refreshUsers();
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
    <AdminCrearUsuarioFrm
        @user-created="refreshUserTable"
        :initialUserData="userToEdit"
    />
    <AdminVerUsuariosTable @cargar-usuario="cargarDatosUsuario" ref="userTable" />
    
    <AdminEditUsuario
        v-if="userToEdit"
        :visible="modalVisible"
        :userData="userToEdit"
        @close="cerrarModal"
        @refresh="refreshUserTable"
    />
</template>