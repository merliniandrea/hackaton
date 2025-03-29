document.addEventListener("DOMContentLoaded", function () {
    // Funzione per caricare il grafico a barre (consumo digitale del giorno)
    async function loadBarChart() {
        const userId = localStorage.getItem("userId");

        const apiUrl = `http://185.6.242.121:7080/~inb5/merlini/api/dashboard/bar.php?id=${userId}&date=2025-03-26`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.error) {
                console.error("Errore API:", data.error);
                return;
            }

            const reportData = data.data;
            const labels = ["Social", "Streaming", "Gaming", "E-Commerce"];
            const values = [
                reportData.social,
                reportData.streaming,
                reportData.gaming,
                reportData.ecommerce
            ];

            const ctx = document.getElementById('barChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Consumo digitale',
                        data: values,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: false // Nasconde la legenda
                        }
                    }
                }
            });
        } catch (error) {
            console.error("Errore nel recupero dati:", error);
        }
    }

    // Funzione per caricare il grafico a torta (report settimanale)
    async function loadPieChart() {
        const userId = localStorage.getItem("userId");
        const weekStart = "2025-03-18"; // Data di inizio settimana
        const apiUrl = `http://185.6.242.121:7080/~inb5/merlini/api/dashboard/pie.php?id=${userId}&week_start=${weekStart}`;

        try {
            const response = await fetch(apiUrl);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Errore sconosciuto");
            }

            const data = result.data;
            const ctx = document.getElementById('weeklyPieChart').getContext('2d');

            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Social', 'Streaming', 'Gaming', 'E-commerce'],
                    datasets: [{
                        data: [data.social, data.streaming, data.gaming, data.ecommerce],
                        backgroundColor: ['#ff6384', '#ffce56', '#4bc0c0', '#9966ff'],
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    },
                    plugins: {
                        legend: {
                            position: 'bottom',
                        },
                        datalabels: {
                            color: '#fff',
                            font: {
                                weight: 'bold',
                                size: 14
                            },
                            formatter: (value, ctx) => {
                                let total = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                                let percentage = ((value / total) * 100).toFixed(1) + "%";
                                return percentage;
                            }
                        }
                    }
                },
                plugins: [ChartDataLabels] // Aggiunge percentuali sopra il grafico
            });
        } catch (error) {
            console.error("Errore nel recupero dati:", error);
            alert("Errore nel caricamento del report settimanale.");
        }
    }

    


    // Carica entrambi i grafici
    loadBarChart();
    loadPieChart();
    loadRank();
});
