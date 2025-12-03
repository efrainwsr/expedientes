
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { getDetUsers } from '../service/reportesService.js'
import { fechaActualhhmm } from '../utils.js'

function invertDate (fecha){
  const d = new Date(`${fecha}T00:00:00`);
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  return `${day}/${month}/${year}`
}

const pageHeight = 792
const pageWidth = 612

function centrarTexto(text, font, size) {
  const subtitleWidth = font.widthOfTextAtSize(text, size)
  return (pageWidth / 2) - (subtitleWidth / 2)
}


function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d)) return ''
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`
}
export async function pdfUsuarios(user, rangoFechas) {
  const resp = await getDetUsers(rangoFechas)
  const rows = resp && resp.data ? resp.data : []
  // rango de fechas para mostrar en header (si se pasan)
  const fecha = rangoFechas && (rangoFechas.inicio || rangoFechas.fin)
    ? `Desde: ${rangoFechas.inicio ? invertDate(rangoFechas.inicio) : ''}  Hasta: ${rangoFechas.fin ? invertDate(rangoFechas.fin) : ''}`
    : ''

  // Agrupar por usuario (username + cédula)
  const usersMap = new Map()
  rows.forEach(r => {
    const key = `${r.username}||${r.cedula}`
    if (!usersMap.has(key)) {
      usersMap.set(key, {
        info: {
          cedula: r.cedula,
          username: r.username,
          nombre: r.nombre,
          apellido: r.apellido,
          roles: r.roles,
          activo: r.activo,
          fecha_creacion: r.fecha_creacion,
          ultimo_login: r.ultimo_login
        },
        expedientes: []
      })
    }
    const entry = usersMap.get(key)
    entry.expedientes.push({
      expediente: r.expediente,
      fecha: r.fecha || r.fecha_procesado || r.fecha_creacion || r.ultimo_login
    })
  })

  const users = Array.from(usersMap.values())

  // Preparar páginas (dos pases: contar líneas para paginación)
  const headerLinesPerUser = 7 // aproximado: título + 5 datos + espacio + casos
  const lineHeight = 12
  const headerHeight = 160 // aumentar espacio para subtítulos + fecha
  const footerHeight = 60
  const contentTop = pageHeight - headerHeight
  const contentBottom = footerHeight
  const maxLinesPerPage = Math.floor((contentTop - contentBottom) / lineHeight)

  const pages = [] // cada página es array de líneas
  let current = []

  function pushLine(line) {
    if (current.length >= maxLinesPerPage) {
      pages.push(current)
      current = []
    }
    current.push(line)
  }

  users.forEach(u => {
    const info = u.info
    const exps = u.expedientes || []

    // Bloque de usuario (estructurado para renderizado con etiquetas en negrita)
    pushLine({ type: 'title', text: 'DETALLES DEL USUARIO' })
    pushLine({ type: 'kv', key: 'Usuario', value: `${info.username || ''}  Cedula: ${info.cedula || ''}` })
    pushLine({ type: 'kv', key: 'Nombres', value: `${info.nombre || ''}  Apellidos: ${info.apellido || ''}` })
    const estatus = info.activo === 1 || info.activo === '1' ? 'activo' : 'inactivo'
    const tipo = info.roles === '0' || info.roles === 0 ? 'administrador' : (info.roles === '1' || info.roles === 1 ? 'usuario' : String(info.roles))
    pushLine({ type: 'kv', key: 'Estatus', value: `${estatus}` })
    pushLine({ type: 'kv', key: 'Tipo usuario', value: `${tipo}` })
    pushLine({ type: 'kv', key: 'Fecha Creacion', value: formatDate(info.fecha_creacion) })
    pushLine({ type: 'kv', key: 'Ultimo acceso', value: formatDate(info.ultimo_login) })
    pushLine({ type: 'blank' })

    pushLine({ type: 'kv', key: 'CASOS PROCESADOS', value: String(exps.length) })
    exps.forEach(e => {
      pushLine({ type: 'case', expediente: e.expediente || '', fecha: e.fecha || '' })
    })

    // separación entre usuarios
    pushLine({ type: 'blank' })
    pushLine({ type: 'blank' })
  })

  if (current.length > 0) pages.push(current)

  // Crear PDF y dibujar páginas
  const pdfDoc = await PDFDocument.create()

  // Cargar recursos
  const imageBytes = await fetch('public/redcrim.jpg').then(res => res.arrayBuffer()).catch(() => null)
  const footerBytes = await fetch('public/imgfooter.png').then(res => res.arrayBuffer()).catch(() => null)
  const image = imageBytes ? await pdfDoc.embedJpg(imageBytes) : null
  const footer = footerBytes ? await pdfDoc.embedPng(footerBytes) : null
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const logoSize = 56
  const posLogo = { x: pageWidth - logoSize - 20, y: pageHeight - logoSize - 20 }

  function drawHeaderFooter(page, pageIndex, totalPages) {
    const now = `EMISIÓN: ${fechaActualhhmm()}`
    page.drawText(now, { x: 40, y: pageHeight - 35, size: 6, font: regularFont })
    if (image) page.drawImage(image, { x: posLogo.x, y: posLogo.y, width: logoSize, height: logoSize })

    const subtitleCicpc = 'CUERPO DE INVESTIGACIONES CIENTÍFICAS, PENALES Y CRIMINALÍSTICAS'
    const subtitleDelegacion = 'DELEGACIÓN MUNICIPAL CIUDAD GUAYANA'
    const subtitleText = 'RELACION DE USUARIOS Y CASOS PROCESADOS'
    const subtitleSize = 12

    page.drawText(subtitleCicpc, { x: centrarTexto(subtitleCicpc, boldFont, subtitleSize), y: 735, size: subtitleSize, font: boldFont })
    page.drawText(subtitleDelegacion, { x: centrarTexto(subtitleDelegacion, boldFont, subtitleSize), y: 723, size: subtitleSize, font: boldFont })
    page.drawText(subtitleText, { x: centrarTexto(subtitleText, boldFont, subtitleSize), y: 690, size: subtitleSize, font: boldFont })

    // imprimir rango de fechas (si existe) justo debajo del subtítulo
    if (fecha) page.drawText(fecha, { x: 40, y: 670, size: 10, font: boldFont })

    if (footer) page.drawImage(footer, { x: 45, y: 15, width: 154, height: 48 })
    const footerText = 'Sistema integrado de reseñas internas para detenidos'
    const footerSize = 7
    const footerWidth = boldFont.widthOfTextAtSize(footerText, footerSize)
    const footerPosX = (pageWidth / 2) - (footerWidth / 2)
    page.drawText(footerText, { x: footerPosX, y: 25, size: footerSize, font: boldFont })

    if (typeof totalPages === 'number') {
      const pageCountText = `Página ${pageIndex + 1} de ${totalPages}`
      const pageCountWidth = regularFont.widthOfTextAtSize(pageCountText, 10)
      page.drawText(pageCountText, { x: pageWidth - pageCountWidth - 50, y: 25, size: 10, font: regularFont })
    }
  }

  const totalPages = pages.length || 1

  pages.forEach((lines, pageIndex) => {
    const page = pdfDoc.addPage([pageWidth, pageHeight])
    drawHeaderFooter(page, pageIndex, totalPages)

    // Dibujar contenido con fondo gris por bloque de usuario y etiquetas en negrita
    const startX = 40
    const baseY = pageHeight - headerHeight - 10
    for (let i = 0; i < lines.length; i++) {
      const ln = lines[i]
      if (ln && ln.type === 'title') {
        // calcular alcance del bloque hasta la siguiente title o fin de página
        let k = i + 1
        while (k < lines.length && lines[k].type !== 'title') k++
                const count = k - i
                const padding = 6
                const gapAfterLast = 5 // leave 5 units of empty space below last line
                const firstBaseline = baseY - (i * lineHeight)
                const topY = firstBaseline + (lineHeight * 0.6)
                const lastBaseline = baseY - ((k - 1) * lineHeight)
                let bottomY = lastBaseline - gapAfterLast
                // ensure minimum height
                if (topY - bottomY < lineHeight + padding) {
                  bottomY = topY - (lineHeight + padding)
                }
                const rectHeight = topY - bottomY
                page.drawRectangle({ x: startX - 6, y: bottomY, width: pageWidth - (startX * 2) + 12, height: rectHeight, color: rgb(0.95, 0.95, 0.95) })

        // dibujar líneas del bloque
        for (let m = i; m < k; m++) {
          const l = lines[m]
          const yLine = baseY - (m * lineHeight)
          if (l.type === 'title') {
            page.drawText(l.text, { x: startX, y: yLine, size: 12, font: boldFont })
          } else if (l.type === 'kv') {
            const label = `${l.key}:`
            const labelWidth = boldFont.widthOfTextAtSize(label, 10)
            page.drawText(label, { x: startX, y: yLine, size: 10, font: boldFont })
            page.drawText(' ' + (l.value || ''), { x: startX + labelWidth + 6, y: yLine, size: 10, font: regularFont })
          } else if (l.type === 'case') {
            // dibujar expediente y fecha en la misma línea pero como elementos separados
            const labelCas = 'Expediente:'
            const labelCasWidth = boldFont.widthOfTextAtSize(labelCas, 10)
            page.drawText(labelCas, { x: startX, y: yLine, size: 10, font: boldFont })
            page.drawText(' ' + (l.expediente || ''), { x: startX + labelCasWidth + 6, y: yLine, size: 10, font: regularFont })

            const midX = startX + Math.floor((pageWidth - startX * 2) / 2)
            const labelFec = 'Fecha:'
            const labelFecWidth = boldFont.widthOfTextAtSize(labelFec, 10)
            page.drawText(labelFec, { x: midX-60, y: yLine, size: 10, font: boldFont })
            page.drawText(' ' + formatDate(l.fecha), { x: midX-60 + labelFecWidth + 6, y: yLine, size: 10, font: regularFont })
          }
        }

        i = k - 1
      } else if (ln && ln.type === 'kv') {
        // línea suelta fuera de bloque (no debería ocurrir a menudo)
        const yLine = baseY - (i * lineHeight)
        const label = `${ln.key}:`
        const labelWidth = boldFont.widthOfTextAtSize(label, 10)
        page.drawText(label, { x: startX, y: yLine, size: 10, font: boldFont })
        page.drawText(' ' + (ln.value || ''), { x: startX + labelWidth + 6, y: yLine, size: 10, font: regularFont })
      } else if (ln && ln.type === 'case') {
        // caso aislado fuera de bloque
        const yLine = baseY - (i * lineHeight)
        const labelCas = 'Expediente:'
        const labelCasWidth = boldFont.widthOfTextAtSize(labelCas, 10)
        page.drawText(labelCas, { x: startX, y: yLine, size: 10, font: boldFont })
        page.drawText(' ' + (ln.expediente || ''), { x: startX + labelCasWidth + 6, y: yLine, size: 10, font: regularFont })
        const midX = startX + Math.floor((pageWidth - startX * 2) / 2)
        const labelFec = 'Fecha:'
        const labelFecWidth = boldFont.widthOfTextAtSize(labelFec, 10)
        page.drawText(labelFec, { x: midX, y: yLine, size: 10, font: boldFont })
        page.drawText(' ' + formatDate(ln.fecha), { x: midX + labelFecWidth + 6, y: yLine, size: 10, font: regularFont })
      }
    }
  })

  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'usuarios_reporte.pdf'
  link.click()
}


