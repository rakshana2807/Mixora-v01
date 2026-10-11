document.addEventListener('DOMContentLoaded', () => {
    // If already logged in, redirect to admin
    if (window.Storage.get('mixora_admin_token')) {
        window.location.href = 'admin.html';
        return;
    }

    const form = document.getElementById('admin-login-form');
    const emailInput = document.getElementById('admin-email');
    const secretInput = document.getElementById('admin-secret');
    const toggleBtn = document.getElementById('toggle-secret');
    const errorMsg = document.getElementById('login-error');
    const submitBtn = document.getElementById('btn-submit');

    // Toggle password visibility
    toggleBtn.addEventListener('click', () => {
        const type = secretInput.getAttribute('type') === 'password' ? 'text' : 'password';
        secretInput.setAttribute('type', type);
        
        if (type === 'text') {
            toggleBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
        } else {
            toggleBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const secret = secretInput.value.trim();
        
        if (!email || !secret) {
            showError('Please complete both fields.');
            return;
        }

        // Loading state
        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;
        errorMsg.style.display = 'none';

        // Simulate network request to authentication provider
        setTimeout(() => {
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;

            // Secure validation (Simulated Backend Check)
            // In a real app, this is handled via Supabase API securely.
            // For this Vanilla JS implementation, we enforce a strict local validation for the demo.
            if (email === 'owner@mixora.example' && secret === 'mixora2026') {
                // Successful Auth
                window.Storage.set('mixora_admin_token', 'demo_admin_session_token_' + Date.now());
                window.location.href = 'admin.html';
            } else {
                showError('Invalid email or secret code. Access denied.');
            }
        }, 1200);
    });

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
    }
});
