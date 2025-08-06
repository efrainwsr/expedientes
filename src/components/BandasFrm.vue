<script setup>
import { ref } from 'vue';
import { saveBanda } from '../service/bandasService.js';
import { validateForm } from '../utils.js';
import { useToast } from "primevue/usetoast";
import * as yup from 'yup';
const toast = useToast();
//const userDataEdit = ref(null)

/* evento para actualizar la tabla luego de agregar nuevos usuarios*/
const emit = defineEmits(['banda-created']);

//console.log('userDataEdit:', userDataEdit);

const bandasSchema = yup.object({
  nombre: yup.string().max(255).required('El nombre es obligatorio'),
  descripcion: yup.string().max(255),
  zona: yup.string().max(255),
  activo: yup.boolean().required('Status es obligatorio'),
});

const dropDownStatus = ref([
{ name: 'Activo', code: true },
{ name: 'Inactivo', code: false }
]);


const newBanda = ref({
  nombre: "",
  descripcion: "",
  zona: "",
  activo: true
});

const errors = ref({});

const sendBanda = async () => {
  const validationResult = await validateForm(bandasSchema, newBanda.value);
  if (!validationResult.isValid) {
    errors.value = validationResult.errors;
  } else {
    errors.value = {};
    // Continuar con el envío del formulario si es válido
    const data = await saveBanda(newBanda.value);
    console.log(newBanda.value);
    
    if(data.error){
      toast.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
      return;
    }else if(data.data.error){
      toast.add({ severity: 'error', summary: 'Error', detail: data.data.message.message, life: 3000 });
      return
    }else{
      toast.add({ severity: 'success', summary: 'Exito', detail: 'Nueva banda agregada.', life: 3000 });
      newBanda.value = {
        nombre: "", descripcion: "", zona: "", activo: true
      };
      emit('banda-created');
    }
  }
}
</script>

<template>
  <div class="col-12">
    <div class="card">
      <h5>Agregar una Banda Criminal</h5>
      <div class="p-fluid formgrid grid">
        
        <div class="field col-12 md:col-4">
          <label for="nombre">Nombre</label>
          <InputText placeholder="Ej. Tren de aragua" v-model="newBanda.nombre" id="nombre" type="text" :class="{ 'p-invalid': errors.nombre }" />
          <small v-if="errors.nombre" class="p-error">{{ errors.nombre }}</small>
        </div>
        
        <div class="field col-12 md:col-4">
          <label for="descripcion">Descripcion</label>
          <InputText placeholder="Ej. narcotráfico, contrabando, trata de personas" v-model="newBanda.descripcion" id="descripcion" type="text" :class="{ 'p-invalid': errors.descripcion }" />
          <small v-if="errors.descripcion" class="p-error">{{ errors.descripcion }}</small>
        </div>

        <div class="field col-12 md:col-4">
          <label for="zona">Zona de operacion</label>
          <InputText placeholder="Ej. Aragua " v-model="newBanda.zona" id="zona" type="text" :class="{ 'p-invalid': errors.zona }" />
          <small v-if="errors.zona" class="p-error">{{ errors.zona }}</small>
        </div>

        <div class="field col-12 md:col-3">
          <label for="status">Status</label>
          <Dropdown v-model="newBanda.activo" class="capitalize" id="status" optionValue="code" :options="dropDownStatus" optionLabel="name" placeholder="Seleccione..."  :class="{ 'p-invalid': errors.activo }" />
          <small v-if="errors.activo" class="p-error">{{ errors.activo }}</small>
        </div>
        
      </div>
      <div class="field col-12 md:col-3 md:col-offset-4 flex justify-content-center">
          <Button severity="success" label="Guardar" icon="pi pi-check" iconPos="right" @click="sendBanda" />
          <Toast />
        </div>
    </div>
  </div>
</template>