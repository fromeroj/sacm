# 🎵 Licencia Musical México - Aplicación Completa

Una aplicación web profesional y educativa para entender y gestionar licencias musicales en establecimientos comerciales de México. Desarrollada con **Node.js**, **Express**, **SQLite** y **PDFKit**.

## 🌟 Características Principales

### 🏠 Landing Page Profesional
- Diseño moderno y responsivo
- Información completa sobre servicios de licenciamiento
- Planes de precios detallados
- Call-to-action optimizado para conversión

### 💰 Sistema UDA Explicado
- **Página dedicada a la UDA** (Unidad de Derechos de Autor)
- Historia y desarrollo del sistema
- Explicación de factores de cálculo
- Jerarquía vertical de tarifas
- Beneficios del sistema UDA

### 📋 Tarifario SACM 2017 Completo
- **Estructura oficial de tarifas** basada en documentos reales
- Categorías principales de establecimientos
- Tipos de tarifas (mensual, diaria, por evento, porcentaje)
- Factores que influyen en las tarifas
- Ejemplos prácticos con tablas interactivas
- Zonas geográficas especiales y temporadas

### 📊 Calculadora Inteligente
- **Formulario mejorado** sin redundancia
- **Campos condicionales** que aparecen según selecciones
- **Validación en tiempo real**
- **Géneros musicales** con checkboxes múltiples
- **Sistema de sonido** con opciones predefinidas
- **Cálculo basado en factores reales**

### 📄 Generación de PDF Profesional
- **PDFKit** para generación eficiente
- **Contratos profesionales** con diseño corporativo
- **Desglose detallado** por cada sociedad (SACM, ANDI, SOMEXFON)
- **Información legal completa**
- **Descarga directa** desde la aplicación

### ⚖️ Marco Legal Completo
- **Ley Federal del Derecho de Autor** detallada
- **Artículos específicos** con explicaciones
- **Sociedades de gestión** con información actualizada
- **Consecuencias del incumplimiento**
- **Proceso de licenciamiento** paso a paso

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** con Express.js
- **SQLite3** para base de datos
- **PDFKit** para generación de PDF
- **EJS** como motor de plantillas
- **CORS** para manejo de peticiones

### Frontend
- **HTML5** semántico
- **CSS3** con Flexbox y Grid
- **JavaScript ES6+** vanilla
- **Font Awesome** para iconografía
- **Diseño responsivo** mobile-first

## 📦 Instalación y Configuración

### Prerrequisitos
- **Node.js** (versión 14 o superior)
- **npm** (incluido con Node.js)

### Instalación Rápida

1. **Extraer y navegar al proyecto**
   ```bash
   unzip licencia-musical-unified-completa.zip
   cd licencia-musical-unified
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar la aplicación**
   ```bash
   npm start
   ```

4. **Acceder a la aplicación**
   - Abrir navegador en `http://localhost:3000`
   - ¡La aplicación está lista para usar!

### Modo Desarrollo
```bash
npm run dev  # Usa nodemon para recarga automática
```

## 🎯 Estructura de la Aplicación

### 1. Landing Page (`/`)
- **Información general** sobre licencias musicales
- **Servicios ofrecidos** y beneficios
- **Planes de precios** con comparación
- **Call-to-action** para comenzar

### 2. Marco Legal (`/legal`)
- **Ley Federal del Derecho de Autor** completa
- **Artículos específicos** (26 bis, 117 bis, 133, 200-202)
- **Sociedades de gestión** (SACM, ANDI, SOMEXFON)
- **Obligaciones legales** para establecimientos
- **Consecuencias del incumplimiento**
- **Proceso de licenciamiento**

### 3. ¿Qué es la UDA? (`/uda`)
- **Concepto y origen** de la UDA
- **Historia y desarrollo** (1992-1998)
- **Objetivos** del sistema UDA
- **Cálculo de la UDA** (IPC + Salarios mínimos)
- **Jerarquía vertical** de tarifas
- **Elementos básicos** para fijación
- **Formas de pago** según tipo de uso
- **Beneficios** del sistema

### 4. Tarifario SACM (`/tarifario`)
- **Introducción** al tarifario oficial
- **Categorías principales** de establecimientos
- **Tipos de tarifas** (mensual, diaria, evento, porcentaje)
- **Factores** que influyen en las tarifas
- **Ejemplos prácticos** con tablas interactivas
- **Zonas geográficas** especiales
- **Temporadas** y variaciones
- **Guía de uso** del tarifario

### 5. Calculadora (`/app`)
- **Formulario inteligente** con 5 secciones:
  - 📍 **Información Básica**: Nombre, tipo, dirección
  - 📏 **Dimensiones**: Aforo y metros cuadrados
  - 🎵 **Características Musicales**: Tipo, géneros, horarios
  - 💰 **Modelo de Negocio**: Entrada, eventos especiales
  - 🔊 **Sistema de Audio**: Equipamiento y zonas

- **Resultados detallados**:
  - Desglose por cada sociedad
  - Costo total anual
  - Factores considerados
  - Información legal y contactos

- **Descarga de PDF** con contrato profesional

## 📊 Factores de Cálculo Implementados

### Multiplicadores por Tipo de Establecimiento
- **Restaurante**: 1.0 (base)
- **Bar**: 1.3
- **Discoteca**: 1.8
- **Café**: 0.8
- **Tienda Departamental**: 0.6
- **Gimnasio**: 0.9
- **Hotel**: 1.1
- **Centro Comercial**: 0.7
- **Salón de Eventos**: 1.4

### Factores de Música en Vivo (ANDI)
- **Diario**: 2.5x
- **Semanal**: 2.0x
- **Mensual**: 1.5x
- **Ocasional**: 1.2x

### Factores Adicionales
- **Cobro de entrada**: +40% SACM/ANDI, +20% SOMEXFON
- **Eventos frecuentes**: +30% SACM/ANDI, +10% SOMEXFON
- **Eventos ocasionales**: +10% SACM/ANDI, +5% SOMEXFON

## 🔧 Estructura del Proyecto

```
licencia-musical-unified/
├── server.js                 # Servidor principal unificado
├── package.json              # Dependencias y scripts
├── README.md                 # Documentación completa
├── public/                   # Archivos estáticos
│   ├── css/
│   │   ├── landing.css       # Estilos de landing page
│   │   ├── app.css          # Estilos de calculadora
│   │   ├── legal.css        # Estilos de marco legal
│   │   ├── uda.css          # Estilos de página UDA
│   │   └── tarifario.css    # Estilos de tarifario
│   └── js/
│       ├── landing.js       # JavaScript de landing page
│       ├── app.js           # JavaScript de calculadora
│       ├── legal.js         # JavaScript de marco legal
│       ├── uda.js           # JavaScript de página UDA
│       └── tarifario.js     # JavaScript de tarifario
├── views/                   # Plantillas EJS
│   ├── landing.ejs          # Landing page
│   ├── app.ejs              # Calculadora
│   ├── legal.ejs            # Marco legal
│   ├── uda.ejs              # Página UDA
│   └── tarifario.ejs        # Tarifario SACM
└── licencias.db             # Base de datos SQLite (se crea automáticamente)
```

## 🚀 Características Técnicas

### Servidor Unificado
- **Un solo puerto** (3000) para toda la aplicación
- **Archivos estáticos** servidos por Express
- **API REST** integrada para funcionalidad
- **Plantillas EJS** para páginas dinámicas
- **5 rutas principales** completamente funcionales

### Base de Datos Expandida
- **18 campos** de información detallada
- **Costos separados** por cada sociedad
- **Información musical** completa
- **Características del negocio**

### Generación de PDF Optimizada
- **PDFKit** en lugar de Puppeteer (más eficiente)
- **Diseño profesional** con colores corporativos
- **Información completa** del contrato
- **Avisos legales** incluidos
- **Compatible con Node.js antiguo**

### UX/UI Mejorada
- **Formulario sin redundancia**
- **Campos condicionales** inteligentes
- **Checkboxes para géneros** musicales
- **Radio buttons** para opciones exclusivas
- **Validación en tiempo real**
- **Animaciones suaves** en todas las páginas

## 📱 Responsive Design

- **Mobile-first** approach en todas las páginas
- **Breakpoints optimizados** para todos los dispositivos
- **Navegación adaptativa** consistente
- **Formularios optimizados** para móviles
- **Botones touch-friendly**
- **Tablas responsivas** con scroll horizontal

## 🔒 Seguridad y Validación

- **Validación del lado del servidor**
- **Sanitización de datos** de entrada
- **Manejo de errores** robusto
- **Headers de seguridad** configurados
- **Compatibilidad con Node.js** versiones antiguas

## 🌐 API Endpoints

### Páginas Públicas
- `GET /` - Landing page
- `GET /legal` - Marco legal
- `GET /uda` - ¿Qué es la UDA?
- `GET /tarifario` - Tarifario SACM 2017
- `GET /app` - Calculadora

### API
- `POST /api/cotizar` - Crear nueva cotización
- `GET /api/contrato/:id` - Obtener contrato por ID
- `GET /api/contrato/:id/pdf` - Descargar PDF del contrato
- `GET /api/health` - Estado del servidor

## 🎨 Características de Diseño

### Paleta de Colores por Página
- **Landing**: Azul y verde (#3498db, #2ecc71)
- **Legal**: Azul profesional (#2c3e50, #3498db)
- **UDA**: Gradiente azul-morado (#3498db, #2980b9)
- **Tarifario**: Gradiente morado (#667eea, #764ba2)
- **Calculadora**: Verde y azul (#27ae60, #3498db)

### Animaciones y Efectos
- **Scroll animations** en todas las páginas
- **Hover effects** en tarjetas y botones
- **Progress bar** de lectura
- **Scroll to top** button
- **Parallax effects** en headers
- **Staggered animations** para elementos
- **Ripple effects** en botones importantes

## 🚨 Importante - Aviso Legal

**Esta es una aplicación de demostración con fines educativos.**

- Los contratos generados **NO tienen validez legal**
- Los costos calculados son **estimaciones para demostración**
- La información sobre UDA y tarifarios es **educativa**
- Para licencias reales, contacte directamente a las sociedades:
  - **SACM**: www.sacm.org.mx
  - **ANDI**: www.andi.org.mx
  - **SOMEXFON**: www.somexfon.com

## 🆕 Nuevas Características en esta Versión

### ✅ Páginas Educativas Completas
- **Página UDA**: Explicación completa del sistema de Unidades de Derechos de Autor
- **Página Tarifario**: Estructura oficial del tarifario SACM 2017 con ejemplos
- **Información basada en documentos oficiales**

### ✅ Navegación Mejorada
- **5 páginas principales** interconectadas
- **Navegación consistente** en todas las páginas
- **Enlaces contextuales** entre secciones relacionadas

### ✅ Contenido Educativo Profundo
- **Historia del sistema UDA** (1992-1998)
- **Factores de cálculo reales** basados en documentos oficiales
- **Ejemplos prácticos** con tablas interactivas
- **Zonas geográficas** y temporadas especiales

### ✅ Experiencia de Usuario Avanzada
- **Animaciones sofisticadas** en cada página
- **Efectos interactivos** (hover, click, scroll)
- **Búsqueda en tablas** del tarifario
- **Progress indicators** de lectura

### ✅ Compatibilidad Mejorada
- **Sintaxis compatible** con Node.js versiones antiguas
- **Sin operadores de encadenamiento opcional** (?..)
- **Manejo de errores** robusto
- **Fallbacks** para valores undefined

## 🐛 Solución de Problemas

### El servidor no inicia
```bash
# Verificar Node.js (mínimo v14)
node --version

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Verificar puerto
lsof -i :3000  # En macOS/Linux
netstat -ano | findstr :3000  # En Windows
```

### Error de sintaxis con operadores
```bash
# Si tienes Node.js < 14, actualiza a una versión más reciente
# O usa la versión compatible incluida en este proyecto
```

### Error de base de datos
```bash
# Eliminar base de datos y reiniciar
rm licencias.db
npm start
```

### Problemas de PDF
```bash
# Verificar instalación de PDFKit
npm list pdfkit

# Reinstalar si es necesario
npm uninstall pdfkit
npm install pdfkit@^0.14.0
```

## 📈 Rendimiento

- **Tiempo de carga**: < 2 segundos por página
- **Generación de PDF**: < 1 segundo
- **Base de datos**: SQLite optimizada
- **Archivos estáticos**: Servidos eficientemente
- **Animaciones**: 60 FPS con CSS3

## 🔄 Actualizaciones Futuras Sugeridas

- [ ] Integración con APIs reales de sociedades
- [ ] Sistema de usuarios y autenticación
- [ ] Dashboard administrativo
- [ ] Notificaciones de renovación
- [ ] Múltiples idiomas
- [ ] Integración con pasarelas de pago
- [ ] Calculadora con tarifas actualizadas
- [ ] Sistema de comentarios y feedback

## 📝 Licencia

Este proyecto es una demostración educativa. Úselo bajo su propia responsabilidad.

## 👥 Soporte

Para soporte técnico o consultas sobre la aplicación:
- Revise la documentación completa
- Verifique la sección de solución de problemas
- Consulte los logs del servidor para errores específicos

---

**Desarrollado como demostración técnica avanzada - 2024**

🎵 **Licencia Musical MX** - Educando sobre el cumplimiento legal musical en México

### Páginas Incluidas:
1. **Landing Page** - Información general y servicios
2. **Marco Legal** - Fundamento jurídico completo
3. **¿Qué es la UDA?** - Sistema de unidades de derechos de autor
4. **Tarifario SACM** - Estructura oficial de tarifas 2017
5. **Calculadora** - Herramienta de cotización interactiva

**Total: 5 páginas completamente funcionales y educativas**

