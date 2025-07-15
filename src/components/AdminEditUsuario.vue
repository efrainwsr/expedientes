<script setup>
import { ref, watch } from "vue";
import { updateUser } from '../service/adminService.js';
import { useToast } from "primevue/usetoast";
import { fechaActual, imgToBase64, compressImg, validateForm } from '../utils.js';
import * as yup from 'yup';
const toast = useToast();
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  userData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'refresh']);

const editedUser = ref({...props.userData});

const userSchema = yup.object({
  username: yup.string().required('El usuario es obligatorio'),
  pass: yup.string(),
  nombre: yup.string().required('El nombre es obligatorio'),
  apellido: yup.string().required('El apellido es obligatorio'),
  roles: yup.string().required('Tipo de usuario es obligatorio'),
  activo: yup.boolean().required('Status es obligatorio'),
});



// Copiamos los datos del usuario al recibirlos
watch(() => props.userData, (newData) => {
  editedUser.value = {...newData};
}, { immediate: true });


const cancelar = () => {
  emit('close');
};

const dropDownStatus = ref([
  { name: 'Activo', code: true },
  { name: 'Inactivo', code: false }
]);

const dropDownRoles = ref([
  { name: 'Consulta', code: '2' },
  { name: 'Administrador', code: '0' },
  { name: 'Operador', code: '1' },
]);

const updateUserData = ref({
  id_usuario: props.userData.id_usuario,
  cedula: props.userData.cedula,
  username: props.userData.username,
  nombre: props.userData.nombre,
  apellido: props.userData.apellido,
  roles: props.userData.roles,
  activo: true
});
const errors = ref({});


const guardarCambios = async () => {
  const validationResult = await validateForm(userSchema, updateUserData.value);
    if (!validationResult.isValid) {
        errors.value = validationResult.errors;
    } else {
        errors.value = {};
        if (updateUserData.value.pass && updateUserData.value.pass.trim() !== '') {
             updateUserData.value.pass = updateUserData.value.pass;
    }
        console.log('Datos a enviar:', updateUserData.value);
        const data = await updateUser(updateUserData.value);

        if(data.error){
            toast.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
            return;
        }else if(data.data.error){
           toast.add({ severity: 'error', summary: 'Error', detail: data.data.message.message, life: 3000 });
           return
        }else{
           toast.add({ severity: 'success', summary: 'Exito', detail: 'Los cambios han sido guardados.', life: 3000 });
           updateUserData.value = {
                cedula: null, username: null, pass: null, nombre: null,
                apellido: null, roles: '', activo: true
            };
            emit('user-created');
            emit('refresh');
            emit('close');
        }
        console.log(data);
      }
  console.log('Guardando cambios:', editedUser.value);
  
};


</script>

<template>
  <Dialog 
    v-model:visible="props.visible" 
    modal 
    header="Editar Usuario" 
    @update:visible="(val) => !val && cancelar()"
    :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"  >
    <template #header>
      <div class="inline-flex items-center justify-center gap-2">
        <Avatar 
          :image="editedUser.avatar || 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png'" 
          shape="circle" 
        />
        <span class="font-bold whitespace-nowrap">{{ editedUser.nombre }} {{ editedUser.apellido }}</span>
      </div>
    </template>

<div class="p-fluid formgrid grid">
        <div class="field col-12 md:col-4">
          <label for="cedula">Cedula</label>
          <InputText disabled v-model="updateUserData.cedula" id="cedula" type="text" :class="{ 'p-invalid': errors.cedula }" />
          <small v-if="errors.cedula" class="p-error">{{ errors.cedula }}</small>
        </div>
        <div class="field col-12 md:col-4">
          <label for="username">Nombre de usuario</label>
          <InputText v-model="updateUserData.username" id="username" type="text" :class="{ 'p-invalid': errors.username }" />
          <small v-if="errors.username" class="p-error">{{ errors.username }}</small>
        </div>
        <div class="field col-12 md:col-4">
          <label for="pass">Contraseña</label>
          <InputText v-model="updateUserData.pass" id="pass" type="text" :class="{ 'p-invalid': errors.pass }" />
          <small v-if="errors.pass" class="p-error">{{ errors.pass }}</small>
        </div>
        <div class="field col-12 md:col-4">
          <label for="nombre">Nombre</label>
          <InputText v-model="updateUserData.nombre" id="nombre" type="text" :class="{ 'p-invalid': errors.nombre }" />
          <small v-if="errors.nombre" class="p-error">{{ errors.nombre }}</small>
        </div>
        <div class="field col-12 md:col-4">
          <label for="apellido">Apellido</label>
          <InputText v-model="updateUserData.apellido" id="apellido" type="text" :class="{ 'p-invalid': errors.apellido }" />
          <small v-if="errors.apellido" class="p-error">{{ errors.apellido }}</small>
        </div>
        <div class="field col-12 md:col-4">
          <label for="roles">Tipo de usuario</label>
          <Dropdown v-model="updateUserData.roles" class="capitalize" id="roles" optionValue="code" :options="dropDownRoles" optionLabel="name" placeholder="Seleccione..." :class="{ 'p-invalid': errors.roles }" />
          <small v-if="errors.roles" class="p-error">{{ errors.roles }}</small>
        </div>
        <div class="field col-12 md:col-3">
          <label for="status">Status</label>
          <Dropdown v-model="updateUserData.activo" class="capitalize" id="status" optionValue="code" :options="dropDownStatus" optionLabel="name" placeholder="Seleccione..."  :class="{ 'p-invalid': errors.activo }" />
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
