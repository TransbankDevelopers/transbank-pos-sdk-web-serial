import Serial from "./Utils/Serial";
import CommonResponses from "./Responses/CommonResponses";
import AutoservicioResponses from "./Responses/POSAutoservicioResponses";

export default class POSAutoservicio extends Serial {

    #CommonResponses;
    #AutoservicioResponses;

    constructor() {
        super();
        this.#CommonResponses = new CommonResponses();
        this.#AutoservicioResponses = new AutoservicioResponses();
    }

    initialization() {
        return this._send('0070', false);
    }

    initializationResponse() {
        return this._send('0080', true).then((response) => {
            return this.AutoservicioResponses.initializationResponse(response);
        });
    }

    loadKeys() {
        return this._send('0800', true).then(response => {
            return this.#CommonResponses.loadKeysResponse(
                response,
                this.#AutoservicioResponses.getResponseMessage
            );
        });
    }

    sale(amount, ticket, sendVoucher = false, sendStatus = false, callback = null) {
        amount = amount.toString().padStart(9, "0").slice(0, 9);
        ticket = ticket.toString().padStart(6, "0").slice(0, 20);
        let status = sendStatus ? "1":"0";
        let voucher = sendVoucher ? "1":"0";

        return this._send(`0200|${amount}|${ticket}|${voucher}|${status}`, true, this.#intermediateResponse.bind(this, [callback]))
        .then((response) => {
            return this.#AutoservicioResponses.saleResponse(response);
        });
    }

    multiCodeSale(amount, ticket, commerceCode = null, sendVoucher = false, sendStatus = false, callback = null) {
        amount = amount.toString().padStart(9, "0").slice(0, 9);
        ticket = ticket.toString().padStart(6, "0").slice(0, 20);
        commerceCode = commerceCode === null ? '0' : commerceCode;
        let status = sendStatus ? "1":"0";
        let voucher = sendVoucher ? "1":"0";

        return this._send(`0270|${amount}|${ticket}|${voucher}|${status}|${commerceCode}`, true, this.#intermediateResponse.bind(this, [callback]))
        .then((response) => {
            return this.#AutoservicioResponses.saleResponse(response);
        });
    }

    #intermediateResponse(callback, response) {
        if (typeof callback[0] === "function") {
            callback[0](this.#CommonResponses.intermediateResponse(
                response,
                this.#AutoservicioResponses.getResponseMessage
            ));
        }
    }

    lastSale(sendVoucher = false) {   
        let voucher = sendVoucher ? "1":"0";
        return this._send(`0250|${voucher}`).then((response) => {
            return this.#AutoservicioResponses.saleResponse(response);
        });
    }

    refund() {
        return this._send(`1200`).then((response) => {
            return this.#CommonResponses.refundResponse(
                response,
                this.#AutoservicioResponses.getResponseMessage
            );
        })
    }

    closeDay(sendVoucher = false) {   
        let voucher = sendVoucher ? "1":"0";
        return this._send(`0500|${voucher}`).then((response) => {
            return this.#AutoservicioResponses.closeResponse(response);
        })
    }
}