import POSIntegrado from "./POSIntegrado";
import POSAutoservicio from "./POSAutoservicio";

class TransbankPOS {
    constructor() {
        this.Integrado = new POSIntegrado();
        this.Autoservicio = new POSAutoservicio();
    }
}


export const POS = new TransbankPOS();
export default POS;