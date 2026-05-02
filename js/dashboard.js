// ==========================================
// 1. LÓGICA DEL TEMPORIZADOR (POMODORO)
// ==========================================

// Variables del temporizador
let temporizador; // Guardará el intervalo
let tiempoRestante = 25 * 60; // 25 minutos en segundos
let enMarcha = false; // Para saber si está funcionando

// Seleccionar los elementos del HTML
const pantallaTiempo = document.getElementById('time-remaining');
const btnEmpezar = document.getElementById('start-btn');
const btnPausa = document.getElementById('pause-btn');
const btnReiniciar = document.getElementById('reset-btn');

// Función para actualizar los números en pantalla
function actualizarPantalla() {
    let minutos = Math.floor(tiempoRestante / 60);
    let segundos = tiempoRestante % 60;
    
    // Añadir un cero a la izquierda si es menor de 10 (ej: 09:05)
    if (minutos < 10) { minutos = "0" + minutos; }
    if (segundos < 10) { segundos = "0" + segundos; }
    
    pantallaTiempo.textContent = minutos + ":" + segundos;
}

// Función para iniciar el reloj
function iniciarTemporizador() {
    // Si ya está en marcha, no hacemos nada para evitar que vaya más rápido
    if (enMarcha) return; 
    
    enMarcha = true;
    temporizador = setInterval(function() {
        if (tiempoRestante > 0) {
            tiempoRestante--; // Restar un segundo
            actualizarPantalla();
        } else {
            // Cuando llega a cero
            clearInterval(temporizador);
            enMarcha = false;
            alert("¡Sessió completada! Bona feina."); // Mensaje en catalán para cuadrar con tu app
        }
    }, 1000); // 1000 milisegundos = 1 segundo
}

// Función para pausar
function pausarTemporizador() {
    clearInterval(temporizador); // Detiene la cuenta atrás
    enMarcha = false;
}

// Función para reiniciar a 25 minutos
function reiniciarTemporizador() {
    clearInterval(temporizador);
    enMarcha = false;
    tiempoRestante = 25 * 60;
    actualizarPantalla();
}

// Asignar las funciones a los botones
btnEmpezar.addEventListener('click', iniciarTemporizador);
btnPausa.addEventListener('click', pausarTemporizador);
btnReiniciar.addEventListener('click', reiniciarTemporizador);


// ==========================================
// 2. LÓGICA DE LAS ETIQUETAS (TAGS)
// ==========================================
// Hacemos que al hacer clic en una etiqueta, se marque como activa

const etiquetas = document.querySelectorAll('.tag-cloud .badge:not(.add-tag)');

etiquetas.forEach(function(etiqueta) {
    etiqueta.addEventListener('click', function() {
        // Primero le quitamos la clase 'active-tag' a TODAS las etiquetas
        etiquetas.forEach(function(et) {
            et.classList.remove('active-tag');
        });
        
        // Luego se la añadimos solo a la que hemos hecho clic
        this.classList.add('active-tag');
    });
});


// ==========================================
// 3. LÓGICA DE LAS PESTAÑAS (TABS)
// ==========================================
// Cambiar visualmente entre "Tasques del dia" y "Notes ràpides"

const pestanas = document.querySelectorAll('.tab');

pestanas.forEach(function(pestana) {
    pestana.addEventListener('click', function() {
        // Quitamos la clase 'active-tab' de todas
        pestanas.forEach(function(p) {
            p.classList.remove('active-tab');
        });
        
        // Se la ponemos a la clicada
        this.classList.add('active-tab');
    });
});