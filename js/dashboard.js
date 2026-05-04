// Esperar a que todo el HTML cargue antes de ejecutar el script
document.addEventListener("DOMContentLoaded", function () {
  // ==========================================
  // 1. POMODORO (Temporizador)
  // ==========================================

  let temporizador;
  let tiempoRestante = 25 * 60; // 25 minutos en segundos
  let enMarcha = false;

  const pantallaTiempo = document.getElementById("time-remaining");
  const btnEmpezar = document.getElementById("start-btn");
  const btnPausa = document.getElementById("pause-btn");
  const btnReiniciar = document.getElementById("reset-btn");

  function actualizarPantalla() {
    let minutos = Math.floor(tiempoRestante / 60);
    let segundos = tiempoRestante % 60;

    if (minutos < 10) {
      minutos = "0" + minutos;
    }
    if (segundos < 10) {
      segundos = "0" + segundos;
    }

    let tiempoFormateado = minutos + ":" + segundos;

    pantallaTiempo.textContent = tiempoFormateado;
    document.title = tiempoFormateado + " - Focusly";
  }

  // Iniciar o REANUDAR el temporizador
  function iniciarTemporizador() {
    if (enMarcha) return; // Si ya está corriendo, no hacemos nada

    enMarcha = true;
    btnEmpezar.textContent = "Sessió en curs...";

    temporizador = setInterval(function () {
      if (tiempoRestante > 0) {
        tiempoRestante--;
        actualizarPantalla();
      } else {
        clearInterval(temporizador);
        enMarcha = false;
        btnEmpezar.textContent = "Començar sessió";
        alert("¡Sessió completada! Bona feina.");
      }
    }, 1000);
  }

  // Pausar el temporizador
  function pausarTemporizador() {
    if (!enMarcha) return; // Si ya está pausado, no hacemos nada

    clearInterval(temporizador);
    enMarcha = false;
    btnEmpezar.textContent = "Reprendre sessió"; // Indica al usuario que puede continuar
  }

  // Reiniciar a 25 minutos
  function reiniciarTemporizador() {
    clearInterval(temporizador);
    enMarcha = false;
    tiempoRestante = 25 * 60;
    btnEmpezar.textContent = "Començar sessió";
    actualizarPantalla();
  }

  btnEmpezar.addEventListener("click", iniciarTemporizador);
  btnPausa.addEventListener("click", pausarTemporizador);
  btnReiniciar.addEventListener("click", reiniciarTemporizador);

  // ==========================================
  // 2. ETIQUETAS (TAGS)
  // ==========================================

  const contenedorEtiquetas = document.querySelector(".tag-cloud");
  const btnNuevaEtiqueta = document.querySelector(".add-tag");

  contenedorEtiquetas.addEventListener("click", function (evento) {
    if (
      evento.target.classList.contains("badge") &&
      !evento.target.classList.contains("add-tag")
    ) {
      const todasLasEtiquetas = document.querySelectorAll(
        ".tag-cloud .badge:not(.add-tag)",
      );
      todasLasEtiquetas.forEach(function (et) {
        et.classList.remove("active-tag");
      });
      evento.target.classList.add("active-tag");
    }
  });

  btnNuevaEtiqueta.addEventListener("click", function () {
    let nombreEtiqueta = prompt("Introdueix el nom de la nova etiqueta:");
    if (nombreEtiqueta && nombreEtiqueta.trim() !== "") {
      let nuevoBoton = document.createElement("button");
      nuevoBoton.className = "badge";
      nuevoBoton.textContent = nombreEtiqueta.trim();
      contenedorEtiquetas.insertBefore(nuevoBoton, btnNuevaEtiqueta);
    }
  });

  // ==========================================
  // 3. PESTAÑAS, TAREAS Y NOTAS (ESPACIO DE TRABAJO)
  // ==========================================

  const pestanas = document.querySelectorAll(".tab");
  const workspaceContent = document.querySelector(".workspace-content");
  const emptyState = document.querySelector(".empty-state");
  const emptyTitulo = emptyState.querySelector("h2");
  const emptyTexto = emptyState.querySelector("p");

  // 3.1. Separar el botón del bloque "empty-state" para que siempre esté visible
  const btnAfegir = emptyState.querySelector(".btn-secondary");
  workspaceContent.appendChild(btnAfegir); // Lo movemos al final del workspace

  // 3.2. Crear las listas (<ul>) donde se guardarán las tareas y las notas
  const llistaTasques = document.createElement("ul");
  llistaTasques.style.listStyle = "none";
  llistaTasques.style.padding = "0";
  llistaTasques.style.marginTop = "20px";

  const llistaNotes = document.createElement("ul");
  llistaNotes.style.listStyle = "none";
  llistaNotes.style.padding = "0";
  llistaNotes.style.marginTop = "20px";
  llistaNotes.style.display = "none"; // Las notas están ocultas por defecto

  // Meter las listas en el workspace, antes del botón de añadir
  workspaceContent.insertBefore(llistaTasques, btnAfegir);
  workspaceContent.insertBefore(llistaNotes, btnAfegir);

  let modoActual = "Tasques del dia"; // Para saber en qué pestaña estamos

  // Función que decide qué texto mostrar dependiendo de si hay items o no
  function actualizarVistaWorkspace() {
    let itemsActuales =
      modoActual === "Tasques del dia"
        ? llistaTasques.children.length
        : llistaNotes.children.length;

    if (itemsActuales === 0) {
      emptyState.style.display = "block"; // Mostrar diseño vacío
      if (modoActual === "Tasques del dia") {
        emptyTitulo.textContent = "Tot en ordre";
        emptyTexto.textContent =
          "Encara no tens cap tasca programada per a aquesta sessió. Aprofita per planificar el teu dia amb claredat.";
        btnAfegir.textContent = "+ Afegeix una tasca";
      } else {
        emptyTitulo.textContent = "Notes ràpides";
        emptyTexto.textContent =
          "Aquest és un espai lliure per apuntar idees, recordatoris o distraccions durant la teva sessió.";
        btnAfegir.textContent = "+ Afegeix una nota";
      }
    } else {
      emptyState.style.display = "none"; // Ocultar diseño vacío si ya hay cosas
      btnAfegir.textContent =
        modoActual === "Tasques del dia"
          ? "+ Afegeix una altra tasca"
          : "+ Afegeix una altra nota";
    }
  }

  // Cambiar de pestaña visualmente y cambiar la lista
  pestanas.forEach(function (pestana) {
    pestana.addEventListener("click", function () {
      pestanas.forEach(function (p) {
        p.classList.remove("active-tab");
      });
      this.classList.add("active-tab");

      modoActual = this.textContent;

      // Mostrar la lista correcta
      if (modoActual === "Tasques del dia") {
        llistaTasques.style.display = "block";
        llistaNotes.style.display = "none";
      } else {
        llistaTasques.style.display = "none";
        llistaNotes.style.display = "block";
      }

      actualizarVistaWorkspace();
    });
  });

  // 3.3. Lógica para crear tareas o notas nuevas
  btnAfegir.addEventListener("click", function () {
    let texto = prompt(
      modoActual === "Tasques del dia" ? "Escriu la tasca:" : "Escriu la nota:",
    );

    if (texto && texto.trim() !== "") {
      // Crear el elemento de la lista (<li>)
      let li = document.createElement("li");
      li.style.padding = "12px 0";
      li.style.borderBottom = "1px solid #eaeaea";
      li.style.display = "flex";
      li.style.alignItems = "center";
      li.style.fontSize = "1.1rem";

      let textoItem = document.createElement("span");
      textoItem.textContent = texto;

      // Si es una tarea, le ponemos un checkbox
      if (modoActual === "Tasques del dia") {
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.style.marginRight = "12px";
        checkbox.style.transform = "scale(1.2)";
        checkbox.style.cursor = "pointer";

        // Efecto de tachado al marcar la tarea
        checkbox.addEventListener("change", function () {
          textoItem.style.textDecoration = this.checked
            ? "line-through"
            : "none";
          textoItem.style.color = this.checked ? "#aaa" : "#333";
        });

        li.appendChild(checkbox);
      } else {
        // Si es una nota, le ponemos un punto/viñeta
        let viñeta = document.createElement("span");
        viñeta.textContent = "• ";
        viñeta.style.marginRight = "12px";
        viñeta.style.color = "#888";
        viñeta.style.fontSize = "1.5rem";
        li.appendChild(viñeta);
      }

      li.appendChild(textoItem);

      // Botón para borrar la tarea/nota con una X roja
      let btnBorrar = document.createElement("button");
      btnBorrar.textContent = "✖";
      btnBorrar.style.marginLeft = "auto"; // Lo empuja a la derecha
      btnBorrar.style.background = "none";
      btnBorrar.style.border = "none";
      btnBorrar.style.color = "#ff4d4d";
      btnBorrar.style.cursor = "pointer";
      btnBorrar.style.fontSize = "1.1rem";

      btnBorrar.addEventListener("click", function () {
        li.remove(); // Borra el elemento
        actualizarVistaWorkspace(); // Comprueba si se ha quedado vacío para volver a mostrar el mensaje original
      });

      li.appendChild(btnBorrar);

      // Añadir el elemento a la lista que toque
      if (modoActual === "Tasques del dia") {
        llistaTasques.appendChild(li);
      } else {
        llistaNotes.appendChild(li);
      }

      // Actualizar la interfaz
      actualizarVistaWorkspace();
    }
  });

  // Inicialización final
  actualizarPantalla();
  actualizarVistaWorkspace();
});
