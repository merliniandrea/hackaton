// Funzione per gestire la registrazione
async function signup(event) {
    event.preventDefault(); // Impedisce il comportamento di invio del form (che ricarica la pagina)

    // Ottieni i valori dai campi del form
    let nome = document.getElementById('name').value;
    let cognome = document.getElementById('surname').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    // Creazione dell'oggetto con i dati da inviare
    let userData = {
        nome: nome,
        cognome: cognome,
        email: email,
        password: password
    };

console.log(userData);

    // Configurazione della richiesta fetch
    let response = await fetch("http://185.6.242.121:7080/~inb5/merlini/api/user/signup.php", {
        method: "POST", // Metodo della richiesta
        headers: {
            "Content-Type": "application/json" // Specifica che il corpo della richiesta è JSON
        },
        body: JSON.stringify(userData) // Converte i dati in formato JSON
    });

    // Gestisci la risposta dal server
    if (response.ok) {
        let data = await response.json(); // Aggiungi "await" per aspettare la risposta

        // Se la registrazione è andata a buon fine
        if (data.message === "Sigup effettuato con successo") {
            // Salva lo stato di login e l'ID dell'utente
            localStorage.setItem("logged", true);
            localStorage.setItem("userId", data.id);  // Usa l'ID restituito dal server
            console.log("Utente registrato correttamente");

            // Reindirizza alla pagina del questionario
            window.location.replace("questionario.html");
        } else {
            // Mostra l'errore se non è riuscita la registrazione
            alert(data.error || "Errore sconosciuto durante la registrazione");
        }
    } else {
        // Se la risposta dal server non è OK, mostra un errore
        alert("Errore nella risposta dal server");
    }
}


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

document.getElementById('signUpForm').addEventListener('submit', signup);

