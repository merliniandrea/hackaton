// Funzione per gestire il login
async function login(event) {
    event.preventDefault(); // Impedisce il comportamento di invio del form (che ricarica la pagina)

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let response = await fetch("http://185.6.242.121:7080/~inb5/merlini/api/user/login.php?email=" + email + "&password=" + password);

    if (response.ok) {
        let data = await response.json(); // Aggiungi "await" per aspettare la risposta

        localStorage.setItem("logged", data.logged);
        localStorage.setItem("userId", data.id);

        window.location.replace("dashboard.html");
    }
}

// Aggiungi un evento "submit" al form
document.getElementById('loginForm').addEventListener('submit', login);
