const UDA_VALUE_2017 = 310.00; // Pesos mexicanos por UDA

// Main calculation function
function calculateSACMTariff(establishmentData) {
    const { tipo_establecimiento } = establishmentData;
    
    let result;
    
    switch (tipo_establecimiento) {
        case 'Restaurante':
        case 'restaurante':
        case 'Bar':
        case 'bar':
        case 'Cantina':
        case 'cantina':
            result = calculateRestaurantBar(establishmentData);
            break;
            
        case 'Hotel':
        case 'hotel':
        case 'Motel':
        case 'motel':
            result = calculateHotel(establishmentData);
            break;
            
        case 'Discoteca':
        case 'discoteca':
        case 'Antro':
        case 'antro':
            result = calculateDiscoteca(establishmentData);
            break;
            
        case 'Centro Nocturno':
        case 'centro_nocturno':
            result = calculateCentroNocturno(establishmentData);
            break;
            
        case 'Parque Acuático':
        case 'parque_acuatico':
        case 'Balneario':
        case 'balneario':
            result = calculateParqueAcuatico(establishmentData);
            break;
            
        case 'Karaoke':
        case 'karaoke':
            result = calculateKaraoke(establishmentData);
            break;
            
        default:
            result = calculateGeneral(establishmentData);
    }
    
    // Convert UDAs to pesos
    result.costo_pesos = result.udas * UDA_VALUE_2017;
    result.uda_value = UDA_VALUE_2017;
    
    return result;
}

// Restaurantes, Bares, Cantinas (Sección 1 del PDF)
function calculateRestaurantBar(data) {
    const { capacidad_mesas, tipo_musica, costo_entrada, permite_baile } = data;
    let udas = 0;
    let base_calculo = 'mensual';
    let detalles = [];
    let seccion = '';

    const mesas = parseInt(capacidad_mesas) || 10;

    // Sección G - Donde se baile (tiene prioridad)
    if (permite_baile === 'si') {
        base_calculo = 'diario';
        seccion = 'G - Donde se baile con música viva o grabada';
        
        if (mesas <= 25) {
            udas = 8;
            detalles.push('1-25 mesas con baile: 8 UDAs por día');
        } else {
            udas = 12;
            detalles.push('26+ mesas con baile: 12 UDAs por día');
        }
    }
    // Sección F - Música en vivo
    else if (tipo_musica === 'vivo' || tipo_musica === 'mixta') {
        base_calculo = 'diario';
        seccion = 'F - Presentan variedad o música en vivo';
        
        if (costo_entrada === 'si') {
            if (mesas <= 25) {
                udas = 5.5;
                detalles.push('1-25 mesas, música viva con entrada: 5.5 UDAs por día');
            } else {
                udas = 8;
                detalles.push('26+ mesas, música viva con entrada: 8 UDAs por día');
            }
        } else {
            if (mesas <= 25) {
                udas = 2;
                detalles.push('1-25 mesas, música viva sin entrada: 2 UDAs por día');
            } else {
                udas = 4;
                detalles.push('26+ mesas, música viva sin entrada: 4 UDAs por día');
            }
        }
    }
    // Sección B - Música grabada
    else if (tipo_musica === 'grabada') {
        base_calculo = 'mensual';
        seccion = 'B - Con música grabada';
        
        if (mesas <= 20) {
            udas = 4;
            detalles.push('1-20 mesas con música grabada: 4 UDAs por mes');
        } else if (mesas <= 40) {
            udas = 8;
            detalles.push('21-40 mesas con música grabada: 8 UDAs por mes');
        } else {
            udas = 10.5;
            detalles.push('41+ mesas con música grabada: 10.5 UDAs por mes');
        }
    }

    return {
        categoria: 'Restaurantes, Restaurantes Bar, Bares, Cantinas',
        seccion: seccion,
        base_calculo: base_calculo,
        udas: udas,
        detalles: detalles
    };
}

// Hoteles y Moteles (Sección 2 del PDF)
function calculateHotel(data) {
    const { capacidad_habitaciones, hotel_estrellas, zona_turistica } = data;
    let udas = 0;
    let base_calculo = 'mensual';
    let detalles = [];
    let seccion = '';

    const habitaciones = parseInt(capacidad_habitaciones) || 50;
    
    if (zona_turistica === 'si' && (hotel_estrellas === '4' || hotel_estrellas === '5' || hotel_estrellas === 'gran_turismo')) {
        seccion = 'Zonas Turísticas';
        
        if (hotel_estrellas === '4') {
            if (habitaciones <= 100) {
                udas = 22;
                detalles.push('Hotel 4 estrellas zona turística, hasta 100 hab: 22 UDAs por mes');
            } else {
                udas = 25;
                detalles.push('Hotel 4 estrellas zona turística, más de 100 hab: 25 UDAs por mes');
            }
        } else if (hotel_estrellas === '5') {
            if (habitaciones <= 170) {
                udas = 55;
                detalles.push('Hotel 5 estrellas zona turística, hasta 170 hab: 55 UDAs por mes');
            } else {
                udas = 62.5;
                detalles.push('Hotel 5 estrellas zona turística, más de 170 hab: 62.5 UDAs por mes');
            }
        } else if (hotel_estrellas === 'gran_turismo') {
            if (habitaciones <= 170) {
                udas = 66;
                detalles.push('Hotel Gran Turismo zona turística, hasta 170 hab: 66 UDAs por mes');
            } else {
                udas = 75;
                detalles.push('Hotel Gran Turismo zona turística, más de 170 hab: 75 UDAs por mes');
            }
        }
    } else {
        seccion = 'Hoteles, Moteles y Similares';
        
        switch (hotel_estrellas) {
            case '1':
                if (habitaciones <= 50) {
                    udas = 2.8;
                    detalles.push('Hotel 1 estrella, hasta 50 hab: 2.8 UDAs por mes');
                } else {
                    udas = 3;
                    detalles.push('Hotel 1 estrella, más de 50 hab: 3 UDAs por mes');
                }
                break;
            case '2':
                if (habitaciones <= 50) {
                    udas = 4.2;
                    detalles.push('Hotel 2 estrellas, hasta 50 hab: 4.2 UDAs por mes');
                } else {
                    udas = 4.5;
                    detalles.push('Hotel 2 estrellas, más de 50 hab: 4.5 UDAs por mes');
                }
                break;
            case '3':
                if (habitaciones <= 50) {
                    udas = 5.6;
                    detalles.push('Hotel 3 estrellas, hasta 50 hab: 5.6 UDAs por mes');
                } else {
                    udas = 6;
                    detalles.push('Hotel 3 estrellas, más de 50 hab: 6 UDAs por mes');
                }
                break;
            case '4':
                if (habitaciones <= 100) {
                    udas = 18;
                    detalles.push('Hotel 4 estrellas, hasta 100 hab: 18 UDAs por mes');
                } else {
                    udas = 20;
                    detalles.push('Hotel 4 estrellas, más de 100 hab: 20 UDAs por mes');
                }
                break;
            case '5':
                if (habitaciones <= 100) {
                    udas = 45;
                    detalles.push('Hotel 5 estrellas, hasta 100 hab: 45 UDAs por mes');
                } else {
                    udas = 50;
                    detalles.push('Hotel 5 estrellas, más de 100 hab: 50 UDAs por mes');
                }
                break;
            case 'gran_turismo':
                if (habitaciones <= 100) {
                    udas = 54;
                    detalles.push('Hotel Gran Turismo, hasta 100 hab: 54 UDAs por mes');
                } else {
                    udas = 60;
                    detalles.push('Hotel Gran Turismo, más de 100 hab: 60 UDAs por mes');
                }
                break;
        }
    }

    return {
        categoria: 'Hoteles y Moteles',
        seccion: seccion,
        base_calculo: base_calculo,
        udas: udas,
        detalles: detalles
    };
}

// Discotecas y Antros (Sección 3 del PDF)
function calculateDiscoteca(data) {
    const { capacidad_personas, zona_geografica, temporada } = data;
    let udas = 0;
    let base_calculo = 'diario';
    let detalles = [];
    let seccion = '';

    const personas = parseInt(capacidad_personas) || 100;
    const esZonaEspecial = ['cdmx', 'guadalajara', 'monterrey'].includes(zona_geografica);
    
    if (esZonaEspecial) {
        seccion = 'Para D.F., Guadalajara, Monterrey, etc.';
        
        if (temporada === 'alta') {
            if (personas <= 250) {
                udas = 15;
                detalles.push('1-250 personas, zona especial, temporada alta: 15 UDAs por día');
            } else if (personas <= 500) {
                udas = 25;
                detalles.push('251-500 personas, zona especial, temporada alta: 25 UDAs por día');
            } else if (personas <= 750) {
                udas = 35;
                detalles.push('501-750 personas, zona especial, temporada alta: 35 UDAs por día');
            } else if (personas <= 1500) {
                udas = 45;
                detalles.push('751-1500 personas, zona especial, temporada alta: 45 UDAs por día');
            } else {
                udas = 80;
                detalles.push('1501+ personas, zona especial, temporada alta: 80 UDAs por día');
            }
        } else {
            // Temporada baja
            if (personas <= 250) {
                udas = 10;
                detalles.push('1-250 personas, zona especial, temporada baja: 10 UDAs por día');
            } else if (personas <= 500) {
                udas = 15;
                detalles.push('251-500 personas, zona especial, temporada baja: 15 UDAs por día');
            } else if (personas <= 750) {
                udas = 20;
                detalles.push('501-750 personas, zona especial, temporada baja: 20 UDAs por día');
            } else if (personas <= 1500) {
                udas = 30;
                detalles.push('751-1500 personas, zona especial, temporada baja: 30 UDAs por día');
            } else {
                udas = 60;
                detalles.push('1501+ personas, zona especial, temporada baja: 60 UDAs por día');
            }
        }
    } else {
        seccion = 'Para toda la República';
        
        if (personas <= 300) {
            udas = 10;
            detalles.push('1-300 personas, República general: 10 UDAs por día');
        } else if (personas <= 700) {
            udas = 15;
            detalles.push('301-700 personas, República general: 15 UDAs por día');
        } else if (personas <= 1000) {
            udas = 20;
            detalles.push('701-1000 personas, República general: 20 UDAs por día');
        } else if (personas <= 2500) {
            udas = 40;
            detalles.push('1001-2500 personas, República general: 40 UDAs por día');
        } else {
            udas = 60;
            detalles.push('2501+ personas, República general: 60 UDAs por día');
        }
    }

    return {
        categoria: 'Discotecas o Antros con Baile',
        seccion: seccion,
        base_calculo: base_calculo,
        udas: udas,
        detalles: detalles
    };
}

// Centros Nocturnos (Sección 4 del PDF)
function calculateCentroNocturno(data) {
    const { capacidad_mesas, zona_geografica } = data;
    let udas = 0;
    let base_calculo = 'diario';
    let detalles = [];
    let seccion = '';

    const mesas = parseInt(capacidad_mesas) || 10;
    const esZonaEspecial = ['cdmx', 'guadalajara', 'monterrey'].includes(zona_geografica);
    
    if (esZonaEspecial) {
        seccion = 'Para D.F., Guadalajara, Monterrey, etc.';
        
        if (mesas <= 15) {
            udas = 10;
            detalles.push('1-15 mesas, zona especial: 10 UDAs por día');
        } else if (mesas <= 25) {
            udas = 15;
            detalles.push('16-25 mesas, zona especial: 15 UDAs por día');
        } else {
            udas = 20;
            detalles.push('26+ mesas, zona especial: 20 UDAs por día');
        }
    } else {
        seccion = 'Para toda la República';
        
        if (mesas <= 15) {
            udas = 5;
            detalles.push('1-15 mesas, República general: 5 UDAs por día');
        } else if (mesas <= 25) {
            udas = 10;
            detalles.push('16-25 mesas, República general: 10 UDAs por día');
        } else {
            udas = 15;
            detalles.push('26+ mesas, República general: 15 UDAs por día');
        }
    }

    return {
        categoria: 'Centros Nocturnos',
        seccion: seccion,
        base_calculo: base_calculo,
        udas: udas,
        detalles: detalles
    };
}

// Parques Acuáticos y Balnearios (Sección 5 del PDF)
function calculateParqueAcuatico(data) {
    const { numero_albercas, tipo_musica } = data;
    let udas = 0;
    let base_calculo = 'mensual';
    let detalles = [];
    let seccion = '';

    const albercas = parseInt(numero_albercas) || 1;
    
    if (tipo_musica === 'grabada') {
        base_calculo = 'mensual';
        seccion = 'Música grabada en áreas comunes y restaurantes';
        
        if (albercas === 1) {
            udas = 4;
            detalles.push('Con 1 alberca, música grabada: 4 UDAs por mes');
        } else if (albercas <= 3) {
            udas = 8;
            detalles.push('Con 2 a 3 albercas, música grabada: 8 UDAs por mes');
        } else if (albercas <= 5) {
            udas = 12;
            detalles.push('Con 4 a 5 albercas, música grabada: 12 UDAs por mes');
        } else {
            udas = 18;
            detalles.push('Con 6+ albercas, música grabada: 18 UDAs por mes');
        }
    } else if (tipo_musica === 'vivo') {
        base_calculo = 'diario';
        seccion = 'Música viva en áreas comunes con participación de grupos musicales locales';
        
        if (albercas === 1) {
            udas = 3;
            detalles.push('Con 1 alberca, música viva: 3 UDAs por día');
        } else if (albercas <= 3) {
            udas = 5;
            detalles.push('Con 2 a 3 albercas, música viva: 5 UDAs por día');
        } else if (albercas <= 5) {
            udas = 8;
            detalles.push('Con 4 a 5 albercas, música viva: 8 UDAs por día');
        } else {
            udas = 10;
            detalles.push('Con 6+ albercas, música viva: 10 UDAs por día');
        }
    }

    return {
        categoria: 'Balnearios, Parques Acuáticos y Similares',
        seccion: seccion,
        base_calculo: base_calculo,
        udas: udas,
        detalles: detalles
    };
}

// Karaoke
function calculateKaraoke(data) {
    const { capacidad_mesas } = data;
    let udas = 0;
    let base_calculo = 'mensual';
    let detalles = [];

    const mesas = parseInt(capacidad_mesas) || 10;
    
    if (mesas <= 20) {
        udas = 4;
        detalles.push('1-20 mesas karaoke: 4 UDAs por mes');
    } else if (mesas <= 40) {
        udas = 8;
        detalles.push('21-40 mesas karaoke: 8 UDAs por mes');
    } else {
        udas = 10.5;
        detalles.push('41+ mesas karaoke: 10.5 UDAs por mes');
    }

    return {
        categoria: 'Karaoke',
        seccion: 'Restaurantes, Restaurantes Bar, Bares, Cantinas, Karaoke',
        base_calculo: base_calculo,
        udas: udas,
        detalles: detalles
    };
}

// Fallback para otros tipos
function calculateGeneral(data) {
    return {
        categoria: 'Establecimiento General',
        seccion: 'Tarifa base',
        base_calculo: 'mensual',
        udas: 4,
        detalles: ['Tarifa base general: 4 UDAs por mes']
    };
}

module.exports = {
    calculateSACMTariff,
    UDA_VALUE_2017
};

