const FUNCTION_CODE_MULTICODE_SALE = '0271';

const responsesMessages = {
    0: "Aprobado",
    1: "Rechazado",
    2: "Autorizador no Responde",
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
    14: "Error Encriptando PAN(BCYCLE)",
    15: "Error Operando con débito(BCYCLE)",
    80: "Solicitando Confirmar Monto",
    81: "Solicitando Ingreso de Clave",
    82: "Enviando transacción al Autorizador",
    83: "Selección menú crédito/redcompra",
    84: "Opere tarjeta",
    85: "Selección de cuotas",
    86: "Ingreso de cuotas",
    87: "Confirmación de cuotas",
    88: "Aceptar consulta cuotas",
    89: "Opción mes de gracia",
    90: "Inicialización Exitosa",
    91: "Inicialización Fallida",
    92: "Lector no Conectado",
    93: "Consultando cuota al Autorizador",
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
            last4Digits: responseChunks[7] !== '' ? parseInt(responseChunks[7]) : null,
            operationNumber: responseChunks[8],
            cardType: responseChunks[9],
            accountingDate: responseChunks[10],
            accountNumber: responseChunks[11],
            cardBrand: responseChunks[12],
            realDate: responseChunks[13],
            realTime: responseChunks[14],
        };
        if (functionCode === FUNCTION_CODE_MULTICODE_SALE) {
            response.commerceProviderCode = parseInt(responseChunks[15]);

            if (typeof responseChunks[16] !== 'undefined')
                response.voucher = responseChunks[16].length % 40 != 0 ? responseChunks[16] : responseChunks[16].match(/.{1,40}/g);
            else
                response.voucher = null;

            response.sharesType = responseChunks[17];
            response.sharesNumber = responseChunks[18];
            response.sharesAmount = responseChunks[19];
            response.sharesTypeGloss = responseChunks[20];
        }
        else {
            if (typeof responseChunks[15] !== 'undefined')
                response.voucher = responseChunks[15].length % 40 != 0 ? responseChunks[15] : responseChunks[15].match(/.{1,40}/g);
            else
                response.voucher = null;

            response.sharesType = responseChunks[16];
            response.sharesNumber = responseChunks[17];
            response.sharesAmount = responseChunks[18];
            response.sharesTypeGloss = responseChunks[19];
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
            voucher : responseChunks[4].lenght % 40 != 0 ? responseChunks[4] : responseChunks[4].match(/.{1,40}/g),
        };
    }

    initializationResponse(response) {
        let responseChunks = response.split("|");
        return {
            functionCode: parseInt(responseChunks[0]),
            responseCode: parseInt(responseChunks[1]),
            responseMessage: this.getResponseMessage(parseInt(responseChunks[1])),
            successful: parseInt(responseChunks[1])===0,
            realDate: responseChunks[2],
            realTime: responseChunks[3],
        };
    }

    getResponseMessage(responseCode) {
        return typeof responsesMessages[responseCode] !=="undefined" ? responsesMessages[responseCode] : null;
    }
}