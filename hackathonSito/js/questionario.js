const gruppi = {
    1: ["Quanto tempo trascorri ogni giorno sui social media?",
        "Quante email invii ogni giorno?",
        "Quanto spesso riduci la luminosità dello schermo?",
        "Cancelli regolarmente email vecchie?"],
    2: ["Quanto tempo a settimana trascorri guardando contenuti in streaming?",
        "Che qualità di video preferisci?",
        "Scarichi i contenuti per guardarli offline?",
        "Guardi video mentre fai altre attività?"],
    3: ["Quanto tempo dedichi ai videogiochi?",
        "Giochi spesso in multiplayer online?",
        "Quante ore lasci il tuo PC acceso senza usarlo?",
        "Spegni il tuo dispositivo quando non lo usi?"],
    4: ["Quanti acquisti fai online al mese?",
        "Scegli spedizioni rapide?",
        "Acquisti prodotti ricondizionati?",
        "Restituisci spesso prodotti acquistati online?"]
};

const risposte = {
    1: [["Meno di 1 ora", "Tra 1 e 2 ore", "Tra 2 e 4 ore", "Più di 4 ore"],
    ["Meno di 10", "Tra 10 e 30", "Tra 30 e 50", "Più di 50"],
    ["Sempre", "Spesso", "Qualche volta", "Mai"],
    ["Sempre", "Spesso", "Qualche volta", "Mai"]],
    2: [["Meno di 2 ore", "Tra 2 e 5 ore", "Tra 5 e 10 ore", "Più di 10 ore"],
    ["SD (480p)", "HD (720p-1080p)", "Full HD (1080p)", "4K o superiore"],
    ["Sempre", "Qualche volta", "Raramente", "Mai"],
    ["Mai", "Qualche volta", "Spesso", "Sempre"]],
    3: [["Meno di 2 ore", "Tra 2 e 5 ore", "Tra 5 e 10 ore", "Più di 10 ore"],
    ["Mai", "Raramente", "Qualche volta", "Spesso"],
    ["Mai", "Meno di 1 ora", "Tra 1 e 3 ore", "Più di 3 ore"],
    ["Sempre", "Spesso", "Raramente", "Mai"]],
    4: [["Nessuno", "1-3", "4-6", "Più di 6"],
    ["Mai", "Qualche volta", "Spesso", "Sempre"],
    ["Sì, sempre", "Qualche volta", "Raramente", "Mai"],
    ["Mai", "Qualche volta", "Spesso", "Sempre"]]
};

let risposteScelte = {};
let indiceGruppo = 1;
let indiceDomanda = 0;
let pieChart;

// Inizializza il grafico
function loadPieChart() {
    const ctx = document.getElementById('pieChart').getContext('2d');
    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Social', 'Streaming', 'Gaming', 'E-commerce'],
            datasets: [{
                data: [0, 0, 0, 0],
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

// Stampa la domanda e le risposte
function stampaDomanda() {
    const domandaContainer = document.getElementById('domandaContainer');
    const rispostaContainer = document.getElementById('rispostaContainer');
    domandaContainer.innerHTML = `<h3>${gruppi[indiceGruppo][indiceDomanda]}</h3>`;
    rispostaContainer.innerHTML = '';

    risposte[indiceGruppo][indiceDomanda].forEach((risposta, index) => {
        const button = document.createElement('button');
        button.className = 'risposta-btn';
        button.textContent = risposta;
        button.onclick = () => salvaRisposta(index);
        rispostaContainer.appendChild(button);
    });
}

// Aggiorna il grafico
function aggiornaGrafico() {
    let risultati = { "Social": 0, "Streaming": 0, "Gaming": 0, "E-commerce": 0 };
    Object.keys(risposteScelte).forEach(cat => {
        risultati[Object.keys(risultati)[cat - 1]] += Object.values(risposteScelte[cat]).reduce((a, b) => a + b, 0);
    });
    pieChart.data.datasets[0].data = Object.values(risultati);
    pieChart.update();
}

// Funzione che salva la risposta e aggiorna il grafico
function salvaRisposta(indexRisposta) {
    let punteggio = (indexRisposta + 1) * 5;
    risposteScelte[indiceGruppo] = risposteScelte[indiceGruppo] || {};
    risposteScelte[indiceGruppo][indiceDomanda + 1] = punteggio;

    aggiornaGrafico();

    indiceDomanda++;
    if (indiceDomanda < gruppi[indiceGruppo].length) {
        stampaDomanda();
    } else {
        indiceDomanda = 0;

        // Controllo per l'ultimo gruppo
        if (indiceGruppo < Object.keys(gruppi).length) {
            indiceGruppo++;
            if (indiceGruppo <= Object.keys(gruppi).length) {
                stampaDomanda();
            }
        } else {
            // Nascondi il questionario e mostra il tasto "Vedi Risultato"
            document.querySelector('.questionario').style.display = 'none';
            document.getElementById('fineButton').style.display = 'block'; // Mostra il pulsante "Vedi Risultato"

            // Mostra il commento senza inviare i dati (se necessario)
            mostraCommento();
        }
    }
}


// Fattori di emissione
const emissionePerKWh = 0.4;  // kg di CO2 per kWh
const consumoPerOra = 0.1;     // kWh per ora di utilizzo
const emissionePerLitroBenzina = 2.3; // kg di CO2 per litro di benzina

// Funzione per calcolare le emissioni di CO2 e la conversione in benzina
function calcolaImpattoAmbientale(ore) {
    // Calcoliamo il consumo energetico
    const kWh = ore * consumoPerOra;

    // Calcoliamo la CO2 prodotta
    const co2Prodotta = kWh * emissionePerKWh;

    // Calcoliamo quanti litri di benzina equivalgono
    const litriBenzina = co2Prodotta / emissionePerLitroBenzina;

    return {
        co2Prodotta: co2Prodotta.toFixed(2),  // CO2 in kg
        litriBenzina: litriBenzina.toFixed(2)  // Litri di benzina
    };
}

// Funzione per calcolare l'inquinamento totale (CO2 e litri di benzina)
function calcolaInquinamento() {
    let totaleOre = {
        "Social": 0,
        "Streaming": 0,
        "Gaming": 0,
        "E-commerce": 0
    };

    // Sommiamo le ore per ogni gruppo
    Object.keys(risposteScelte).forEach(cat => {
        let categoria = Object.keys(totaleOre)[cat - 1];
        if (totaleOre[categoria] !== undefined) {
            Object.values(risposteScelte[cat]).forEach(punteggio => {
                totaleOre[categoria] += punteggio / 5; // 5 ore per ogni punteggio
            });
        }
    });

    // Calcoliamo CO2 e benzina
    let inquinamento = "";
    Object.keys(totaleOre).forEach(categoria => {
        const ore = totaleOre[categoria];
        const impatto = calcolaImpattoAmbientale(ore); // Usa la funzione che calcola CO2 e benzina
        inquinamento += `${categoria}: ${impatto.co2Prodotta} kg di CO2, equivalenti a ${impatto.litriBenzina} litri di benzina.\n`;
    });

    return inquinamento;
}



// Funzione per inviare i risultati tramite API
function inviaRisultatiAPI() {
    const risultati = {
        "Social": 0,
        "Streaming": 0,
        "Gaming": 0,
        "E-commerce": 0
    };

    Object.keys(risposteScelte).forEach(cat => {
        let categoria = Object.keys(risultati)[cat - 1];
        if (risultati[categoria] !== undefined) {
            risultati[categoria] += Object.values(risposteScelte[cat]).reduce((a, b) => a + b, 0);
        }
    });

    // Assicurati che i risultati siano validi prima di inviare
    if (Object.values(risultati).some(value => value !== undefined)) {
        fetch("http://185.6.242.121:7080/~inb5/merlini/api/dashboard/saveSurvey.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(risultati)
        })
            .then(response => response.json())
            .then(data => {
                console.log("Risultati inviati con successo", data);
                mostraCommento(); // Mostra il commento se l'API è stata inviata correttamente
            })
            .catch(error => {
                console.error("Errore durante la chiamata API:", error);
            });
    } else {
        console.error("Errore: Risultati non validi per l'invio API");
    }
}

// Funzione per mostrare il grafico grande
function mostraGraficoGrande() {
    const ctx = document.getElementById('pieChart').getContext('2d');
    pieChart.destroy(); // Distruggiamo il grafico precedente

    // Creiamo un nuovo grafico a torta grande
    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Social', 'Streaming', 'Gaming', 'E-commerce'],
            datasets: [{
                data: [0, 0, 0, 0], // Aggiorna con i risultati effettivi
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true, // Rendi il grafico responsive
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function mostraCommento() {
    // Nascondi il tasto "Vedi Risultato"
    document.getElementById('fineButton').style.display = 'none';

    // Mostra il grafico grande e il commento
    document.getElementById('graficoContainer').style.display = 'block';

    // Calcoliamo le ore totali per ogni categoria
    let totaleOre = {
        "Social": 0,
        "Streaming": 0,
        "Gaming": 0,
        "E-commerce": 0
    };

    // Sommiamo le ore per ogni gruppo
    Object.keys(risposteScelte).forEach(cat => {
        let categoria = Object.keys(totaleOre)[cat - 1];
        if (totaleOre[categoria] !== undefined) {
            Object.values(risposteScelte[cat]).forEach(punteggio => {
                totaleOre[categoria] += punteggio / 5; // 5 ore per ogni punteggio
            });
        }
    });

    // Calcoliamo il totale delle ore per tutte le categorie
    let totaleOreGlobali = 0;
    Object.keys(totaleOre).forEach(categoria => {
        totaleOreGlobali += totaleOre[categoria];
    });

    // Calcoliamo il consumo totale in kWh
    const kWhTotale = totaleOreGlobali * consumoPerOra;

    // Calcoliamo la CO2 prodotta
    const co2Totale = kWhTotale * emissionePerKWh;

    // Calcoliamo i litri di benzina equivalenti
    const litriBenzinaTotali = co2Totale / emissionePerLitroBenzina;

    // Calcoliamo il numero di alberi abbattuti (22 kg CO2 per albero)
    const alberiAbbattuti = co2Totale / 22;

    // Generiamo il commento
    let consumiCumulativi = `<h2>Impatto Ambientale Totale</h2>`;
    consumiCumulativi += `<p>Il tuo consumo complessivo di energia è stato valutato, ed ecco i risultati:</p>`;
    consumiCumulativi += `<p><span class="emphasis">${litriBenzinaTotali.toFixed(2)} litri</span> di benzina sono stati consumati.</p>`;
    consumiCumulativi += `<p>Questo è equivalente a circa <span class="emphasis">${alberiAbbattuti.toFixed(2)} alberi</span> abbattuti per la CO2 emessa.</p>`;
    consumiCumulativi += `<p>Ogni piccolo cambiamento che puoi fare può avere un grande impatto sul nostro pianeta. Considera di ridurre i tuoi consumi digitali per aiutare l'ambiente!</p>`;

    // Mostriamo i risultati
    document.getElementById('commento').innerHTML = consumiCumulativi;
}







// Avvia il questionario
stampaDomanda();
loadPieChart();



