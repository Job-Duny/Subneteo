"use strict";

const $form = document.querySelector("form");

const $ip = document.getElementById("ip");
const $masc = document.getElementById("masc");
const $mascaracid = document.getElementById("mascaracid");

$form.addEventListener("submit", function (e) {
    e.preventDefault();

    cleanInputs();

    try {
        if (!!$mascaracid.value) {
            $masc.value = notacaoCIDR($mascaracid.value);
        }
        const classe = verificarClasse($ip.value);
        const mascara = verificarMascara($masc.value, classe);
        const red = valRed($ip.value, $masc.value);
        const broadcast = verificarBroadcast($ip.value, $masc.value);
        const host = verificarHost($masc.value);
        const subred = verificarSubrede(classe, $masc.value);


        const $sectionEntrada = document.querySelector('section');
        $sectionEntrada.insertAdjacentHTML('afterend', `<section class="result"></section>`);


        const $resultado = document.querySelector('.result');

        $resultado.insertAdjacentHTML('beforeend', criarCard('Clase', classe));

        $resultado.insertAdjacentHTML('beforeend', criarCard('IP', ip.value, converterDecimalParaBinarioQuatroOctetos($ip.value)));

        $resultado.insertAdjacentHTML('beforeend', criarCard('Máscara', $masc.value, converterDecimalParaBinarioQuatroOctetos($masc.value)));

        $resultado.insertAdjacentHTML('beforeend', criarCard('Direccion de Red', red, converterDecimalParaBinarioQuatroOctetos(red)));

        $resultado.insertAdjacentHTML('beforeend', criarCard('Direccion de broadcast', broadcast, converterDecimalParaBinarioQuatroOctetos(broadcast)));

        $resultado.insertAdjacentHTML('beforeend', criarCard('Cantidad de redes/sub-redes', subred));

        $resultado.insertAdjacentHTML('beforeend', criarCard('Cantidad de host por red/sub-red', host));

    } catch (error) {
        document.querySelector('body').insertAdjacentHTML('beforeend',
            `<div class="result alert warning">
        <p>Verifique los valores ingresados</p>
    </div>`
        )
    }
});

function cleanInputs() {
    document.querySelector('.result') ? document.querySelector('.result').remove() : "";
}

function criarCard(texto, valor1, valor2) {
    if (!!valor2) {
        return `<div class="card">
                <p>${texto}</p>
                <p>${valor1}</p>
                <p>${valor2}</p>
            </div>`
    } else {
        return `<div class="card">
                <p>${texto}</p>
                <p>${valor1}</p>
            </div>`
    }
}