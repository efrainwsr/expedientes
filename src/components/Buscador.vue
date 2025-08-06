<template>
    <div class="card">
        <h5>{{ titulo }}</h5>
        <form @submit.prevent="buscar">
            <div class="p-fluid formgrid grid">
                <div class="field col-7 md:col-7">
                    <label :for="inputId">{{ label }}</label>
                    <InputText
                    :id="inputId"
                    v-model="valorBusqueda"
                    :placeholder="placeholder"
                    />
                </div>
                
                <div class="field col-5 md:col-5">
                    <Button
                    @click="buscar"
                    class="p-button-success"
                    :label="botonLabel"
                    icon="pi pi-search"
                    />
                </div>
            </div>
            
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    titulo: String,
    label: {
        type: String,
        default: '',
    },
    placeholder: {
        type: String,
        default: 'Buscar...',
    },
    botonLabel: {
        type: String,
        default: 'Buscar',
    },
    inputId: {
        type: String,
        default: 'busqueda',
    },
})

const emits = defineEmits(['buscar'])

const valorBusqueda = ref('')

const buscar = () => {
    emits('buscar', valorBusqueda.value)
}
</script>
