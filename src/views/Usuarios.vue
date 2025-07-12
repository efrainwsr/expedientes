<script setup>
import AdminCrearUsuarioFrm from '../components/AdminCrearUsuarioFrm.vue'
import AdminVerUsuariosTable from '../components/AdminVerUsuariosTable.vue';
import {ref} from 'vue';

const userTable = ref(null);

const refreshUserTable = () => {
    if (userTable.value && userTable.value.refreshUsers) {
        userTable.value.refreshUsers();
    }
};

</script>

<template>
    <AdminCrearUsuarioFrm @user-created="refreshUserTable" />
    <AdminVerUsuariosTable ref="userTable" />
</template>

