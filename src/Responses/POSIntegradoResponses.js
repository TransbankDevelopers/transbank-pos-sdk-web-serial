const FUNCTION_CODE_MULTICODE_SALE = '0271';
const FUNCTION_CODE_MULTICODE_LAST_SALE = '0281';
const FUNCTION_CODE_MULTICODE_DETAIL_SALE = '0291';

const responsesMessages = {
    0: "Aprobado",
    1: "Rechazado",
    2: "Host no Responde",
    3: "Conexión Fallo",
    4: "Transacción ya Fue Anulada",
    5: "No existe Transacción para Anular",
    6: "Tarjeta no Soportada",
    7: "Transacción Cancelada desde el POS",
    8: "No puede Anular Transacción Debito",
    9: "Error Lectura Tarjeta",
    10: "Monto menor al mínimo permitido",
    11: "No existe venta",
    12: "Transacción No Soportada",
    13: "Debe ejecutar cierre ",
    14: "No hay Tono",
    15: "Archivo BITMAP.DAT no encontrado. Favor cargue",
    16: "Error Formato Respuesta del HOST",
    17: "Error en los 4 últimos dígitos.",
    18: "Menú invalido",
    19: "ERROR_TARJ_DIST",
    20: "Tarjeta Invalida",
    21: "Anulación no Permitida",
    22: "TIMEOUT",
    24: "Impresora Sin Papel",
    25: "Fecha Invalida",
    26: "Debe Cargar Llaves",
    27: "Debe Actualizar",
    60: "Error en Número de Cuotas",
    61: "Error en Armado de Solicitud",
    62: "Problema con el Pinpad interno",
    65: "Error al Procesar la Respuesta del Host",
    67: "Superó Número Máximo de Ventas, Debe Ejecutar Cierre",
    68: "Error Genérico, Falla al Ingresar Montos",
    70: "Error de formato Campo de Boleta MAX 6",
    71: "Error de Largo Campo de Impresión",
    72: "Error de Monto Venta, Debe ser Mayor que 0",
    73: "Terminal ID no configurado",
    74: "Debe Ejecutar CIERRE",
    75: "Comercio no tiene Tarjetas Configuradas",
    76: "Supero Número Máximo de Ventas, Debe Ejecutar CIERRE",
    77: "Debe Ejecutar Cierre",
    78: "Esperando Leer Tarjeta",
    79: "Solicitando Confirmar Monto",
    80: "Selección de Cuotas",
    81: "Solicitando Ingreso de Clave",
    82: "Enviando transacción al Host",
    88: "Error Cantidad Cuotas",
    93: "Declinada",
    94: "Error al Procesar Respuesta",
    95: "Error al Imprimir TASA",
};

export default class POSIntegradoResponses {

    saleResponse(responseData) {
        let responseChunks = responseData.split("|");
        let functionCode = responseChunks[0];
        let authorizationCode = typeof responseChunks[5] !== 'undefined' ? responseChunks[5].trim() : null;
        let response = {
            functionCode: parseInt(functionCode),
            responseCode: parseInt(responseChunks[1]),
            commerceCode: parseInt(responseChunks[2]),
            terminalId: responseChunks[3],
            responseMessage: this.getResponseMessage(parseInt(responseChunks[1])),
            successful: parseInt(responseChunks[1])===0,
            ticket: responseChunks[4],
            authorizationCode: authorizationCode,
            amount: parseInt(responseChunks[6]),
            sharesNumber: responseChunks[7],
            sharesAmount: responseChunks[8],
            last4Digits: responseChunks[9] !== '' ? parseInt(responseChunks[9]) : null,
            operationNumber: responseChunks[10],
            cardType: responseChunks[11],
            accountingDate: responseChunks[12],
            accountNumber: responseChunks[13],
            cardBrand: responseChunks[14],
            realDate: responseChunks[15],
            realTime: responseChunks[16],
            employeeId: responseChunks[17],
            tip: responseChunks[18] !== '' ? parseInt(responseChunks[18]) : null,
        };

        if(functionCode === FUNCTION_CODE_MULTICODE_LAST_SALE) {
            let voucher = [];

            if (responseChunks[19].lenght % 40 != 0)
                voucher.push(responseChunks[19]);

            voucher = responseChunks[19].match(/.{1,40}/g)

            response.voucher = voucher;
        }

        if (functionCode === FUNCTION_CODE_MULTICODE_SALE) {
            response.change = responseChunks[20];
            response.commerceProviderCode = responseChunks[21];
        }
        return response;
    }

    closeResponse(response) {
        let responseChunks = response.split("|");
        return {
            functionCode: parseInt(responseChunks[0]),
            responseCode: parseInt(responseChunks[1]),
            commerceCode: parseInt(responseChunks[2]),
            terminalId: responseChunks[3],
            responseMessage: this.getResponseMessage(parseInt(responseChunks[1])),
            successful: parseInt(responseChunks[1])===0,
        };
    }

    saleDetailResponse(responseData) {
        let responseChunks = responseData.split("|");
        let functionCode = responseChunks[0];
        let authorizationCode = typeof responseChunks[5] !== 'undefined' ? responseChunks[5].trim() : null;
        let response = {
            functionCode: parseInt(functionCode),
            responseCode: parseInt(responseChunks[1]),
            commerceCode: parseInt(responseChunks[2]),
            terminalId: responseChunks[3],
            responseMessage: this.getResponseMessage(parseInt(responseChunks[1])),
            successful: parseInt(responseChunks[1])===0,
            ticket: responseChunks[4],
            authorizationCode: authorizationCode,
            amount: responseChunks[6],
            last4Digits: parseInt(responseChunks[7]),
            operationNumber: responseChunks[8],
            cardType: responseChunks[9],
            accountingDate: responseChunks[10],
            accountNumber: responseChunks[11],
            cardBrand: responseChunks[12],
            realDate: responseChunks[13],
            realTime: responseChunks[14],
            employeeId: responseChunks[15],
            tip: parseInt(responseChunks[16]),
            feeAmount: (responseChunks[17]),
            feeNumber: (responseChunks[18]),
        };

        if (functionCode === FUNCTION_CODE_MULTICODE_DETAIL_SALE) {
            response.change = responseChunks[18];
            response.commerceProviderCode = responseChunks[19];
        }

        return response;
    }

    getTotalsResponse(response) {
        let responseChunks = response.split("|");
        return {
            functionCode: parseInt(responseChunks[0]),
            responseCode: parseInt(responseChunks[1]),
            txCount: parseInt(responseChunks[2]),
            txTotal: parseInt(responseChunks[3]),
            responseMessage: this.getResponseMessage(parseInt(responseChunks[1])),
            successful: parseInt(responseChunks[1])===0,
        }
    }

    getResponseMessage(responseCode) {
        return typeof responsesMessages[responseCode] !=="undefined" ? responsesMessages[responseCode] : null;
    }
}
