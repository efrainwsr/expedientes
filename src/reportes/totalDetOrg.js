
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import {getAllDet, getTotalDetOrg} from '../service/reportesService.js'    


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

function invertDate (fecha){
  const d = new Date(`${fecha}T00:00:00`);
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  return `${day}/${month}/${year}`
}

// Función para generar y descargar el PDF
export async function createTemplate(org, rangoFechas){
  
  let reg = []

  if(org == null || org == undefined ){
    const {data} = await getAllDet(rangoFechas);
    if(data.length === 0) reg = [{org: 'SIN REGISTROS', det: 0}]
    else reg = data

  }else{
    const {data} = await getTotalDetOrg(org, rangoFechas);
    if(data.length === 0) reg = [{org: 'SIN REGISTROS', det: 0}]
    else reg = data
  }

  // Crear documento PDF
  const pdfDoc = await PDFDocument.create()
  const pageHeight = 792
  const pageWidth = 612
  const rowsPerPage = 20 // Ajusta según el espacio
  const totalPages = Math.ceil(reg.length / rowsPerPage)

  // Cargar imágenes (desde public/)
  const imageBytes = await fetch('public/redcrim.jpg').then(res => res.arrayBuffer())
  const footerBytes = await fetch('public/imgfooter.png').then(res => res.arrayBuffer())
  const image = await pdfDoc.embedJpg(imageBytes)
  const footer = await pdfDoc.embedPng(footerBytes)
  const logoSize = 112

  // Fuentes
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Tabla configuración
  const colWidths = [420, 95]
  const tableX = 50
  // Aumentamos la altura para permitir una segunda línea dentro de la misma celda
  const cellHeight = 40
  const padding = 10
  const headers = ['Organismo Aprehensor', 'Detenciones']
  
  //Header 
  const posLogo = { x: (pageWidth-logoSize)/2, y: 660 }
  const subtitleText = 'DETENCIONES TOTALES POR ORGANISMO APREHENSOR'
  const subtitleSize = 12
  const fecha = `Desde: ${invertDate(rangoFechas.inicio)}  Hasta: ${invertDate(rangoFechas.fin)}`
  
  const footerText = 'Sistema integrado de reseñas internas para detenidos'
  const footerSize = 7

  

  function drawHeaderFooter(page, pageIndex) {
    const now = `EMISIÓN: ${fechaActual()}`
    page.drawText(now, { x: 50, y: pageHeight - 35, size: 6, font: regularFont })
    page.drawImage(image, { x: posLogo.x, y: posLogo.y, width: logoSize, height: logoSize })

    const subtitleWidth = boldFont.widthOfTextAtSize(subtitleText, subtitleSize)
    const subtitleX = (pageWidth / 2) - (subtitleWidth / 2)
    page.drawText(subtitleText, { x: subtitleX, y: posLogo.y - 25, size: subtitleSize, font: regularFont })
    page.drawText(fecha, { x: 50, y: 600, size: 10, font: boldFont })

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
    let currentY = 550
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

      const orgText = (reg[i].org || '').toUpperCase()
      const delitosText = String(reg[i].delitos || '')

      // Wrapping for delitosText to fit inside the column
      const wrapFontSize = 10
      const wrapMaxWidth = colWidths[0] - padding * 2
      const words = delitosText.split(/\s+/).filter(Boolean)
      const lines = []
      let line = ''
      for (let w = 0; w < words.length; w++) {
        const test = line ? line + ' ' + words[w] : words[w]
        const testWidth = regularFont.widthOfTextAtSize(test, wrapFontSize)
        if (testWidth <= wrapMaxWidth) {
          line = test
        } else {
          if (line) lines.push(line)
          // if single word longer than maxWidth, we still push it (it will overflow)
          line = words[w]
        }
      }
      if (line) lines.push(line)

      // Calculate dynamic row height: top org line + gap + wrapped lines + padding
      const orgLineHeight = 12
      const lineGap = 4
      const wrappedHeight = lines.length * (wrapFontSize + 2)
      const rowHeight = Math.max(cellHeight, orgLineHeight + lineGap + wrappedHeight + padding)

      // Draw cell rectangle with dynamic height
      page.drawRectangle({
        x: currentX,
        y: currentY,
        width: colWidths[0],
        height: rowHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      })

      // Draw organismo (top of cell)
      page.drawText(orgText, {
        x: currentX + padding,
        y: currentY + rowHeight - orgLineHeight - 4,
        size: 11,
        font: regularFont,
      })

      // Draw wrapped delitos lines below organismo
      let ly = currentY + rowHeight - orgLineHeight - lineGap - wrapFontSize
      for (let li = 0; li < lines.length; li++) {
        page.drawText(lines[li], { x: currentX + padding, y: ly, size: wrapFontSize, font: regularFont, maxWidth: wrapMaxWidth })
        ly -= (wrapFontSize + 2)
      }

      currentX += colWidths[0]

      // Second column (detenciones) - vertically center based on rowHeight
      page.drawRectangle({
        x: currentX,
        y: currentY,
        width: colWidths[1],
        height: rowHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      })
      const detText = reg[i].det != null ? reg[i].det.toString() : ''
      const detY = currentY + (rowHeight / 2) - (12 / 2)
      page.drawText(detText, {
        x: currentX + padding,
        y: detY,
        size: 12,
        font: regularFont,
      })

      // Move down by the dynamic row height
      currentY -= rowHeight
    }
  }

  // Descargar PDF en el navegador
  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'reporte.pdf'
  link.click()

}


