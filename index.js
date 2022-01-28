const tabs = document.querySelectorAll(".tabs");
const tab = document.querySelectorAll(".tab");
const panel = document.querySelectorAll(".tab-content");

function onTabClick(event) {
    // deactivate existing active tabs and panel

    for (let i = 0; i < tab.length; i++) {
        tab[i].classList.remove("active");
        tab[i].classList.remove("text-blue-500");
        tab[i].classList.remove("border-b-2");
        tab[i].classList.remove("border-blue-500");
    }

    for (let i = 0; i < panel.length; i++) {
        panel[i].classList.remove("active");
    }

    // activate new tabs and panel
    event.target.classList.add('active', 'text-blue-500', 'border-b-2', 'border-blue-500');
    let classString = event.target.getAttribute('data-target');
    document.getElementById('panels').getElementsByClassName(classString)[0].classList.add("active");
}

for (let i = 0; i < tab.length; i++) {
    tab[i].addEventListener('click', onTabClick, false);
}

function syntaxHighlight(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function printResponse(response, element) {
    let json = $('<pre>').html(
        syntaxHighlight(JSON.stringify(response, undefined, 4))
    );

    element.html(json);
}

const whenConnect = (type = 'pos') => {

    if(type != 'pos') {
        if(!$('#autoservicio-disconnect').length)
            $('#connection-autoservicio').append('<button class="border w-full p-3 text-sm" id="autoservicio-disconnect">Disconnect</button>');
    }
    else {
        if(!$('#disconnect').length)
            $('#connection').append('<button class="border w-full p-3 text-sm" id="disconnect">Disconnect</button>');
    }

    $('#statePOS').html(`Connected to POS`);
}

$(document).ready(() => {
    $('#browser_support').html(
        Transbank.POS.Integrado.browserSupport? 'Supported' : 'NotSupported'
    );

    Transbank.POS.Integrado.autoConnect().then((result) => {
        if(result) whenConnect();
    });
});

// POS Integrado

$('#connect').click(function (e) { 
    e.preventDefault();

    let baudrate = $('#baudrate-integrado option:selected').val();

    Transbank.POS.Integrado.connect(baudrate).then((result) => {
        console.log(result);

        whenConnect();
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
    
    Transbank.POS.Integrado.poll().then((response) => {
        console.log(response);
        printResponse(response, $('#pos-response'));
    }).catch(err => console.log(err));
});

$('#setNormalMode').click(async function (e) { 
    e.preventDefault();

    Transbank.POS.Integrado.setNormalMode().then((response) => {
        console.log(response);
        printResponse(response, $('#pos-response'));
    }).catch(err => console.log(err));
    
});

$('#loadKeys').click(async function (e) { 
    e.preventDefault();
    
    Transbank.POS.Integrado.loadKeys().then((response) => {
        console.log(response);
        printResponse(response, $('#pos-response'));
    }).catch(err => console.log(err));
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
    ).then((response) => {
        console.log(response);
        printResponse(response, $('#pos-response'));
        $('#stateSale').html(response.responseMessage);
    }).catch(err => console.log(err));
});

$('#multicodeSale').submit(async function (e) { 
    e.preventDefault();

    let formData = new FormData(document.querySelector('#multicodeSale'));
    let data = Object.fromEntries(formData);

    Transbank.POS.Integrado.multiCodeSale(
        data.amount,
        'ABC123',
        data.commerceCode,
        true,
        saleState
    ).then((response) => {
        console.log(response);
        printResponse(response, $('#pos-response'));
        $('#stateSale').html(response.responseMessage);
    }).catch(err => console.log(err));
});

$('#lastSale').click(async function (e) { 
    e.preventDefault();

    Transbank.POS.Integrado.lastSale().then((response) => {
        console.log(response);
        printResponse(response, $('#pos-response'));
    }).catch(err => console.log(err));
});

$('#multicodeLastSale').submit(async function (e) { 
    e.preventDefault();

    let formData = new FormData(document.querySelector('#multicodeLastSale'));
    let data = Object.fromEntries(formData);

    Transbank.POS.Integrado.multiCodeLastSale(data.getVoucher).then((response) => {
        console.log(response);
        printResponse(response, $('#pos-response'));
    }).catch(err => console.log(err));
    
});

$('#refund').submit(async function (e) { 
    e.preventDefault();

    let formData = new FormData(document.querySelector('#refund'));
    let data = Object.fromEntries(formData);

    console.log(data);

    Transbank.POS.Integrado.refund(data.operationId).then((response) => {
        console.log(response);
        printResponse(response, $('#pos-response'));
    }).catch(err => console.log(err));
});

$('#close').click(async function (e) { 
    e.preventDefault();

    Transbank.POS.Integrado.closeDay().then((response) => {
        console.log(response);
        printResponse(response, $('#pos-response'));
    }).catch(err => console.log(err));
});

$('#salesDetail').submit(async function (e) {
    e.preventDefault();

    let formData = new FormData(document.querySelector('#salesDetail'));
    let data = Object.fromEntries(formData);

    Transbank.POS.Integrado.salesDetail(data.printOnPos).then((response) => {
        console.log(response);
        printResponse(response, $('#pos-response'));
    }).catch(err => console.log(err));
});

$('#multicodeSalesDetail').submit(async function (e) {
    e.preventDefault();

    let formData = new FormData(document.querySelector('#multicodeSalesDetail'));
    let data = Object.fromEntries(formData);

    Transbank.POS.Integrado.multicodeSalesDetail(data.printOnPos).then((response) => {
        console.log(response);
        printResponse(response, $('#pos-response'));
    }).catch(err => console.log(err));
});

$('#totalSale').click(async function (e) { 
    e.preventDefault();

    Transbank.POS.Integrado.getTotals().then((response) => {
        console.log(response);
        printResponse(response, $('#pos-response'));
    }).catch(err => console.log(err));   
});

function saleState(posResponse) {
    console.log(posResponse);
    $('#stateSale').html(posResponse.responseMessage);
}

// POS Autoservicio

$('#autoservicio-connect').click(function (e) { 
    e.preventDefault();

    let baudrate = $('#baudrate-autoservicio option:selected').val();

    Transbank.POS.Autoservicio.connect(baudrate).then((result) => {
        console.log(result);

        whenConnect('autoservicio');

        $('#statePOS').html(`Connected to POS`);
    });
});

$('#connection-autoservicio').on('click', '#autoservicio-disconnect', async function (e) {
    e.preventDefault();
    try {
        Transbank.POS.Autoservicio.disconnect().then((result) => {
            console.log(result);
            $('#statePOS').html(`Port closed`);
            $('#autoservicio-disconnect').remove();
        });
    }
    catch(err) {
        console.log(err);
        $('#statePOS').html(`Failed to close port`);
    }
});

$('#autoservicio-poll').click(async function (e) { 
    e.preventDefault();
    
    Transbank.POS.Autoservicio.poll().then((response) => {
        console.log(response);
        printResponse(response, $('#autoservicio-response'));
    }).catch(err => console.log(err));
});

$('#autoservicio-initialization').click(async function (e) { 
    e.preventDefault();
    
    Transbank.POS.Autoservicio.initialization().then((response) => {
        console.log(response);
        printResponse(response, $('#autoservicio-response'));
    }).catch(err => console.log(err));
});

$('#autoservicio-initialization-response').click(async function (e) { 
    e.preventDefault();
    
    Transbank.POS.Autoservicio.initializationResponse().then((response) => {
        console.log(response);
        printResponse(response, $('#autoservicio-response'));
    }).catch(err => console.log(err));
});

$('#autoservicio-loadkeys').click(async function (e) { 
    e.preventDefault();
    
    Transbank.POS.Autoservicio.loadKeys().then((response) => {
        console.log(response);
        printResponse(response, $('#autoservicio-response'));
    }).catch(err => console.log(err));
});

$('#autoservicio-sale').submit( function (e) { 
    e.preventDefault();

    let formData = new FormData(document.querySelector('#autoservicio-sale'));
    let data = Object.fromEntries(formData);

    Transbank.POS.Autoservicio.sale(
        data.amount,
        'ABC123',
        data.getVoucher,
        true,
        saleState
    ).then((response) => {
        console.log(response);
        printResponse(response, $('#autoservicio-response'));
    }).catch(err => console.log(err));
});

$('#autoservicio-multicode-sale').submit(async function (e) { 
    e.preventDefault();

    let formData = new FormData(document.querySelector('#autoservicio-multicode-sale'));
    let data = Object.fromEntries(formData);

    Transbank.POS.Autoservicio.multiCodeSale(
        data.amount,
        'ABC123',
        data.commerceCode,
        data.getVoucher,
        true,
        saleState
    ).then((response) => {
        console.log(response);
        printResponse(response, $('#autoservicio-response'));
    }).catch(err => console.log(err));
});

$('#autoservicio-last-sale').submit(async function (e) { 
    e.preventDefault();

    let formData = new FormData(document.querySelector('#autoservicio-last-sale'));
    let data = Object.fromEntries(formData);

    Transbank.POS.Autoservicio.lastSale(data.getVoucher).then((response) => {
        console.log(response);
        printResponse(response, $('#autoservicio-response'));
    }).catch(err => console.log(err));
    
});

$('#autoservicio-refund').click(async function (e) { 
    e.preventDefault();
    
    Transbank.POS.Autoservicio.refund().then((response) => {
        console.log(response);
        printResponse(response, $('#autoservicio-response'));
    }).catch(err => console.log(err));
});

$('#autoservicio-close').submit(async function (e) { 
    e.preventDefault();

    let formData = new FormData(document.querySelector('#autoservicio-close'));
    let data = Object.fromEntries(formData);

    Transbank.POS.Autoservicio.closeDay(data.getVoucher).then((response) => {
        console.log(response);
        printResponse(response, $('#autoservicio-response'));
    }).catch(err => console.log(err));
    
});