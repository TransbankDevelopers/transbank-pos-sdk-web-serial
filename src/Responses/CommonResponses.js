export default class CommonResponses {

    loadKeysResponse(response, responseMessageFunction) {
        let responseChunks = response.split("|");
        return {
            functionCode: parseInt(responseChunks[0]),
            responseCode: parseInt(responseChunks[1]),
            commerceCode: parseInt(responseChunks[2]),
            terminalId: responseChunks[3],
            responseMessage: responseMessageFunction(parseInt(responseChunks[1])),
            successful: parseInt(responseChunks[1])===0,
        }
    }

    refundResponse(response, responseMessageFunction) {
        let responseChunks = response.split("|")
        return {
            functionCode: parseInt(responseChunks[0]),
            responseCode: parseInt(responseChunks[1]),
            commerceCode: parseInt(responseChunks[2]),
            terminalId: responseChunks[3],
            authorizationCode: responseChunks[4].trim(),
            operationId: responseChunks[5],
            responseMessage: responseMessageFunction(parseInt(responseChunks[1])),
            successful: parseInt(responseChunks[1])===0,
        }
    }

    intermediateResponse(response, responseMessageFunction) {
        let responseChunks = response.split("|");
        return{
            responseCode: parseInt(responseChunks[1]),
            responseMessage: responseMessageFunction(parseInt(responseChunks[1])),
        }
    }
}