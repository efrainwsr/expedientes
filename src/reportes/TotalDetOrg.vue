<script setup>
import { ref } from 'vue'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import axios from 'axios'
import {getTotalDetOrg} from '../service/reportesService.js'    

const props = defineProps({
    org: String
})

async function handleClick() {
  await createTemplate(props.org);
}


// Referencia para mostrar estado o mensajes
const mensaje = ref('')

// Utilidad para obtener fecha actual
function fechaActual() {
  const d = new Date()
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hours = d.getHours()
  const minutes = d.getMinutes().toString().padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

// Función para generar y descargar el PDF
async function createTemplate(org) {
 
  const response = await getTotalDetOrg(org);
    console.log('Datos del reporte:', response);
    return response;
  
  
  mensaje.value = 'Generando PDF...'

  // Crear documento PDF
  const pdfDoc = await PDFDocument.create()

  // Cargar imágenes (desde public/)
  const imageBytes = await fetch('public/redcrim.jpg').then(res => res.arrayBuffer())
  const footerBytes = await fetch('public/imgfooter.png').then(res => res.arrayBuffer())
  const image = await pdfDoc.embedJpg(imageBytes)
  const footer = await pdfDoc.embedPng(footerBytes)

  // Fuentes
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Datos
  const reg = [
    { org: 'POLICIA NACIONAL BOLIVARIANA', det: 5 },
    { org: 'CICPC', det: 3 },
    { org: 'GUARDIA NACIONAL BOLIVARIANA', det: 7 },
    { org: 'POLICIA DEL CARONI', det: 4 },
    { org: 'POLICIA NACIONAL BOLIVARIANA', det: 5 },
    { org: 'CICPC', det: 3 },
    { org: 'GUARDIA NACIONAL BOLIVARIANA', det: 7 },
    { org: 'POLICIA DEL CARONI', det: 4 },{ org: 'POLICIA NACIONAL BOLIVARIANA', det: 5 },
    { org: 'CICPC', det: 3 },
    { org: 'GUARDIA NACIONAL BOLIVARIANA', det: 7 },
    { org: 'POLICIA DEL CARONI', det: 4 },{ org: 'POLICIA NACIONAL BOLIVARIANA', det: 5 },
    { org: 'CICPC', det: 3 },
    { org: 'GUARDIA NACIONAL BOLIVARIANA', det: 7 },
    { org: 'POLICIA DEL CARONI', det: 4 },{ org: 'POLICIA NACIONAL BOLIVARIANA', det: 5 },
    { org: 'CICPC', det: 3 },
    { org: 'GUARDIA NACIONAL BOLIVARIANA', det: 7 },
    { org: 'POLICIA DEL CARONI', det: 4 },{ org: 'POLICIA NACIONAL BOLIVARIANA', det: 5 },
    { org: 'CICPC', det: 3 },
    { org: 'GUARDIA NACIONAL BOLIVARIANA', det: 7 },
    { org: 'POLICIA DEL CARONI', det: 4 },{ org: 'POLICIA NACIONAL BOLIVARIANA', det: 5 },
    { org: 'CICPC', det: 3 },
    { org: 'GUARDIA NACIONAL BOLIVARIANA', det: 7 },
    { org: 'POLICIA DEL CARONI', det: 4 },{ org: 'POLICIA NACIONAL BOLIVARIANA', det: 5 },
    { org: 'CICPC', det: 3 },
    { org: 'GUARDIA NACIONAL BOLIVARIANA', det: 7 },
    { org: 'POLICIA DEL CARONI', det: 4 },{ org: 'POLICIA NACIONAL BOLIVARIANA', det: 5 },
    { org: 'CICPC', det: 3 },
    { org: 'GUARDIA NACIONAL BOLIVARIANA', det: 7 },
    { org: 'POLICIA DEL CARONI', det: 4 },{ org: 'POLICIA NACIONAL BOLIVARIANA', det: 5 },
    { org: 'CICPC', det: 3 },
    { org: 'GUARDIA NACIONAL BOLIVARIANA', det: 7 },
    { org: 'POLICIA DEL CARONI', det: 4 },{ org: 'POLICIA NACIONAL BOLIVARIANA', det: 5 },
    { org: 'CICPC', det: 3 },
    { org: 'GUARDIA NACIONAL BOLIVARIANA', det: 7 },
    { org: 'POLICIA DEL CARONI', det: 4 },{ org: 'POLICIA NACIONAL BOLIVARIANA', det: 5 },
    { org: 'CICPC', det: 3 },
    { org: 'GUARDIA NACIONAL BOLIVARIANA', det: 7 },
    { org: 'POLICIA DEL CARONI', det: 4 },{ org: 'POLICIA NACIONAL BOLIVARIANA', det: 5 },
    { org: 'CICPC', det: 3 },
    { org: 'GUARDIA NACIONAL BOLIVARIANA', det: 7 },
    { org: 'POLICIA DEL CARONI', det: 4 },{ org: 'POLICIA NACIONAL BOLIVARIANA', det: 5 },
    { org: 'CICPC', det: 3 },
    { org: 'GUARDIA NACIONAL BOLIVARIANA', det: 7 },
    { org: 'POLICIA DEL CARONI', det: 4 },{ org: 'POLICIA NACIONAL BOLIVARIANA', det: 5 },
    { org: 'CICPC', det: 3 },
    { org: 'GUARDIA NACIONAL BOLIVARIANA', det: 7 },
    { org: 'POLICIA DEL CARONI', det: 4 },
  ]

  const headers = ['Organismo Aprehensor', 'Detenciones']
  const colWidths = [420, 95]
  const tableX = 50
  const cellHeight = 25
  const padding = 10
  const posLogo = { x: 209, y: 660 }
  const subtitleText = 'REPORTE DE DETENCIÓN TOTALES POR ORGANISMO APREHENSOR'
  const subtitleSize = 13
  const fecha = 'Desde 01/09/2025 hasta 23/09/2025'
  const footerText = 'Sistema integrado de reseñas internas para detenidos'
  const footerSize = 7

  const pageHeight = 792
  const pageWidth = 612
  const rowsPerPage = 20 // Ajusta según el espacio
  const totalPages = Math.ceil(reg.length / rowsPerPage)

  function drawHeaderFooter(page, pageIndex) {
    const now = `Emisión: ${fechaActual()}`
    page.drawText(now, { x: 50, y: pageHeight - 35, size: 10, font: boldFont })
    page.drawImage(image, { x: posLogo.x, y: posLogo.y, width: 112, height: 112 })

    const subtitleWidth = boldFont.widthOfTextAtSize(subtitleText, subtitleSize)
    const subtitleX = (pageWidth / 2) - (subtitleWidth / 2)
    page.drawText(subtitleText, { x: subtitleX, y: posLogo.y - 25, size: subtitleSize, font: regularFont })
    page.drawText(fecha, { x: 50, y: posLogo.y - 45, size: 12, font: boldFont })

    // Footer
    page.drawImage(footer, { x: 45, y: 15, width: 154, height: 48 })
    const footerWidth = boldFont.widthOfTextAtSize(footerText, footerSize)
    const footerPosX = (pageWidth / 2) - (footerWidth / 2)
    page.drawText(footerText, { x: footerPosX, y: 25, size: footerSize, font: boldFont })

    const pageCountText = `Página ${pageIndex + 1} de ${totalPages}`
    const pageCountWidth = regularFont.widthOfTextAtSize(pageCountText, 10)
    page.drawText(pageCountText, { x: pageWidth - pageCountWidth - 50, y: 25, size: 10, font: regularFont })
  }

  // Generar páginas
  for (let p = 0; p < totalPages; p++) {
    const page = pdfDoc.addPage([pageWidth, pageHeight])
    drawHeaderFooter(page, p)

    // Encabezados
    let currentY = 570
    let currentX = tableX
    headers.forEach((header, index) => {
      page.drawRectangle({
        x: currentX,
        y: currentY,
        width: colWidths[index],
        height: cellHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
        color: rgb(0.9, 0.9, 0.9),
      })
      const textWidth = boldFont.widthOfTextAtSize(header, 14)
      const textXCentered = currentX + (colWidths[index] / 2) - (textWidth / 2)
      const textYCentered = currentY + (cellHeight / 2) - (14 / 2)
      page.drawText(header, { x: textXCentered, y: textYCentered, size: 14, font: boldFont })
      currentX += colWidths[index]
    })

    // Filas
    currentY -= cellHeight
    const startIdx = p * rowsPerPage
    const endIdx = Math.min(startIdx + rowsPerPage, reg.length)
    for (let i = startIdx; i < endIdx; i++) {
      let currentX = tableX
      page.drawRectangle({
        x: currentX,
        y: currentY,
        width: colWidths[0],
        height: cellHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      })
      page.drawText(reg[i].org, {
        x: currentX + padding,
        y: currentY + (cellHeight / 2) - (12 / 2),
        size: 11,
        font: regularFont,
      })
      currentX += colWidths[0]
      page.drawRectangle({
        x: currentX,
        y: currentY,
        width: colWidths[1],
        height: cellHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      })
      page.drawText(reg[i].det.toString(), {
        x: currentX + padding,
        y: currentY + (cellHeight / 2) - (12 / 2),
        size: 12,
        font: regularFont,
      })
      currentY -= cellHeight
    }
  }

  // Descargar PDF en el navegador
  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'reporte.pdf'
  link.click()

  mensaje.value = 'PDF generado y descargado ✅'
}
</script>

<template>
   <i  @click="handleClick"  class="edit-button pi pi-file-pdf text-red-500" ></i>
</template>

