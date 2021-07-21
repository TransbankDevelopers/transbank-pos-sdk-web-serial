import WebSerialPort from "../Lib/WebSerial/WebSerialPort"

const ACK = 0x06;
const STX = 0x02;
const ETX = 0x03;

export default class Serial extends WebSerialPort {

    #_ackTimeout;
    #_responseTimeout;
    #responseCallback;
    #ackCallback;
    #connecting;
    #disconnecting;
    #waiting;

    constructor() {
        super();
        this.#_ackTimeout = 2000;
        this.#_responseTimeout = 150000;
        this.#responseCallback = () => {};
        this.#ackCallback = () => {};
        this.#connecting = false;
        this.#disconnecting =false;
        this.#waiting = false;
    }

    #itsAnACK = (data) => {
        return (!data.length > 1) || data[0] === ACK;
    }

    #writeACK = async () => {
        this.writeData(new Uint8Array([ACK]))
        .catch(err => {
            console.log(`Unable to send ACK: ${err.message}`);
        });
    }

    connect(baudRate = 115200) {
        return new Promise((resolve, reject) => {
            // Block so just one connect command can be sent at a time
            if (this.#connecting === true) {
                reject("Another connect command was already sent and it is still waiting");
                return;
            }
            
            this.#connecting = true;
            
            if(this.isOpen) this.closePort();

            return this.requestSerialPort().then(async () => {
                let result = await this.openPort({baudRate: baudRate});
        
                // Aqui se reciben los datos del puerto serial. 
                this.on('data', async (data) => {
        
                    // Primero, se recibe un ACK
                    if (this.#itsAnACK(data)) {
                        if (typeof this.#ackCallback==="function") {
                            this.#ackCallback(data);
                        }
                        return;
                    }
        
                    // Si se recibió una respuesta (diferente a un ACK) entonces responder con un ACK y mandar el mensaje por callback
                    await this.#writeACK();
                    if (typeof this.#responseCallback==="function") {
                        this.#responseCallback(data);
                    }
                })
    
                resolve(result);
            }).finally(() => this.#connecting = false);
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            // Block so just one disconnect command can be sent at a time
            if (this.#disconnecting === true) {
                reject("Another disconnect command was already sent and it is still waiting");
                return;
            }

            this.#disconnecting = true;

            if(this.isOpen)
                return this.closePort()
                    .then(() => resolve(true))
                    .catch((e) => reject(`Error closing port. ${e.message}`))
                    .finally(() => this.#disconnecting = false);

            this.#disconnecting = false;
            resolve(true);
        });
    }

    _send(command, waitResponse = true, callback = null) {
        return new Promise((resolve, reject) => {
            if (!this.isOpen) {
                reject(`You have to connect to a POS to send this message: ${command}`);
                return;
            }
            // Block so just one message can be sent at a time
            if (this.#waiting === true) {
                reject("Another message was already sent and it is still waiting for a response from the POS");
                return;
            }
            this.#waiting = true;

            // Se establece timeout para recibir ACK desde el POS.
            let ackTimeout = setTimeout(() => {
                this.#waiting = false;
                clearTimeout(responseTimeout)
                reject("ACK has not been received in " + this.#_ackTimeout + " ms.")
            }, this.#_ackTimeout);

            this.#ackCallback = () => {
                clearTimeout(ackTimeout);
                if (!waitResponse) {
                    this.#waiting = false;
                    resolve(true);
                }
            }

            this.writeData(this.#prepareCommand(command));

            // Se establece timeout para recibir respuesta desde el POS.
            let responseTimeout = setTimeout(() => {
                this.#waiting = false
                reject(`Response of POS has not been received in ${this.#_responseTimeout/1000} seconds`)
            }, this.#_responseTimeout);

            this.#responseCallback = (serialData) => {
                clearTimeout(responseTimeout);

                let response = new TextDecoder().decode(serialData.slice(1, -2));
                let functionCode = response.slice(0, 4);

                if (typeof callback==="function") {
                    if (functionCode==="0900") { // Sale status messages
                        callback(response);
                        return;
                    }

                    if (functionCode==="0261" || functionCode==="0291")
                        callback(response);
                }

                this.#waiting = false;
                resolve(response);
            }
        });
    }

    #prepareCommand(command) {
        let hexData = new TextEncoder().encode(command);

        if(hexData[0] === STX)
            hexData =  hexData.slice(1);

        if(hexData[hexData.length - 1] !== ETX)
            hexData =  this._concatTypedArrays(hexData, new Uint8Array([ETX]));

        hexData = this._concatTypedArrays(hexData, new Uint8Array([this.#LRC(hexData)]));

        return this._concatTypedArrays(new Uint8Array([STX]), hexData);
    }

    #LRC(hexData) {
        return hexData.reduce((accumulator, byte) => accumulator ^ byte, 0);
    }

    poll() {
        return this._send('0100', false);
    }
}