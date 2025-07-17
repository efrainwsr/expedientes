<script setup>
import { ref, watch } from "vue";
import { updateOrg } from '../service/OrgService.js';
import { useToast } from "primevue/usetoast";
import {validateForm } from '../utils.js';
import * as yup from 'yup';
const toast = useToast();

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  orgData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'refresh']);

const editedOrg = ref({...props.orgData});

const orgSchema = yup.object({
  nombre: yup.string().required('El nombre es obligatorio'),
  siglas: yup.string().required('Las siglas son obligatorias'),
  activo: yup.boolean().required('Status es obligatorio'),
});



// Copiamos los datos del usuario al recibirlos
watch(() => props.orgData, (newData) => {
  editedOrg.value = {...newData};
}, { immediate: true });


const cancelar = () => {
  emit('close');
};

const dropDownStatus = ref([
  { name: 'Activo', code: true },
  { name: 'Inactivo', code: false }
]);



const updateOrgData = ref({
  id_organismo: props.orgData.id_organismo,
  nombre: props.orgData.nombre,
  siglas: props.orgData.siglas,
  activo: true
});
const errors = ref({});


const guardarCambios = async () => {
  const validationResult = await validateForm(orgSchema, updateOrgData.value);
    if (!validationResult.isValid) {
        errors.value = validationResult.errors;
    } else {
        errors.value = {};
        if (updateOrgData.value.pass && updateOrgData.value.pass.trim() !== '') {
             updateOrgData.value.pass = updateOrgData.value.pass;
    }
        //console.log('Datos a enviar:', updateOrgData.value);
        const data = await updateOrg(updateOrgData.value);

        if(data.error){
            toast.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
            return;
        }else if(data.data.error){
           toast.add({ severity: 'error', summary: 'Error', detail: data.data.message.message, life: 3000 });
           return
        }else{
           toast.add({ severity: 'success', summary: 'Exito', detail: 'Los cambios han sido guardados.', life: 3000 });
           updateOrgData.value = {
                nombre: null, siglas:null, activo: true
            };
            emit('org-created');
            emit('refresh');
            emit('close');
        }
        console.log(data);
      }
  console.log('Guardando cambios:', editedOrg.value);
  
};


</script>

<template>
  <Dialog 
    v-model:visible="props.visible" 
    modal 
    header="Editar Organismo Aprehensor" 
    @update:visible="(val) => !val && cancelar()"
    :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"  >
    <template #header>
      <div class="inline-flex items-center justify-center gap-2">
       <!-- <Avatar 
          :image="editedOrg.avatar || 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png'" 
          shape="circle" 
        /> -->
        <span class="font-bold whitespace-nowrap">{{ editedOrg.nombre }} </span>
      </div>
    </template>

<div class="p-fluid formgrid grid">
        <div class="field col-12 md:col-4">
          <label for="nombre">Nombre</label>
          <InputText placeholder="Ej. Guardia Nacional Bolivariana" v-model="updateOrgData.nombre" id="nombre" type="text" :class="{ 'p-invalid': errors.nombre }" />
          <small v-if="errors.nombre" class="p-error">{{ errors.nombre }}</small>
        </div>

        <div class="field col-12 md:col-4">
          <label for="siglas">Siglas</label>
          <InputText placeholder="Ej. GNB" v-model="updateOrgData.siglas" id="siglas" type="text" :class="{ 'p-invalid': errors.siglas }" />
          <small v-if="errors.siglas" class="p-error">{{ errors.siglas }}</small>
        </div>
        
        <div class="field col-12 md:col-3">
          <label for="status">Status</label>
          <Dropdown v-model="updateOrgData.activo" class="capitalize" id="status" optionValue="code" :options="dropDownStatus" optionLabel="name" placeholder="Seleccione..."  :class="{ 'p-invalid': errors.activo }" />
          <small v-if="errors.activo" class="p-error">{{ errors.activo }}</small>
        </div>
    </div>

    <template #footer>
      <Button 
        label="Cancelar" 
        text 
        severity="danger" 
        @click="cancelar" 
      />
      <Button 
        label="Guardar" 
        outlined 
        severity="success" 
        @click="guardarCambios" 
      />
    </template>
  </Dialog>
</template>