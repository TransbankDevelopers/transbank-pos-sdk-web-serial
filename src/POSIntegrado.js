import Serial from "./Utils/Serial";
import CommonResponses from "./Responses/CommonResponses";
import IntegradoResponses from "./Responses/POSIntegradoResponses";

export default class POSIntegrado extends Serial {

    #CommonResponses;
    #IntegradoResponses;

    constructor() {
        super();
        this.#CommonResponses = new CommonResponses();
        this.#IntegradoResponses = new IntegradoResponses();
    }

    setNormalMode() {
        return this._send('0300', false);
    }

    loadKeys() {
        return this._send('0800', true).then(response => {
            return this.#CommonResponses.loadKeysResponse(
                response,
                this.#IntegradoResponses.getResponseMessage
            );
        });
    }

    sale(amount, ticket, sendStatus = false, callback = null) {
        amount = amount.toString().padStart(9, "0").slice(0, 9);
        ticket = ticket.toString().padStart(6, "0").slice(0, 6);
        let status = sendStatus ? "1":"0";

        return this._send(`0200|${amount}|${ticket}|||${status}`, true, this.#intermediateResponse.bind(this, [callback]))
        .then((response) => {
            return this.#IntegradoResponses.saleResponse(response);
        });
    }

    multiCodeSale(amount, ticket, commerceCode = null, sendStatus = false, callback = null) {
        amount = amount.toString().padStart(9, "0").slice(0, 9);
        ticket = ticket.toString().padStart(6, "0").slice(0, 6);
        commerceCode = commerceCode === null ? '0' : commerceCode;
        let status = sendStatus ? "1":"0";

        return this._send(`0270|${amount}|${ticket}|||${status}|${commerceCode}`, true, this.#intermediateResponse.bind(this, [callback]))
        .then((response) => {
            return this.#IntegradoResponses.saleResponse(response);
        });
    }

    #intermediateResponse(callback, response) {
        if (typeof callback[0] === "function") {
            callback[0](this.#CommonResponses.intermediateResponse(
                response,
                this.#IntegradoResponses.getResponseMessage
            ));
        }
    }

    lastSale() {   
        return this._send("0250|").then((response) => {
            return this.#IntegradoResponses.saleResponse(response);
        });
    }

    multiCodeLastSale(sendVoucher) {
        let voucher = sendVoucher ? "1":"0";
        return this._send(`0280|${voucher}`).then((response) => {
            return this.#IntegradoResponses.saleResponse(response);
        });
    }

    refund(operationId) {
        if (typeof operationId==="undefined" || isNaN(operationId)) {
            return new Promise((resolve, reject) => {
                reject("Operation ID not provided or has invalid value when calling refund method.")
            })
        }

        operationId = operationId.toString().slice(0, 6)
        return this._send(`1200|${operationId}|`).then((response) => {
            return this.#CommonResponses.refundResponse(
                response,
                this.#IntegradoResponses.getResponseMessage
            );
        })
    }

    closeDay() {
        return this._send("0500||").then((response) => {
            return this.#IntegradoResponses.closeResponse(response);
        })
    }

    salesDetail(printOnPos = false, command = '0260') {
        return new Promise((resolve) => {

            if(typeof printOnPos !== 'boolean' && typeof printOnPos !== 'string')
                return new Promise((resolve, reject) => {
                    reject("printOnPos must be of type boolean.");
                });

            if(typeof printOnPos === 'string')
                printOnPos = (printOnPos === 'true' || printOnPos === '1') ? true:false;

            let print = printOnPos ? "0":"1";
            let sales = [];

            let promise = this._send(`${command}|${print}|`, !printOnPos, onEverySale.bind(this));
            if (printOnPos) {
                resolve(promise);
            }

            function onEverySale(sale) {
                let detail = this.#IntegradoResponses.saleDetailResponse(sale);
                if (detail.authorizationCode=== "" || detail.authorizationCode === null) {
                    resolve(sales);
                    return
                }
                sales.push(detail);
            }

        })
    }

    multicodeSalesDetail(printOnPos = false) {
        return this.salesDetail(printOnPos, '0290');
    }

    getTotals() {
        return this._send("0700||").then((response) => {
            return this.#IntegradoResponses.getTotalsResponse(response);
        })
    }
}