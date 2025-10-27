<script setup>
import { onMounted, ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useToast } from "primevue/usetoast";
const toast = useToast();
const personIcon = ('src/assets/person-icon.svg');
import * as yup from 'yup';
import {config, validateForm, resizeImage, imgToBase64, compressImg, formatDate} from '../utils.js'
import { pdfCiudadano } from '../reportes/pdfCiudadano.js';

import { getCurrentInstance } from 'vue';
const fileupload = ref(null);

import Buscador from '../components/Buscador.vue';
import { saveCiudadano, buscarCiudadano, saveDelitoCiudadano, getDelitosCiudadano } from '../service/ciudadanoService.js';
import { getAllDelitos } from '../service/delitosService.js';
import { getEstados, getMunicipios, getParroquias } from '../service/ubicacionService.js';
import { getAllBandas } from '../service/bandasService.js';
import { getAllOrg } from '../service/orgService.js';
const modalVisible = ref(false);
const ciudadanoEncontrado = ref(false);

const { isDarkTheme } = useLayout();
const lineOptions = ref(null);
const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
};

const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            },
            y: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            }
        }
    };
};

watch(
isDarkTheme,
(val) => {
    if (val) {
        applyDarkTheme();
    } else {
        applyLightTheme();
    }
},
{ immediate: true }
);


const delitosCiudadano = ref([]);


const errors = ref({});
const errorsModal = ref({});

const sexoOptions = ref([
{name: "Masculino", code: 'M'},
{name: "Femenino", code: 'F'},
]);

const estadoOptions = ref([]);
const municipioOptions = ref([]) 
const parroquiaOptions = ref([]) 
const delitosOptions = ref([]);
const organismoOptions = ref([]);


const nacOptions = ref([  
{name: "Venezolano", code: 'V' },
{name: "Extranjero", code: 'E'},
])

const bandaOptions = ref([
{name: "No pertenece", code: 0},
]);

const isDisabled = ref(false);
const cedulaDisabled = ref(false);
const resenador = JSON.parse(localStorage.getItem('user'))

const resetForm = () => {
    ciudadanoModel.value = {
        id_ciudadano: null, cedula: null, nombres: "", apellidos: "", alias: "", prefijo_nac: "", fecha_nacimiento: "",
        sexo: "", telefono: "", id_banda: null, id_estado: null, id_municipio: null,
        id_parroquia: null, direccion: "", foto: ""
    };
    delitoModel.value = {
        expediente: "",
        id_ciudadano: null,
        id_usuario_registro: resenador.id,
        id_organismo: null,
        fecha_detencion: "",
        lugar_detencion: "",
        id_delito: null,
        observaciones: "",
    };
    delitosCiudadano.value = [];
    errors.value = {};
    errorsModal.value = {};
    isDisabled.value = false;
    cedulaDisabled.value = false;
    ciudadanoEncontrado.value = false;
};

const ciudadanoSchema = yup.object({
    cedula: yup.string().max(8).required('La cédula es obligatoria'),
    nombres: yup.string().max(255).required('El nombre es obligatorio'),
    apellidos: yup.string().max(255).required('El nombre es obligatorio'),
    alias: yup.string().max(50),
    prefijo_nac: yup.string().max(1).required('La nacionalidad es obligatoria'),
    fecha_nacimiento: yup.string().required('La fecha de nacimiento es obligatoria'),
    sexo: yup.string().max(1).required('El sexo es obligatorio'),
    telefono: yup.string().max(15).required('El teléfono es obligatorio'),
    id_banda: yup.number().required('La banda es obligatoria'),
    id_estado: yup.number().required('El estado es obligatorio'),
    id_municipio: yup.number().required('El municipio es obligatorio'),
    id_parroquia: yup.number().required('La parroquia es obligatoria'),
    direccion: yup.string().max(255).required('La dirección es obligatoria'),
    foto: yup.string().optional(),
});

const delitosSchema = yup.object({
    id_ciudadano: yup.number(),
    expediente: yup.string().max(50),
    id_usuario_registro: yup.number(),
    id_organismo: yup.number().required('Seleccione un organismo aprehensor'),
    fecha_detencion: yup.string().required('Fecha de detención es obligatoria'),
    lugar_detencion: yup.string().max(255),
    id_delito: yup.number().required('Seleccione un delito'),
    observaciones: yup.string().max(255)
});

onMounted( async () => {
    const orgs = await getAllOrg();    
    organismoOptions.value = [];
    orgs.data.forEach(org => {
        organismoOptions.value.push({
            name: org.siglas,
            code: org.id_organismo
        });
    });
});
onMounted( async () => {
    const bandas = await getAllBandas();    
    //bandaOptions.value = [];
    bandas.data.forEach(banda => {
        bandaOptions.value.push({
            name: banda.nombre,
            code: banda.id_banda
        });
    });
});
onMounted( async () => {
    const estados = await getEstados();
    estados.data.forEach(estado => {
        estadoOptions.value.push({
            name: estado.estado,
            code: estado.id_estado
        });
    });
});
onMounted(() => {
    getAllDelitos().then((data) => {
        delitosOptions.value = [];
        data.data.forEach(delito => {
            delitosOptions.value.push({
                name: delito.nombre,
                code: delito.id_delito
            });
        });
    });
});
const buscarMunicipio = async (event) => {
    const data = await getMunicipios(event.value);    
    municipioOptions.value = [];
    data.data.forEach(municipio => {
        municipioOptions.value.push({
            name: municipio.municipio,
            code: municipio.id_municipio
        });
    });  
};
const buscarParroquia = async (event) => {
    const data = await getParroquias(event.value);    
    parroquiaOptions.value = [];
    data.data.forEach(parroquia => {
        parroquiaOptions.value.push({
            name: parroquia.parroquia,
            code: parroquia.id_parroquia
        });
    });  
};




const buscarCne = async () =>{
    const res = await fetch(`https://api.cedula.com.ve/api/v1?app_id=1075&token=499a64a32fdcb13b03869b70cee3ce0d&nacionalidad=V&cedula=${ciudadanoModel.value.cedula}`)
    console.log(res.json())
}

const buscar = {cedula: 14509013, nombre: '', expediente: ''};


const ciudadanoModel = ref(
{
    id_ciudadano: null, cedula: null, nombres: "", apellidos: "", alias: "", prefijo_nac: "", fecha_nacimiento: "", sexo: "", telefono: "", id_banda: null, id_estado: null, id_municipio: null,
    id_parroquia: null, direccion: "", foto: ""
}
);

const delitoModel = ref(
{
    expediente: "",
    id_ciudadano: null,
    id_usuario_registro: resenador.id,
    id_organismo: null,
    fecha_detencion: "",
    lugar_detencion: "",
    id_delito: null,
    observaciones: "",
}
);

const buscarCiudadanos = async (cedula) => {
    if(cedula){
        const data = await buscarCiudadano(cedula);
        if(data.data === false){
            toast.add({ severity: 'error', summary: 'Error', detail: 'No se encontró el ciudadano.', life: 3000 });
            return;
        }
        if(data.error){
            toast.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
            return;
        }
        
        ciudadanoModel.value = data.data[0];
        delitoModel.value.id_ciudadano = data.data[0].id_ciudadano
        cedulaDisabled.value = true;
        ciudadanoEncontrado.value = true;
        isDisabled.value = true;
        //Buscar y asginar los delitos a variable local delitosCiudadanos
        await buscarDelitosCiudadanos(data.data[0].id_ciudadano)
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: 'Debe ingresar una cédula válida.', life: 3000 });
        return;
    }
}

const buscarExpediente = async (cedula) => {
    if(cedula){
        const data = await buscarCiudadano(cedula);
        if(data.data === false){
            toast.add({ severity: 'error', summary: 'Error', detail: 'No se encontró el ciudadano.', life: 3000 });
            return;
        }
        if(data.error){
            toast.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
            return;
        }
        
        ciudadanoModel.value = data.data[0];
        delitoModel.value.id_ciudadano = data.data[0].id_ciudadano
        cedulaDisabled.value = true;
        ciudadanoEncontrado.value = true;
        isDisabled.value = true;
        //Buscar y asginar los delitos a variable local delitosCiudadanos
        await buscarDelitosCiudadanos(data.data[0].id_ciudadano)
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: 'Debe ingresar una cédula válida.', life: 3000 });
        return;
    }
}

const buscarDelitosCiudadanos = async (id_ciudadano) =>{
    const resDelitos = await getDelitosCiudadano(id_ciudadano);
    delitosCiudadano.value = resDelitos.data;
    if(resDelitos.data != false){
        delitosCiudadano.value.forEach(delito => {
            delito.fecha_detencion = new Date(delito.fecha_detencion).toLocaleString('es-VE', formatDate);
        });
    }
    return 
}


const buscarNombre = async (valor) => {
    
    //const res = await fetch('demo/data/ciudadanos.json');
    const ciudadanoData =  listaCiudadanos;//await res.json();
    
    //busquedaRealizada.value = true; // Indicamos que se ha iniciado una búsqueda
    const nombreNormalizado = valor.trim().toUpperCase(); // Normalizamos la cédula para una búsqueda precisa
    // Usamos el método .find() para buscar el ciudadano por su cédula
    const encontrado = ciudadanoData.find(
    (ciudadano) => ciudadano.nombres.toUpperCase() === nombreNormalizado
    );
    // Asignamos el resultado a la referencia reactiva
    if (encontrado) {
        ciudadanoModel.value = encontrado;
        // Opcional: Para ver el objeto puro en la consola sin el Proxy de Vue
        //console.log("Ciudadano encontrado:", JSON.parse(JSON.stringify(encontrado)));
    } else {
        ciudadanoModel.value = null; // Si no se encuentra, limpiamos el valor anterior
       //console.log(`No se encontró ningún ciudadano con la cédula: ${nombreNormalizado}`);
    }
};

// ****** Funcion para procesar las fotos *********
// ****** Captura y convierte la imagen seleccionada en base64 usando la referencia de FileUpload****
const upload = async () => {
    // Usar la referencia de FileUpload para obtener el archivo
    const files = fileupload.value && fileupload.value.files ? fileupload.value.files : [];
    if (files.length > 0) {
        const file = files[0];
        try {
            const resizedBase64 = await resizeImage(file, 900, 900, 0.7); // Puedes ajustar tamaño/calidad
            ciudadanoModel.value.foto = resizedBase64;
            toast.add({ severity: 'info', summary: 'Operacion exitosa', detail: 'Foto subida.', life: 3000 }); 
        } catch (err) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo reducir la imagen.', life: 3000 });
        }
    } else {
        // Si no hay imagen, simplemente no se asigna nada y no se muestra error
        ciudadanoModel.value.foto = null;
        toast.add({ severity: 'info', summary: 'Sin foto', detail: 'No se subió ninguna imagen. El registro se guardará sin foto.', life: 3000 });
    }
};




const sendCiudadano = async () => {
    const validationResult = await validateForm(ciudadanoSchema, ciudadanoModel.value);
    if (!validationResult.isValid) {
        errors.value = validationResult.errors;
    } else {
        errors.value = {};
        // Continuar con el envío del formulario si es válido
        const data = await saveCiudadano(ciudadanoModel.value);
        //console.log(ciudadanoModel.value, "funcion serndCiudadano ");
        if(data.error){
            toast.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
            return;
        }else if(data.data.error){
            toast.add({ severity: 'error', summary: 'Error', detail: data.data.message.message, life: 3000 });
            return
        }else{
            toast.add({ severity: 'success', summary: 'Operacion exitosa.', detail: 'Ciudadano registrado.', life: 3000 });
            ciudadanoModel.value = {};
            delitosCiudadano.value = {}
            //emit('delito-created');
        }
        //console.log(data);
    }
}

const sendDelito = async () => {
    console.log(delitoModel.value, "funcion sendDelito");
    const validationResult = await validateForm(delitosSchema, delitoModel.value);
    if (!validationResult.isValid) {
        errorsModal.value = validationResult.errors;
    } else {
        errorsModal.value = {};
        console.log(delitoModel.value, "funcion sendDelito");
        // Continuar con el envío del formulario si es válido
        const data = await saveDelitoCiudadano(delitoModel.value);
        //console.log(ciudadanoModel.value, "funcion serndCiudadano ");
        
        if(data.error){
            toast.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
            return;
        }else if(data.data.error){
            toast.add({ severity: 'error', summary: 'Error', detail: data.data.message.message, life: 3000 });
            return
        }else{
            toast.add({ severity: 'success', summary: 'Operacion exitosa.', detail: 'Delito registrado.', life: 3000 });
            delitoModel.value = {id_ciudadano: ciudadanoModel.value.id_ciudadano, id_usuario_registro: resenador.id ,expediente: "", fecha_detencion: "", lugar_detencion:"", id_organismo:"", id_delito:"", observaciones:""};
            //console.log("PROBANDO", ciudadanoModel.value.id_ciudadano)
            await buscarDelitosCiudadanos(ciudadanoModel.value.id_ciudadano) 
        }
        //console.log(data);
    }
}

</script>

<template>
    <Toast/>
    <div class="grid">
        
        <div class="col-12 md:col-4">
            <div class="card">
                <h5>Buscar por cedula</h5>
                <form @submit.prevent="buscarCiudadanos(buscar.cedula)" >
                    <div class="p-fluid formgrid grid">
                        <div class="field col-7 md:col-7">
                            <InputText
                            id="cedulaBuscar"
                            v-model="buscar.cedula"
                            placeholder=""
                            />
                        </div>
                        <div class="field col-5 md:col-5">
                            <Button
                            @click="buscarCiudadanos(buscar.cedula)"
                            class="p-button-success"
                            label="Buscar"
                            icon="pi pi-search"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div> 
        
        <div class="col-12 md:col-4">
            <Buscador
            titulo="Buscar por nombre"
            placeholder=""
            botonLabel="Buscar"
            inputId="busquedaNombre"
            @buscar="buscarNombre"
            />
        </div>
        
        <div class="col-12 md:col-4">
            <Buscador
            titulo="Buscar expediente"
            placeholder=""
            botonLabel="Buscar"
            inputId="busquedaExpediente"
            @buscar="buscarExpediente"
            />
        </div>
    </div>
    
    <div v-if="true"  class="grid"> 
        <div class="col-12">
            <div class="card">
                <h5>Expediente</h5>
                <form v-on:submit.prevent >
                    <div class="p-fluid formgrid grid">
                        
                        <div class="ffield col-12 md:col-2 card flex justify-content-center align-items-center p-0 overflow-hidden">
                            <Image :src="ciudadanoModel.foto ? ciudadanoModel.foto : personIcon" alt="Foto" width="150" preview />
                        </div>
                        
                        
                        <div class="field col-12 md:col-2">
                            <label for="cedula">Cedula</label>
                            <InputText @keyup.enter="buscarCne" :disabled="cedulaDisabled" v-model="ciudadanoModel.cedula" id="cedula" type="text"  placeholder="" :class="{ 'p-invalid': errors.cedula }" />
                            <small v-if="errors.cedula" class="p-error">{{ errors.cedula }}</small>
                        </div>
                        
                        <div class="field col-12 md:col-3">
                            <label for="nombres">Nombres</label>
                            <InputText :disabled="isDisabled" v-model="ciudadanoModel.nombres" id="nombres" type="text"  placeholder="" :class="{ 'p-invalid': errors.nombres }" />
                            <small v-if="errors.nombres" class="p-error">{{ errors.nombres }}</small>
                        </div>
                        
                        <div class="field col-12 md:col-3">
                            <label for="apellidos">Apellidos</label>
                            <InputText :disabled="isDisabled" v-model="ciudadanoModel.apellidos" id="apellidos" type="text"  placeholder="" :class="{ 'p-invalid': errors.apellidos }" />
                            <small v-if="errors.apellidos" class="p-error">{{ errors.apellidos }}</small>
                        </div>
                        
                        <div class="field col-12 md:col-2">
                            <label for="alias">Alias y/o apodo</label>
                            <InputText :disabled="isDisabled" v-model="ciudadanoModel.alias" id="alias" type="text"  placeholder="" :class="{ 'p-invalid': errors.alias }" />
                            <small v-if="errors.alias" class="p-error">{{ errors.alias }}</small>
                        </div>
                        
                        <div class="field col-12 md:col-3">
                            <label for="nacionalidad">Nacionalidad</label>
                            <Dropdown :disabled="isDisabled" v-model="ciudadanoModel.prefijo_nac" id="nacionalidad" :options="nacOptions" optionLabel="name" optionValue="code" placeholder="Seleccione..." :class="{ 'p-invalid': errors.prefijo_nac }"></Dropdown>
                            <small v-if="errors.prefijo_nac" class="p-error">{{ errors.prefijo_nac }}</small>
                        </div>
                        
                        <div class="field col-12 md:col-2">
                            <label for="fecha de nacimiento">Fecha de nacimiento</label>     
                            <InputMask :disabled="isDisabled" id="fecha_nac" v-model="ciudadanoModel.fecha_nacimiento" placeholder="" mask="99/99/9999" slotChar="dd/mm/yyyy" :class="{ 'p-invalid': errors.fecha_nacimiento }" />
                            <small v-if="errors.fecha_nacimiento" class="p-error">{{ errors.fecha_nacimiento }}</small>
                        </div>
                        
                        <div class="field col-12 md:col-2">
                            <label for="sexo">Sexo</label>
                            <Dropdown :disabled="isDisabled" v-model="ciudadanoModel.sexo" id="sexo" :options="sexoOptions" optionLabel="name" optionValue="code" placeholder="Seleccione..." :class="{ 'p-invalid': errors.sexo }"></Dropdown>
                            <small v-if="errors.sexo" class="p-error">{{ errors.sexo }}</small>
                        </div>
                        
                        <div class="field col-12 md:col-2">
                            <label for="telefono">Telefono</label>
                            <InputMask :disabled="isDisabled" mask="9999 999-9999" v-model="ciudadanoModel.telefono" id="celular" type="text"  placeholder="" :class="{ 'p-invalid': errors.telefono }" />
                            <small v-if="errors.telefono" class="p-error">{{ errors.telefono }}</small>
                        </div>
                        
                        <div class="field col-12 md:col-3">
                            <label for="banda">Banda</label>
                            <Dropdown :disabled="isDisabled" v-model="ciudadanoModel.id_banda" id="banda" :options="bandaOptions" optionLabel="name" optionValue="code"  placeholder="Seleccione..." :class="{ 'p-invalid': errors.id_banda }"></Dropdown>
                            <small v-if="errors.id_banda" class="p-error">{{ errors.id_banda }}</small>
                        </div>
                        
                        
                        <h5 class="col-12">Direccion</h5>
                        
                        <div class="field col-12 md:col-2">
                            <label for="estado">Estado</label>
                            <Dropdown :disabled="isDisabled" v-model="ciudadanoModel.id_estado" :options="estadoOptions"  optionLabel="name" placeholder="Seleccione..." optionValue="code" @change="buscarMunicipio" :class="{ 'p-invalid': errors.id_estado }"></Dropdown>
                            <small v-if="errors.id_estado" class="p-error">{{ errors.id_estado }}</small>
                        </div>
                        
                        <div class="field col-12 md:col-2">
                            <label for="municipio">Municipio</label>
                            <Dropdown :disabled="isDisabled" v-model="ciudadanoModel.id_municipio" :options="municipioOptions"  optionLabel="name" optionValue="code" placeholder="Seleccione..." @change="buscarParroquia" :class="{ 'p-invalid': errors.id_municipio }"></Dropdown>
                            <small v-if="errors.id_municipio" class="p-error">{{ errors.id_municipio }}</small>
                        </div>
                        
                        <div class="field col-12 md:col-2">
                            <label for="parroquia">Parroquia</label>
                            <Dropdown :disabled="isDisabled" v-model="ciudadanoModel.id_parroquia" :options="parroquiaOptions"  optionLabel="name" optionValue="code" placeholder="Seleccione..."  :class="{ 'p-invalid': errors.id_parroquia }"></Dropdown>
                            <small v-if="errors.id_parroquia" class="p-error">{{ errors.id_parroquia }}</small>
                        </div>
                        
                        <div class="field col-12 md:col-6">
                            <label for="direccion">Direccion 1</label>
                            <Textarea :disabled="isDisabled" v-model="ciudadanoModel.direccion" id="direccion" rows="1" placeholder="" :class="{ 'p-invalid': errors.direccion }" />
                            <small v-if="errors.direccion" class="p-error">{{ errors.direccion }}</small>
                        </div>                                 
                    </div>
                    
                    
                    <h5>Foto</h5>
                    <div class="card flex flex-wrap gap-6 items-center justify-between">
                        <Toast />
                        <FileUpload  chooseLabel="Seleccionar" ref="fileupload" mode="basic" name="demo[]" accept="image/*" :maxFileSize="5000000" />
                        <Button label="Subir" @click="upload" severity="secondary" />
                    </div>
                    
                    
                    <div class="field col-12 md:col-4 md:col-offset-4 flex justify-content-center">
                        <Button severity="success" label="Guardar" icon="pi pi-check" iconPos="right" @click="sendCiudadano" />
                        <Button v-if="ciudadanoEncontrado" severity="secondary" label="Cancelar" icon="pi pi-times " iconPos="right" @click="resetForm" />
                        <Button v-if="ciudadanoEncontrado" label="IMPRIMIR" icon="pi pi-file-pdf" severity="danger" outlined @click="pdfCiudadano(ciudadanoModel.cedula)"/>
                        <Toast />
                    </div>
                    
                </form>
            </div>
        </div>
    </div>
    
    <!------------------------------  MODAL DE DELITOS  --------------------------->
    
    <Dialog v-model:visible="modalVisible" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" modal header="Agregar Delito a al ciudadano">
        <template #header>
            <div class="inline-flex items-center justify-center gap-2">
                <span class="font-bold whitespace-nowrap">Agregar delito al ciudadano: {{ ciudadanoModel.nombres.toUpperCase() + ' ' + ciudadanoModel.apellidos.toUpperCase() }} </span>
            </div>
        </template>
        <div class="grid p-fluid formgrid">
            
            <div class="field col-12 md:col-4">
                <label for="expediente">Caso</label>
                <InputText placeholder="" v-model="delitoModel.expediente" id="expediente" type="text" :class="{ 'p-invalid': errorsModal.expediente }" />
                <small v-if="errorsModal.expediente" class="p-error">{{ errorsModal.expediente }}</small>
            </div>
            
            <div class="field col-12 md:col-4">
                <label for="organismo">Aprehensor</label>
                <Dropdown v-model="delitoModel.id_organismo" class="capitalize" id="organismo" optionValue="code" :options="organismoOptions" optionLabel="name" placeholder="Seleccione..."  :class="{ 'p-invalid': errorsModal.id_organismo }" />
                <small v-if="errorsModal.id_organismo" class="p-error">{{ errorsModal.id_organismo }}</small>
            </div>
            
            
            <div class="field col-12 md:col-4">
                <label for="lugar_detencion">Lugar de detencion</label>
                <InputText  v-model="delitoModel.lugar_detencion" id="lugar_detencion" type="text" :class="{ 'p-invalid': errorsModal.lugar_detencion }" />
                <small v-if="errorsModal.lugar_detencion" class="p-error">{{ errorsModal.lugar_detencion }}</small>
            </div>
            
            <div class="field col-12 md:col-4">
                <label for="observaciones">Observaciones</label>
                <InputText placeholder="" v-model="delitoModel.observaciones"  id="observaciones" type="text" :class="{ 'p-invalid': errorsModal.observaciones }" />
                <small v-if="errorsModal.observaciones" class="p-error">{{ errorsModal.observaciones }}</small>
            </div>
            
            <div class="field col-12 md:col-12">
                <label for="delito">Delito</label>
                <Dropdown v-model="delitoModel.id_delito" class="capitalize" id="delito" optionValue="code" :options="delitosOptions" optionLabel="name" placeholder="Seleccione..."  :class="{ 'p-invalid': errorsModal.id_delito }" />
                <small v-if="errorsModal.id_delito" class="p-error">{{ errorsModal.id_delito }}</small>
            </div>
            
            <div class="field col-12 md:col-6">
                <label for="fecha_detencion">Fecha de detencion</label>
                <input type="datetime-local" v-model="delitoModel.fecha_detencion" id="fecha_detencion" class="p-inputtext p-component w-full" :class="{ 'p-invalid': errorsModal.fecha_detencion}" />
                <small v-if="errorsModal.fecha_detencion" class="p-error">{{ errorsModal.fecha_detencion }}</small>
            </div>
            
        </div>
        
        <template #footer>
            <Button 
            label="Cancelar" 
            text 
            severity="danger" 
            @click="modalVisible = false" 
            />
            <Button 
            label="Guardar" 
            outlined 
            severity="success" 
            @click="sendDelito" 
            />
        </template>  
    </Dialog>
    
    
    <div class="card">
        <div class="p-fluid formgrid grid">   
            <h5 class="col-12 md:col-3">Delitos</h5>
            <div class="field col-12 md:col-3 md:col-offset-6 flex justify-content-center">
                <Button v-if="ciudadanoEncontrado" severity="secondary" label="Agregar" icon="pi pi-plus" iconPos="right" @click="modalVisible = true" />
                <Toast />
            </div>
            
        </div>
        
        <DataTable :value="delitosCiudadano" stripedRows tableStyle="min-width: 50rem">
            <Column field="expediente" header="Caso"></Column>
            <Column field="fecha_detencion" header="Fecha"></Column>
            <Column field="nombre_delito" header="Delito">
                <template #body="{ data }">
                    <span v-tooltip.top="data.nombre_delito">
                        {{ data.nombre_delito.length > 30 ? data.nombre_delito.substring(0, 30) + '...' : data.nombre_delito }}
                    </span>
                </template>
            </Column>
            <Column field="org_siglas" header="Aprehensor">
                <template #body="{ data }">
                    <span v-tooltip.top="data.org_nombre">
                        {{ data.org_siglas }}
                    </span>
                </template>
            </Column>
            <Column field="u_nombre" header="Reseñador">
                <template #body="{ data }">
                    <span v-tooltip.top="data.u_username">
                        {{ data.u_nombre + ' ' + data.u_apellido }}
                    </span>
                </template>
            </Column>
            <Column field="observaciones" header="Detalles">
                <template #body="{ data }">
                    <span v-tooltip.top="data.observaciones">
                        {{ data.observaciones.length > 30 ? data.observaciones.substring(0, 30) + '...' : data.observaciones }}
                    </span>
                </template>
            </Column>
        </DataTable>
    </div>
</template> 

<style scoped>
.calendar-small {
    width: 220px !important; /* Ajusta el valor según lo que necesites */
}
</style>
