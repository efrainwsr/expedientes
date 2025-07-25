<script setup>
import { ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import {validateForm } from '../utils.js';
import * as yup from 'yup';
import { updateBanda } from "../service/bandasService.js";
const toast = useToast();

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  bandaData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'refresh']);

const editedBanda = ref({...props.bandaData});

const BandaSchema = yup.object({
  nombre: yup.string().required('El nombre es obligatorio'),
  descripcion: yup.string(),
  zona: yup.string(),
  activo: yup.boolean().required('Status es obligatorio'),
});



// Copiamos los datos del usuario al recibirlos
watch(() => props.bandaData, (newData) => {
  editedBanda.value = {...newData};
}, { immediate: true });


const cancelar = () => {
  emit('close');
};

const dropDownStatus = ref([
  { name: 'Activo', code: true },
  { name: 'Inactivo', code: false }
]);



const updateBandaData = ref({
  id_banda: props.bandaData.id_banda,
  nombre: props.bandaData.nombre,
  descripcion: props.bandaData.descripcion,
  zona: props.bandaData.zona,
  activo: true
});
const errors = ref({});


const guardarCambios = async () => {
  const validationResult = await validateForm(BandaSchema, updateBandaData.value);
    if (!validationResult.isValid) {
        errors.value = validationResult.errors;
    } else {
        errors.value = {};
        if (updateBandaData.value.pass && updateBandaData.value.pass.trim() !== '') {
             updateBandaData.value.pass = updateBandaData.value.pass;
    }
        //console.log('Datos a enviar:', updateOrgData.value);
        const data = await updateBanda(updateBandaData.value);

        if(data.error){
            toast.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
            return;
        }else if(data.data.error){
           toast.add({ severity: 'error', summary: 'Error', detail: data.data.message.message, life: 3000 });
           return
        }else{
           toast.add({ severity: 'success', summary: 'Exito', detail: 'Los cambios han sido guardados.', life: 3000 });
           updateBandaData.value = {
                nombre: "", descripcion:"", zona:"", activo: true
            };
            emit('banda-created');
            emit('refresh');
            emit('close');
        }
        console.log(data);
      }
  console.log('Guardando cambios:', editedBanda.value);
  
};


</script>

<template>
  <Dialog 
    v-model:visible="props.visible" 
    modal 
    header="Editar bandar" 
    @update:visible="(val) => !val && cancelar()"
    :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"  >
    <template #header>
      <div class="inline-flex items-center justify-center gap-2">
       <!-- <Avatar 
          :image="editedOrg.avatar || 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png'" 
          shape="circle" 
        /> -->
        <span class="font-bold whitespace-nowrap">{{ editedBanda.nombre.toUpperCase() }} </span>
      </div>
    </template>

<div class="p-fluid formgrid grid">
        <div class="field col-12 md:col-4">
          <label for="nombre">Nombre</label>
          <InputText placeholder="Ej. Guardia Nacional Bolivariana" v-model="updateBandaData.nombre" id="nombre" type="text" :class="{ 'p-invalid': errors.nombre }" />
          <small v-if="errors.nombre" class="p-error">{{ errors.nombre }}</small>
        </div>

        <div class="field col-12 md:col-4">
          <label for="descripcion">Descripcion</label>
          <InputText placeholder="Ej. GNB" v-model="updateBandaData.descripcion" id="siglas" type="text" :class="{ 'p-invalid': errors.descripcion }" />
          <small v-if="errors.descripcion" class="p-error">{{ errors.descripcion }}</small>
        </div>

        <div class="field col-12 md:col-4">
          <label for="zona">Zona</label>
          <InputText placeholder="Ej. GNB" v-model="updateBandaData.zona" id="siglas" type="text" :class="{ 'p-invalid': errors.zona }" />
          <small v-if="errors.zona" class="p-error">{{ errors.zona }}</small>
        </div>
        
        <div class="field col-12 md:col-3">
          <label for="status">Status</label>
          <Dropdown v-model="updateBandaData.activo" class="capitalize" id="status" optionValue="code" :options="dropDownStatus" optionLabel="name" placeholder="Seleccione..."  :class="{ 'p-invalid': errors.activo }" />
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