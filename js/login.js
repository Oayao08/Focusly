// 1. CONFIGURACIÓN (REEMPLAZA ESTO)
const SUPABASE_URL = "TU_URL_DE_SUPABASE";
const SUPABASE_KEY = "TU_ANON_KEY";
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

  const { data, error } = await supabaseClient.auth.signUp({ email, password });

  if (error) {
    msg.innerText = "Error: " + error.message;
    msg.className = "status-msg error";
  } else {
    // IMPORTANTE: Si en Supabase tienes "Confirm Email" activado,
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
    setTimeout(() => (window.location.href = "../app/app.html"), 1000);
  }
}
