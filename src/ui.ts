import { Context } from 'hono';

export async function serveUI(c: Context) {
    const path = c.req.path;

    // Serve different pages based on path
    if (path === '/' || path === '/login') {
        return c.html(getLoginPage());
    } else if (path === '/dashboard') {
        return c.html(getDashboardPage());
    } else if (path === '/admin') {
        return c.html(getAdminPage());
    }

    return c.html(getLoginPage());
}

// --- Shared Styles & Scripts ---

function getSharedHead(title: string) {
    return `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="icon" type="image/png" href="/favicon.png">
    <style>
        :root {
            --primary: #6366f1;
            --primary-dark: #4f46e5;
            --secondary: #ec4899;
            --accent: #8b5cf6;
            --background: #0f172a;
            --surface: rgba(30, 41, 59, 0.7);
            --surface-light: rgba(51, 65, 85, 0.5);
            --text: #f8fafc;
            --text-muted: #94a3b8;
            --border: rgba(148, 163, 184, 0.1);
            --success: #10b981;
            --error: #ef4444;
            --radius: 16px;
            --shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            --glow: 0 0 20px rgba(99, 102, 241, 0.3);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Outfit', sans-serif;
            background-color: var(--background);
            background-image: 
                radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
                radial-gradient(at 100% 0%, rgba(236, 72, 153, 0.15) 0px, transparent 50%),
                radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.15) 0px, transparent 50%),
                radial-gradient(at 0% 100%, rgba(16, 185, 129, 0.15) 0px, transparent 50%);
            background-attachment: fixed;
            color: var(--text);
            min-height: 100vh;
            line-height: 1.6;
            overflow-x: hidden;
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: var(--surface-light);
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: var(--text-muted);
        }

        /* Utility Classes */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        .glass {
            background: var(--surface);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            box-shadow: var(--shadow);
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.75rem 1.5rem;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: none;
            font-size: 0.95rem;
            text-decoration: none;
            gap: 0.5rem;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--primary), var(--accent));
            color: white;
            box-shadow: var(--glow);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 0 30px rgba(99, 102, 241, 0.5);
        }

        .btn-secondary {
            background: var(--surface-light);
            color: var(--text);
            border: 1px solid var(--border);
        }

        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
        }
        
        .btn-danger {
            background: rgba(239, 68, 68, 0.2);
            color: #fca5a5;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }
        
        .btn-danger:hover {
            background: rgba(239, 68, 68, 0.3);
            color: #fff;
        }

        .input-group {
            margin-bottom: 1.5rem;
        }
        
        /* Mobile Navigation */
        .mobile-nav {
            display: none;
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(20px);
            border-top: 1px solid var(--border);
            padding: 0.75rem 1.5rem;
            justify-content: space-around;
            z-index: 100;
            padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
        }
        
        .mobile-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.25rem;
            color: var(--text-muted);
            text-decoration: none;
            font-size: 0.75rem;
            font-weight: 500;
            transition: all 0.2s;
        }
        
        .mobile-nav-item svg {
            width: 24px;
            height: 24px;
        }
        
        .mobile-nav-item.active {
            color: var(--primary);
        }

        label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--text-muted);
            font-size: 0.9rem;
            font-weight: 500;
        }

        input, select, textarea {
            width: 100%;
            padding: 0.875rem 1rem;
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid var(--border);
            border-radius: 12px;
            color: var(--text);
            font-family: inherit;
            font-size: 1rem;
            transition: all 0.2s;
        }

        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
            background: rgba(15, 23, 42, 0.8);
        }

        .fade-in {
            animation: fadeIn 0.5s ease-out forwards;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Toast/Message */
        .message {
            padding: 1rem;
            border-radius: 12px;
            margin-bottom: 1.5rem;
            display: none;
            font-weight: 500;
            animation: slideDown 0.3s ease;
        }
        
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .message.success {
            background: rgba(16, 185, 129, 0.2);
            color: #6ee7b7;
            border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .message.error {
            background: rgba(239, 68, 68, 0.2);
            color: #fca5a5;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }

        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            h1 {
                font-size: 1.75rem;
            }
            
            .mobile-nav {
                display: flex;
            }
            
            body {
                padding-bottom: 80px; /* Space for mobile nav */
            }
        }

        .rotating {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    </style>
  `;
}

// --- Login Page ---

function getLoginPage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    ${getSharedHead('Webmail - Login')}
    <style>
        .login-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            position: relative;
            overflow: hidden;
        }

        .login-card {
            width: 100%;
            max-width: 440px;
            padding: 2.5rem;
            position: relative;
            z-index: 10;
        }

        .brand {
            text-align: center;
            margin-bottom: 2rem;
        }

        .brand h1 {
            font-size: 2rem;
            font-weight: 700;
            background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
        }

        .brand p {
            color: var(--text-muted);
        }

        .tabs {
            display: flex;
            background: rgba(15, 23, 42, 0.5);
            padding: 0.25rem;
            border-radius: 14px;
            margin-bottom: 2rem;
        }

        .tab {
            flex: 1;
            text-align: center;
            padding: 0.75rem;
            border-radius: 12px;
            cursor: pointer;
            color: var(--text-muted);
            font-weight: 600;
            transition: all 0.3s;
        }

        .tab.active {
            background: var(--surface-light);
            color: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
            animation: fadeIn 0.4s ease;
        }

        .token-display {
            background: rgba(15, 23, 42, 0.8);
            padding: 1.5rem;
            border-radius: 12px;
            margin-top: 1.5rem;
            border: 1px dashed var(--primary);
            word-break: break-all;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            color: var(--text);
        }
        
        /* Background Orbs */
        .orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            z-index: 0;
            opacity: 0.6;
        }
        .orb-1 {
            width: 300px;
            height: 300px;
            background: var(--primary);
            top: -50px;
            left: -50px;
            animation: float 10s infinite ease-in-out;
        }
        .orb-2 {
            width: 250px;
            height: 250px;
            background: var(--secondary);
            bottom: -50px;
            right: -50px;
            animation: float 12s infinite ease-in-out reverse;
        }

        @keyframes float {
            0% { transform: translate(0, 0); }
            50% { transform: translate(20px, 40px); }
            100% { transform: translate(0, 0); }
        }

        @media (max-width: 768px) {
            body {
                padding-bottom: 0;
            }
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        
        <div class="glass login-card fade-in">
            <div class="brand">
                <h1>Webmail</h1>
                <p>Secure & Modern Email Management</p>
            </div>

            <div class="tabs">
                <div class="tab active" onclick="switchTab('login')">Login</div>
                <div class="tab" onclick="switchTab('register')">Register</div>
            </div>

            <div id="message" class="message"></div>

            <!-- Login Tab -->
            <div id="login-tab" class="tab-content active">
                <form onsubmit="handleLogin(event)">
                    <div class="input-group">
                        <label for="login-token">Access Token</label>
                        <input type="password" id="login-token" placeholder="Paste your access token here" required autocomplete="current-password">
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%">
                        <span>Access Dashboard</span>
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </button>
                </form>
                <p style="text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-muted);">
                    Use the token provided during registration.
                </p>
            </div>

            <!-- Register Tab -->
            <div id="register-tab" class="tab-content">
                <form onsubmit="handleRegister(event)">
                    <div style="text-align: center; margin-bottom: 2rem;">
                        <div style="width: 60px; height: 60px; background: rgba(99, 102, 241, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
                            <svg width="30" height="30" fill="none" stroke="var(--primary)" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                        </div>
                        <h3 style="margin-bottom: 0.5rem;">Create Account</h3>
                        <p style="color: var(--text-muted); font-size: 0.9rem;">Generate a secure access token to get started.</p>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%">Generate New Token</button>
                </form>
                
                <div id="new-token-display" class="token-display" style="display: none;">
                    <strong style="color: var(--primary); display: block; margin-bottom: 0.5rem;">Your Access Token:</strong>
                    <div id="token-value" style="margin-bottom: 1rem;"></div>
                    <p style="color: var(--error); font-size: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        Save this token immediately! It cannot be recovered.
                    </p>
                </div>
            </div>
        </div>
    </div>

    <script>
        const API_BASE = '/api';

        function switchTab(tab) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            
            if (tab === 'login') {
                document.querySelector('.tab:first-child').classList.add('active');
                document.getElementById('login-tab').classList.add('active');
            } else {
                document.querySelector('.tab:last-child').classList.add('active');
                document.getElementById('register-tab').classList.add('active');
            }
            
            hideMessage();
        }

        function showMessage(text, type) {
            const msg = document.getElementById('message');
            msg.textContent = text;
            msg.className = 'message ' + type;
            msg.style.display = 'block';
        }

        function hideMessage() {
            document.getElementById('message').style.display = 'none';
        }

        async function handleLogin(e) {
            e.preventDefault();
            const token = document.getElementById('login-token').value;

            try {
                const response = await fetch(API_BASE + '/user/me', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('token', token);
                    
                    if (data.is_admin) {
                        window.location.href = '/admin';
                    } else {
                        window.location.href = '/dashboard';
                    }
                } else {
                    showMessage('Invalid token', 'error');
                }
            } catch (error) {
                showMessage('Login failed', 'error');
            }
        }

        async function handleRegister(e) {
            e.preventDefault();

            try {
                const response = await fetch(API_BASE + '/user/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    document.getElementById('token-value').textContent = data.user.token;
                    document.getElementById('new-token-display').style.display = 'block';
                    showMessage('Account created successfully!', 'success');
                } else {
                    showMessage('Registration failed', 'error');
                }
            } catch (error) {
                showMessage('Registration failed', 'error');
            }
        }
    </script>
</body>
</html>`;
}

// --- Dashboard Page ---

function getDashboardPage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    ${getSharedHead('Dashboard - Webmail')}
    <style>
        .app-layout {
            display: grid;
            grid-template-columns: 280px 1fr;
            min-height: 100vh;
        }

        .sidebar {
            background: rgba(15, 23, 42, 0.4);
            backdrop-filter: blur(20px);
            border-right: 1px solid var(--border);
            padding: 2rem;
            display: flex;
            flex-direction: column;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: white;
            margin-bottom: 3rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .nav-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            color: var(--text-muted);
            text-decoration: none;
            border-radius: 12px;
            margin-bottom: 0.5rem;
            transition: all 0.2s;
            cursor: pointer;
        }

        .nav-item:hover, .nav-item.active {
            background: var(--surface-light);
            color: white;
        }

        .nav-item.active {
            background: linear-gradient(90deg, rgba(99, 102, 241, 0.2) 0%, transparent 100%);
            border-left: 3px solid var(--primary);
            border-radius: 4px 12px 12px 4px;
        }

        .main-content {
            padding: 2rem;
            overflow-y: auto;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }

        .user-profile {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            color: white;
        }

        .card-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .stat-card {
            padding: 1.5rem;
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }

        .stat-icon {
            width: 50px;
            height: 50px;
            border-radius: 14px;
            background: rgba(99, 102, 241, 0.1);
            color: var(--primary);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
        }

        .email-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .email-item {
            padding: 1.25rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.2s;
            cursor: pointer;
            border: 1px solid transparent;
        }

        .email-item:hover {
            background: var(--surface-light);
            border-color: var(--border);
            transform: translateX(5px);
        }

        .badge {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .badge-active { background: rgba(16, 185, 129, 0.2); color: #6ee7b7; }
        .badge-inactive { background: rgba(239, 68, 68, 0.2); color: #fca5a5; }

        /* Modal */
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            z-index: 100;
            display: none;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s;
        }

        .modal.open {
            display: flex;
            opacity: 1;
        }

        .modal-content {
            width: 90%;
            max-width: 600px;
            max-height: 85vh;
            overflow-y: auto;
            transform: scale(0.95);
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .modal.open .modal-content {
            transform: scale(1);
        }

        @media (max-width: 768px) {
            .app-layout {
                grid-template-columns: 1fr;
            }
            .sidebar {
                display: none;
            }
            .main-content {
                padding: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="app-layout">
        <aside class="sidebar">
            <div class="logo">
                <img src="/logo.png" alt="Logo" style="width: 32px; height: 32px; border-radius: 8px;">
                Webmail
            </div>
            
            <nav>
                <a class="nav-item active" onclick="showSection('dashboard')">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                    Dashboard
                </a>
                <a class="nav-item" onclick="showSection('emails')">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    Inbox
                </a>
                <a class="nav-item" onclick="showSection('send')">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                    Send Email
                </a>
            </nav>

            <div style="margin-top: auto;">
                <button onclick="logout()" class="btn btn-secondary" style="width: 100%;">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Logout
                </button>
            </div>
        </aside>
        
        <!-- Mobile Navigation -->
        <nav class="mobile-nav">
            <a class="mobile-nav-item active" onclick="showSection('dashboard')">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                Dashboard
            </a>
            <a class="mobile-nav-item" onclick="showSection('emails')">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                Inbox
            </a>
            <a class="mobile-nav-item" onclick="showSection('send')">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                Send
            </a>
            <a class="mobile-nav-item" onclick="logout()">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                Logout
            </a>
        </nav>

        <main class="main-content">
            <div class="header">
                <div>
                    <h2 style="font-size: 1.8rem; font-weight: 700;">Welcome Back</h2>
                    <p style="color: var(--text-muted);">Manage your temporary emails securely.</p>
                </div>
                <div class="user-profile">
                    <div class="avatar">U</div>
                </div>
            </div>

            <!-- Dashboard Section -->
            <div id="section-dashboard" style="display: none;" class="fade-in">
                <div class="card-grid">
                    <div class="glass stat-card">
                        <div class="stat-icon">
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
                        </div>
                        <div>
                            <h3 id="address-count" style="font-size: 1.5rem; font-weight: 700;">0</h3>
                            <p style="color: var(--text-muted);">Active Addresses</p>
                        </div>
                    </div>
                    <div class="glass stat-card">
                        <div class="stat-icon" style="color: var(--secondary); background: rgba(236, 72, 153, 0.1);">
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        <div>
                            <h3 id="email-count" style="font-size: 1.5rem; font-weight: 700;">0</h3>
                            <p style="color: var(--text-muted);">Total Emails</p>
                        </div>
                    </div>
                </div>

                <div class="glass" style="padding: 2rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                        <h3>Your Addresses</h3>
                        <button onclick="openCreateModal()" class="btn btn-primary">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                            New Address
                        </button>
                    </div>
                    <div id="address-list" class="email-list">
                        <!-- Populated by JS -->
                        <div style="text-align: center; padding: 2rem; color: var(--text-muted);">Loading addresses...</div>
                    </div>
                </div>
            </div>

            <!-- Emails Section -->
            <div id="section-emails" style="display: none;" class="fade-in">
                <div class="glass" style="padding: 2rem;">
                    <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                        <select id="address-filter" onchange="handleFilterChange()">
                            <option value="">All Addresses</option>
                        </select>
                        <button id="refresh-btn" onclick="loadEmails()" class="btn btn-secondary">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                        </button>
                    </div>
                    <div id="message-list" class="email-list">
                        <!-- Populated by JS -->
                    </div>
                </div>
            </div>
            
            <!-- Send Email Section -->
            <div id="section-send" style="display: none;" class="fade-in">
                <div class="glass" style="padding: 2rem; max-width: 800px; margin: 0 auto;">
                    <h2 style="margin-bottom: 1.5rem;">Send Email</h2>
                    <form onsubmit="handleSendEmail(event)">
                        <div class="input-group">
                            <label>From</label>
                            <select id="send-from" required>
                                <option value="">Select an address...</option>
                            </select>
                            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;">
                                Only addresses with approved send permission can be used.
                            </p>
                        </div>
                        <div class="input-group">
                            <label>To</label>
                            <input type="email" id="send-to" placeholder="recipient@example.com" required>
                        </div>
                        <div class="input-group">
                            <label>Subject</label>
                            <input type="text" id="send-subject" placeholder="Email subject" required>
                        </div>
                        <div class="input-group">
                            <label>Message</label>
                            <textarea id="send-body" style="min-height: 200px;" placeholder="Write your message here..." required></textarea>
                        </div>
                        <div style="display: flex; justify-content: flex-end;">
                            <button type="submit" class="btn btn-primary">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                                Send Email
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>

    <!-- Create Address Modal -->
    <div id="create-modal" class="modal">
        <div class="glass modal-content" style="padding: 2rem;">
            <h2 style="margin-bottom: 1.5rem;">Create New Address</h2>
            <form onsubmit="handleCreateAddress(event)">
                <div class="input-group">
                    <label>Address Prefix</label>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <input type="text" id="new-prefix" placeholder="e.g., contact" required pattern="[a-z0-9-]+" title="Lowercase letters, numbers, and hyphens only">
                        <span style="color: var(--text-muted);">@<span id="domain-suffix">...</span></span>
                    </div>
                </div>
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                    <button type="button" onclick="closeModal('create-modal')" class="btn btn-secondary">Cancel</button>
                    <button type="submit" class="btn btn-primary">Create</button>
                </div>
            </form>
        </div>
    </div>

    <!-- View Email Modal -->
    <div id="email-modal" class="modal">
        <div class="glass modal-content" style="padding: 0;">
            <div style="padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <h2 id="email-subject" style="margin-bottom: 0.5rem;">Subject</h2>
                    <div style="color: var(--text-muted); font-size: 0.9rem;">
                        From: <span id="email-from" style="color: var(--text);"></span><br>
                        To: <span id="email-to" style="color: var(--text);"></span>
                    </div>
                </div>
                <button onclick="closeModal('email-modal')" style="background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.5rem;">&times;</button>
            </div>
            <div id="email-body" style="min-height: 200px; background: white; color: #1a1a1a; overflow-x: auto;">
                <style>
                    #email-body img { max-width: 100%; height: auto; }
                    #email-body table { max-width: 100%; }
                    /* Reset body margin inside the email content if possible, though scoped styles are limited */
                    #email-body > * { margin: 0; } 
                </style>
                <!-- Email content -->
            </div>
        </div>
    </div>

    <script>
        const API_BASE = '/api';
        const token = localStorage.getItem('token');
        let autoRefreshInterval;

        if (!token) window.location.href = '/login';

        // Initial Load
        const savedSection = localStorage.getItem('currentSection') || 'dashboard';
        showSection(savedSection);
        loadDashboard();

        function showSection(section) {
            localStorage.setItem('currentSection', section);
            
            // Update Nav
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.mobile-nav-item').forEach(el => el.classList.remove('active'));
            
            // Find active items based on onclick content
            const desktopNav = Array.from(document.querySelectorAll('.nav-item')).find(el => el.getAttribute('onclick').includes(section));
            const mobileNav = Array.from(document.querySelectorAll('.mobile-nav-item')).find(el => el.getAttribute('onclick').includes(section));
            
            if (desktopNav) desktopNav.classList.add('active');
            if (mobileNav) mobileNav.classList.add('active');

            // Update Content
            document.getElementById('section-dashboard').style.display = 'none';
            document.getElementById('section-emails').style.display = 'none';
            document.getElementById('section-send').style.display = 'none';
            
            document.getElementById('section-' + section).style.display = 'block';
            
            if (section === 'emails') {
                const saved = localStorage.getItem('selectedAddressId');
                loadEmails(false, false, saved);
            }
            if (section === 'send') loadSendOptions();
        }

        async function loadDashboard() {
            // Start loading email count in parallel
            const saved = localStorage.getItem('selectedAddressId');
            loadEmails(true, false, saved);
            startAutoRefresh();

            try {
                // Load Addresses
                const res = await fetch(API_BASE + '/addresses', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                
                if (!res.ok) throw new Error('Failed to fetch addresses');
                
                const data = await res.json();
                
                if (!data.addresses) {
                    throw new Error('Invalid response format');
                }
                
                const list = document.getElementById('address-list');
                const filter = document.getElementById('address-filter');
                
                document.getElementById('address-count').textContent = data.addresses.length;
                
                // Update Domain Suffix
                if (data.addresses.length > 0) {
                    const domain = data.addresses[0].address.split('@')[1];
                    document.getElementById('domain-suffix').textContent = domain;
                } else {
                     // Fallback if no addresses yet, try to fetch user info or config (simplified here)
                     document.getElementById('domain-suffix').textContent = window.location.hostname;
                }

                list.innerHTML = '';
                // Keep first option
                filter.innerHTML = '<option value="">All Addresses</option>';

                data.addresses.forEach(addr => {
                    // Check permission status (mocked if not present in list, but ideally should be fetched)
                    // For now assuming we might need to fetch it or it's in the object
                    // In a real app, we'd probably fetch permissions separately or include them
                    
                    // Add to list
                    const div = document.createElement('div');
                    div.className = 'glass email-item';
                    div.style.marginBottom = '0.5rem';
                    div.innerHTML = \`
                        <div>
                            <div style="font-weight: 600; font-size: 1.1rem;">\${addr.address}</div>
                            <div style="font-size: 0.85rem; color: var(--text-muted);">Created: \${new Date(addr.created_at).toLocaleDateString()}</div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            \${!addr.send_permission_status ? \`
                                <button onclick="requestPermission('\${addr.id}')" class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
                                    Request Send
                                </button>
                            \` : addr.send_permission_status === 'approved' ? '' : \`
                                <span class="badge" style="\${
                                    addr.send_permission_status === 'pending' ? 'background: rgba(234, 179, 8, 0.2); color: #fde047;' : 
                                    'background: rgba(239, 68, 68, 0.2); color: #fca5a5;'
                                }">
                                    \${addr.send_permission_status.charAt(0).toUpperCase() + addr.send_permission_status.slice(1)}
                                </span>
                            \`}
                            <span class="badge badge-active">Active</span>
                            <button onclick="deleteAddress('\${addr.id}')" class="btn btn-danger" style="padding: 0.5rem;">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                        </div>
                    \`;
                    list.appendChild(div);

                    // Add to filter
                    const opt = document.createElement('option');
                    opt.value = addr.id;
                    opt.textContent = addr.address;
                    filter.appendChild(opt);
                });

                // Restore saved filter
                const savedFilter = localStorage.getItem('selectedAddressId');
                if (savedFilter && filter.querySelector(\`option[value="\${savedFilter}"]\`)) {
                    filter.value = savedFilter;
                }

            } catch (e) {
                console.error(e);
                alert('Error loading dashboard: ' + e.message);
            }
        }

        function startAutoRefresh() {
            if (autoRefreshInterval) clearInterval(autoRefreshInterval);
            autoRefreshInterval = setInterval(() => {
                const emailsSection = document.getElementById('section-emails');
                if (emailsSection && emailsSection.style.display !== 'none') {
                    loadEmails(false, true); // Refresh list
                } else {
                    loadEmails(true); // Refresh count only
                }
            }, 10000);
        }

        function handleFilterChange() {
            const addressId = document.getElementById('address-filter').value;
            localStorage.setItem('selectedAddressId', addressId);
            loadEmails();
        }

        async function loadEmails(countOnly = false, isAutoRefresh = false, overrideAddressId = null) {
            let addressId = overrideAddressId;
            if (addressId === null) {
                addressId = document.getElementById('address-filter').value;
            }
            const refreshBtn = document.getElementById('refresh-btn');
            
            if (!countOnly && refreshBtn && !isAutoRefresh) {
                refreshBtn.classList.add('rotating');
                refreshBtn.disabled = true;
            }

            let url = API_BASE + '/emails';
            const params = new URLSearchParams();
            if (addressId && !countOnly) params.append('address_id', addressId);
            if (countOnly) params.append('count_only', 'true');
            
            if (params.toString()) url += '?' + params.toString();

            try {
                const res = await fetch(url, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const data = await res.json();

                if (countOnly) {
                    document.getElementById('email-count').textContent = data.count !== undefined ? data.count : (data.emails ? data.emails.length : 0);
                    return;
                }

                const list = document.getElementById('message-list');
                list.innerHTML = '';

                if (!data.emails || data.emails.length === 0) {
                    list.innerHTML = '<div style="text-align: center; padding: 3rem; color: var(--text-muted);">No emails found</div>';
                } else {
                    data.emails.forEach(email => {
                        const div = document.createElement('div');
                        div.className = 'glass email-item';
                        div.style.marginBottom = '0.5rem';
                        div.onclick = () => openEmail(email);
                        div.innerHTML = \`
                            <div style="flex: 1; min-width: 0;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                                    <span style="font-weight: 600; color: var(--primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-right: 0.5rem;">\${email.from_address}</span>
                                    <span style="font-size: 0.8rem; color: var(--text-muted); white-space: nowrap;">\${new Date(email.received_at * 1000).toLocaleString()}</span>
                                </div>
                                <div style="font-weight: 500; margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">\${email.subject || '(No Subject)'}</div>
                                <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">To: \${email.to_address}</div>
                                <div style="font-size: 0.9rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 600px;">
                                    Click to view details
                                </div>
                            </div>
                        \`;
                        list.appendChild(div);
                    });
                }
            } catch (e) {
                console.error(e);
            } finally {
                if (!countOnly && refreshBtn) {
                    refreshBtn.classList.remove('rotating');
                    refreshBtn.disabled = false;
                }
            }
        }

        async function handleCreateAddress(e) {
            e.preventDefault();
            const prefix = document.getElementById('new-prefix').value;
            
            try {
                const res = await fetch(API_BASE + '/addresses', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ prefix })
                });

                if (res.ok) {
                    closeModal('create-modal');
                    document.getElementById('new-prefix').value = '';
                    loadDashboard();
                } else {
                    alert('Failed to create address');
                }
            } catch (e) {
                alert('Error creating address');
            }
        }
        
        async function requestPermission(addressId) {
            try {
                const res = await fetch(API_BASE + '/emails/address/' + addressId + '/request-send', {
                    method: 'POST',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                
                const data = await res.json();
                if (res.ok) {
                    alert('Permission requested! Status: ' + data.permission.status);
                } else {
                    alert(data.message || 'Failed to request permission');
                }
            } catch (e) {
                console.error(e);
                alert('Error requesting permission');
            }
        }
        
        async function loadSendOptions() {
            const select = document.getElementById('send-from');
            select.innerHTML = '<option value="">Loading...</option>';
            
            try {
                const res = await fetch(API_BASE + '/addresses', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const data = await res.json();
                
                select.innerHTML = '<option value="">Select an address...</option>';
                
                // In a real app, we should filter by permission status.
                // Since /addresses doesn't return permission status directly in this simplified version,
                // we might need to fetch it or just show all and let the backend reject.
                // For better UX, let's assume we show all but warn.
                
                data.addresses.forEach(addr => {
                    if (addr.send_permission_status === 'approved') {
                        const opt = document.createElement('option');
                        opt.value = addr.address;
                        opt.textContent = addr.address;
                        select.appendChild(opt);
                    }
                });
            } catch (e) {
                select.innerHTML = '<option value="">Error loading addresses</option>';
            }
        }
        
        async function handleSendEmail(e) {
            e.preventDefault();
            
            const from = document.getElementById('send-from').value;
            const to = document.getElementById('send-to').value;
            const subject = document.getElementById('send-subject').value;
            const text = document.getElementById('send-body').value;
            
            try {
                const res = await fetch(API_BASE + '/emails/send', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ from, to, subject, text })
                });
                
                const data = await res.json();
                
                if (res.ok) {
                    alert('Email sent successfully!');
                    document.getElementById('send-to').value = '';
                    document.getElementById('send-subject').value = '';
                    document.getElementById('send-body').value = '';
                    showSection('emails');
                } else {
                    alert('Failed to send: ' + (data.error || 'Unknown error'));
                }
            } catch (e) {
                alert('Error sending email');
            }
        }

        async function deleteAddress(id) {
            if (!confirm('Are you sure? This will delete all emails associated with this address.')) return;
            
            try {
                const res = await fetch(API_BASE + '/addresses/' + id, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                
                if (res.ok) loadDashboard();
            } catch (e) {
                console.error(e);
            }
        }

        async function openEmail(email) {
            // Show loading state
            document.getElementById('email-subject').textContent = 'Loading...';
            document.getElementById('email-from').textContent = '...';
            document.getElementById('email-to').textContent = '...';
            document.getElementById('email-body').innerHTML = '<div style="text-align: center; padding: 2rem;">Loading content...</div>';
            openModal('email-modal');

            try {
                // Fetch full email details
                const res = await fetch(API_BASE + '/emails/' + email.id, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const data = await res.json();
                
                if (res.ok) {
                    const fullEmail = data.email;
                    document.getElementById('email-subject').textContent = fullEmail.subject || '(No Subject)';
                    document.getElementById('email-from').textContent = fullEmail.from_address;
                    document.getElementById('email-to').textContent = fullEmail.to_address;
                    
                    const bodyContainer = document.getElementById('email-body');
                    if (fullEmail.html_body) {
                        bodyContainer.innerHTML = fullEmail.html_body;
                    } else {
                        bodyContainer.textContent = fullEmail.text_body || '(No content)';
                    }
                } else {
                    document.getElementById('email-body').textContent = 'Failed to load email content.';
                }
            } catch (e) {
                document.getElementById('email-body').textContent = 'Error loading email.';
            }
        }

        function openCreateModal() {
            openModal('create-modal');
        }

        function openModal(id) {
            document.getElementById(id).classList.add('open');
        }

        function closeModal(id) {
            document.getElementById(id).classList.remove('open');
        }

        function logout() {
            if (autoRefreshInterval) clearInterval(autoRefreshInterval);
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    </script>
</body>
</html>`;
}

// --- Admin Page ---


function getAdminPage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    ${getSharedHead('Admin - Webmail')}
    <style>
        .app-layout { display: grid; grid-template-columns: 280px 1fr; min-height: 100vh; }
        .sidebar { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(20px); border-right: 1px solid var(--border); padding: 2rem; display: flex; flex-direction: column; height: 100vh; position: sticky; top: 0; z-index: 50; }
        .main-content { padding: 2rem; overflow-y: auto; width: 100%; max-width: 100vw; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; gap: 1rem; }
        
        /* Navigation */
        .nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; color: var(--text-muted); text-decoration: none; border-radius: 8px; margin-bottom: 0.5rem; cursor: pointer; transition: all 0.2s; }
        .nav-item:hover, .nav-item.active { background: var(--surface-light); color: white; }
        .nav-item svg { width: 20px; height: 20px; }

        /* Tables */
        .table-container { overflow-x: auto; border-radius: 12px; border: 1px solid var(--border); }
        table { width: 100%; border-collapse: collapse; white-space: nowrap; }
        th, td { padding: 1rem; text-align: left; border-bottom: 1px solid var(--border); }
        th { background: rgba(255,255,255,0.02); color: var(--text-muted); font-weight: 600; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; }
        tr:last-child td { border-bottom: none; }
        tr:hover { background: rgba(255,255,255,0.02); }

        /* Forms */
        .form-group { margin-bottom: 1.5rem; }
        .form-label { display: block; margin-bottom: 0.5rem; color: var(--text-muted); font-size: 0.9rem; }
        .form-input { width: 100%; background: rgba(0, 0, 0, 0.2); border: 1px solid var(--border); padding: 0.75rem; border-radius: 8px; color: white; font-family: inherit; }
        .form-input:focus { outline: none; border-color: var(--primary); }

        /* Badges & Buttons */
        .badge { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
        .badge-success { background: rgba(16, 185, 129, 0.2); color: #34d399; }
        .badge-warning { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
        .badge-danger { background: rgba(239, 68, 68, 0.2); color: #f87171; }
        
        .btn-sm { padding: 0.25rem 0.75rem; font-size: 0.85rem; }
        .btn-danger { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
        .btn-danger:hover { background: rgba(239, 68, 68, 0.3); }

        /* Mobile Elements */
        .menu-btn { display: none; background: none; border: none; color: white; cursor: pointer; padding: 0.5rem; margin-left: -0.5rem; }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 40; opacity: 0; pointer-events: none; transition: opacity 0.3s; backdrop-filter: blur(4px); }
        .overlay.open { opacity: 1; pointer-events: auto; }

        /* Sections */
        .section { display: none; animation: fadeIn 0.3s ease; }
        .section.active { display: block; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 1024px) {
            .app-layout { grid-template-columns: 1fr; }
            .sidebar { position: fixed; left: -280px; top: 0; bottom: 0; width: 280px; background: #0f172a; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); border-right: 1px solid var(--border); }
            .sidebar.open { transform: translateX(280px); }
            .menu-btn { display: block; }
            .main-content { padding: 1.5rem; }
        }
    </style>
</head>
<body>
    <div class="overlay" id="sidebar-overlay" onclick="toggleSidebar()"></div>

    <div class="app-layout">
        <aside class="sidebar" id="sidebar">
            <div style="font-size: 1.5rem; font-weight: 700; color: white; margin-bottom: 3rem; display: flex; align-items: center; gap: 0.75rem;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="shield_grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#6366f1" />
                            <stop offset="1" stop-color="#ec4899" />
                        </linearGradient>
                    </defs>
                    <path d="M12 2L3 7V12C3 17.52 6.84 22.74 12 24C17.16 22.74 21 17.52 21 12V7L12 2Z" fill="url(#shield_grad)"/>
                    <path d="M17 10H7C6.45 10 6 10.45 6 11V15C6 15.55 6.45 16 7 16H17C17.55 16 18 15.55 18 15V11C18 10.45 17.55 10 17 10Z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
                    <path d="M7 11L12 14L17 11" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Admin Panel
            </div>
            
            <nav style="margin-bottom: auto;">
                 <a class="nav-item active" onclick="switchSection('overview')">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                    Overview
                </a>
                <a class="nav-item" onclick="switchSection('users')">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    Users
                </a>
                <a class="nav-item" onclick="switchSection('emails')">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    Emails
                </a>
                <a class="nav-item" onclick="switchSection('permissions')">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Permissions
                </a>
                <a class="nav-item" onclick="switchSection('settings')">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    Settings
                </a>
            </nav>

            <button onclick="logout()" class="btn btn-secondary" style="width: 100%;">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                Logout
            </button>
        </aside>

        <main class="main-content">
            <div class="header">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <button class="menu-btn" onclick="toggleSidebar()">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                    <h2 id="page-title">System Overview</h2>
                </div>
                <div class="badge badge-active" style="font-size: 0.9rem;">Admin Mode</div>
            </div>

            <!-- Overview Section -->
            <div id="overview" class="section active">
                <div class="glass" style="padding: 2rem; margin-bottom: 2rem;">
                    <h3>Statistics</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1.5rem; margin-top: 1.5rem;">
                        <div style="text-align: center; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 12px;">
                            <div id="total-users" style="font-size: 2rem; font-weight: 700; color: var(--primary);">0</div>
                            <div style="color: var(--text-muted);">Total Users</div>
                        </div>
                        <div style="text-align: center; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 12px;">
                            <div id="total-addresses" style="font-size: 2rem; font-weight: 700; color: var(--secondary);">0</div>
                            <div style="color: var(--text-muted);">Active Addresses</div>
                        </div>
                        <div style="text-align: center; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 12px;">
                            <div id="total-emails" style="font-size: 2rem; font-weight: 700; color: var(--success);">0</div>
                            <div style="color: var(--text-muted);">Processed Emails</div>
                        </div>
                        <div style="text-align: center; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 12px;">
                            <div id="pending-permissions" style="font-size: 2rem; font-weight: 700; color: #fbbf24;">0</div>
                            <div style="color: var(--text-muted);">Pending Requests</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Users Section -->
            <div id="users" class="section">
                <div class="glass" style="padding: 2rem;">
                    <h3>Manage Users</h3>
                    <div class="table-container" style="margin-top: 1.5rem;">
                        <table id="users-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Emails Section -->
            <div id="emails" class="section">
                <div class="glass" style="padding: 2rem;">
                    <h3>Recent Emails</h3>
                    <div class="table-container" style="margin-top: 1.5rem;">
                        <table id="emails-table">
                            <thead>
                                <tr>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Subject</th>
                                    <th>Received</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Permissions Section -->
            <div id="permissions" class="section">
                <div class="glass" style="padding: 2rem;">
                    <h3>Pending Permissions</h3>
                    <div class="table-container" style="margin-top: 1.5rem;">
                        <table id="permissions-table">
                            <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>Address</th>
                                    <th>Requested At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Settings Section -->
            <div id="settings" class="section">
                <div class="glass" style="padding: 2rem; max-width: 600px;">
                    <h3>System Settings</h3>
                    <div style="margin-top: 2rem;">
                        <div class="form-group">
                            <label class="form-label">Email Retention (Days)</label>
                            <div style="display: flex; gap: 1rem;">
                                <input type="number" id="setting-ttl" class="form-input" placeholder="30">
                                <button onclick="saveTTL()" class="btn btn-primary">Save</button>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">System Domain</label>
                            <div style="display: flex; gap: 1rem;">
                                <input type="text" id="setting-domain" class="form-input" placeholder="example.com">
                                <button onclick="saveDomain()" class="btn btn-primary">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    </div>

    <script>
        const API_BASE = '/api';
        const token = localStorage.getItem('token');
        if (!token) window.location.href = '/login';

        // Initial Load
        loadStats();
        
        // Navigation Logic
        function switchSection(sectionId) {
            // Update UI
            document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');
            
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            event.currentTarget.classList.add('active'); // Note: this relies on the click event
            
            document.getElementById('page-title').textContent = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
            
            // Close mobile menu
            document.getElementById('sidebar').classList.remove('open');
            document.getElementById('sidebar-overlay').classList.remove('open');

            // Load Data
            if (sectionId === 'users') loadUsers();
            if (sectionId === 'emails') loadEmails();
            if (sectionId === 'permissions') loadPermissions();
            if (sectionId === 'settings') loadSettings();
            if (sectionId === 'overview') loadStats();
        }

        function toggleSidebar() {
            document.getElementById('sidebar').classList.toggle('open');
            document.getElementById('sidebar-overlay').classList.toggle('open');
        }

        // Data Loading Functions
        async function loadStats() {
            try {
                const res = await fetch(API_BASE + '/admin/stats', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                if (!res.ok) return;
                const data = await res.json();
                document.getElementById('total-users').textContent = data.users;
                document.getElementById('total-addresses').textContent = data.addresses;
                document.getElementById('total-emails').textContent = data.emails;
                document.getElementById('pending-permissions').textContent = data.pending_permissions;
            } catch (e) { console.error(e); }
        }

        async function loadUsers() {
            try {
                const res = await fetch(API_BASE + '/admin/users', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const data = await res.json();
                const tbody = document.querySelector('#users-table tbody');
                tbody.innerHTML = data.users.map(u => \`
                    <tr>
                        <td><span style="font-family: monospace; color: var(--text-muted);">\${u.id.substring(0,8)}...</span></td>
                        <td>
                            \${u.is_banned 
                                ? '<span class="badge badge-danger">Banned</span>' 
                                : '<span class="badge badge-success">Active</span>'}
                            \${u.is_admin ? '<span class="badge badge-warning" style="margin-left: 0.5rem">Admin</span>' : ''}
                        </td>
                        <td>\${new Date(u.created_at).toLocaleDateString()}</td>
                        <td>
                            \${!u.is_admin ? \`
                                \${u.is_banned 
                                    ? \`<button onclick="unbanUser('\${u.id}')" class="btn btn-sm btn-primary">Unban</button>\`
                                    : \`<button onclick="banUser('\${u.id}')" class="btn btn-sm btn-danger">Ban</button>\`
                                }
                            \` : ''}
                        </td>
                    </tr>
                \`).join('');
            } catch (e) { console.error(e); }
        }

        async function loadEmails() {
            try {
                const res = await fetch(API_BASE + '/admin/emails?limit=50', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const data = await res.json();
                const tbody = document.querySelector('#emails-table tbody');
                tbody.innerHTML = data.emails.map(e => \`
                    <tr>
                        <td>\${escapeHtml(e.from_address)}</td>
                        <td>\${escapeHtml(e.to_address)}</td>
                        <td>\${escapeHtml(e.subject || '(No Subject)')}</td>
                        <td style="color: var(--text-muted); font-size: 0.9rem;">\${new Date(e.received_at).toLocaleString()}</td>
                    </tr>
                \`).join('');
            } catch (e) { console.error(e); }
        }

        async function loadPermissions() {
            try {
                const res = await fetch(API_BASE + '/admin/permissions/pending', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const data = await res.json();
                const tbody = document.querySelector('#permissions-table tbody');
                if (data.permissions.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">No pending requests</td></tr>';
                    return;
                }
                tbody.innerHTML = data.permissions.map(p => \`
                    <tr>
                        <td><span style="font-family: monospace;">\${p.user_id.substring(0,8)}...</span></td>
                        <td>\${escapeHtml(p.address)}</td>
                        <td>\${new Date(p.requested_at).toLocaleDateString()}</td>
                        <td style="display: flex; gap: 0.5rem;">
                            <button onclick="approvePermission('\${p.id}')" class="btn btn-sm btn-primary">Approve</button>
                            <button onclick="rejectPermission('\${p.id}')" class="btn btn-sm btn-danger">Reject</button>
                        </td>
                    </tr>
                \`).join('');
            } catch (e) { console.error(e); }
        }

        async function loadSettings() {
            try {
                const [ttlRes, domainRes] = await Promise.all([
                    fetch(API_BASE + '/admin/settings/ttl', { headers: { 'Authorization': 'Bearer ' + token } }),
                    fetch(API_BASE + '/admin/settings/domain', { headers: { 'Authorization': 'Bearer ' + token } })
                ]);
                const ttlData = await ttlRes.json();
                const domainData = await domainRes.json();
                
                document.getElementById('setting-ttl').value = ttlData.ttl_days;
                document.getElementById('setting-domain').value = domainData.domain;
            } catch (e) { console.error(e); }
        }

        // Actions
        async function banUser(id) {
            if (!confirm('Are you sure you want to ban this user?')) return;
            await fetch(API_BASE + '/admin/users/' + id + '/ban', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + token }
            });
            loadUsers();
        }

        async function unbanUser(id) {
            await fetch(API_BASE + '/admin/users/' + id + '/unban', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + token }
            });
            loadUsers();
        }

        async function approvePermission(id) {
            await fetch(API_BASE + '/admin/permissions/' + id + '/approve', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + token }
            });
            loadPermissions();
            loadStats(); // Update pending count
        }

        async function rejectPermission(id) {
            if (!confirm('Reject this permission request?')) return;
            await fetch(API_BASE + '/admin/permissions/' + id + '/reject', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + token }
            });
            loadPermissions();
            loadStats();
        }

        async function saveTTL() {
            const val = document.getElementById('setting-ttl').value;
            await fetch(API_BASE + '/admin/settings/ttl', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify({ ttl_days: val })
            });
            alert('Settings saved');
        }

        async function saveDomain() {
            const val = document.getElementById('setting-domain').value;
            await fetch(API_BASE + '/admin/settings/domain', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify({ domain: val })
            });
            alert('Settings saved');
        }

        function escapeHtml(text) {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function logout() {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    </script>
</body>
</html>`;
}
