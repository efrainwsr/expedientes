<template>
    <div class="card">
        <h5>Delitos</h5>
        <DataTable size="small" v-model:filters="filters" :value="delitos" paginator showGridlines :rows="10" dataKey="id_delito"
            filterDisplay="menu" :loading="loading"
            :globalFilterFields="['nombre', 'descripcion', 'activo']">
            
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
            
            <template #empty> No se encontraron delitos. </template>
            <template #loading> Cargando listado delitos. Por favor, espere. </template>

            <Column field="nombre" header="Nombre" style="min-width: 8rem; text-transform: capitalize; ">
                <template #body="{ data }">
                    {{ data.nombre }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Buscar por Nombre" />
                </template>
            </Column>

            <Column field="siglas" header="Descripcion" style="min-width: 12rem">
                <template #body="{ data }">
                    <span v-tooltip.top="data.descripcion">
                        {{ data.descripcion.length > 50 ? data.descripcion.substring(0, 50) + '...' : data.descripcion }}
                    </span>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Buscar por descripcion" />
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
                    <i  @click="cargarDatosDelitos(data)"  class="edit-button pi pi-file-edit text-yellow-500" ></i>
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
import Checkbox from 'primevue/checkbox';

// Importa tu servicio de usuarios
import { getAllDelitos } from '../service/delitosService.js';

const emit = defineEmits(['cargar-delitos']);
const delitos = ref(); //variable que guarda todos los usuarios 
const filters = ref();
const loading = ref(false);

// emitir evento para abrir el modal y cargar los datos del organismo seleccionado
const cargarDatosDelitos = (data) => {
    emit('cargar-delitos', data); // emitir el evento con los datos del organismo a la vista padre
};

// Método para refrescar los organismos
const refreshDelito = async () => {
    const data = await getAllDelitos();
    delitos.value = data.data;
};

// Expón el método para que sea accesible desde el padre
defineExpose({
    refreshDelito
});


onMounted(() => {
    //loading.value = true;
    getAllDelitos().then((data) => {
        delitos.value = data.data; // Accede a la propiedad 'data' de tu JSON
        //loading.value = false;
        //console.log('Delitos cargados:', delitos.value);
    });
});

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nombre: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        descripcion: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        activo: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
    };
};

// Inicializa los filtros al cargar el componente
initFilters();

const clearFilter = () => {
    initFilters();
};





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