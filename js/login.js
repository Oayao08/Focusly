        // CONFIGURACIÓ SUPABASE (Substitueix amb les teves dades)
        const SUPABASE_URL = 'LA_TEVA_URL_DE_SUPABASE';
        const SUPABASE_KEY = 'LA_TEVA_ANON_KEY_DE_SUPABASE';
        const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

        // Canviar entre login i registre
        function toggleAuth() {
            document.getElementById('login-section').classList.toggle('hidden');
            document.getElementById('register-section').classList.toggle('hidden');
            document.getElementById('message').innerText = '';
        }

        async function handleRegister() {
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const msg = document.getElementById('message');

            const { data, error } = await supabase.auth.signUp({ email, password });

            if (error) {
                msg.innerText = error.message;
                msg.className = 'status-msg error';
            } else {
                msg.innerText = "Revisa el teu correu per confirmar el compte!";
                msg.className = 'status-msg success';
            }
        }

        async function handleLogin() {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const msg = document.getElementById('message');

            const { data, error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                msg.innerText = error.message;
                msg.className = 'status-msg error';
            } else {
                msg.innerText = "Sessió iniciada correctament. Redirigint...";
                msg.className = 'status-msg success';
                setTimeout(() => window.location.href = '../app/index.html', 1500);
            }
        }