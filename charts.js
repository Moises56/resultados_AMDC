// Registrar plugin datalabels
Chart.register(ChartDataLabels);

// Configuración común para las gráficas
Chart.defaults.color = '#fff';
Chart.defaults.font.family = 'Inter';

// Función para cambiar tema
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const icon = document.querySelector('.theme-icon');
    const isLight = document.body.classList.contains('light-theme');
    
    if (isLight) {
        icon.textContent = '☀️';
        Chart.defaults.color = '#1a1a2e';
    } else {
        icon.textContent = '🌙';
        Chart.defaults.color = '#fff';
    }
    
    // Actualizar todas las gráficas con colores correctos
    Object.values(Chart.instances).forEach(function(chart) {
        // Actualizar colores de escalas si existen
        if (chart.options.scales) {
            if (chart.options.scales.x) {
                chart.options.scales.x.ticks.color = isLight ? '#1a1a2e' : '#fff';
                chart.options.scales.x.grid.color = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
            }
            if (chart.options.scales.y) {
                chart.options.scales.y.ticks.color = isLight ? '#1a1a2e' : '#fff';
                chart.options.scales.y.grid.color = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
            }
        }
        // Actualizar color del título
        if (chart.options.plugins && chart.options.plugins.title) {
            chart.options.plugins.title.color = isLight ? '#1a1a2e' : '#fff';
        }
        chart.update();
    });
}

// Colores para todos los partidos
const COLORS = {
    libre: '#dc3545',
    pnh: '#007bff',
    plh: '#ffc107',
    dc: '#28a745',
    pinu: '#ff9800'
};

// Datos completos de las 430 actas
const data430 = { 
    libre: 36249, 
    pnh: 35004,
    plh: 18794,
    dc: 2543,
    pinu: 1846
};

// Datos de las 5 actas
const data5 = { 
    libre: 416, 
    pnh: 383,
    plh: 202,
    dc: 36,
    pinu: 15
};

// Datos de las 435 actas
const data435 = { 
    libre: 36665, 
    pnh: 35387,
    plh: 18996,
    dc: 2579,
    pinu: 1861
};

// Datos CNE publicado (solo LIBRE y PNH disponibles)
const dataCNE = { libre: 163577, pnh: 164465 };

// Datos 2441 actas
const data2441 = { libre: 200242, pnh: 199852 };

// Función para crear gráfica de dona con todos los partidos
function createDonutChart(canvasId, data) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['LIBRE', 'PNH', 'PLH', 'DC', 'PINU'],
            datasets: [{
                data: [data.libre, data.pnh, data.plh, data.dc, data.pinu],
                backgroundColor: [COLORS.libre, COLORS.pnh, COLORS.plh, COLORS.dc, COLORS.pinu],
                borderColor: '#1a1a2e',
                borderWidth: 2,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '50%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return `${context.label}: ${context.raw.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Crear gráficas de dona para cada sección
createDonutChart('chart430', data430);
createDonutChart('chart5', data5);
createDonutChart('chart435', data435);

// Gráfica de barras - Total 435 Actas por partido
const ctxComparison = document.getElementById('chartComparison').getContext('2d');

new Chart(ctxComparison, {
    type: 'bar',
    data: {
        labels: ['LIBRE', 'PNH', 'PLH', 'DC', 'PINU'],
        datasets: [{
            label: 'Votos en 435 Actas',
            data: [data435.libre, data435.pnh, data435.plh, data435.dc, data435.pinu],
            backgroundColor: [COLORS.libre, COLORS.pnh, COLORS.plh, COLORS.dc, COLORS.pinu],
            borderRadius: 8,
            barPercentage: 0.7
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 30
            }
        },
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'TOTAL VOTOS EN 435 ACTAS CON INCONSISTENCIAS',
                font: {
                    size: 18,
                    weight: '700'
                },
                padding: {
                    bottom: 20
                }
            },
            datalabels: {
                color: function(context) {
                    return document.body.classList.contains('light-theme') ? '#1a1a2e' : '#fff';
                },
                anchor: 'end',
                align: 'top',
                offset: 5,
                font: {
                    weight: 'bold',
                    size: 14
                },
                formatter: function(value) {
                    return value.toLocaleString();
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 14,
                        weight: '700'
                    }
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255,255,255,0.1)'
                },
                ticks: {
                    callback: function(value) {
                        return value.toLocaleString();
                    },
                    font: {
                        size: 11
                    }
                }
            }
        }
    }
});

// Animación de entrada para los elementos
document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .escrutinio-card, .result-box').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
});
