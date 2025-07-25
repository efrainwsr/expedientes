<script setup>
import { ref, watch } from "vue";
import { updateDelito } from '../service/delitosService.js';
import { useToast } from "primevue/usetoast";
import {validateForm } from '../utils.js';
import * as yup from 'yup';
const toast = useToast();

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  delitoData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'refresh']);

const editedDelito = ref({...props.delitoData});

const delitoSchema = yup.object({
  nombre: yup.string().required('El nombre es obligatorio'),
  descripcion: yup.string(),
  activo: yup.boolean().required('Status es obligatorio'),
});



// Copiamos los datos del usuario al recibirlos
watch(() => props.delitoData, (newData) => {
  editedDelito.value = {...newData};
}, { immediate: true });


const cancelar = () => {
  emit('close');
};

const dropDownStatus = ref([
  { name: 'Activo', code: true },
  { name: 'Inactivo', code: false }
]);



const updateDelitoData = ref({
  id_delito: props.delitoData.id_delito,
  nombre: props.delitoData.nombre,
  descripcion: props.delitoData.descripcion,
  activo: true
});
const errors = ref({});


const guardarCambios = async () => {
  const validationResult = await validateForm(delitoSchema, updateDelitoData.value);
    if (!validationResult.isValid) {
        errors.value = validationResult.errors;
    } else {
        errors.value = {};
        if (updateDelitoData.value.pass && updateDelitoData.value.pass.trim() !== '') {
             updateDelitoData.value.pass = updateDelitoData.value.pass;
    }
        //console.log('Datos a enviar:', updateOrgData.value);
        const data = await updateDelito(updateDelitoData.value);

        if(data.error){
            toast.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
            return;
        }else if(data.data.error){
           toast.add({ severity: 'error', summary: 'Error', detail: data.data.message.message, life: 3000 });
           return
        }else{
           toast.add({ severity: 'success', summary: 'Exito', detail: 'Los cambios han sido guardados.', life: 3000 });
           updateDelitoData.value = {
                nombre: "", descripcion:"", activo: true
            };
            emit('delito-created');
            emit('refresh');
            emit('close');
        }
        console.log(data);
      }
  console.log('Guardando cambios:', editedDelito.value);
  
};


</script>

<template>
  <Dialog 
    v-model:visible="props.visible" 
    modal 
    header="Editar delito" 
    @update:visible="(val) => !val && cancelar()"
    :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"  >
    <template #header>
      <div class="inline-flex items-center justify-center gap-2">
       <!-- <Avatar 
          :image="editedOrg.avatar || 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png'" 
          shape="circle" 
        /> -->
        <span class="font-bold whitespace-nowrap">{{ editedDelito.nombre }} </span>
      </div>
    </template>

<div class="p-fluid formgrid grid">
        <div class="field col-12 md:col-4">
          <label for="nombre">Nombre</label>
          <InputText placeholder="Ej. Guardia Nacional Bolivariana" v-model="updateDelitoData.nombre" id="nombre" type="text" :class="{ 'p-invalid': errors.nombre }" />
          <small v-if="errors.nombre" class="p-error">{{ errors.nombre }}</small>
        </div>

        <div class="field col-12 md:col-4">
          <label for="descripcion">Descripcion</label>
          <InputText placeholder="" v-model="updateDelitoData.descripcion" id="descripcion" type="text" :class="{ 'p-invalid': errors.descripcion }" />
          <small v-if="errors.descripcion" class="p-error">{{ errors.descripcion }}</small>
        </div>
        
        <div class="field col-12 md:col-3">
          <label for="status">Status</label>
          <Dropdown v-model="updateDelitoData.activo" class="capitalize" id="status" optionValue="code" :options="dropDownStatus" optionLabel="name" placeholder="Seleccione..."  :class="{ 'p-invalid': errors.activo }" />
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