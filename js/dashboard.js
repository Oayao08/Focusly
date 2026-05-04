// Esperar a que todo el HTML cargue antes de ejecutar el script
document.addEventListener('DOMContentLoaded', function() {

    // ==========================================
    // 1. POMODORO
    // ==========================================
    
    let temporizador; 
    let tiempoRestante = 25 * 60; // 25 minutos en segundos
    let enMarcha = false; 

    // Seleccionar los elementos del HTML
    const pantallaTiempo = document.getElementById('time-remaining');
    const btnEmpezar = document.getElementById('start-btn');
    const btnPausa = document.getElementById('pause-btn');
    const btnReiniciar = document.getElementById('reset-btn');

    // Función para actualizar los números en pantalla y en la pestaña del navegador
    function actualizarPantalla() {
        let minutos = Math.floor(tiempoRestante / 60);
        let segundos = tiempoRestante % 60;
        
        if (minutos < 10) { minutos = "0" + minutos; }
        if (segundos < 10) { segundos = "0" + segundos; }
        
        let tiempoFormateado = minutos + ":" + segundos;
        
        pantallaTiempo.textContent = tiempoFormateado;
        document.title = tiempoFormateado + " - Focusly"; // Muestra el tiempo en la pestaña
    }

    // Función para iniciar el reloj
    function iniciarTemporizador() {
        if (enMarcha) return; 
        
        enMarcha = true;
        btnEmpezar.textContent = "Sessió en curs..."; // Feedback visual
        
        temporizador = setInterval(function() {
            if (tiempoRestante > 0) {
                tiempoRestante--; 
                actualizarPantalla();
            } else {
                // Cuando llega a cero
                clearInterval(temporizador);
                enMarcha = false;
                btnEmpezar.textContent = "Començar sessió";
                alert("¡Sessió completada! Bona feina."); 
            }
        }, 1000); 
    }

    // Función para pausar
    function pausarTemporizador() {
        clearInterval(temporizador); 
        enMarcha = false;
        if (tiempoRestante > 0 && tiempoRestante < 25 * 60) {
            btnEmpezar.textContent = "Reprendre sessió"; // Cambia el texto al pausar
        }
    }

    // Función para reiniciar a 25 minutos
    function reiniciarTemporizador() {
        clearInterval(temporizador);
        enMarcha = false;
        tiempoRestante = 25 * 60;
        btnEmpezar.textContent = "Començar sessió";
        actualizarPantalla();
    }

    // Asignar las funciones a los botones
    btnEmpezar.addEventListener('click', iniciarTemporizador);
    btnPausa.addEventListener('click', pausarTemporizador);
    btnReiniciar.addEventListener('click', reiniciarTemporizador);


    //ETIQUETAS TAGS
    
    const contenedorEtiquetas = document.querySelector('.tag-cloud');
    const btnNuevaEtiqueta = document.querySelector('.add-tag');

    // Usar delegación de eventos en el contenedor para que funcione con etiquetas nuevas
    contenedorEtiquetas.addEventListener('click', function(evento) {
        // Comprobar si el clic fue en un botón de etiqueta (y no en el de "+ Nova")
        if (evento.target.classList.contains('badge') && !evento.target.classList.contains('add-tag')) {
            
            // Quitar la clase activa a todas
            const todasLasEtiquetas = document.querySelectorAll('.tag-cloud .badge:not(.add-tag)');
            todasLasEtiquetas.forEach(function(et) {
                et.classList.remove('active-tag');
            });
            
            // Se la ponemos solo a la que recibió el clic
            evento.target.classList.add('active-tag');
        }
    });

    // Lógica para añadir una nueva etiqueta
    btnNuevaEtiqueta.addEventListener('click', function() {
        let nombreEtiqueta = prompt("Introdueix el nom de la nova etiqueta:");
        
        // Si el usuario escribió algo y no canceló
        if (nombreEtiqueta && nombreEtiqueta.trim() !== "") {
            let nuevoBoton = document.createElement('button');
            nuevoBoton.className = 'badge';
            nuevoBoton.textContent = nombreEtiqueta.trim();
            
            // Insertar el nuevo botón justo antes del botón "+ Nova"
            contenedorEtiquetas.insertBefore(nuevoBoton, btnNuevaEtiqueta);
        }
    });

    
    const pestanas = document.querySelectorAll('.tab');
    const tituloEspacio = document.querySelector('.empty-state h2');
    const textoEspacio = document.querySelector('.empty-state p');

    pestanas.forEach(function(pestana) {
        pestana.addEventListener('click', function() {
            //  Eliminar  clase 'active-tab' de todas
            pestanas.forEach(function(p) {
                p.classList.remove('active-tab');
            });
            
            // Poner a la clicada
            this.classList.add('active-tab');

            // texto del centro para que la pestaña haga algo visualmente
            if (this.textContent === "Tasques del dia") {
                tituloEspacio.textContent = "Tot en ordre";
                textoEspacio.textContent = "Encara no tens cap tasca programada per a aquesta sessió. Aprofita per planificar el teu dia amb claredat.";
            } else {
                tituloEspacio.textContent = "Notes ràpides";
                textoEspacio.textContent = "Aquest és un espai lliure per apuntar idees, recordatoris o distraccions durant la teva sessió.";
            }
        });
    });

    // Inicializar la pantalla del reloj al cargar por primera vez
    actualizarPantalla();

});