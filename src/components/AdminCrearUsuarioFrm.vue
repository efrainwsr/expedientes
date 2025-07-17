<script setup>
import { ref } from 'vue';
import { saveUser } from '../service/adminService.js';
import { fechaActual, imgToBase64, compressImg, validateForm } from '../utils.js';
import { useToast } from "primevue/usetoast";
import * as yup from 'yup';
const toast = useToast();
//const userDataEdit = ref(null)

/* evento para actualizar la tabla luego de agregar nuevos usuarios*/
const emit = defineEmits(['user-created']);
//const userDataEdit = inject('user-Data-Edit'); // Inject the provided user data for editing

//console.log('userDataEdit:', userDataEdit);

const userSchema = yup.object({
  cedula: yup.number().required('La cedula es obligatoria'),
  username: yup.string().required('El usuario es obligatorio'),
  pass: yup.string().required('La contraseña es obligatoria'),
  nombre: yup.string().required('El nombre es obligatorio'),
  apellido: yup.string().required('El apellido es obligatorio'),
  roles: yup.string().required('Tipo de usuario es obligatorio'),
  activo: yup.boolean().required('Status es obligatorio'),
});

const dropDownStatus = ref([
  { name: 'Activo', code: true },
  { name: 'Inactivo', code: false }
]);

const dropDownRoles = ref([
  { name: 'Consulta', code: '2' },
  { name: 'Administrador', code: '0' },
  { name: 'Operador', code: '1' },
]);

const newUser = ref({
  cedula: null,
  username: null,
  pass: null,
  nombre: null,
  apellido: null,
  roles: '',
  activo: true
});

const errors = ref({});


const sendUser = async () => {
    const validationResult = await validateForm(userSchema, newUser.value);
    if (!validationResult.isValid) {
        errors.value = validationResult.errors;
    } else {
        errors.value = {};
        // Continuar con el envío del formulario si es válido
        const data = await saveUser(newUser.value);

        if(data.error){
            toast.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
            return;
        }else if(data.data.error){
           toast.add({ severity: 'error', summary: 'Error', detail: data.data.message.message, life: 3000 });
           return
        }else{
           toast.add({ severity: 'success', summary: 'Exito', detail: 'Nuevo usuario creado.', life: 3000 });
           newUser.value = {
                cedula: null, username: null, pass: null, nombre: null,
                apellido: null, roles: '', activo: true
            };
            emit('user-created');
        }
        console.log(data);
      }
}
/*const handleFileUpload = async (event) => {
  const file = event.files[0];
  const compressedImg = await compressImg(file, 3, 800);
  newUser.value.avatar = await imgToBase64(compressedImg);
};*/
</script>

<template>
  <div class="col-12">
    <div class="card">
      <h5>Crear usuario</h5>
      <div class="p-fluid formgrid grid">
        <div class="field col-12 md:col-4">
          <label for="cedula">Cedula</label>
          <InputText min="7" max="8" v-model="newUser.cedula" id="cedula" type="text" :class="{ 'p-invalid': errors.cedula }" />
          <small v-if="errors.cedula" class="p-error">{{ errors.cedula }}</small>
        </div>
        <div class="field col-12 md:col-4">
          <label for="username">Nombre de usuario</label>
          <InputText v-model="newUser.username" id="username" type="text" :class="{ 'p-invalid': errors.username }" />
          <small v-if="errors.username" class="p-error">{{ errors.username }}</small>
        </div>
        <div class="field col-12 md:col-4">
          <label for="pass">Contraseña</label>
          <InputText v-model="newUser.pass" id="pass" type="text" :class="{ 'p-invalid': errors.pass }" />
          <small v-if="errors.pass" class="p-error">{{ errors.pass }}</small>
        </div>
        <div class="field col-12 md:col-4">
          <label for="nombre">Nombre</label>
          <InputText v-model="newUser.nombre" id="nombre" type="text" :class="{ 'p-invalid': errors.nombre }" />
          <small v-if="errors.nombre" class="p-error">{{ errors.nombre }}</small>
        </div>
        <div class="field col-12 md:col-4">
          <label for="apellido">Apellido</label>
          <InputText v-model="newUser.apellido" id="apellido" type="text" :class="{ 'p-invalid': errors.apellido }" />
          <small v-if="errors.apellido" class="p-error">{{ errors.apellido }}</small>
        </div>
        <div class="field col-12 md:col-4">
          <label for="roles">Tipo de usuario</label>
          <Dropdown v-model="newUser.roles" class="capitalize" id="roles" optionValue="code" :options="dropDownRoles" optionLabel="name" placeholder="Seleccione..." :class="{ 'p-invalid': errors.roles }" />
          <small v-if="errors.roles" class="p-error">{{ errors.roles }}</small>
        </div>
        <div class="field col-12 md:col-3">
          <label for="status">Status</label>
          <Dropdown v-model="newUser.activo" class="capitalize" id="status" optionValue="code" :options="dropDownStatus" optionLabel="name" placeholder="Seleccione..."  :class="{ 'p-invalid': errors.activo }" />
          <small v-if="errors.activo" class="p-error">{{ errors.activo }}</small>
        </div>

        
      </div>
      <div class="field col-12 md:col-3 md:col-offset-4 flex justify-content-center">
          <Button severity="success" label="Guardar" icon="pi pi-check" iconPos="right" @click="sendUser" />
          <Toast />
        </div>
    </div>
  </div>
</template>
