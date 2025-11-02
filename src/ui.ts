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

function getLoginPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Webmail - Login</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            position: relative;
            overflow: hidden;
        }
        body::before {
            content: '';
            position: absolute;
            width: 400px;
            height: 400px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            top: -100px;
            left: -100px;
            backdrop-filter: blur(50px);
        }
        body::after {
            content: '';
            position: absolute;
            width: 300px;
            height: 300px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            bottom: -80px;
            right: -80px;
            backdrop-filter: blur(50px);
        }
        .container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 28px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
            padding: 48px;
            max-width: 420px;
            width: 100%;
            animation: slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
            border: 1px solid rgba(255, 255, 255, 0.5);
            position: relative;
            z-index: 1;
        }
        @keyframes slideUp {
            from { 
                opacity: 0; 
                transform: translateY(30px); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0); 
            }
        }
        h1 {
            color: #333;
            margin-bottom: 8px;
            font-size: 32px;
            text-align: center;
            font-weight: 700;
            letter-spacing: -1px;
        }
        .subtitle {
            color: #666;
            text-align: center;
            margin-bottom: 32px;
            font-size: 15px;
            font-weight: 500;
        }
        .tab-container {
            display: flex;
            margin-bottom: 28px;
            background: #f5f7fa;
            padding: 6px;
            border-radius: 12px;
        }
        .tab {
            flex: 1;
            padding: 12px 16px;
            text-align: center;
            cursor: pointer;
            color: #666;
            font-weight: 600;
            font-size: 15px;
            transition: all 0.2s;
            border-radius: 10px;
            background: transparent;
            border: none;
        }
        .tab.active {
            color: white;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 600;
            font-size: 14px;
        }
        input {
            width: 100%;
            padding: 13px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 15px;
            background: #f9fafb;
            transition: all 0.2s;
            font-family: inherit;
        }
        input:focus {
            outline: none;
            border-color: #667eea;
            background: white;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .btn {
            width: 100%;
            padding: 14px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.25);
        }
        .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.35);
        }
        .btn:active {
            transform: translateY(-1px);
        }
        .message {
            padding: 13px 16px;
            border-radius: 10px;
            margin-bottom: 20px;
            display: none;
            font-size: 14px;
            font-weight: 500;
            animation: slideDown 0.3s ease;
        }
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .message.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .message.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .token-display {
            background: linear-gradient(135deg, #f5f7fa 0%, #e9e4f0 100%);
            padding: 16px;
            border-radius: 10px;
            margin-top: 16px;
            word-break: break-all;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            border: 2px dashed #667eea;
            color: #333;
            line-height: 1.6;
        }
        .tab-content {
            display: none;
        }
        .tab-content.active {
            display: block;
            animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .info-box {
            background: linear-gradient(135deg, #d1ecf1 0%, #c6e0e6 100%);
            padding: 16px;
            border-radius: 10px;
            margin-top: 20px;
            font-size: 14px;
            color: #0c5460;
            border-left: 4px solid #0c5460;
            font-weight: 500;
        }
        @media (max-width: 480px) {
            .container {
                padding: 32px 20px;
                border-radius: 24px;
            }
            h1 {
                font-size: 26px;
            }
            .subtitle {
                font-size: 14px;
            }
            .tab {
                padding: 10px 12px;
                font-size: 14px;
            }
            input, .btn {
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📧 Webmail</h1>
        <p class="subtitle">Login to Webmail</p>

        <div class="tab-container">
            <div class="tab active" onclick="switchTab('login')">Login</div>
            <div class="tab" onclick="switchTab('register')">Register</div>
        </div>

        <div id="message" class="message"></div>

        <!-- Login Tab -->
        <div id="login-tab" class="tab-content active">
            <form onsubmit="handleLogin(event)">
                <div class="form-group">
                    <label for="login-token">Access Token</label>
                    <input type="password" id="login-token" placeholder="Enter your access token" required autocomplete="current-password">
                </div>
                <button type="submit" class="btn">Login</button>
            </form>
            <div class="info-box">
                💡 Use your access token to login.
            </div>
        </div>

        <!-- Register Tab -->
        <div id="register-tab" class="tab-content">
            <form onsubmit="handleRegister(event)">
                <div class="form-group">
                    <label>Create New Account</label>
                    <p style="font-size: 13px; color: #666; margin-bottom: 15px;">
                        Click below to generate a new user account and receive your access token.
                    </p>
                </div>
                <button type="submit" class="btn">Create Account</button>
            </form>
            <div id="new-token-display" class="token-display" style="display: none;">
                <strong>Your Access Token (Save this!):</strong>
                <div id="token-value" style="margin-top: 10px;"></div>
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
                    showMessage('Account created! Save your token below.', 'success');
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

function getDashboardPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Webmail</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #e9e4f0 50%, #f0e5ff 100%);
            min-height: 100vh;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 28px 0;
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
        }
        .header-content {
            max-width: 1100px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
        }
        .header h1 {
            font-size: 1.8rem;
            font-weight: 700;
            letter-spacing: -1px;
        }
        .logout-btn {
            background: rgba(255,255,255,0.15);
            border: 2px solid white;
            color: white;
            padding: 10px 28px;
            border-radius: 12px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.95rem;
            transition: all 0.2s;
            backdrop-filter: blur(10px);
        }
        .logout-btn:hover {
            background: white;
            color: #667eea;
            transform: translateY(-2px);
        }
        .container {
            max-width: 1100px;
            margin: 0 auto;
            padding: 32px 20px;
        }
        .tabs {
            display: flex;
            gap: 8px;
            margin-bottom: 32px;
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
        }
        .tabs::-webkit-scrollbar {
            display: none;
        }
        .tab {
            padding: 12px 28px;
            background: rgba(255, 255, 255, 0.8);
            border: 2px solid transparent;
            cursor: pointer;
            font-size: 0.95rem;
            font-weight: 600;
            color: #666;
            border-radius: 12px;
            transition: all 0.2s;
            white-space: nowrap;
        }
        .tab.active {
            color: white;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-color: transparent;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        .tab-panel {
            display: none;
            animation: slideIn 0.3s ease;
        }
        .tab-panel.active {
            display: block;
        }
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .card {
            background: white;
            border-radius: 16px;
            padding: 28px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            margin-bottom: 24px;
            border: 1px solid rgba(102, 126, 234, 0.05);
            transition: all 0.2s;
        }
        .card:hover {
            box-shadow: 0 8px 28px rgba(102, 126, 234, 0.12);
        }
        .card h2 {
            margin-bottom: 20px;
            color: #1a1a1a;
            font-size: 1.25rem;
            font-weight: 700;
        }
        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 10px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.25);
        }
        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.35);
        }
        .btn-secondary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 10px;
            cursor: pointer;
            font-size: 0.95rem;
            margin-left: 8px;
            font-weight: 600;
            transition: all 0.2s;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.25);
        }
        .btn-secondary:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.35);
        }
        .btn-secondary:active {
            transform: translateY(-1px);
        }
        .btn-danger {
            background: #ff6b6b;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.95rem;
            font-weight: 500;
            transition: all 0.2s;
        }
        .btn-danger:hover {
            background: #ee5a52;
            transform: translateY(-1px);
        }
        .input-group {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        input[type="text"], input[type="email"], select, textarea {
            flex: 1 1 200px;
            padding: 13px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 1rem;
            background: #f9fafb;
            transition: all 0.2s;
            font-family: inherit;
        }
        select {
            appearance: none;
            background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23667eea' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 12px center;
            padding-right: 36px;
        }
        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #667eea;
            background-color: white;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.08);
        }
        select:focus {
            background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23667eea' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
        }
        textarea {
            min-height: 100px;
            resize: vertical;
        }
        .email-list, .message-list {
            list-style: none;
            padding: 0;
        }
        .email-item {
            padding: 18px;
            border: 2px solid #e8e8e8;
            border-radius: 12px;
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(135deg, #fafbff 0%, #f3f6ff 100%);
            transition: all 0.2s;
        }
        .email-item:hover {
            border-color: #667eea;
            background: linear-gradient(135deg, #f3f6ff 0%, #eef2ff 100%);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
        }
        .email-info {
            flex: 1;
        }
        .email-address {
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 6px;
            font-size: 1.05rem;
        }
        .email-meta {
            font-size: 0.9rem;
            color: #888;
        }
        .message-item {
            padding: 18px;
            border: 2px solid #e8e8e8;
            border-radius: 12px;
            margin-bottom: 12px;
            cursor: pointer;
            background: linear-gradient(135deg, #fafbff 0%, #f3f6ff 100%);
            transition: all 0.2s;
        }
        .message-item:hover {
            border-color: #667eea;
            background: linear-gradient(135deg, #f3f6ff 0%, #eef2ff 100%);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
        }
        .message-subject {
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 6px;
            font-size: 1.05rem;
        }
        .message-from {
            font-size: 0.9rem;
            color: #888;
            margin-bottom: 2px;
        }
        .message-date {
            font-size: 0.85rem;
            color: #aaa;
        }
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(4px);
            opacity: 0;
            transition: opacity 0.15s ease;
        }
        .modal.active {
            display: flex;
            opacity: 1;
        }
        .modal-content {
            background: white;
            border-radius: 16px;
            padding: 32px;
            max-width: 90vw;
            width: 100%;
            max-width: 600px;
            max-height: 85vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            transform: translateY(0);
            transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .modal:not(.active) .modal-content {
            transform: translateY(20px);
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
        }
        .modal-header h2 {
            color: #1a1a1a;
            font-weight: 700;
            font-size: 1.3rem;
            flex: 1;
            word-break: break-word;
        }
        .close-btn {
            background: none;
            border: none;
            font-size: 1.8rem;
            cursor: pointer;
            color: #888;
            transition: color 0.2s;
            padding: 0;
            margin-left: 16px;
        }
        .close-btn:hover {
            color: #667eea;
        }
        .alert {
            padding: 14px 16px;
            border-radius: 10px;
            margin-bottom: 20px;
            font-size: 0.95rem;
            font-weight: 500;
        }
        .alert-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .alert-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .alert-info {
            background: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }
        .empty-state {
            text-align: center;
            padding: 48px 20px;
            color: #aaa;
        }
        .empty-state-icon {
            font-size: 3rem;
            margin-bottom: 12px;
        }
        .empty-state p {
            font-size: 1.05rem;
        }
        .badge {
            display: inline-block;
            padding: 6px 14px;
            border-radius: 12px;
            font-size: 0.9rem;
            font-weight: 600;
        }
        .badge-pending {
            background: #fff3cd;
            color: #856404;
        }
        .badge-approved {
            background: #d4edda;
            color: #155724;
        }
        .badge-rejected {
            background: #f8d7da;
            color: #721c24;
        }
        /* Responsive Design */
        @media (max-width: 768px) {
            .header-content {
                padding: 0 12px;
                flex-direction: row;
                gap: 8px;
                align-items: center;
            }
            .header h1 {
                font-size: 1.4rem;
                margin: 0;
            }
            .logout-btn {
                align-self: center;
                width: auto;
                margin: 0;
            }
            .container {
                padding: 20px 12px;
            }
            .card {
                padding: 20px;
            }
            .tab {
                padding: 10px 16px;
                font-size: 0.9rem;
            }
            .inbox-controls {
                flex-direction: column;
                gap: 8px;
            }
            .inbox-controls select {
                width: 100%;
                flex: none;
            }
            .inbox-controls button {
                width: 100%;
                flex: none;
            }
        }
        @media (max-width: 480px) {
            .header h1 {
                font-size: 1.1rem;
            }
            .logout-btn {
                padding: 8px 16px;
                font-size: 0.9rem;
            }
            .card {
                padding: 16px;
                margin-bottom: 16px;
            }
            .card h2 {
                font-size: 1.1rem;
            }
            .btn-primary, .btn-secondary, .btn-danger {
                font-size: 0.9rem;
                padding: 10px 16px;
                width: 100%;
            }
            .btn-secondary {
                margin-left: 0;
                margin-top: 8px;
            }
            .input-group {
                flex-direction: column;
                gap: 8px;
            }
            input[type="text"], input[type="email"], select, textarea {
                width: 100%;
            }
            .email-item, .message-item {
                padding: 12px;
                flex-direction: column;
                align-items: flex-start;
            }
            .modal-content {
                padding: 20px;
                max-width: 95vw;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <h1 onclick="window.location.href='/dashboard'" style="cursor:pointer;">📧 Email Dashboard</h1>
            <button class="logout-btn" onclick="logout()">Logout</button>
        </div>
    </div>

    <div class="container">
        <div class="tabs">
            <button class="tab" data-tab="addresses" onclick="switchTab(this.dataset.tab)">My Addresses</button>
            <button class="tab" data-tab="inbox" onclick="switchTab(this.dataset.tab)">Inbox</button>
            <button class="tab" data-tab="send" onclick="switchTab(this.dataset.tab)">Send Email</button>
        </div>

        <div id="alert-container"></div>

        <!-- Addresses Tab -->
        <div id="addresses-panel" class="tab-panel active">
            <div class="card">
                <h2>Create New Email Address</h2>
                <div class="input-group">
                    <input type="text" id="email-prefix" placeholder="Enter prefix (leave empty for random)">
                    <button class="btn-primary" onclick="createAddress()">Create Address</button>
                </div>
            </div>

            <div class="card">
                <h2>Your Email Addresses</h2>
                <ul id="addresses-list" class="email-list"></ul>
            </div>
        </div>

        <!-- Inbox Tab -->
        <div id="inbox-panel" class="tab-panel">
            <div class="card">
                <h2>Select Email Address</h2>
                <div class="inbox-controls" style="display: flex; gap: 12px; align-items: center;">
                    <select id="inbox-address-select" onchange="onInboxAddressChange()" style="flex: 1 1 0; min-width: 0;">
                        <option value="">Select an address...</option>
                    </select>
                    <button class="btn-secondary" id="refresh-inbox-btn" onclick="manualInboxRefresh()" style="flex: 0 0 auto;">Refresh</button>
                </div>
            </div>

            <div class="card">
                <h2>Messages</h2>
                <ul id="messages-list" class="message-list"></ul>
            </div>
        </div>

        <!-- Send Tab -->
        <div id="send-panel" class="tab-panel">
            <div class="card">
                <h2>Send Email</h2>
                <div id="permission-alert" class="alert alert-info">
                    📮 You need admin approval to send emails. Request permission first, then you can send emails once approved.
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">From Address:</label>
                    <select id="send-from-select" style="width: 100%;" onchange="onSendAddressChange()">
                        <option value="">Select your address...</option>
                    </select>
                    <button id="request-send-btn" class="btn-secondary" onclick="requestSendPermission()" style="margin-top: 10px;">Request Send Permission</button>
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">To:</label>
                    <input type="email" id="send-to" placeholder="recipient@example.com">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Subject:</label>
                    <input type="text" id="send-subject" placeholder="Email subject">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Message:</label>
                    <textarea id="send-message" rows="8" style="width: 100%; resize: vertical;"></textarea>
                </div>
                <button class="btn-primary" onclick="sendEmail()">Send Email</button>
            </div>
        </div>
    </div>

    <!-- Email Modal -->
    <div id="email-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modal-subject"></h2>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <button id="toggle-read-btn" class="close-btn" style="background: none; border: none; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;" onclick="toggleEmailReadStatus()">Mark as Unread</button>
                    <button class="close-btn" onclick="closeModal()">&times;</button>
                </div>
            </div>
            <div id="modal-body"></div>
        </div>
    </div>

    <script>
        const API_BASE = '/api';
        let token = localStorage.getItem('token');
        let addresses = [];
        let currentEmailId = null;
        let currentEmailIsRead = false;

        if (!token) {
            window.location.href = '/login';
        }

        async function apiCall(endpoint, options = {}) {
            const response = await fetch(API_BASE + endpoint, {
                ...options,
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            return response;
        }

        function showAlert(message, type = 'info') {
            const container = document.getElementById('alert-container');
            container.innerHTML = \`<div class="alert alert-\${type}">\${message}</div>\`;
            setTimeout(() => container.innerHTML = '', 5000);
        }

        function switchTab(tab, fromRestore) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            // Find the tab button by data-tab
            const tabBtn = document.querySelector('.tab[data-tab="' + tab + '"]');
            if (tabBtn) tabBtn.classList.add('active');
            document.getElementById(tab + '-panel').classList.add('active');
            localStorage.setItem('dashboard_tab', tab);
            if (tab === 'addresses') loadAddresses();
            if (tab === 'inbox') {
                loadAddresses().then(() => {
                    populateAddressSelects();
                    if (!fromRestore) {
                        // If not restoring, clear selected address
                        document.getElementById('inbox-address-select').value = localStorage.getItem('selected_inbox_address') || '';
                        loadEmails();
                    }
                });
            }
            if (tab === 'send') {
                loadAddresses().then(populateAddressSelects);
            }
            setupInboxAutoRefresh();
        }

        // On address select change in inbox
        function onInboxAddressChange() {
            const val = document.getElementById('inbox-address-select').value;
            localStorage.setItem('selected_inbox_address', val);
            loadEmails();
        }

        // Manual refresh button for inbox
        function manualInboxRefresh() {
            loadEmails();
        }

        // Auto-refresh for inbox
        let inboxRefreshInterval = null;
        function setupInboxAutoRefresh() {
            if (inboxRefreshInterval) clearInterval(inboxRefreshInterval);
            inboxRefreshInterval = setInterval(() => {
                const inboxTabActive = document.getElementById('inbox-panel').classList.contains('active');
                if (inboxTabActive && document.getElementById('inbox-address-select').value) {
                    loadEmails();
                }
            }, 5000); // 5 seconds
        }

        async function loadAddresses() {
            const response = await apiCall('/addresses/');
            if (response.ok) {
                const data = await response.json();
                addresses = data.addresses;
                displayAddresses(addresses);
            }
        }

        function displayAddresses(addresses) {
            const list = document.getElementById('addresses-list');
            if (addresses.length === 0) {
                list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div><p>No email addresses yet. Create one above!</p></div>';
                return;
            }

            list.innerHTML = addresses.map(addr => \`
                <li class="email-item">
                    <div class="email-info">
                        <div class="email-address">\${addr.address}</div>
                        <div class="email-meta">Created: \${new Date(addr.created_at * 1000).toLocaleDateString()}</div>
                    </div>
                    <button class="btn-danger" onclick="deleteAddress('\${addr.id}')">Delete</button>
                </li>
            \`).join('');
        }

        function populateAddressSelects() {
            const inboxSelect = document.getElementById('inbox-address-select');
            const sendSelect = document.getElementById('send-from-select');
            
            const options = addresses.map(addr => \`<option value="\${addr.id}">\${addr.address}</option>\`).join('');
            
            inboxSelect.innerHTML = '<option value="">Select an address...</option>' + options;
            sendSelect.innerHTML = '<option value="">Select your address...</option>' + options;
        }

        async function createAddress() {
            const prefix = document.getElementById('email-prefix').value;
            const response = await apiCall('/addresses/', {
                method: 'POST',
                body: JSON.stringify({ prefix })
            });

            if (response.ok) {
                const data = await response.json();
                showAlert(\`✅ Created: \${data.address.address}\`, 'success');
                document.getElementById('email-prefix').value = '';
                loadAddresses();
            } else {
                const error = await response.json();
                showAlert('❌ ' + error.error, 'error');
            }
        }

        async function deleteAddress(addressId) {
            if (!confirm('Delete this email address? All associated emails will be deleted.')) return;
            
            const response = await apiCall('/addresses/' + addressId, { method: 'DELETE' });
            if (response.ok) {
                showAlert('✅ Address deleted', 'success');
                loadAddresses();
            }
        }

        async function loadEmails() {
            const addressId = document.getElementById('inbox-address-select').value;
            if (!addressId) {
                document.getElementById('messages-list').innerHTML = '<div class="empty-state"><div class="empty-state-icon">📬</div><p>Select an address to view emails</p></div>';
                return;
            }
            localStorage.setItem('selected_inbox_address', addressId);
            const response = await apiCall('/emails/address/' + addressId);
            if (response.ok) {
                const data = await response.json();
                displayEmails(data.emails);
            }
        }

        function displayEmails(emails) {
            const list = document.getElementById('messages-list');
            if (emails.length === 0) {
                list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div><p>No emails yet</p></div>';
                return;
            }

            list.innerHTML = emails.map(email => \`
                <li class="message-item \${email.is_read ? 'read' : 'unread'}" onclick="viewEmail('\${email.id}')">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background: \${email.is_read ? '#ccc' : '#667eea'}; flex-shrink: 0;"></div>
                        <div style="flex: 1;">
                            <div class="message-subject" style="font-weight: \${email.is_read ? '400' : '700'}; color: \${email.is_read ? '#999' : '#1a1a1a'};}">\${email.subject || '(No subject)'}</div>
                            <div class="message-from">From: \${email.from_address}</div>
                            <div class="message-date">\${new Date(email.received_at * 1000).toLocaleString()}</div>
                        </div>
                    </div>
                </li>
            \`).join('');
        }

        async function viewEmail(emailId) {
            // Show modal immediately with loading state
            document.getElementById('email-modal').classList.add('active');
            document.getElementById('modal-subject').textContent = 'Loading...';
            document.getElementById('modal-body').innerHTML = '<div style="text-align: center; padding: 20px; color: #999;">Loading email content...</div>';
            
            const response = await apiCall('/emails/' + emailId);
            if (response.ok) {
                const data = await response.json();
                const email = data.email;
                
                // Track current email for toggle button
                currentEmailId = emailId;
                currentEmailIsRead = email.is_read;
                updateToggleButton();
                
                document.getElementById('modal-subject').textContent = email.subject || '(No subject)';
                const bodyContent = (email.body_html || email.body_text || '(No content)').trim();
                document.getElementById('modal-body').innerHTML = \`
                    <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 2px solid #eee;">
                        <div style="margin-bottom: 10px;"><strong>From:</strong> \${email.from}</div>
                        <div style="margin-bottom: 10px;"><strong>To:</strong> \${email.to}</div>
                        <div><strong>Date:</strong> \${new Date(email.received_at * 1000).toLocaleString()}</div>
                    </div>
                    <div style="white-space: pre-wrap; word-wrap: break-word;">\${bodyContent}</div>
                \`;
                
                // Mark email as read if not already read
                if (!email.is_read) {
                    await apiCall('/emails/' + emailId + '/mark-read', { method: 'POST' });
                    currentEmailIsRead = true;
                    updateToggleButton();
                    // Refresh the email list to update the read status indicator
                    loadEmails();
                }
            }
        }
        
        function updateToggleButton() {
            const btn = document.getElementById('toggle-read-btn');
            if (currentEmailIsRead) {
                btn.textContent = 'Mark as Unread';
                btn.style.background = '#f0f0f0';
                btn.style.color = '#666';
            } else {
                btn.textContent = 'Mark as Read';
                btn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                btn.style.color = 'white';
            }
        }
        
        async function toggleEmailReadStatus() {
            if (!currentEmailId) return;
            
            const endpoint = currentEmailIsRead 
                ? '/emails/' + currentEmailId + '/mark-unread'
                : '/emails/' + currentEmailId + '/mark-read';
            
            const response = await apiCall(endpoint, { method: 'POST' });
            if (response.ok) {
                currentEmailIsRead = !currentEmailIsRead;
                updateToggleButton();
                loadEmails();
            }
        }

        function closeModal() {
            document.getElementById('email-modal').classList.remove('active');
        }

        async function requestSendPermission() {
            const addressId = document.getElementById('send-from-select').value;
            if (!addressId) {
                showAlert('❌ Please select an address', 'error');
                return;
            }

            const response = await apiCall(\`/emails/address/\${addressId}/request-send\`, {
                method: 'POST'
            });

            if (response.ok) {
                showAlert('✅ Send permission requested. Wait for admin approval.', 'success');
                checkSendPermission();
            } else {
                const error = await response.json();
                showAlert('❌ ' + (error.error || error.message), 'error');
            }
        }

        async function onSendAddressChange() {
            checkSendPermission();
        }

        async function checkSendPermission() {
            const addressId = document.getElementById('send-from-select').value;
            const permAlert = document.getElementById('permission-alert');
            const requestBtn = document.getElementById('request-send-btn');
            
            if (!addressId) {
                permAlert.style.display = 'block';
                requestBtn.style.display = 'inline-block';
                return;
            }

            try {
                // Fetch the permission status
                const response = await apiCall(\`/emails/address/\${addressId}\`);
                if (response.ok) {
                    const data = await response.json();
                    
                    // Check if permission is approved
                    if (data.send_permission_status === 'approved') {
                        permAlert.style.display = 'none';
                        requestBtn.style.display = 'none';
                    } else {
                        permAlert.style.display = 'block';
                        requestBtn.style.display = 'inline-block';
                    }
                } else {
                    permAlert.style.display = 'block';
                    requestBtn.style.display = 'inline-block';
                }
            } catch (error) {
                // Keep showing the alert and button on error
                permAlert.style.display = 'block';
                requestBtn.style.display = 'inline-block';
            }
        }

        async function sendEmail() {
            const fromSelect = document.getElementById('send-from-select');
            const to = document.getElementById('send-to').value;
            const subject = document.getElementById('send-subject').value;
            const text = document.getElementById('send-message').value;

            if (!fromSelect.value || !to || !subject || !text) {
                showAlert('❌ Please fill all fields', 'error');
                return;
            }

            const fromAddress = addresses.find(a => a.id === fromSelect.value)?.address;

            const response = await apiCall('/emails/send', {
                method: 'POST',
                body: JSON.stringify({
                    from: fromAddress,
                    to: to,
                    subject: subject,
                    text: text
                })
            });

            if (response.ok) {
                showAlert('✅ Email sent!', 'success');
                document.getElementById('send-to').value = '';
                document.getElementById('send-subject').value = '';
                document.getElementById('send-message').value = '';
            } else {
                const error = await response.json();
                showAlert('❌ ' + error.error, 'error');
            }
        }

        function logout() {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        // Restore state on load
        window.addEventListener('DOMContentLoaded', () => {
            // Restore tab
            const savedTab = localStorage.getItem('dashboard_tab') || 'addresses';
            switchTab(savedTab, true);
            // Restore selected address in inbox
            if (savedTab === 'inbox') {
                loadAddresses().then(() => {
                    populateAddressSelects();
                    const savedAddr = localStorage.getItem('selected_inbox_address');
                    if (savedAddr) {
                        document.getElementById('inbox-address-select').value = savedAddr;
                        loadEmails();
                    }
                });
            } else {
                loadAddresses();
            }
            setupInboxAutoRefresh();
        });
    </script>
</body>
</html>`;
}

function getAdminPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - Webmail</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #e9e4f0 50%, #f0e5ff 100%);
            min-height: 100vh;
        }
        .header {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 28px 0;
            box-shadow: 0 8px 32px rgba(245, 87, 108, 0.15);
        }
        .header-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
        }
        .header h1 {
            font-size: 1.8rem;
            font-weight: 700;
            letter-spacing: -1px;
        }
        .logout-btn {
            background: rgba(255,255,255,0.15);
            border: 2px solid white;
            color: white;
            padding: 10px 28px;
            border-radius: 12px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.95rem;
            transition: all 0.2s;
            backdrop-filter: blur(10px);
        }
        .logout-btn:hover {
            background: white;
            color: #f5576c;
            transform: translateY(-2px);
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 32px 20px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 32px;
        }
        .stat-card {
            background: white;
            border-radius: 16px;
            padding: 28px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(245, 87, 108, 0.05);
            transition: all 0.2s;
        }
        .stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 28px rgba(245, 87, 108, 0.12);
        }
        .stat-number {
            font-size: 2.5rem;
            font-weight: 700;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 8px;
        }
        .stat-label {
            color: #666;
            font-size: 0.95rem;
            font-weight: 500;
        }
        .tabs {
            display: flex;
            gap: 8px;
            margin-bottom: 32px;
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
            flex-wrap: wrap;
        }
        .tabs::-webkit-scrollbar {
            display: none;
        }
        .tab {
            padding: 12px 28px;
            background: rgba(255, 255, 255, 0.8);
            border: 2px solid transparent;
            cursor: pointer;
            font-size: 0.95rem;
            font-weight: 600;
            color: #666;
            border-radius: 12px;
            transition: all 0.2s;
            white-space: nowrap;
        }
        .tab.active {
            color: white;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            border-color: transparent;
            box-shadow: 0 4px 15px rgba(245, 87, 108, 0.3);
        }
        .tab-panel {
            display: none;
            animation: slideIn 0.3s ease;
        }
        .tab-panel.active {
            display: block;
        }
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .card {
            background: white;
            border-radius: 16px;
            padding: 28px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            margin-bottom: 24px;
            border: 1px solid rgba(0, 0, 0, 0.05);
            transition: all 0.2s;
        }
        .card:hover {
            box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
        }
        .card h2 {
            margin-bottom: 20px;
            color: #1a1a1a;
            font-size: 1.25rem;
            font-weight: 700;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th {
            background: linear-gradient(135deg, #f5f7fa 0%, #e9e4f0 100%);
            padding: 14px;
            text-align: left;
            font-weight: 600;
            color: #333;
            border-bottom: 2px solid #e0e0e0;
            font-size: 0.95rem;
        }
        td {
            padding: 14px;
            border-bottom: 1px solid #e8e8e8;
            color: #666;
            font-size: 0.95rem;
        }
        tr:hover {
            background: linear-gradient(135deg, #f9fafb 0%, #f3f6ff 100%);
        }
        .btn {
            padding: 10px 18px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: 600;
            margin-right: 6px;
            transition: all 0.2s;
        }
        .btn-approve {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            box-shadow: 0 2px 8px rgba(40, 167, 69, 0.2);
        }
        .btn-approve:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        }
        .btn-reject {
            background: linear-gradient(135deg, #dc3545 0%, #ff6b6b 100%);
            color: white;
            box-shadow: 0 2px 8px rgba(220, 53, 69, 0.2);
        }
        .btn-reject:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        }
        .btn-ban {
            background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
            color: #000;
            box-shadow: 0 2px 8px rgba(255, 193, 7, 0.2);
        }
        .btn-ban:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
        }
        .btn-delete {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
            color: white;
            box-shadow: 0 2px 8px rgba(255, 107, 107, 0.2);
        }
        .btn-delete:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
        }
        .input-group {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        input[type="text"], input[type="number"], select {
            flex: 1 1 200px;
            padding: 13px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 1rem;
            background: #f9fafb;
            transition: all 0.2s;
            font-family: inherit;
        }
        input:focus, select:focus {
            outline: none;
            border-color: #f5576c;
            background: white;
            box-shadow: 0 0 0 3px rgba(245, 87, 108, 0.08);
        }
        .btn-primary {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(245, 87, 108, 0.25);
            transition: all 0.2s;
        }
        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(245, 87, 108, 0.35);
        }
        .alert {
            padding: 14px 16px;
            border-radius: 10px;
            margin-bottom: 20px;
            font-size: 0.95rem;
            font-weight: 500;
        }
        .alert-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .alert-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .badge {
            display: inline-block;
            padding: 6px 14px;
            border-radius: 12px;
            font-size: 0.9rem;
            font-weight: 600;
        }
        .badge-admin {
            background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
            color: #1976d2;
        }
        .badge-banned {
            background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
            color: #c62828;
        }
        .badge-pending {
            background: linear-gradient(135deg, #fff3cd 0%, #ffe082 100%);
            color: #856404;
        }
        .empty-state {
            text-align: center;
            padding: 48px 20px;
            color: #aaa;
        }
        .empty-state-icon {
            font-size: 3rem;
            margin-bottom: 12px;
        }
        /* Responsive Design */
        @media (max-width: 1024px) {
            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        @media (max-width: 768px) {
            .header-content {
                flex-direction: column;
                gap: 12px;
            }
            .header h1 {
                font-size: 1.4rem;
            }
            .stats-grid {
                grid-template-columns: 1fr;
            }
            .card {
                padding: 20px;
            }
            .tab {
                padding: 10px 16px;
                font-size: 0.9rem;
            }
            table {
                font-size: 0.9rem;
            }
            th, td {
                padding: 10px;
            }
        }
        @media (max-width: 480px) {
            .header h1 {
                font-size: 1.1rem;
            }
            .logout-btn {
                padding: 8px 16px;
                font-size: 0.9rem;
            }
            .stat-number {
                font-size: 1.8rem;
            }
            .card {
                padding: 16px;
            }
            .card h2 {
                font-size: 1.1rem;
            }
            .btn {
                padding: 8px 12px;
                font-size: 0.85rem;
                margin-right: 4px;
                margin-bottom: 4px;
            }
            .input-group {
                flex-direction: column;
            }
            input[type="text"], input[type="number"] {
                width: 100%;
            }
            .btn-primary {
                padding: 10px 16px;
            }
            table {
                font-size: 0.85rem;
            }
            th, td {
                padding: 8px;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <h1>🛡️ Admin Panel</h1>
            <button class="logout-btn" onclick="logout()">Logout</button>
        </div>
    </div>

    <div class="container">
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number" id="stat-users">0</div>
                <div class="stat-label">Total Users</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="stat-addresses">0</div>
                <div class="stat-label">Email Addresses</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="stat-emails">0</div>
                <div class="stat-label">Total Emails</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="stat-pending">0</div>
                <div class="stat-label">Pending Permissions</div>
            </div>
        </div>

        <div class="tabs">
            <button class="tab active" onclick="switchTab('users')">Users</button>
            <button class="tab" onclick="switchTab('addresses')">Email Addresses</button>
            <button class="tab" onclick="switchTab('emails')">All Emails</button>
            <button class="tab" onclick="switchTab('permissions')">Send Permissions</button>
            <button class="tab" onclick="switchTab('settings')">Settings</button>
        </div>

        <div id="alert-container"></div>

        <!-- Users Tab -->
        <div id="users-panel" class="tab-panel active">
            <div class="card">
                <h2>User Management</h2>
                <table>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="users-table"></tbody>
                </table>
            </div>
        </div>

        <!-- Addresses Tab -->
        <div id="addresses-panel" class="tab-panel">
            <div class="card">
                <h2>All Email Addresses</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Email Address</th>
                            <th>User ID</th>
                            <th>Created</th>
                        </tr>
                    </thead>
                    <tbody id="addresses-table"></tbody>
                </table>
            </div>
        </div>

        <!-- Emails Tab -->
        <div id="emails-panel" class="tab-panel">
            <div class="card">
                <h2>All Emails</h2>
                <table>
                    <thead>
                        <tr>
                            <th>From</th>
                            <th>To</th>
                            <th>Subject</th>
                            <th>Received</th>
                            <th>User ID</th>
                        </tr>
                    </thead>
                    <tbody id="emails-table"></tbody>
                </table>
            </div>
        </div>

        <!-- Permissions Tab -->
        <div id="permissions-panel" class="tab-panel">
            <div class="card">
                <h2>Pending Send Permissions</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Email Address</th>
                            <th>User ID</th>
                            <th>Requested</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="permissions-table"></tbody>
                </table>
            </div>
        </div>

        <!-- Settings Tab -->
        <div id="settings-panel" class="tab-panel">
            <div class="card">
                <h2>Email TTL (Time to Live)</h2>
                <p style="margin-bottom: 20px; color: #666;">Set how many days emails are kept before being automatically deleted.</p>
                <div class="input-group">
                    <input type="number" id="ttl-input" placeholder="Days" min="1">
                    <button class="btn-primary" onclick="updateTTL()">Update TTL</button>
                </div>
                <div id="current-ttl" style="color: #666; font-size: 14px;"></div>
            </div>

            <div class="card">
                <h2>Domain Configuration</h2>
                <p style="margin-bottom: 20px; color: #666;">Set the domain used for email addresses.</p>
                <div class="input-group">
                    <input type="text" id="domain-input" placeholder="example.com">
                    <button class="btn-primary" onclick="updateDomain()">Update Domain</button>
                </div>
                <div id="current-domain" style="color: #666; font-size: 14px;"></div>
            </div>
        </div>
    </div>

    <script>
        const API_BASE = '/api';
        let token = localStorage.getItem('token');

        if (!token) {
            window.location.href = '/login';
        }

        async function apiCall(endpoint, options = {}) {
            const response = await fetch(API_BASE + endpoint, {
                ...options,
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            return response;
        }

        function showAlert(message, type = 'success') {
            const container = document.getElementById('alert-container');
            container.innerHTML = \`<div class="alert alert-\${type}">\${message}</div>\`;
            setTimeout(() => container.innerHTML = '', 5000);
        }

        function switchTab(tab) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            
            event.target.classList.add('active');
            document.getElementById(tab + '-panel').classList.add('active');
            
            if (tab === 'users') loadUsers();
            if (tab === 'addresses') loadAddresses();
            if (tab === 'emails') loadEmails();
            if (tab === 'permissions') loadPermissions();
            if (tab === 'settings') loadSettings();
        }

        async function loadStats() {
            const response = await apiCall('/admin/stats');
            if (response.ok) {
                const data = await response.json();
                document.getElementById('stat-users').textContent = data.users;
                document.getElementById('stat-addresses').textContent = data.addresses;
                document.getElementById('stat-emails').textContent = data.emails;
                document.getElementById('stat-pending').textContent = data.pending_permissions;
            }
        }

        async function loadUsers() {
            const response = await apiCall('/admin/users');
            if (response.ok) {
                const data = await response.json();
                const table = document.getElementById('users-table');
                
                if (data.users.length === 0) {
                    table.innerHTML = '<tr><td colspan="4" class="empty-state">No users found</td></tr>';
                    return;
                }

                table.innerHTML = data.users.map(user => \`
                    <tr>
                        <td>\${user.id}</td>
                        <td>
                            \${user.is_admin ? '<span class="badge badge-admin">Admin</span>' : ''}
                            \${user.is_banned ? '<span class="badge badge-banned">Banned</span>' : ''}
                        </td>
                        <td>\${new Date(user.created_at * 1000).toLocaleDateString()}</td>
                        <td>
                            \${!user.is_admin ? \`
                                <button class="btn \${user.is_banned ? 'btn-approve' : 'btn-ban'}" 
                                    onclick="\${user.is_banned ? 'unbanUser' : 'banUser'}('\${user.id}')">
                                    \${user.is_banned ? 'Unban' : 'Ban'}
                                </button>
                                <button class="btn btn-delete" onclick="deleteUser('\${user.id}')">Delete</button>
                            \` : ''}
                        </td>
                    </tr>
                \`).join('');
            }
        }

        async function banUser(userId) {
            const response = await apiCall(\`/admin/users/\${userId}/ban\`, { method: 'POST' });
            if (response.ok) {
                showAlert('✅ User banned');
                loadUsers();
                loadStats();
            }
        }

        async function unbanUser(userId) {
            const response = await apiCall(\`/admin/users/\${userId}/unban\`, { method: 'POST' });
            if (response.ok) {
                showAlert('✅ User unbanned');
                loadUsers();
            }
        }

        async function deleteUser(userId) {
            if (!confirm('Delete this user and all their data?')) return;
            const response = await apiCall(\`/admin/users/\${userId}\`, { method: 'DELETE' });
            if (response.ok) {
                showAlert('✅ User deleted');
                loadUsers();
                loadStats();
            }
        }

        async function loadAddresses() {
            const response = await apiCall('/admin/addresses');
            if (response.ok) {
                const data = await response.json();
                const table = document.getElementById('addresses-table');
                
                if (data.addresses.length === 0) {
                    table.innerHTML = '<tr><td colspan="3" class="empty-state">No addresses found</td></tr>';
                    return;
                }

                table.innerHTML = data.addresses.map(addr => \`
                    <tr>
                        <td>\${addr.address}</td>
                        <td>\${addr.user_id}</td>
                        <td>\${new Date(addr.created_at * 1000).toLocaleDateString()}</td>
                    </tr>
                \`).join('');
            }
        }

        async function loadEmails() {
            const response = await apiCall('/admin/emails?limit=100');
            if (response.ok) {
                const data = await response.json();
                const table = document.getElementById('emails-table');
                
                if (data.emails.length === 0) {
                    table.innerHTML = '<tr><td colspan="5" class="empty-state">No emails found</td></tr>';
                    return;
                }

                table.innerHTML = data.emails.map(email => \`
                    <tr>
                        <td>\${email.from_address}</td>
                        <td>\${email.to_address}</td>
                        <td>\${email.subject || '(No subject)'}</td>
                        <td>\${new Date(email.received_at * 1000).toLocaleDateString()}</td>
                        <td>\${email.user_id}</td>
                    </tr>
                \`).join('');
            }
        }

        async function loadPermissions() {
            const response = await apiCall('/admin/permissions/pending');
            if (response.ok) {
                const data = await response.json();
                const table = document.getElementById('permissions-table');
                
                if (data.permissions.length === 0) {
                    table.innerHTML = '<tr><td colspan="4" class="empty-state">No pending permissions</td></tr>';
                    return;
                }

                table.innerHTML = data.permissions.map(perm => \`
                    <tr>
                        <td>\${perm.address}</td>
                        <td>\${perm.user_id}</td>
                        <td>\${new Date(perm.requested_at * 1000).toLocaleString()}</td>
                        <td>
                            <button class="btn btn-approve" onclick="approvePermission('\${perm.id}')">Approve</button>
                            <button class="btn btn-reject" onclick="rejectPermission('\${perm.id}')">Reject</button>
                        </td>
                    </tr>
                \`).join('');
            }
        }

        async function approvePermission(permId) {
            const response = await apiCall(\`/admin/permissions/\${permId}/approve\`, { method: 'POST' });
            if (response.ok) {
                showAlert('✅ Permission approved');
                loadPermissions();
                loadStats();
            }
        }

        async function rejectPermission(permId) {
            const response = await apiCall(\`/admin/permissions/\${permId}/reject\`, { method: 'POST' });
            if (response.ok) {
                showAlert('✅ Permission rejected');
                loadPermissions();
                loadStats();
            }
        }

        async function loadSettings() {
            // Load TTL
            const ttlResponse = await apiCall('/admin/settings/ttl');
            if (ttlResponse.ok) {
                const data = await ttlResponse.json();
                document.getElementById('current-ttl').textContent = \`Current TTL: \${data.ttl_days} days\`;
                document.getElementById('ttl-input').value = data.ttl_days;
            }

            // Load Domain
            const domainResponse = await apiCall('/admin/settings/domain');
            if (domainResponse.ok) {
                const data = await domainResponse.json();
                document.getElementById('current-domain').textContent = \`Current domain: \${data.domain}\`;
                document.getElementById('domain-input').value = data.domain;
            }
        }

        async function updateTTL() {
            const ttl = document.getElementById('ttl-input').value;
            const response = await apiCall('/admin/settings/ttl', {
                method: 'PUT',
                body: JSON.stringify({ ttl_days: parseInt(ttl) })
            });

            if (response.ok) {
                showAlert('✅ TTL updated');
                loadSettings();
            } else {
                showAlert('❌ Failed to update TTL', 'error');
            }
        }

        async function updateDomain() {
            const domain = document.getElementById('domain-input').value;
            const response = await apiCall('/admin/settings/domain', {
                method: 'PUT',
                body: JSON.stringify({ domain })
            });

            if (response.ok) {
                showAlert('✅ Domain updated');
                loadSettings();
            } else {
                showAlert('❌ Failed to update domain', 'error');
            }
        }

        function logout() {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        // Initialize
        loadStats();
        loadUsers();
    </script>
</body>
</html>`;
}
