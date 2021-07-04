const EventEmitter = require('events');

const serialOptions = {
    baudRate: 115200,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
    // bufferSize: 1024,
    flowControl: 'none'
}

module.exports = class WebSerialPort extends EventEmitter {

    #_port;
    #_reader;
    #_writer;
    #_keepReading;

    constructor() {
        super();
        this.browserSupport = "serial" in navigator;
        this.#_port = null;
        this.#_reader = null;
        this.#_writer = null;
        this.#_keepReading = false;
        this.isOpen = false;
    }

    /**
     * @param {SerialPort} port
     */
    set port(port) {
        this.#_port = port;
    }

    async requestSerialPort(filters = {}) {
        try {
            this.#_port = await navigator.serial.requestPort(filters);
            return true;
        }
        catch (err) {
            console.error(`Cannot select serial port. ${err.message}.`);
            return false;
        }
    }

    async getAuthorizedPorts() {
        return await navigator.serial.getPorts();
    }

    getPortInfo() {
        if(!this.#_port === null)
            throw new Error('Cannot get port information. Port not selected.');

        return this.#_port.getInfo();
    }

    async openPort(options = serialOptions) {
        try {
            await this.#_port.open(options);
            this.isOpen = true;

            this.#_reader = this.#_port.readable.getReader();
            this.#_writer = this.#_port.writable.getWriter();

            this.#readPort();
            return this.isOpen;
        }
        catch (e) {
            this.isOpen = false;
            this.#_reader = null;
            this.#_writer = null;

            throw new Error(`Cannot open port. ${e.message}`)
        }
    }

    async closePort() {
        try {
            this.#_keepReading = false;
            await this.#_reader.cancel();
            this.#_writer.releaseLock();

            await this.#_port.close();
            this.isOpen = false;
            this.#_reader = null;
            this.#_writer = null;
        }
        catch (e) {
            throw new Error(`Cannot close port. ${e.message}`)
        }
    }

    async writeData(data) {
        try {
            await this.#_writer.write(data);
        }
        catch (e) {
            throw new Error(`Cannot write port. ${e.message}`);
        }
    }

    async #readPort() {
        this.#_keepReading = true;

        while (this.#_port.readable && this.#_keepReading) {
            try {
                while (true) {
                    const { value, done } = await this.#_reader.read();
                    if (done) {                       
                        break;
                    }
                    if (value) {
                        this.emit('data', value);
                    }
                }
            }
            catch (e) {
                throw new Error(`Cannot read port. ${e.message}`);
            }
            finally {
                this.#_reader.releaseLock();
            }
        }
    }
}