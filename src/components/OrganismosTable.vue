<template>
    <div class="card">
        <h5>Organismos Aprehensores</h5>
        <DataTable size="small" v-model:filters="filters" :value="org" paginator showGridlines :rows="10" dataKey="id_organismo"
            filterDisplay="menu" :loading="loading"
            :globalFilterFields="['nombre', 'siglas', 'activo']">
            
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

            <Column field="nombre" header="Nombre" style="min-width: 8rem; text-transform: capitalize; ">
                <template #body="{ data }">
                    {{ data.nombre }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Buscar por Nombre" />
                </template>
            </Column>

            <Column field="siglas" header="Siglas" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.siglas.toUpperCase()  }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Buscar por nombre siglas" />
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
import { capitalize } from 'vue';

// Importa tu servicio de usuarios
import { getAllOrg } from '../service/orgService.js';

const emit = defineEmits(['cargar-usuario']);
const org = ref(); //variable que guarda todos los usuarios 
const filters = ref();
const loading = ref(false);

const cargarDatosUsuario = (data) => {
    emit('cargar-usuario', data); // Emit the entire 'data' object
};


onMounted(() => {
    //loading.value = true;
    getAllOrg().then((data) => {
        org.value = data.data; // Accede a la propiedad 'data' de tu JSON
        //loading.value = false;
    });
});

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nombre: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        siglas: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        activo: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
    };
};

// Inicializa los filtros al cargar el componente
initFilters();

const clearFilter = () => {
    initFilters();
};


// Método para refrescar los organismos
const refreshOrg = async () => {
    const data = await getAllOrg();
    org.value = data.data;
};

// Expón el método para que sea accesible desde el padre
defineExpose({
    refreshOrg
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