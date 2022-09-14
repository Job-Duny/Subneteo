"use strict";

function verificarClasse(ip) {
    ip = validarEntry(ip);
    return tipoClasse(primeiroOcteto(ip));
}

function validarEntry(value) {
    if (inputVacio(value)) {
        throw new Error("Pase algun valor por el parametro");
    }

    if (!inputString(value)) {
        throw new Error("El parametro debe ser de tipo string");
    }

    value = value.trim();

    if (!inputValMascOtIp(value)) {
        throw new Error(
            "Utilice puntos para separar los valores, sin utilizar espacios"
        );
    }

    return value;
}

function inputVacio(value) {
    return !!!value;
}

function inputString(value) {
    return typeof value === "string";
}

function inputValMascOtIp(value) {
    const regExp = /^(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][1-9]|2[0-5][0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][1-9]|2[0-5][0-5])$/;
    return regExp.test(value);
}

function decParaBin(decimal) {
    return (decimal >>> 0).toString(2);
}

function primeiroOcteto(value) {
    value = value.split(".");
    value = decParaBin(value[0]);
    return fillOct(value);
}

function fillOct(value) {
    return "00000000".slice(value.length) + value;
}

function tipoClasse(octeto) {
    if (octeto.slice(0, 1) === "0") {
        return "A";
    } else if (octeto.slice(0, 2) === "10") {
        return "B";
    } else if (octeto.slice(0, 3) === "110") {
        return "C";
    } else if (octeto.slice(0, 4) === "1110") {
        return "D";
    } else if (octeto.slice(0, 4) === "1111") {
        return "E";
    }
}

function verificarMascara(mascara, classeIp) {
    mascara = validarEntry(mascara);

    if (classeIp === "A") {
        const regExp = /^(((255)\.([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|2[0-5][0-5]))\.0\.0)|((((255)\.){2}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|2[0-5][0-5]))\.0)|((((255)\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|2[0-5][0-5])))$/;
        return regExp.test(mascara);
    }

    if (classeIp === "B") {
        const regExp = /^((((255)\.){2}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|2[0-5][0-5]))\.0)|((((255)\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|2[0-5][0-5])))$/;
        return regExp.test(mascara);
    }

    if (classeIp === "C") {
        const regExp = /^((((255)\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|2[0-5][0-5])))$/;
        return regExp.test(mascara);
    }

    return false;
}


function valRed(ip, mascara) {
    ip = converterDecimalParaBinarioQuatroOctetos(ip);
    mascara = converterDecimalParaBinarioQuatroOctetos(mascara);

    let rede = "";

    for (let i = 0; i < ip.length; i++) {
        let ipBin = ip.charAt(i);
        let mascaraBin = mascara.charAt(i);

        if (ipBin === "." || mascaraBin === ".") {
            rede += ipBin || mascaraBin;
        } else {
            rede += ipBin & mascaraBin;
        }
    }

    return converteBinarioParaDecimalQuatroNumeros(rede);
}


function verificarBroadcast(ip, mascara) {
    ip = converterDecimalParaBinarioQuatroOctetos(ip);
    mascara = negacaoBinariaQuatroOctetos(
        converterDecimalParaBinarioQuatroOctetos(mascara)
    );

    let broadcast = "";

    for (let i = 0; i < ip.length; i++) {
        let ipBin = ip.charAt(i);
        let mascaraBin = mascara.charAt(i);

        if (ipBin === "." || mascaraBin === ".") {
            broadcast += ".";
        } else {
            broadcast += ipBin | mascaraBin;
        }
    }

    return converteBinarioParaDecimalQuatroNumeros(broadcast);
}

function converterDecimalParaBinarioQuatroOctetos(value) {
    value = value.split(".");
    let octetos = fillOct(decParaBin(value[0]));
    octetos += "." + fillOct(decParaBin(value[1]));
    octetos += "." + fillOct(decParaBin(value[2]));
    octetos += "." + fillOct(decParaBin(value[3]));
    return octetos;
}

function binParaDec(value) {
    return parseInt(value, 2);
}

function converteBinarioParaDecimalQuatroNumeros(value) {
    value = value.split(".");
    let numeros = binParaDec(value[0]);
    numeros += "." + binParaDec(value[1]);
    numeros += "." + binParaDec(value[2]);
    numeros += "." + binParaDec(value[3]);
    return numeros;
}

function negBin(value) {
    return value === "1" ? "0" : "1";
}

function negacaoBinariaQuatroOctetos(value) {
    let valueNegado = "";
    for (let i = 0; i < value.length; i++) {
        let valueBin = value.charAt(i);
        if (valueBin === ".") {
            valueNegado += valueBin;
        } else {
            valueNegado += negBin(valueBin);
        }
    }
    return valueNegado;
}

function notacaoCIDR(value) {
    let mascaraCIDR = "";

    for (let i = 0; i < 32; i++) {
        if (i < value) {
            mascaraCIDR += "1";
        } else {
            mascaraCIDR += "0";
        }
    }

    mascaraCIDR = converteBinarioParaDecimalQuatroNumeros(
        formatarBinarioQuatroOctetos(mascaraCIDR)
    );
    return mascaraCIDR;
}

function formatarBinarioQuatroOctetos(value) {
    let octeto = value.slice(0, 8);
    octeto += "." + value.slice(8, 16);
    octeto += "." + value.slice(16, 24);
    octeto += "." + value.slice(24, 32);
    return octeto;
}

function verificarSubrede(classeIp, mascara) {
    mascara = converterDecimalParaBinarioQuatroOctetos(mascara);
    switch (classeIp) {
        case "A":
            return Math.pow(2, Math.abs(8 - qtdBitsLigado(mascara)));
        case "B":
            return Math.pow(2, Math.abs(16 - qtdBitsLigado(mascara)));
        case "C":
            return Math.pow(2, Math.abs(24 - qtdBitsLigado(mascara)));
        default:
            throw new Error("No es posible calcular la subred");
    }
}

function verificarHost(mascara) {
    mascara = converterDecimalParaBinarioQuatroOctetos(mascara);
    return new Number(Math.pow(2, qtdBitsDesligado(mascara)) - 2);
}

function qtdBitsLigado(mascara) {
    return mascara.match(/1/g).length;
}

function qtdBitsDesligado(mascara) {
    return mascara.match(/0/g).length;
}