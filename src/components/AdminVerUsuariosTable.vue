<template>
    <div class="card">
        <h5>Usuarios registrados</h5>
        <DataTable size="small" v-model:filters="filters" :value="users" paginator showGridlines :rows="10" dataKey="id_usuario"
            filterDisplay="menu" :loading="loading"
            :globalFilterFields="['username', 'nombre', 'apellido', 'cedula', 'roles', 'activo']">
            
            <template #header>
                <div class="flex justify-between items-center">
                    <Button type="button" icon="pi pi-filter-slash" label="Limpiar Filtros" outlined @click="clearFilter()" />
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search"></i>
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Buscar por palabra clave" />
                    </IconField>
                </div>
            </template>
            
            <template #empty> No se encontraron usuarios. </template>
            <template #loading> Cargando datos de usuarios. Por favor, espere. </template>

            <Column field="id_usuario" header="ID" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.id_usuario }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Buscar por ID" />
                </template>
            </Column>

            <Column field="username" header="Usuario" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.username }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Buscar por nombre de usuario" />
                </template>
            </Column>

            <Column field="cedula" header="Cedula" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.cedula }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Buscar por cédula" />
                </template>
            </Column>

            <Column field="nombre" header="Nombre" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.nombre }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Buscar por nombre" />
                </template>
            </Column>

            <Column field="apellido" header="Apellido" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.apellido }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Buscar por apellido" />
                </template>
            </Column>

            <Column field="roles" header="Tipo" :filterMenuStyle="{ width: '14rem' }" style="min-width: 10rem">
                <template #body="{ data }">
                    <Tag :value="getRoleName(data.roles)" :severity="getRoleSeverity(data.roles)" />
                </template>
                <template #filter="{ filterModel }">
                    <Select v-model="filterModel.value" :options="roleOptions" optionLabel="label" optionValue="value" placeholder="Seleccionar Rol" showClear>
                        <template #option="slotProps">
                            <Tag :value="slotProps.option.label" :severity="getRoleSeverity(slotProps.option.value)" />
                        </template>
                    </Select>
                </template>
            </Column>

            <Column field="activo" header="Estatus" dataType="boolean" bodyClass="text-center" style="min-width: 8rem">
                <template #body="{ data }">
                    <i class="pi" :class="{ 'pi-check-circle text-green-500': data.activo === 1, 'pi-times-circle text-red-500': data.activo === 0 }"></i>
                </template>
                <template #filter="{ filterModel }">
                    <label for="active-filter" class="font-bold mr-2"> Activo </label>
                    <Checkbox v-model="filterModel.value" :indeterminate="filterModel.value === null" binary inputId="active-filter" />
                </template>
            </Column>

            <Column  field="accion" header="Accion"  bodyClass="text-center" style="min-width: 8rem">
                <template #body="{ data }">
                    <i  @click="cargarDatosUsuario(data)"  class="edit-button pi pi-file-edit text-yellow-500" ></i>
                </template>
            </Column>

        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api'; // Importar para filtros
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import Checkbox from 'primevue/checkbox';

// Importa tu servicio de usuarios
import { getAllUsers } from '../service/adminService.js';

const emit = defineEmits(['cargar-usuario']);
const users = ref(); //variable que guarda todos los usuarios 
const filters = ref();
const loading = ref(false);

const cargarDatosUsuario = (data) => {
    emit('cargar-usuario', data); // Emit the entire 'data' object
};

// Opciones para el filtro de roles
const roleOptions = ref([
    { label: 'Administrador', value: '0' },
    { label: 'Operador', value: '1' },
    { label: 'Consulta', value: '2' },
]);

onMounted(() => {
    //loading.value = true;
    getAllUsers().then((data) => {
        users.value = data.data; // Accede a la propiedad 'data' de tu JSON
        //loading.value = false;
    });
});

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        id_usuario: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        username: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        cedula: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        nombre: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        apellido: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        roles: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        activo: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
    };
};

// Inicializa los filtros al cargar el componente
initFilters();

const clearFilter = () => {
    initFilters();
};

// Funciones auxiliares para mostrar los roles y su severidad
const getRoleName = (roleValue) => {
    switch (roleValue) {
        case '0':
            return 'Administrador';
        case '1':
            return 'Operador';
        case '2':
            return 'Consulta';
        default:
            return 'Desconocido';
    }
};

const getRoleSeverity = (roleValue) => {
    switch (roleValue) {
        case '0':
            return 'danger'; // O 'error' o 'warning'
        case '1':
            return 'warning';
        case '2':
            return 'info';
        default:
            return null;
    }
};

// Método para refrescar los usuarios
const refreshUsers = async () => {
    const data = await getAllUsers();
    users.value = data.data;
};

// Expón el método para que sea accesible desde el padre
defineExpose({
    refreshUsers
});
</script>

<style scoped>
/* Puedes añadir estilos específicos para tu componente aquí */
/* Por ejemplo, si los iconos no se ven bien, podrías necesitar */
/* importar los estilos de PrimeIcons en tu archivo principal CSS */
/* o en tu configuración de TailwindCSS si lo usas. */

/* Ejemplo de importación si no lo tienes globalmente: */
/* @import 'primeicons/primeicons.css'; */

/* Estilos para el Tag (si quieres que se vea diferente) */
.p-tag {
    min-width: 6rem; /* Ajusta el ancho mínimo del Tag si es necesario */
    text-align: center;
}


.edit-button {
    /* Estilos base del botón */
     /* Un verde amigable */

    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease; /* Suaviza la transición */
}

.edit-button:hover {
    color: white; /* Cambia el color del texto al pasar el mouse */
}
</style>