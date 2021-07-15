$(document).ready(() => {
    $('#browser_support').html(
        Transbank.POS.Integrado.browserSupport? 'Supported' : 'NotSupported'
    );
});

$('#connect').click(function (e) { 
    e.preventDefault();

    Transbank.POS.Integrado.connect().then((result) => {
        console.log(result);

        if(!$('#disconnect').length)
            $('#connection').append('<button id="disconnect">Disconnect</button>');

        $('#statePOS').html(`Connected to POS`);
    });
});

$('#connection').on('click', '#disconnect', async function (e) {
    e.preventDefault();
    try {
        Transbank.POS.Integrado.disconnect().then((result) => {
            console.log(result);
            $('#statePOS').html(`Port closed`);
            $('#disconnect').remove();
        });
    }
    catch(err) {
        console.log(err);
        $('#statePOS').html(`Failed to close port`);
    }
});

$('#poll').click(async function (e) { 
    e.preventDefault();
    
    Transbank.POS.Integrado.poll().then((response) => console.log(response)).catch(err => console.log(err));
});

$('#setNormalMode').click(async function (e) { 
    e.preventDefault();

    Transbank.POS.Integrado.setNormalMode().then((response) => console.log(response)).catch(err => console.log(err));
    
});

$('#loadKeys').click(async function (e) { 
    e.preventDefault();
    
    Transbank.POS.Integrado.loadKeys().then((response) => console.log(response)).catch(err => console.log(err));
});

$('#sale').submit( function (e) { 
    e.preventDefault();

    let formData = new FormData(document.querySelector('#sale'));
    let data = Object.fromEntries(formData);

    Transbank.POS.Integrado.sale(
        data.amount,
        'ABC123',
        true,
        saleState
    ).then((response) => console.log(response)).catch(err => console.log(err));
});

$('#multicodeSale').submit(async function (e) { 
    e.preventDefault();

    let formData = new FormData(document.querySelector('#multicodeSale'));
    let data = Object.fromEntries(formData);

    console.log(data);

    Transbank.POS.Integrado.multiCodeSale(
        data.amount,
        'ABC123',
        data.commerceCode,
        true,
        saleState
    ).then((response) => console.log(response)).catch(err => console.log(err));
});

$('#lastSale').click(async function (e) { 
    e.preventDefault();

    Transbank.POS.Integrado.lastSale().then((response) => console.log(response)).catch(err => console.log(err));
    
});

$('#multicodeLastSale').submit(async function (e) { 
    e.preventDefault();

    let formData = new FormData(document.querySelector('#multicodeLastSale'));
    let data = Object.fromEntries(formData);

    console.log(data);

    Transbank.POS.Integrado.multiCodeLastSale(data.getVoucher).then((response) => console.log(response)).catch(err => console.log(err));
    
});

$('#refund').submit(async function (e) { 
    e.preventDefault();

    let formData = new FormData(document.querySelector('#refund'));
    let data = Object.fromEntries(formData);

    console.log(data);

    Transbank.POS.Integrado.refund(data.operationId).then((response) => console.log(response)).catch(err => console.log(err));
    
});

$('#close').click(async function (e) { 
    e.preventDefault();

    Transbank.POS.Integrado.closeDay().then((response) => console.log(response)).catch(err => console.log(err));
    
});

$('#salesDetail').submit(async function (e) {
    e.preventDefault();

    let formData = new FormData(document.querySelector('#salesDetail'));
    let data = Object.fromEntries(formData);

    Transbank.POS.Integrado.salesDetail(data.printOnPos).then((response) => console.log(response)).catch(err => console.log(err));
});

$('#multicodeSalesDetail').submit(async function (e) {
    e.preventDefault();

    let formData = new FormData(document.querySelector('#multicodeSalesDetail'));
    let data = Object.fromEntries(formData);

    Transbank.POS.Integrado.multicodeSalesDetail(data.printOnPos).then((response) => console.log(response)).catch(err => console.log(err));
});

$('#totalSale').click(async function (e) { 
    e.preventDefault();

    Transbank.POS.Integrado.getTotals().then((response) => console.log(response)).catch(err => console.log(err));
    
});

function saleState(posResponse) {
    console.log(posResponse);
    $('#stateSale').html(posResponse.responseMessage);
}

$('#autoservicioConnect').click(function (e) { 
    e.preventDefault();

    Transbank.POS.Autoservicio.connect().then((result) => {
        console.log(result);

        if(!$('#autoservicioDisconnect').length)
            $('#connection').append('<button id="autoservicioDisconnect">Disconnect</button>');

        $('#statePOS').html(`Connected to POS`);
    });
});

$('#connection').on('click', '#autoservicioDisconnect', async function (e) {
    e.preventDefault();
    try {
        Transbank.POS.Autoservicio.disconnect().then((result) => {
            console.log(result);
            $('#statePOS').html(`Port closed`);
            $('#autoservicioDisconnect').remove();
        });
    }
    catch(err) {
        console.log(err);
        $('#statePOS').html(`Failed to close port`);
    }
});

$('#autoservicioPoll').click(async function (e) { 
    e.preventDefault();
    
    Transbank.POS.Autoservicio.poll().then((response) => console.log(response)).catch(err => console.log(err));
});

$('#autoservicioLoadKeys').click(async function (e) { 
    e.preventDefault();
    
    Transbank.POS.Autoservicio.loadKeys().then((response) => console.log(response)).catch(err => console.log(err));
});

$('#autoservicioSale').submit( function (e) { 
    e.preventDefault();

    let formData = new FormData(document.querySelector('#autoservicioSale'));
    let data = Object.fromEntries(formData);

    console.log(data);

    Transbank.POS.Autoservicio.sale(
        data.amount,
        'ABC123',
        data.getVoucher,
        true,
        saleState
    ).then((response) => console.log(response)).catch(err => console.log(err));
});

$('#autoservicioMulticodeSale').submit(async function (e) { 
    e.preventDefault();

    let formData = new FormData(document.querySelector('#autoservicioMulticodeSale'));
    let data = Object.fromEntries(formData);

    console.log(data);

    Transbank.POS.Autoservicio.multiCodeSale(
        data.amount,
        'ABC123',
        data.commerceCode,
        data.getVoucher,
        true,
        saleState
    ).then((response) => console.log(response)).catch(err => console.log(err));
});