// Esegui il fetch per ottenere i dati
fetch('http://185.6.242.121:7080/~inb5/merlini/api/dashboard/leaderscore.php') // Sostituisci con il tuo URL API
.then(response => response.json())
.then(data => {
    const tableBody = document.getElementById('table-body');
    
    // Verifica che ci siano dati nella risposta
    if (data && data.message === "Dati trovati" && Array.isArray(data.data)) {
        data.data.forEach((user, index) => {
            // Crea una nuova riga per ogni utente
            const row = document.createElement('tr');
            
            // Crea le celle per nome, cognome e punti
            const nomeCell = document.createElement('td');
            const cognomeCell = document.createElement('td');
            const pointCell = document.createElement('td');

            // Aggiungi la medaglia (oro, argento, bronzo) ai primi tre
            if (index === 0) {
                nomeCell.innerHTML = `<img src="https://static-00.iconduck.com/assets.00/gold-medal-icon-770x1024-i88elmlx.png" alt="Oro" class="medal-icon"> ${user.nome}`;
            } else if (index === 1) {
                nomeCell.innerHTML = `<img src="https://static-00.iconduck.com/assets.00/silver-medal-icon-385x512-j79m3dnn.png" alt="Argento" class="medal-icon"> ${user.nome}`;
            } else if (index === 2) {
                nomeCell.innerHTML = `<img src="https://static-00.iconduck.com/assets.00/bronze-medal-icon-1540x2048-plq7ryc8.png" alt="Bronzo" class="medal-icon"> ${user.nome}`;
            } else {
                nomeCell.textContent = user.nome;
            }
            
            cognomeCell.textContent = user.cognome;
            pointCell.textContent = user.point;

            // Aggiungi le celle alla riga
            row.appendChild(nomeCell);
            row.appendChild(cognomeCell);
            row.appendChild(pointCell);

            // Aggiungi la riga alla tabella
            tableBody.appendChild(row);
        });
    } else {
        console.error('Dati non validi ricevuti dalla API');
    }
})
.catch(error => console.error('Errore nel fetch dei dati:', error));
