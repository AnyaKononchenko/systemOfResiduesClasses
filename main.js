function parseNumberToSRC(number, modules) {
    let numberInSRC = [];
    for (let i = 0; i < modules.length; i++) {
        numberInSRC.push(number - parseInt((number / modules[i]).toString()) * modules[i]);
    }
    return numberInSRC;
}

function stringToArray(string) {
    return string.split(',');
}


document.getElementById('submit').addEventListener('click', function () {
    let input1 = parseInt(document.getElementById('number1').value);
    let input2 = parseInt(document.getElementById('number2').value);
    let res1 = document.getElementById('resultA');
    let res2 = document.getElementById('resultB');
    let sum = document.getElementById('resultAplusB');
    let mult = document.getElementById('resultAmultiplyB');
    let dif = document.getElementById('resultAminusB');

    let modules = document.getElementById('modules');
    let parsedModules = stringToArray(modules.value).map(item => parseInt(item));
    res1.innerHTML = parseNumberToSRC(input1, parsedModules)
    res2.innerHTML = parseNumberToSRC(input2, parsedModules)
    sum.innerHTML = calc('+', res1.innerHTML, res2.innerHTML, parsedModules);
    mult.innerHTML = calc('*', res1.innerHTML, res2.innerHTML, parsedModules);
    dif.innerHTML = calc(`-`, res1.innerHTML, res2.innerHTML, parsedModules);
})

document.getElementById('SRCnumber').addEventListener('change', function (){
    document.getElementById('SRCnumberInDecimal').innerHTML = SRCtoDecimal(
        stringToArray(document.getElementById('SRCnumber').value),
        stringToArray(document.getElementById('modules').value)
    )
})


function calc(operation, a, b, modules) {
    let res = [];
    a = stringToArray(a).map(item => parseInt(item));
    b = stringToArray(b).map(item => parseInt(item));
    for (let i = 0; i < modules.length; i++) {
        if (operation === '+') {
            res.push((a[i] + b[i]) % modules[i]);
        } else if (operation === '-') {
            let tmp = (a[i] - b[i]) % modules[i];
            console.log(a[i], '-', b[i], '=', (a[i] - b[i]), 'mod', modules[i], '=', tmp)
            res.push(tmp >= 0 ? tmp : negativeModulo(tmp, modules[i]));
            console.log('pushed: ', res[i])
        } else if (operation === '*') {
            res.push((a[i] * b[i]) % modules[i]);
        }
    }
    return res;
}

function negativeModulo(a, modulo) {
    while (a <= modulo) {
        a += modulo;
    }
    return a - modulo;
}

function calcRelation(a, modulo) {
    a = a % modulo;
    let tmp = 1;
    do {
        let A = a * tmp;
        if (A % modulo === 1) {
            break;
        }
        tmp++;

    } while (tmp < 500)
    return tmp;

}

function SRCtoDecimal(SRC, modules) {
    let M = multAllElements(modules);
    let subModules = calcSubModules(M, modules);
    let coeffs = calcCoefficients(modules, subModules);
    let sum = 0;
    for (let i = 0; i < modules.length; i++) {

        sum += SRC[i] * subModules[i] * coeffs[i];
    }
    return sum % M;
}

let tmp = [0, 1, 4, 9], tmpModules = [3, 4, 5, 13]
console.log(SRCtoDecimal(tmp, tmpModules))

function multAllElements(arr) {
    let res = 1;
    for (let i = 0; i < arr.length; i++) {
        res *= arr[i];
    }
    return res;
}

function calcSubModules(M, modules) {
    let res = [];
    for (let i = 0; i < modules.length; i++) {
        res.push(M / modules[i])
    }
    return res;
}

function calcCoefficients(modules, submodules) {//способ только для НОД()=1
    let res = [];
    for (let i = 0; i < modules.length; i++) {
        console.log('calculate for:', submodules[i], modules[i])
        res.push(calcRelation(submodules[i], modules[i]));
    }
    console.log(res)
    return res;
}

