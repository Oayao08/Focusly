document.addEventListener("DOMContentLoaded", function () {

  var DURACIO_FOCUS = 25 * 60;
  var DURACIO_PAUSA = 5 * 60;
  var CIRCUMFERENCIA = 2 * Math.PI * 70; // r=70

  var temporizador;
  var tempsRestant = DURACIO_FOCUS;
  var enMarcha = false;
  var sessioDeFocus = true;
  var sessionsCompletades = 0;

  var pantallaTemps = document.getElementById("time-remaining");
  var etiLabel = document.getElementById("timer-label");
  var etiPhase = document.getElementById("session-phase");
  var ringProgress = document.getElementById("ring-progress");
  var btnEmpezar = document.getElementById("start-btn");
  var btnPausa = document.getElementById("pause-btn");
  var btnReiniciar = document.getElementById("reset-btn");
  var footerSessions = document.getElementById("footer-sessions");

  ringProgress.style.strokeDasharray = CIRCUMFERENCIA;
  ringProgress.style.strokeDashoffset = 0;

  function actualitzarPantalla() {
    var minuts = Math.floor(tempsRestant / 60);
    var segons = tempsRestant % 60;
    var text =
      (minuts < 10 ? "0" : "") +
      minuts +
      ":" +
      (segons < 10 ? "0" : "") +
      segons;
    pantallaTemps.textContent = text;
    document.title = text + " — Focusly";

    var duracio = sessioDeFocus ? DURACIO_FOCUS : DURACIO_PAUSA;
    var progres = (duracio - tempsRestant) / duracio;
    ringProgress.style.strokeDashoffset = CIRCUMFERENCIA * (1 - progres);
    ringProgress.style.stroke = sessioDeFocus ? "#3b5bdb" : "#2f9e44";
  }

  function actualitzarDots() {
    for (var i = 0; i < 4; i++) {
      var dot = document.getElementById("dot-" + i);
      if (dot) {
        dot.className =
          "session-dot" + (i < sessionsCompletades ? " done" : "");
      }
    }
    if (footerSessions) footerSessions.textContent = sessionsCompletades;
  }

  function iniciarTemporizador() {
    if (enMarcha) return;
    enMarcha = true;
    btnEmpezar.textContent = sessioDeFocus
      ? "Sessió en curs…"
      : "Pausa en curs…";

    temporizador = setInterval(function () {
      if (tempsRestant > 0) {
        tempsRestant--;
        actualitzarPantalla();
      } else {
        clearInterval(temporizador);
        enMarcha = false;

        if (sessioDeFocus) {
          sessionsCompletades = Math.min(sessionsCompletades + 1, 4);
          actualitzarDots();
          sessioDeFocus = false;
          tempsRestant = DURACIO_PAUSA;
          etiLabel.textContent = "pausa activa";
          etiPhase.textContent = "Temps de recuperació";
          btnEmpezar.textContent = "Iniciar pausa";
          canviarInsight();
        } else {
          sessioDeFocus = true;
          tempsRestant = DURACIO_FOCUS;
          etiLabel.textContent = "concentració";
          etiPhase.textContent = "Sessió de treball";
          btnEmpezar.textContent = "Començar sessió";
        }
        actualitzarPantalla();
        alert(
          sessioDeFocus
            ? "Pausa acabada. A treballar!"
            : "Sessió completada. Bona feina! 🎉",
        );
      }
    }, 1000);
  }

  function pausarTemporizador() {
    if (!enMarcha) return;
    clearInterval(temporizador);
    enMarcha = false;
    btnEmpezar.textContent = sessioDeFocus
      ? "Reprendre sessió"
      : "Reprendre pausa";
  }

  function reiniciarTemporizador() {
    clearInterval(temporizador);
    enMarcha = false;
    sessioDeFocus = true;
    tempsRestant = DURACIO_FOCUS;
    etiLabel.textContent = "concentració";
    etiPhase.textContent = "Sessió de treball";
    btnEmpezar.textContent = "Començar sessió";
    actualitzarPantalla();
  }

  btnEmpezar.addEventListener("click", iniciarTemporizador);
  btnPausa.addEventListener("click", pausarTemporizador);
  btnReiniciar.addEventListener("click", reiniciarTemporizador);
  actualitzarPantalla();
  actualitzarDots();


  var insights = [
    {
      text: "La creativitat augmenta un 31% quan el cervell opera des del positivisme en lloc de l'estrès.",
      autor: "Dr. Shawn Achor, Harvard",
    },
    {
      text: "25 minuts de focus seguits d'una pausa curta milloren la retenció de memòria fins un 40%.",
      autor: "Dra. Barbara Oakley, Learning How to Learn",
    },
    {
      text: "Caminar 10 minuts a l'aire lliure redueix el cortisol i augmenta la creativitat en un 81%.",
      autor: "Stanford University, 2014",
    },
    {
      text: "Les persones que fan pauses actives recuperen el 23% del rendiment perdut per la fatiga mental.",
      autor: "Journal of Applied Psychology",
    },
  ];
  var indexInsight = 0;

  function canviarInsight() {
    indexInsight = (indexInsight + 1) % insights.length;
    var el = document.getElementById("insight-text");
    var autor = document.getElementById("insight-author");
    if (el) el.textContent = "\u201C" + insights[indexInsight].text + "\u201D";
    if (autor) autor.textContent = "\u2014 " + insights[indexInsight].autor;
  }

  var tagCloud = document.getElementById("tag-cloud");

  tagCloud.addEventListener("click", function (e) {
    var btn = e.target;
    if (!btn.classList.contains("tag")) return;
    if (btn.classList.contains("add")) {
      var nom = prompt("Nom de la nova etiqueta:");
      if (nom && nom.trim()) {
        var nouBtn = document.createElement("button");
        nouBtn.className = "tag";
        nouBtn.textContent = nom.trim();
        tagCloud.insertBefore(nouBtn, tagCloud.querySelector(".add"));
      }
      return;
    }
    tagCloud.querySelectorAll(".tag").forEach(function (t) {
      t.classList.remove("active");
    });
    btn.classList.add("active");
  });

  var tabs = document.querySelectorAll(".tab");
  var panels = {
    tasques: "tab-tasques",
    notes: "tab-notes",
    habits: "tab-habits",
  };

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        t.classList.remove("active");
      });
      tab.classList.add("active");

      var key = tab.getAttribute("data-tab");
      Object.keys(panels).forEach(function (k) {
        var el = document.getElementById(panels[k]);
        if (el) el.style.display = k === key ? "block" : "none";
      });

      // Hàbit panel needs flex override
      if (key === "habits") {
        document.getElementById("tab-habits").style.display = "block";
      }
    });
  });

  var taskList = document.getElementById("task-list");
  var taskInput = document.getElementById("task-input");
  var addTaskBtn = document.getElementById("add-task-btn");
  var emptyTasques = document.getElementById("empty-tasques");
  var tasquesCount = document.getElementById("tasques-count");
  var tasquesDone = document.getElementById("tasques-done");
  var tasquesBar = document.getElementById("tasques-bar");
  var doneBar = document.getElementById("done-bar");

  function actualitzarStatsTasques() {
    var total = taskList.querySelectorAll("li").length;
    var completades = taskList.querySelectorAll("input:checked").length;
    tasquesCount.textContent = total;
    tasquesDone.textContent = completades;
    tasquesBar.style.width = total > 0 ? "100%" : "0%";
    doneBar.style.width =
      total > 0 ? Math.round((completades / total) * 100) + "%" : "0%";
    emptyTasques.style.display = total === 0 ? "flex" : "none";
  }

  function afegirTasca(text) {
    if (!text || !text.trim()) return;

    var li = document.createElement("li");
    li.className = "task-item";

    var cb = document.createElement("input");
    cb.type = "checkbox";
    cb.className = "task-cb";

    var span = document.createElement("span");
    span.className = "task-text";
    span.textContent = text.trim();

    cb.addEventListener("change", function () {
      span.classList.toggle("done", cb.checked);
      actualitzarStatsTasques();
    });

    var del = document.createElement("button");
    del.className = "task-del";
    del.textContent = "✕";
    del.addEventListener("click", function () {
      li.remove();
      actualitzarStatsTasques();
    });

    li.appendChild(cb);
    li.appendChild(span);
    li.appendChild(del);
    taskList.appendChild(li);
    actualitzarStatsTasques();
  }

  addTaskBtn.addEventListener("click", function () {
    afegirTasca(taskInput.value);
    taskInput.value = "";
    taskInput.focus();
  });

  taskInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      afegirTasca(taskInput.value);
      taskInput.value = "";
    }
  });

  actualitzarStatsTasques();

  var noteList = document.getElementById("note-list");
  var noteInput = document.getElementById("note-input");
  var addNoteBtn = document.getElementById("add-note-btn");
  var emptyNotes = document.getElementById("empty-notes");

  function actualitzarEmptyNotes() {
    emptyNotes.style.display =
      noteList.querySelectorAll("li").length === 0 ? "flex" : "none";
  }

  function afegirNota(text) {
    if (!text || !text.trim()) return;

    var li = document.createElement("li");
    li.className = "task-item";

    var bullet = document.createElement("span");
    bullet.textContent = "•";
    bullet.style.cssText =
      "color:var(--text-3);font-size:1.2rem;flex-shrink:0;";

    var span = document.createElement("span");
    span.className = "task-text";
    span.textContent = text.trim();

    var del = document.createElement("button");
    del.className = "task-del";
    del.textContent = "✕";
    del.addEventListener("click", function () {
      li.remove();
      actualitzarEmptyNotes();
    });

    li.appendChild(bullet);
    li.appendChild(span);
    li.appendChild(del);
    noteList.appendChild(li);
    actualitzarEmptyNotes();
  }

  addNoteBtn.addEventListener("click", function () {
    afegirNota(noteInput.value);
    noteInput.value = "";
    noteInput.focus();
  });

  noteInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      afegirNota(noteInput.value);
      noteInput.value = "";
    }
  });

  actualitzarEmptyNotes();


  var moodMissatges = {
    Cansat: "Prova la respiració 4-7-8 per recuperar energia.",
    Estressat: "Fes una pausa activa de 5 min. El teu cervell t'ho agrairà.",
    Neutre: "Bon moment per establir una intenció de sessió clara.",
    Bé: "Perfecte estat per a feina creativa o d'alta concentració.",
    Motivat: "Aprofita aquesta energia! Ataca la tasca més important.",
  };

  var moodBtns = document.querySelectorAll(".mood-btn");
  var moodFeedback = document.getElementById("mood-feedback");
  var footerMoodChip = document.getElementById("footer-mood-chip");

  moodBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      moodBtns.forEach(function (b) {
        b.classList.remove("selected");
      });
      btn.classList.add("selected");
      var mood = btn.getAttribute("data-mood");
      moodFeedback.textContent = moodMissatges[mood] || "";
      if (footerMoodChip) {
        footerMoodChip.textContent = btn.textContent + " " + mood;
        footerMoodChip.style.display = "inline-flex";
      }
    });
  });
});
