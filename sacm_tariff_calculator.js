const UDA_VALUE_2017 = 310.00; // Pesos mexicanos por UDA (valor de referencia)

// Geographic zones with special rates
const SPECIAL_ZONES = ['cdmx', 'estado_mexico', 'guadalajara', 'monterrey', 'tijuana'];

// Main tariff calculation function
function calculateSACMTariff(establishmentData) {
    const {
        tipo_establecimiento,
        capacidad_mesas,
        capacidad_personas,
        capacidad_habitaciones,
        tipo_musica,
        costo_entrada,
        zona_geografica,
        temporada,
        frecuencia_vivo,
        eventos_especiales
    } = establishmentData;

    let tariffResult = {
        categoria: '',
        base_calculo: '',
        udas: 0,
        costo_pesos: 0,
        detalles: []
    };

    // Determine establishment category and calculate
    switch (tipo_establecimiento.toLowerCase()) {
        case 'restaurante':
        case 'bar':
        case 'cantina':
            tariffResult = calculateRestaurantBar(establishmentData);
            break;
        case 'hotel':
        case 'motel':
            tariffResult = calculateHotel(establishmentData);
            break;
        case 'discoteca':
        case 'antro':
            tariffResult = calculateDiscoteca(establishmentData);
            break;
        case 'centro_nocturno':
            tariffResult = calculateCentroNocturno(establishmentData);
            break;
        case 'parque_acuatico':
        case 'balneario':
            tariffResult = calculateParqueAcuatico(establishmentData);
            break;
        case 'gimnasio':
        case 'tienda':
        case 'centro_comercial':
            tariffResult = calculateComercial(establishmentData);
            break;
        default:
            tariffResult = calculateGeneral(establishmentData);
    }

    // Convert UDAs to pesos
    tariffResult.costo_pesos = tariffResult.udas * UDA_VALUE_2017;
    
    return tariffResult;
}

// Restaurant and Bar calculations
function calculateRestaurantBar(data) {
    const { capacidad_mesas, tipo_musica, costo_entrada, frecuencia_vivo, permite_baile } = data;
    let udas = 0;
    let base_calculo = 'Por mes';
    let detalles = [];

    if (tipo_musica === 'grabada') {
        // Música grabada - Tabla del tarifario (Sección B)
        if (capacidad_mesas <= 20) {
            udas = 4;
            detalles.push('1-20 mesas con música grabada: 4 UDAs/mes');
        } else if (capacidad_mesas <= 40) {
            udas = 8;
            detalles.push('21-40 mesas con música grabada: 8 UDAs/mes');
        } else {
            udas = 10.5;
            detalles.push('41+ mesas con música grabada: 10.5 UDAs/mes');
        }
    } else if (tipo_musica === 'vivo' || tipo_musica === 'mixta') {
        // Música en vivo - Por día de funcionamiento (Sección F)
        base_calculo = 'Por día de funcionamiento';
        
        if (costo_entrada === 'si') {
            // Con costo de entrada
            if (capacidad_mesas <= 25) {
                udas = 5.5;
                detalles.push('1-25 mesas con música viva y entrada: 5.5 UDAs/día');
            } else {
                udas = 8;
                detalles.push('26+ mesas con música viva y entrada: 8 UDAs/día');
            }
        } else {
            // Sin costo de entrada
            if (capacidad_mesas <= 25) {
                udas = 2;
                detalles.push('1-25 mesas con música viva sin entrada: 2 UDAs/día');
            } else {
                udas = 4;
                detalles.push('26+ mesas con música viva sin entrada: 4 UDAs/día');
            }
        }
    }

    // Special case for dancing (Sección G) - overrides other calculations
    if (permite_baile === 'si') {
        base_calculo = 'Por día de funcionamiento';
        if (capacidad_mesas <= 25) {
            udas = Math.max(udas, 8);
            detalles.push('Establecimiento con baile: 8 UDAs/día (mínimo)');
        } else {
            udas = Math.max(udas, 12);
            detalles.push('Establecimiento con baile: 12 UDAs/día (mínimo)');
        }
    }

    return {
        categoria: 'Restaurantes, Bares y Cantinas',
        base_calculo,
        udas,
        costo_pesos: 0,
        detalles
    };
}

// Hotel calculations
function calculateHotel(data) {
    const { capacidad_habitaciones, hotel_estrellas, zona_turistica } = data;
    let udas = 0;
    let detalles = [];

    // Base rates by hotel category
    const hotelRates = {
        1: { hasta50: 2.8, mas50: 3 },
        2: { hasta50: 4.2, mas50: 4.5 },
        3: { hasta50: 5.6, mas50: 6 },
        4: { hasta100: 18, mas100: 20 },
        5: { hasta100: 45, mas100: 50 },
        'gran_turismo': { hasta100: 54, mas100: 60 }
    };

    const estrellas = parseInt(hotel_estrellas) || 3;
    const rates = hotelRates[estrellas] || hotelRates[3];

    if (estrellas <= 3) {
        udas = capacidad_habitaciones <= 50 ? rates.hasta50 : rates.mas50;
        detalles.push(`Hotel ${estrellas} estrellas, ${capacidad_habitaciones} habitaciones`);
    } else {
        udas = capacidad_habitaciones <= 100 ? rates.hasta100 : rates.mas100;
        detalles.push(`Hotel ${estrellas} estrellas, ${capacidad_habitaciones} habitaciones`);
    }

    // Tourist zone adjustment
    if (zona_turistica === 'si') {
        const adjustment = estrellas >= 4 ? 1.25 : 1.15;
        udas = udas * adjustment;
        detalles.push(`Ajuste zona turística: x${adjustment}`);
    }

    return {
        categoria: 'Hoteles y Moteles',
        base_calculo: 'Por mes',
        udas,
        costo_pesos: 0,
        detalles
    };
}

// Discoteca calculations
function calculateDiscoteca(data) {
    const { capacidad_personas, zona_geografica, temporada } = data;
    let udas = 0;
    let detalles = [];

    const isSpecialZone = SPECIAL_ZONES.includes(zona_geografica?.toLowerCase());

    if (isSpecialZone) {
        // Special zones (CDMX, Guadalajara, Monterrey, etc.)
        if (capacidad_personas <= 250) {
            udas = 15;
        } else if (capacidad_personas <= 500) {
            udas = 25;
        } else if (capacidad_personas <= 750) {
            udas = 35;
        } else if (capacidad_personas <= 1500) {
            udas = 45;
        } else {
            udas = 80;
        }
        detalles.push(`Zona especial (${zona_geografica}): ${capacidad_personas} personas`);
    } else {
        // General Republic
        if (capacidad_personas <= 300) {
            udas = 10;
        } else if (capacidad_personas <= 700) {
            udas = 15;
        } else if (capacidad_personas <= 1000) {
            udas = 20;
        } else if (capacidad_personas <= 2500) {
            udas = 40;
        } else {
            udas = 60;
        }
        detalles.push(`República general: ${capacidad_personas} personas`);
    }

    // Season adjustment for tourist zones
    if (temporada === 'baja' && zona_geografica?.includes('turistico')) {
        udas = udas * 0.75;
        detalles.push('Ajuste temporada baja: x0.75');
    }

    return {
        categoria: 'Discotecas y Antros',
        base_calculo: 'Por día de funcionamiento',
        udas,
        costo_pesos: 0,
        detalles
    };
}

// Centro Nocturno calculations
function calculateCentroNocturno(data) {
    const { capacidad_mesas, zona_geografica } = data;
    let udas = 0;
    let detalles = [];

    const isSpecialZone = SPECIAL_ZONES.includes(zona_geografica?.toLowerCase());

    if (isSpecialZone) {
        // Special zones
        if (capacidad_mesas <= 15) {
            udas = 10;
        } else if (capacidad_mesas <= 25) {
            udas = 15;
        } else {
            udas = 20;
        }
        detalles.push(`Centro nocturno zona especial: ${capacidad_mesas} mesas`);
    } else {
        // General Republic
        if (capacidad_mesas <= 15) {
            udas = 5;
        } else if (capacidad_mesas <= 25) {
            udas = 10;
        } else {
            udas = 15;
        }
        detalles.push(`Centro nocturno república general: ${capacidad_mesas} mesas`);
    }

    return {
        categoria: 'Centros Nocturnos',
        base_calculo: 'Por día de funcionamiento',
        udas,
        costo_pesos: 0,
        detalles
    };
}

// Parque Acuático calculations
function calculateParqueAcuatico(data) {
    const { numero_albercas, tipo_musica } = data;
    let udas = 0;
    let base_calculo = 'Por mes';
    let detalles = [];

    if (tipo_musica === 'grabada') {
        // Música grabada en áreas comunes
        if (numero_albercas === 1) {
            udas = 4;
        } else if (numero_albercas <= 3) {
            udas = 8;
        } else if (numero_albercas <= 5) {
            udas = 12;
        } else {
            udas = 18;
        }
        detalles.push(`Música grabada, ${numero_albercas} alberca(s): ${udas} UDAs/mes`);
    } else if (tipo_musica === 'vivo') {
        // Música viva con grupos locales
        base_calculo = 'Por día de funcionamiento';
        if (numero_albercas === 1) {
            udas = 3;
        } else if (numero_albercas <= 3) {
            udas = 5;
        } else if (numero_albercas <= 5) {
            udas = 8;
        } else {
            udas = 10;
        }
        detalles.push(`Música viva, ${numero_albercas} alberca(s): ${udas} UDAs/día`);
    }

    return {
        categoria: 'Balnearios y Parques Acuáticos',
        base_calculo,
        udas,
        costo_pesos: 0,
        detalles
    };
}

// Commercial establishments
function calculateComercial(data) {
    const { tipo_establecimiento } = data;
    let udas = 4; // Default for commercial establishments
    let detalles = [];

    switch (tipo_establecimiento.toLowerCase()) {
        case 'gimnasio':
            udas = 4;
            detalles.push('Gimnasio con música de fondo: 4 UDAs/mes');
            break;
        case 'tienda':
        case 'centro_comercial':
            udas = 2.5;
            detalles.push('Establecimiento comercial: 2.5 UDAs/mes');
            break;
        default:
            udas = 4;
            detalles.push('Establecimiento comercial general: 4 UDAs/mes');
    }

    return {
        categoria: 'Establecimientos Comerciales',
        base_calculo: 'Por mes',
        udas,
        costo_pesos: 0,
        detalles
    };
}

// General calculation for unlisted categories
function calculateGeneral(data) {
    return {
        categoria: 'Establecimiento General',
        base_calculo: 'Por mes',
        udas: 4,
        costo_pesos: 0,
        detalles: ['Tarifa general para establecimiento no especificado: 4 UDAs/mes']
    };
}

// Helper function for live music frequency multiplier
function getFrecuenciaMultiplier(frecuencia) {
    switch (frecuencia?.toLowerCase()) {
        case 'diario':
            return 1.0; // Base rate is already daily
        case 'semanal':
            return 0.8; // Several times per week
        case 'mensual':
            return 0.6; // Several times per month
        case 'ocasional':
            return 0.4; // Occasionally
        default:
            return 1.0;
    }
}

// Calculate events with entrance fee (6% of ticket sales)
function calculateEventWithEntrance(ticketSales) {
    return {
        categoria: 'Evento Musical con Entrada',
        base_calculo: 'Porcentaje de taquilla',
        porcentaje: 6,
        costo_pesos: ticketSales * 0.06,
        udas: 0,
        detalles: [`6% de taquilla bruta: $${ticketSales.toFixed(2)} x 0.06`]
    };
}

// Calculate events without entrance fee
function calculateEventWithoutEntrance(capacity) {
    let udas = 0;
    
    if (capacity <= 100) {
        udas = 30;
    } else if (capacity <= 200) {
        udas = 60;
    } else if (capacity <= 300) {
        udas = 90;
    } else if (capacity <= 400) {
        udas = 120;
    } else if (capacity <= 500) {
        udas = 200;
    } else if (capacity <= 600) {
        udas = 400;
    } else {
        udas = 600;
    }

    return {
        categoria: 'Evento Musical sin Entrada',
        base_calculo: 'Por evento',
        udas,
        costo_pesos: udas * UDA_VALUE_2017,
        detalles: [`Evento para ${capacity} personas: ${udas} UDAs por evento`]
    };
}

// Export functions
module.exports = {
    calculateSACMTariff,
    calculateEventWithEntrance,
    calculateEventWithoutEntrance,
    UDA_VALUE_2017
};

