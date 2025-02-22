function validarCedulaEcuatoriana(cedula) {
    if (!/^\d{10}$/.test(cedula)) return false; // Debe ser numérica y de 10 dígitos

    const provincia = parseInt(cedula.substring(0, 2), 10);
    if (provincia < 1 || provincia > 24) return false; // Provincia inválida

    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let suma = 0;

    for (let i = 0; i < 9; i++) {
        let valor = parseInt(cedula[i]) * coeficientes[i];
        if (valor > 9) valor -= 9;
        suma += valor;
    }

    const digitoVerificador = (10 - (suma % 10)) % 10;
    return digitoVerificador === parseInt(cedula[9]);
}

module.exports = { validarCedulaEcuatoriana}; 