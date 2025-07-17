<script setup>
import { ref } from 'vue';
import { saveOrg } from '../service/orgService.js';
import { validateForm } from '../utils.js';
import { useToast } from "primevue/usetoast";
import * as yup from 'yup';
const toast = useToast();
//const userDataEdit = ref(null)

/* evento para actualizar la tabla luego de agregar nuevos usuarios*/
const emit = defineEmits(['org-created']);

//console.log('userDataEdit:', userDataEdit);

const orgSchema = yup.object({
  nombre: yup.string().max(50).required('El nombre es obligatorio'),
  siglas: yup.string().max(15).required('Siglas son obligatorias'),
});

const dropDownStatus = ref([
{ name: 'Activo', code: true },
{ name: 'Inactivo', code: false }
]);


const newOrg = ref({
  nombre: "",
  siglas: "",
  activo: true
});

const errors = ref({});


const sendOrg = async () => {
  const validationResult = await validateForm(orgSchema, newOrg.value);
  if (!validationResult.isValid) {
    errors.value = validationResult.errors;
  } else {
    errors.value = {};
    // Continuar con el envío del formulario si es válido
    const data = await saveOrg(newOrg.value);
    console.log(newOrg.value);
    
    if(data.error){
      toast.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
      return;
    }else if(data.data.error){
      toast.add({ severity: 'error', summary: 'Error', detail: data.data.message.message, life: 3000 });
      return
    }else{
      toast.add({ severity: 'success', summary: 'Exito', detail: 'Nuevo organismo creado.', life: 3000 });
      newOrg.value = {
        nombre: null, siglas: null, activo: true
      };
      emit('org-created');
    }
    console.log(data);
  }
}
</script>

<template>
  <div class="col-12">
    <div class="card">
      <h5>Organismos Aprehensores</h5>
      <div class="p-fluid formgrid grid">
        
        <div class="field col-12 md:col-4">
          <label for="nombre">Nombre</label>
          <InputText placeholder="Ej. Guardia Nacional Bolivariana" v-model="newOrg.nombre" id="nombre" type="text" :class="{ 'p-invalid': errors.nombre }" />
          <small v-if="errors.nombre" class="p-error">{{ errors.nombre }}</small>
        </div>
        
        <div class="field col-12 md:col-4">
          <label for="siglas">Siglas</label>
          <InputText placeholder="Ej. GNB" v-model="newOrg.siglas" id="siglas" type="text" :class="{ 'p-invalid': errors.siglas }" />
          <small v-if="errors.siglas" class="p-error">{{ errors.siglas }}</small>
        </div>
        
        <div class="field col-12 md:col-3">
          <label for="status">Status</label>
          <Dropdown v-model="newOrg.activo" class="capitalize" id="status" optionValue="code" :options="dropDownStatus" optionLabel="name" placeholder="Seleccione..."  :class="{ 'p-invalid': errors.activo }" />
          <small v-if="errors.activo" class="p-error">{{ errors.activo }}</small>
        </div>
        
        <div class="field col-12 md:col-3 md:col-offset-4 flex justify-content-center">
          <Button severity="success" label="Guardar" icon="pi pi-check" iconPos="right" @click="sendOrg" />
          <Toast />
        </div>
        
      </div>
    </div>
  </div>
</template>