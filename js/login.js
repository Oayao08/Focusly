const SUPABASE_URL = "https://jfwutdlgumqwpqythmyq.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impmd3V0ZGxndW1xd3BxeXRobXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MTA1MTQsImV4cCI6MjA5MzI4NjUxNH0.DvnVJMXADKYJhuRX19sUYwmfG3nheqG8bA0naw_NZ68";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function toggleAuth() {
  document.getElementById("login-section").classList.toggle("hidden");
  document.getElementById("register-section").classList.toggle("hidden");
  document.getElementById("message").innerText = "";
}

// REGISTRO
async function handleRegister() {
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;
  const msg = document.getElementById("message");

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        "https://automatic-guide-g46xg5wvvgwx2w6j-5501.app.github.dev/app/index.html",
    },
  });

  if (error) {
    msg.innerText = "Error: " + error.message;
    msg.className = "status-msg error";
  } else {
    // IMPORTANTE: Si en Supabase "Confirm Email" activado,
    // el usuario no podrá loguearse hasta que haga clic en el link de su correo.
    msg.innerText = "Compte creat! Revisa el teu correu per confirmar.";
    msg.className = "status-msg success";
  }
}

// LOGIN
async function handleLogin() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const msg = document.getElementById("message");

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    msg.innerText = "Error: " + error.message;
    msg.className = "status-msg error";
  } else {
    msg.innerText = "Sessió iniciada. Redirigint...";
    msg.className = "status-msg success";
    setTimeout(() => (window.location.href = "app.html"), 1000);
  }
}
