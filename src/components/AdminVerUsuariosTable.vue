<template>
    <div class="card">
        <div class="relative mb-4" style="position: relative;">
        <h5>Usuarios registrados</h5>
        <!-- Botón posicionado en el borde derecho del card -->
            <Button
                label=""
                icon="pi pi-file-pdf"
                class="p-button-sm"
                severity="danger"
                outlined
                :style="{ position: 'absolute', right: '0', top: '0' }"
                @click="openModal(null)"
            />
            </div>
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
                <!-- <i  @click="generarPdf(data)"  class="edit-button pi pi-file-pdf text-red-500" ></i>-->
            </template> 
        </Column> 
    </DataTable>


<Dialog 
    v-model:visible="modalFechaReporte" 
    modal 
    header="Reporte usuarios registrados" 
    :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"  >
    <template #header>
        <div class="inline-flex items-center justify-center gap-2">
            <span class="font-bold whitespace-nowrap">Seleccione un rango de fechas</span>
        </div>
    </template>
    
    <div class="p-fluid formgrid grid">
        <div class="field col-12 md:col-4">
            <label for="nombre">Fecha inicio</label>
            <input type="date" id="inicio" v-model="rangoFechas.inicio" :class="{ 'p-invalid': errors.inicio }" class="p-inputtext p-component p-filled w-full"/>
            <small v-if="errors.inicio" class="p-error">{{ errors.inicio }}</small>
        </div>
        
        <div class="field col-12 md:col-4">
            <label for="fin">Fecha fin</label>
        
            <input type="date" id="fin" v-model="rangoFechas.fin" :class="{ 'p-invalid': errors.fin }" class="p-inputtext p-component p-filled w-full"/>
            <small v-if="errors.fin" class="p-error">{{ errors.fin }}</small>
        </div>
    </div>
    
    <template #footer>
        <Button 
        label="Cancelar" 
        text 
        severity="danger" 
        @click="modalFechaReporte = false" 
        />
        <Button 
        label="Generar" 
        outlined 
        severity="success" 
        @click="handleReporte(selectedUser)" 
        />
    </template>
</Dialog>


<Dialog
    v-model:visible="modalGeneral" 
    modal 
    header="Reporte usuarios registrados" 
    :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"  >
    <template #header>
        <div class="inline-flex items-center justify-center gap-2">
            <span class="font-bold whitespace-nowrap">Seleccione un rango de fechas</span>
        </div>
    </template>
    
    <div class="p-fluid formgrid grid">
        <div class="field col-12 md:col-4">
            <label for="nombre">Fecha inicio</label>
            <!--<InputMask id="inicio" v-model="rangoFechas.inicio" placeholder="" mask="99/99/9999" slotChar="dd/mm/yyyy" :class="{ 'p-invalid': errors.inicio }" />-->
            <input type="date" id="inicio" v-model="rangoFechas.inicio" :class="{ 'p-invalid': errors.inicio }" class="p-inputtext p-component p-filled w-full"/>
            <small v-if="errors.inicio" class="p-error">{{ errors.inicio }}</small>
        </div>
        
        <div class="field col-12 md:col-4">
            <label for="fin">Fecha fin</label>
            <!--<InputMask placeholder="" v-model="rangoFechas.fin" id="fin" mask="99/99/9999" slotChar="dd/mm/yyyy" :class="{ 'p-invalid': errors.fin }" /> -->
            <input type="date" id="fin" v-model="rangoFechas.fin" :class="{ 'p-invalid': errors.fin }" class="p-inputtext p-component p-filled w-full"/>
            <small v-if="errors.fin" class="p-error">{{ errors.fin }}</small>
        </div>
    </div>
    
    <template #footer>
        <Button 
        label="Cancelar" 
        text 
        severity="danger" 
        @click="modalFechaReporte = false" 
        />
        <Button 
        label="Generar" 
        outlined 
        severity="success" 
        @click="handleReporte(selectedUser)" 
        />
    </template>
</Dialog>



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
import {validateForm } from '../utils.js';
import * as yup from 'yup';
import {pdfUsuarios} from '../reportes/pdfUsuarios.js';

// Importa tu servicio de usuarios
import { getAllUsers } from '../service/adminService.js';

const emit = defineEmits(['cargar-usuario']);
const users = ref(); //variable que guarda todos los usuarios 
const filters = ref();
const loading = ref(false);
const selectedUser = ref(null);
const errors = ref({});

const cargarDatosUsuario = (data) => {
    emit('cargar-usuario', data); // Emit the entire 'data' object
};

// Opciones para el filtro de roles
const roleOptions = ref([
{ label: 'Administrador', value: '0' },
{ label: 'Operador', value: '1' },
{ label: 'Consulta', value: '2' },
]);

// Variables para el modal de fechas
const modalGeneral = ref(false);
const modalFechaReporte = ref(false);
const rangoFechas = ref({
    inicio: null,
    fin: null
});

const fechaSchema = yup.object({
    inicio: yup.string().required('Fecha de inicio obligatoria'),
    fin: yup.string().required('Fecha final obligatoria'),
});


const generarPdf = (data) => {
    console.log('Generando PDF para el usuario:', data);
};

const openModal = (data) => {
    if(data === null){
        modalFechaReporte.value = true;
        selectedUser.value = null;
        return;
    }
    
    modalFechaReporte.value = true;
    selectedUser.value = data;
    return;
};

const handleReporte = async (selectedUser) => {
    
    const validationResult = await validateForm(fechaSchema, rangoFechas.value);
    if (!validationResult.isValid) {
        errors.value = validationResult.errors;
        return;
    }
    errors.value = {};

    if(selectedUser === null){
        await pdfUsuarios(selectedUser, rangoFechas.value);
        modalFechaReporte.value = false; 
        return;
    }
        await pdfUsuarios(selectedUser, rangoFechas.value); 
        modalFechaReporte.value = false; 
};

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