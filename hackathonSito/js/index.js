// Variabili per il font e il contrasto
let fontSize = 16; 
let contrastoAttivo = false;

// Aumenta il font
function aumentaFont() {
    fontSize += 2;
    document.body.style.fontSize = fontSize + "px";
    localStorage.setItem("fontSize", fontSize);
}

// Diminuisce il font
function diminuisciFont() {
    if (fontSize > 10) {
        fontSize -= 2;
        document.body.style.fontSize = fontSize + "px";
        localStorage.setItem("fontSize", fontSize);
    }
}

// Attiva/disattiva il contrasto alto
function toggleContrasto() {
    contrastoAttivo = !contrastoAttivo;
    if (contrastoAttivo) {
        document.body.classList.add("alto-contrasto");
        localStorage.setItem("contrasto", "on");
    } else {
        document.body.classList.remove("alto-contrasto");
        localStorage.setItem("contrasto", "off");
    }
}

// Mostra/nasconde il menu accessibilità
document.getElementById("toggleAccessibilita").addEventListener("click", function() {
    let menu = document.getElementById("menuAccessibilita");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
});
