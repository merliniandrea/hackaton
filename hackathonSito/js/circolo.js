function nascondi() {
    document.getElementById("NoCircolo").style.display = "none";
    document.getElementById("creaCircolo").style.display = "none";
    document.getElementById("uniscitiCircolo").style.display = "none";
    document.getElementById("SiCircolo").style.display = "none";
}

function visNoCircolo() {
    nascondi();
    document.getElementById("NoCircolo").style.display = "block";
}

function visCreaCircolo() {
    nascondi();
    document.getElementById("creaCircolo").style.display = "block";
}

function visUniscitiCircolo() {
    nascondi();
    document.getElementById("uniscitiCircolo").style.display = "block";
}

async function visSiCircolo() {
    nascondi();
    document.getElementById("SiCircolo").style.display = "block";

    let htmlElement = ''; // Dichiara htmlElement fuori dal ciclo forEach

    // Usa Promise.all() per aspettare che tutte le richieste API siano completate
    await Promise.all(groups.map(async group => {
        const apiUrl = `http://185.6.242.121:7080/~inb5/merlini/api/group/list.php?id=${group}`;
        try {
            const response = await fetch(apiUrl);
            const result = await response.json();

            htmlElement += `<h1>${result.group}</h1><ul>`;

            result.users.forEach(user => {
                var name = user.nome;
                var surname = user.cognome;
                htmlElement += `<li>${name} ${surname}</li>`; // Correggi il tag <li> (chiudi correttamente il tag)
            });

            htmlElement += '</ul>';

        } catch (error) {
            console.error("Errore nel recupero dati:", error);
            alert("Errore nel caricamento dei gruppi settimanale.");
        }
    }));

    // Una volta che tutte le richieste sono completate, aggiorna il DOM
    document.getElementById('gestioneCircolo').innerHTML = htmlElement;
}

let groups = [];

document.addEventListener("DOMContentLoaded", function () {
    async function getGroups() {
        const userId = localStorage.getItem("userId");
        const apiUrl = `http://185.6.242.121:7080/~inb5/merlini/api/group/get.php?id=${userId}`;

        try {
            const response = await fetch(apiUrl);
            const result = await response.json();

            console.log(result.groups.length);

            if (result.groups.length > 0) {
                groups = result.groups;
                visSiCircolo(); // Chiamata alla funzione per visualizzare il gruppo
            } else {
                visNoCircolo(); // Chiamata alla funzione per visualizzare "NoCircolo"
            }

        } catch (error) {
            console.error("Errore nel recupero dati:", error);
            alert("Errore nel caricamento dei gruppi settimanale.");
        }
    }

    getGroups();
});
