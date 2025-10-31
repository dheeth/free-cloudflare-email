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
    <title>Free Cloudflare Email - Login</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 40px;
            max-width: 400px;
            width: 100%;
            animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 28px;
            text-align: center;
        }

        .subtitle {
            color: #666;
            text-align: center;
            margin-bottom: 30px;
            font-size: 14px;
        }

        .tab-container {
            display: flex;
            margin-bottom: 30px;
            border-bottom: 2px solid #eee;
        }

        .tab {
            flex: 1;
            padding: 10px;
            text-align: center;
            cursor: pointer;
            color: #666;
            font-weight: 500;
            transition: all 0.3s;
            border-bottom: 3px solid transparent;
            margin-bottom: -2px;
        }

        .tab.active {
            color: #667eea;
            border-bottom-color: #667eea;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 500;
            font-size: 14px;
        }

        input {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 14px;
            transition: all 0.3s;
        }

        input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .btn {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .btn:active {
            transform: translateY(0);
        }

        .message {
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: none;
            font-size: 14px;
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
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-top: 15px;
            word-break: break-all;
            font-family: monospace;
            font-size: 12px;
            border: 2px dashed #667eea;
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
            animation: fadeIn 0.3s ease-in;
        }

        .info-box {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            font-size: 13px;
            color: #1565c0;
            border-left: 4px solid #1976d2;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📧 Email System</h1>
        <p class="subtitle">Free Cloudflare Email Management</p>

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
    <title>Dashboard - Email System</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f7fa;
            min-height: 100vh;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .header-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header h1 {
            font-size: 24px;
        }

        .logout-btn {
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid white;
            color: white;
            padding: 8px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
        }

        .logout-btn:hover {
            background: white;
            color: #667eea;
        }

        .container {
            max-width: 1200px;
            margin: 30px auto;
            padding: 0 20px;
        }

        .tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
            border-bottom: 2px solid #e0e0e0;
        }

        .tab {
            padding: 12px 24px;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 15px;
            font-weight: 600;
            color: #666;
            border-bottom: 3px solid transparent;
            margin-bottom: -2px;
            transition: all 0.3s;
        }

        .tab.active {
            color: #667eea;
            border-bottom-color: #667eea;
        }

        .tab-panel {
            display: none;
            animation: fadeIn 0.3s ease-in;
        }

        .tab-panel.active {
            display: block;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
        }

        .card h2 {
            margin-bottom: 20px;
            color: #333;
            font-size: 20px;
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
        }

        .btn-secondary {
            background: #f0f0f0;
            color: #333;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            margin-left: 10px;
        }

        .btn-danger {
            background: #dc3545;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
        }

        .input-group {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }

        input[type="text"], input[type="email"], textarea {
            flex: 1;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
        }

        input:focus, textarea:focus {
            outline: none;
            border-color: #667eea;
        }

        .email-list {
            list-style: none;
        }

        .email-item {
            padding: 15px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s;
        }

        .email-item:hover {
            border-color: #667eea;
            background: #f8f9ff;
        }

        .email-info {
            flex: 1;
        }

        .email-address {
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
        }

        .email-meta {
            font-size: 13px;
            color: #666;
        }

        .message-list {
            list-style: none;
        }

        .message-item {
            padding: 15px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            margin-bottom: 10px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .message-item:hover {
            border-color: #667eea;
            background: #f8f9ff;
        }

        .message-subject {
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
        }

        .message-from {
            font-size: 13px;
            color: #666;
            margin-bottom: 3px;
        }

        .message-date {
            font-size: 12px;
            color: #999;
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
        }

        .modal.active {
            display: flex;
        }

        .modal-content {
            background: white;
            border-radius: 12px;
            padding: 30px;
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
        }

        .alert {
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .alert-success {
            background: #d4edda;
            color: #155724;
        }

        .alert-error {
            background: #f8d7da;
            color: #721c24;
        }

        .alert-info {
            background: #d1ecf1;
            color: #0c5460;
        }

        .empty-state {
            text-align: center;
            padding: 40px;
            color: #999;
        }

        .empty-state-icon {
            font-size: 48px;
            margin-bottom: 15px;
        }

        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
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
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <h1>📧 Email Dashboard</h1>
            <button class="logout-btn" onclick="logout()">Logout</button>
        </div>
    </div>

    <div class="container">
        <div class="tabs">
            <button class="tab active" onclick="switchTab('addresses')">My Addresses</button>
            <button class="tab" onclick="switchTab('inbox')">Inbox</button>
            <button class="tab" onclick="switchTab('send')">Send Email</button>
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
                <select id="inbox-address-select" onchange="onInboxAddressChange()" style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid #e0e0e0;">
                    <option value="">Select an address...</option>
                </select>
                <button class="btn-secondary" id="refresh-inbox-btn" style="margin-left:10px;" onclick="manualInboxRefresh()">Refresh</button>
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
                <div class="alert alert-info">
                    📮 You need admin approval to send emails. Request permission first, then you can send emails once approved.
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">From Address:</label>
                    <select id="send-from-select" style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid #e0e0e0;">
                        <option value="">Select your address...</option>
                    </select>
                    <button class="btn-secondary" onclick="requestSendPermission()" style="margin-top: 10px;">Request Send Permission</button>
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
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            <div id="modal-body"></div>
        </div>
    </div>

    <script>
        const API_BASE = '/api';
        let token = localStorage.getItem('token');
        let addresses = [];

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
            // Find the tab button by tab name
            const tabBtn = Array.from(document.querySelectorAll('.tab')).find(btn => btn.textContent.replace(/\s/g, '').toLowerCase().includes(tab));
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
                <li class="message-item" onclick="viewEmail('\${email.id}')">
                    <div class="message-subject">\${email.subject || '(No subject)'}</div>
                    <div class="message-from">From: \${email.from_address}</div>
                    <div class="message-date">\${new Date(email.received_at * 1000).toLocaleString()}</div>
                </li>
            \`).join('');
        }

        async function viewEmail(emailId) {
            const response = await apiCall('/emails/' + emailId);
            if (response.ok) {
                const data = await response.json();
                const email = data.email;
                
                document.getElementById('modal-subject').textContent = email.subject || '(No subject)';
                document.getElementById('modal-body').innerHTML = \`
                    <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 2px solid #eee;">
                        <div style="margin-bottom: 10px;"><strong>From:</strong> \${email.from}</div>
                        <div style="margin-bottom: 10px;"><strong>To:</strong> \${email.to}</div>
                        <div><strong>Date:</strong> \${new Date(email.received_at * 1000).toLocaleString()}</div>
                    </div>
                    <div style="white-space: pre-wrap;">\${email.body_html || email.body_text || '(No content)'}</div>
                \`;
                
                document.getElementById('email-modal').classList.add('active');
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
            } else {
                const error = await response.json();
                showAlert('❌ ' + (error.error || error.message), 'error');
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

        // Also re-setup auto-refresh on tab switch
        document.querySelectorAll('.tab').forEach(tabBtn => {
            tabBtn.addEventListener('click', function(e) {
                const tab = this.textContent.replace(/\s/g, '').toLowerCase().includes('inbox') ? 'inbox' :
                            this.textContent.replace(/\s/g, '').toLowerCase().includes('addresses') ? 'addresses' :
                            this.textContent.replace(/\s/g, '').toLowerCase().includes('send') ? 'send' : 'addresses';
                switchTab(tab);
                setupInboxAutoRefresh();
            });
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
    <title>Admin Panel - Email System</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f7fa;
            min-height: 100vh;
        }

        .header {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .header-content {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header h1 {
            font-size: 24px;
        }

        .logout-btn {
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid white;
            color: white;
            padding: 8px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
        }

        .logout-btn:hover {
            background: white;
            color: #f5576c;
        }

        .container {
            max-width: 1400px;
            margin: 30px auto;
            padding: 0 20px;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .stat-number {
            font-size: 36px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
        }

        .stat-label {
            color: #666;
            font-size: 14px;
        }

        .tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
            border-bottom: 2px solid #e0e0e0;
            flex-wrap: wrap;
        }

        .tab {
            padding: 12px 24px;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 15px;
            font-weight: 600;
            color: #666;
            border-bottom: 3px solid transparent;
            margin-bottom: -2px;
            transition: all 0.3s;
        }

        .tab.active {
            color: #f5576c;
            border-bottom-color: #f5576c;
        }

        .tab-panel {
            display: none;
        }

        .tab-panel.active {
            display: block;
        }

        .card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
        }

        .card h2 {
            margin-bottom: 20px;
            color: #333;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            background: #f8f9fa;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #333;
            border-bottom: 2px solid #e0e0e0;
        }

        td {
            padding: 12px;
            border-bottom: 1px solid #e0e0e0;
        }

        tr:hover {
            background: #f8f9ff;
        }

        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            margin-right: 5px;
            transition: all 0.2s;
        }

        .btn-approve {
            background: #28a745;
            color: white;
        }

        .btn-reject {
            background: #dc3545;
            color: white;
        }

        .btn-ban {
            background: #ffc107;
            color: #000;
        }

        .btn-delete {
            background: #dc3545;
            color: white;
        }

        .btn:hover {
            transform: translateY(-2px);
            opacity: 0.9;
        }

        .input-group {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }

        input {
            flex: 1;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
        }

        .btn-primary {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
        }

        .alert {
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .alert-success {
            background: #d4edda;
            color: #155724;
        }

        .alert-error {
            background: #f8d7da;
            color: #721c24;
        }

        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }

        .badge-admin {
            background: #e3f2fd;
            color: #1976d2;
        }

        .badge-banned {
            background: #ffebee;
            color: #c62828;
        }

        .badge-pending {
            background: #fff3cd;
            color: #856404;
        }

        .empty-state {
            text-align: center;
            padding: 40px;
            color: #999;
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
