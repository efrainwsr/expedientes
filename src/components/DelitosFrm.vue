<script setup>
import { ref } from 'vue';
import { saveDelito } from '../service/delitosService.js';
import { validateForm } from '../utils.js';
import { useToast } from "primevue/usetoast";
import * as yup from 'yup';
const toast = useToast();
//const userDataEdit = ref(null)

/* evento para actualizar la tabla luego de agregar nuevos usuarios*/
const emit = defineEmits(['delito-created']);

//console.log('userDataEdit:', userDataEdit);

const delitoSchema = yup.object({
  nombre: yup.string().max(255).required('El nombre es obligatorio'),
  descripcion: yup.string().max(255),
  activo: yup.boolean().required('El status es obligatorio')
});

const dropDownStatus = ref([
{ name: 'Activo', code: true },
{ name: 'Inactivo', code: false }
]);


const newDelito = ref({
  nombre: "",
  descripcion: "",
  activo: true
});

const errors = ref({});


const sendDelito = async () => {
  const validationResult = await validateForm(delitoSchema, newDelito.value);
  if (!validationResult.isValid) {
    errors.value = validationResult.errors;
  } else {
    errors.value = {};
    // Continuar con el envío del formulario si es válido
    const data = await saveDelito(newDelito.value);
    console.log(newDelito.value);
    
    if(data.error){
      toast.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
      return;
    }else if(data.data.error){
      toast.add({ severity: 'error', summary: 'Error', detail: data.data.message.message, life: 3000 });
      return
    }else{
      toast.add({ severity: 'success', summary: 'Exito', detail: 'Nuevo delito agregado.', life: 3000 });
      newDelito.value = {
        nombre: "", descripcion: "", activo: true
      };
      emit('delito-created');
    }
    //console.log(data);
  }
}
</script>

<template>
  <div class="col-12">
    <div class="card">
      <h5>Agregar Delitos</h5>
      <div class="p-fluid formgrid grid">
        
        <div class="field col-12 md:col-4">
          <label for="nombre">Nombre</label>
          <InputText placeholder="Ej. Robo agravado" v-model="newDelito.nombre" id="nombre" type="text" :class="{ 'p-invalid': errors.nombre }" />
          <small v-if="errors.nombre" class="p-error">{{ errors.nombre }}</small>
        </div>
        
        <div class="field col-12 md:col-4">
          <label for="descripcion">descripcion</label>
          <InputText placeholder="" v-model="newDelito.descripcion" id="descripcion" type="text" :class="{ 'p-invalid': errors.descripcion }" />
          <small v-if="errors.descripcion" class="p-error">{{ errors.descripcion }}</small>
        </div>
        
        <div class="field col-12 md:col-3">
          <label for="status">Status</label>
          <Dropdown v-model="newDelito.activo" class="capitalize" id="status" optionValue="code" :options="dropDownStatus" optionLabel="name" placeholder="Seleccione..."  :class="{ 'p-invalid': errors.activo }" />
          <small v-if="errors.activo" class="p-error">{{ errors.activo }}</small>
        </div>
        
        <div class="field col-12 md:col-3 md:col-offset-4 flex justify-content-center">
          <Button severity="success" label="Guardar" icon="pi pi-check" iconPos="right" @click="sendDelito" />
          <Toast />
        </div>
        
      </div>
    </div>
  </div>
</template>