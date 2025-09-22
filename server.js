const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const PDFDocument = require('pdfkit');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const cors = require('cors');
const { calculateSACMTariff, UDA_VALUE_2017 } = require('./sacm_calculator');

const app = express();
const PORT = process.env.PORT || 8800;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database setup
const db = new sqlite3.Database('./licencias.db', (err) => {
  if (err) {
    console.error("Error al abrir la base de datos", err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
    db.run(`CREATE TABLE IF NOT EXISTS contratos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_establecimiento TEXT NOT NULL,
      tipo_establecimiento TEXT NOT NULL,
      aforo INTEGER,
      metros_cuadrados INTEGER,
      direccion TEXT,
      horario_musica TEXT,
      tipo_musica TEXT NOT NULL,
      frecuencia_vivo TEXT,
      generos_predominantes TEXT,
      cobra_entrada TEXT NOT NULL,
      sistema_sonido TEXT,
      zonas_audio INTEGER,
      eventos_especiales TEXT NOT NULL,
      costo_sacm REAL,
      costo_andi REAL,
      costo_somexfon REAL,
      costo_total REAL,
      fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

// Routes
app.get('/', (req, res) => {
  res.render('landing', { 
    title: 'Licencia Musical México - Obtén tu Licencia Legal'
  });
});

app.get('/app', (req, res) => {
  res.render('app', { 
    title: 'Calculadora de Licencias - Licencia Musical MX'
  });
});

// Ruta para la página de marco legal
app.get('/legal', (req, res) => {
    res.render('legal', { title: 'Marco Legal - Licencia Musical MX' });
});

// Ruta para la página de UDA
app.get('/uda', (req, res) => {
    res.render('uda', { title: '¿Qué es la UDA? - Licencia Musical MX' });
});

// Ruta para la página de tarifario
app.get('/tarifario', (req, res) => {
    res.render('tarifario', { title: 'Tarifario SACM 2017 - Licencia Musical MX' });
});

// API Routes
app.post('/api/cotizar', (req, res) => {
  const { 
    nombre, 
    tipo, 
    direccion,
    capacidadMesas,
    capacidadPersonas,
    capacidadHabitaciones,
    numeroAlbercas,
    hotelEstrellas,
    zonaTuristica,
    zonaGeografica,
    temporada,
    tipoMusica,
    cobraEntrada,
    permiteBaile
  } = req.body;

  console.log('Received request body:', req.body);

  // Validación básica
  if (!nombre || !tipo || !tipoMusica || !cobraEntrada) {
    return res.status(400).json({ error: "Campos requeridos: nombre, tipo, tipoMusica, cobraEntrada" });
  }

  try {
    // Prepare data for SACM tariff calculator
    const establishmentData = {
      tipo_establecimiento: tipo,
      capacidad_mesas: parseInt(capacidadMesas) || null,
      capacidad_personas: parseInt(capacidadPersonas) || null,
      capacidad_habitaciones: parseInt(capacidadHabitaciones) || null,
      numero_albercas: parseInt(numeroAlbercas) || null,
      hotel_estrellas: hotelEstrellas,
      zona_turistica: zonaTuristica,
      zona_geografica: zonaGeografica || 'general',
      temporada: temporada || 'alta',
      tipo_musica: tipoMusica,
      costo_entrada: cobraEntrada,
      permite_baile: permiteBaile
    };

    console.log('Establishment data for calculation:', establishmentData);

    // Calculate SACM tariff using official 2017 rates
    const sacmResult = calculateSACMTariff(establishmentData);
    
    console.log('SACM calculation result:', sacmResult);
    
    // Only SACM costs - no ANDI or SOMEXFON for this calculator
    const costoSACM = sacmResult.costo_pesos;
    const costoTotal = costoSACM; // Only SACM

    // Round to 2 decimals
    const finalCostoSACM = Math.round(costoSACM * 100) / 100;
    const finalCostoTotal = finalCostoSACM;

    const sql = `INSERT INTO contratos (
      nombre_establecimiento, tipo_establecimiento, aforo, metros_cuadrados, direccion,
      horario_musica, tipo_musica, frecuencia_vivo, generos_predominantes,
      cobra_entrada, sistema_sonido, zonas_audio, eventos_especiales,
      costo_sacm, costo_andi, costo_somexfon, costo_total
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
      nombre, tipo, 
      capacidadPersonas || capacidadMesas || capacidadHabitaciones || 50, // aforo
      100, // metros_cuadrados (default)
      direccion || '',
      '', // horario_musica
      tipoMusica, 
      '', // frecuencia_vivo
      '', // generos_predominantes
      cobraEntrada, 
      '', // sistema_sonido
      1, // zonas_audio
      'ocasional', // eventos_especiales
      finalCostoSACM, 0, 0, finalCostoTotal // ANDI and SOMEXFON set to 0
    ];

    db.run(sql, params, function (err) {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ "error": "Error al guardar la cotización: " + err.message });
        return;
      }
      
      console.log('Successfully saved to database with ID:', this.lastID);
      
      res.json({
        message: "Cotización SACM creada con éxito",
        id: this.lastID,
        sacm_details: {
          categoria: sacmResult.categoria,
          seccion: sacmResult.seccion,
          base_calculo: sacmResult.base_calculo,
          udas: sacmResult.udas,
          uda_value: UDA_VALUE_2017,
          detalles: sacmResult.detalles
        },
        costos: {
          sacm: finalCostoSACM,
          andi: 0, // Not included in SACM-only calculator
          somexfon: 0, // Not included in SACM-only calculator
          total: finalCostoTotal
        }
      });
    });
  } catch (error) {
    console.error('Calculation error:', error);
    res.status(500).json({ error: "Error en el cálculo SACM: " + error.message });
  }

});

app.get('/api/contrato/:id', (req, res) => {
  const sql = "SELECT * FROM contratos WHERE id = ?";
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      res.status(400).json({"error": err.message});
      return;
    }
    if (!row) {
      res.status(404).json({"error": "Contrato no encontrado"});
      return;
    }
    res.json(row);
  });
});

// PDF Generation endpoint
app.get('/api/contrato/:id/pdf', async (req, res) => {
  try {
    const sql = "SELECT * FROM contratos WHERE id = ?";
    db.get(sql, [req.params.id], async (err, contrato) => {
      if (err || !contrato) {
        return res.status(404).json({"error": "Contrato no encontrado"});
      }

      // Create PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        info: {
          Title: `Contrato de Licencia Musical - ${contrato.nombre_establecimiento}`,
          Author: 'Licencia Musical MX',
          Subject: 'Contrato de Licencias Musicales',
          Keywords: 'música, licencia, SACM, ANDI, SOMEXFON'
        }
      });

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="contrato-${contrato.id}.pdf"`);
      
      // Pipe PDF to response
      doc.pipe(res);

      // Add header with logo area
      doc.fontSize(20)
         .fillColor('#2c3e50')
         .text('🎵 LICENCIA MUSICAL MÉXICO', 50, 50, { align: 'center' });
      
      doc.fontSize(14)
         .fillColor('#666')
         .text('Licencias Musicales para Establecimientos Comerciales', 50, 80, { align: 'center' });

      // Add line separator
      doc.moveTo(50, 110)
         .lineTo(545, 110)
         .strokeColor('#3498db')
         .lineWidth(2)
         .stroke();

      // Contract header
      doc.fontSize(18)
         .fillColor('#2c3e50')
         .text('CONTRATO DE LICENCIAS MUSICALES', 50, 130, { align: 'center' });

      const fechaCreacion = new Date(contrato.fecha_creacion).toLocaleDateString('es-MX');
      doc.fontSize(12)
         .fillColor('#666')
         .text(`Folio: #${contrato.id.toString().padStart(6, '0')}`, 50, 160)
         .text(`Fecha de emisión: ${fechaCreacion}`, 400, 160);

      let yPosition = 200;

      // Establishment information section
      doc.fontSize(14)
         .fillColor('#2c3e50')
         .text('📍 INFORMACIÓN DEL ESTABLECIMIENTO', 50, yPosition);
      
      yPosition += 25;
      doc.fontSize(11)
         .fillColor('#333')
         .text(`Nombre: ${contrato.nombre_establecimiento}`, 70, yPosition)
         .text(`Tipo: ${contrato.tipo_establecimiento}`, 70, yPosition + 15)
         .text(`Capacidad: ${contrato.aforo} personas`, 70, yPosition + 30)
         .text(`Área con música: ${contrato.metros_cuadrados} m²`, 70, yPosition + 45);

      if (contrato.direccion) {
        doc.text(`Dirección: ${contrato.direccion}`, 70, yPosition + 60);
        yPosition += 75;
      } else {
        yPosition += 60;
      }

      yPosition += 30;

      // Musical characteristics section
      doc.fontSize(14)
         .fillColor('#2c3e50')
         .text('🎵 CARACTERÍSTICAS MUSICALES', 50, yPosition);
      
      yPosition += 25;
      const tipoMusicaText = contrato.tipo_musica === 'grabada' ? 'Solo música grabada' :
                            contrato.tipo_musica === 'vivo' ? 'Solo música en vivo' :
                            'Música grabada y en vivo';
      
      doc.fontSize(11)
         .fillColor('#333')
         .text(`Tipo de música: ${tipoMusicaText}`, 70, yPosition);

      if (contrato.frecuencia_vivo) {
        const frecuenciaText = contrato.frecuencia_vivo === 'diario' ? 'Diario' :
                              contrato.frecuencia_vivo === 'semanal' ? 'Varias veces por semana' :
                              contrato.frecuencia_vivo === 'mensual' ? 'Varias veces por mes' :
                              'Ocasionalmente';
        doc.text(`Frecuencia de música en vivo: ${frecuenciaText}`, 70, yPosition + 15);
        yPosition += 15;
      }

      if (contrato.generos_predominantes) {
        doc.text(`Géneros predominantes: ${contrato.generos_predominantes}`, 70, yPosition + 15);
        yPosition += 15;
      }

      if (contrato.horario_musica) {
        doc.text(`Horario de música: ${contrato.horario_musica}`, 70, yPosition + 15);
        yPosition += 15;
      }

      yPosition += 40;

      // Business model section
      doc.fontSize(14)
         .fillColor('#2c3e50')
         .text('💰 MODELO DE NEGOCIO', 50, yPosition);
      
      yPosition += 25;
      doc.fontSize(11)
         .fillColor('#333')
         .text(`Cobra entrada: ${contrato.cobra_entrada === 'si' ? 'Sí' : 'No'}`, 70, yPosition);

      const eventosText = contrato.eventos_especiales === 'nunca' ? 'Nunca' :
                         contrato.eventos_especiales === 'ocasionales' ? 'Ocasionalmente (1-3 por mes)' :
                         'Frecuentemente (más de 4 por mes)';
      doc.text(`Eventos especiales: ${eventosText}`, 70, yPosition + 15);

      if (contrato.sistema_sonido) {
        doc.text(`Sistema de sonido: ${contrato.sistema_sonido}`, 70, yPosition + 30);
        yPosition += 15;
      }

      doc.text(`Zonas de audio: ${contrato.zonas_audio}`, 70, yPosition + 30);
      yPosition += 60;

      // Cost breakdown section
      doc.fontSize(14)
         .fillColor('#2c3e50')
         .text('💵 DESGLOSE DE COSTOS POR SOCIEDAD', 50, yPosition);
      
      yPosition += 30;

      // SACM
      doc.rect(50, yPosition, 495, 60)
         .fillAndStroke('#f8f9fa', '#e9ecef');
      
      doc.fontSize(12)
         .fillColor('#2c3e50')
         .text('SACM - Sociedad de Autores y Compositores', 60, yPosition + 10);
      
      doc.fontSize(11)
         .fillColor('#666')
         .text('Derechos de autores y compositores (letra y música)', 60, yPosition + 25);
      
      doc.fontSize(14)
         .fillColor('#27ae60')
         .text(`$${contrato.costo_sacm ? contrato.costo_sacm.toFixed(2) : '0.00'} MXN`, 450, yPosition + 15);

      yPosition += 70;

      // ANDI
      doc.rect(50, yPosition, 495, 60)
         .fillAndStroke('#f8f9fa', '#e9ecef');
      
       doc.fontSize(14)
         .fillColor('#27ae60')
         .text(`$${contrato.costo_sacm ? contrato.costo_sacm.toFixed(2) : '0.00'} MXN`, 450, yPosition + 15);

      yPosition += 60;
      doc.fontSize(12)
         .fillColor('#2c3e50')
         .text('ANDI - Asociación Nacional de Intérpretes', 50, yPosition)
         .text('Derechos de artistas intérpretes y ejecutantes', 50, yPosition + 15);
      
      doc.fontSize(14)
         .fillColor('#27ae60')
         .text(`$${contrato.costo_andi ? contrato.costo_andi.toFixed(2) : '0.00'} MXN`, 450, yPosition + 15);

      yPosition += 60;
      doc.fontSize(12)
         .fillColor('#2c3e50')
         .text('SOMEXFON - Productores de Fonogramas', 50, yPosition)
         .text('Derechos de productores fonográficos', 50, yPosition + 15);
      
      doc.fontSize(14)
         .fillColor('#27ae60')
         .text(`$${contrato.costo_somexfon ? contrato.costo_somexfon.toFixed(2) : '0.00'} MXN`, 450, yPosition + 15);

      // Total
      yPosition += 80;
      doc.fontSize(16)
         .fillColor('#2c3e50')
         .text('COSTO TOTAL ANUAL:', 50, yPosition);
      
      doc.fontSize(18)
         .fillColor('#e74c3c')
         .text(`$${contrato.costo_total ? contrato.costo_total.toFixed(2) : '0.00'} MXN`, 450, yPosition);

      yPosition += 60;

      // Check if we need a new page
      if (yPosition > 650) {
        doc.addPage();
        yPosition = 50;
      }

      // Calculation factors
      doc.fontSize(14)
         .fillColor('#2c3e50')
         .text('📊 FACTORES CONSIDERADOS EN EL CÁLCULO', 50, yPosition);
      
      yPosition += 25;
      doc.fontSize(10)
         .fillColor('#333')
         .text('• Tipo de establecimiento y multiplicador correspondiente', 70, yPosition)
         .text('• Capacidad y área del establecimiento', 70, yPosition + 12)
         .text('• Uso de música en vivo y su frecuencia', 70, yPosition + 24)
         .text('• Cobro de entrada o cover', 70, yPosition + 36)
         .text('• Frecuencia de eventos especiales', 70, yPosition + 48)
         .text('• Tipo de música predominante (grabada vs. en vivo)', 70, yPosition + 60);

      yPosition += 90;

      // Legal disclaimer
      doc.fontSize(14)
         .fillColor('#e74c3c')
         .text('⚠️ IMPORTANTE - AVISO LEGAL', 50, yPosition);
      
      yPosition += 25;
      doc.fontSize(9)
         .fillColor('#333')
         .text('• Esta es una aplicación de demostración con fines educativos', 70, yPosition)
         .text('• Los contratos generados NO tienen validez legal real', 70, yPosition + 12)
         .text('• Los costos son estimaciones basadas en factores comunes', 70, yPosition + 24)
         .text('• Para licencias reales, debe contactar directamente a cada sociedad:', 70, yPosition + 36)
         .text('  - SACM: www.sacm.org.mx', 90, yPosition + 48)
         .text('  - ANDI: www.andi.org.mx', 90, yPosition + 60)
         .text('  - SOMEXFON: www.somexfon.com', 90, yPosition + 72)
         .text('• Cada sociedad maneja tarifas y procesos independientes', 70, yPosition + 84)
         .text('• Es obligatorio obtener licencias de las tres sociedades', 70, yPosition + 96);

      // Footer
      doc.fontSize(8)
         .fillColor('#666')
         .text('Documento generado por Licencia Musical MX - Sistema de demostración', 50, 750, { align: 'center' })
         .text(`Generado el ${new Date().toLocaleDateString('es-MX')} a las ${new Date().toLocaleTimeString('es-MX')}`, 50, 765, { align: 'center' });

      // Finalize PDF
      doc.end();
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Error al generar PDF' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎵 Licencia Musical México corriendo en http://localhost:${PORT}`);
  console.log(`📊 Panel de administración: http://localhost:${PORT}/admin`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nCerrando servidor...');
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Conexión a la base de datos cerrada.');
    process.exit(0);
  });
});

