# API Examples and Usage

## Authentication

All requests (except registration) require a bearer token:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://your-worker.workers.dev/api/user/me
\`\`\`

## User Management

### Register New User

\`\`\`bash
curl -X POST https://your-worker.workers.dev/api/user/register \\
  -H "Content-Type: application/json"
\`\`\`

Response:
\`\`\`json
{
  "success": true,
  "user": {
    "id": "uuid-here",
    "token": "save-this-token-securely",
    "is_admin": false,
    "created_at": 1234567890
  }
}
\`\`\`

### Get Current User

\`\`\`bash
curl -H "Authorization: Bearer YOUR_TOKEN" \\
  https://your-worker.workers.dev/api/user/me
\`\`\`

### Delete Account

\`\`\`bash
curl -X DELETE \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  https://your-worker.workers.dev/api/user/me
\`\`\`

## Email Address Management

### Create Email Address (Custom Prefix)

\`\`\`bash
curl -X POST https://your-worker.workers.dev/api/addresses/ \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"prefix": "john"}'
\`\`\`

Response:
\`\`\`json
{
  "success": true,
  "address": {
    "id": "address-uuid",
    "address": "john@yourdomain.com",
    "created_at": 1234567890
  }
}
\`\`\`

### Create Email Address (Random)

\`\`\`bash
curl -X POST https://your-worker.workers.dev/api/addresses/ \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{}'
\`\`\`

Response:
\`\`\`json
{
  "success": true,
  "address": {
    "id": "address-uuid",
    "address": "abc123xyz@yourdomain.com",
    "created_at": 1234567890
  }
}
\`\`\`

### List All Addresses

\`\`\`bash
curl -H "Authorization: Bearer YOUR_TOKEN" \\
  https://your-worker.workers.dev/api/addresses/
\`\`\`

Response:
\`\`\`json
{
  "addresses": [
    {
      "id": "address-uuid-1",
      "address": "john@yourdomain.com",
      "created_at": 1234567890
    },
    {
      "id": "address-uuid-2",
      "address": "abc123xyz@yourdomain.com",
      "created_at": 1234567891
    }
  ]
}
\`\`\`

### Delete Address

\`\`\`bash
curl -X DELETE \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  https://your-worker.workers.dev/api/addresses/ADDRESS_ID
\`\`\`

## Email Management

### List Emails for Address

\`\`\`bash
curl -H "Authorization: Bearer YOUR_TOKEN" \\
  https://your-worker.workers.dev/api/emails/address/ADDRESS_ID
\`\`\`

Response:
\`\`\`json
{
  "emails": [
    {
      "id": "email-uuid",
      "from_address": "sender@example.com",
      "to_address": "john@yourdomain.com",
      "subject": "Hello!",
      "received_at": 1234567890,
      "expires_at": 1237159890
    }
  ]
}
\`\`\`

### Get Email Details

\`\`\`bash
curl -H "Authorization: Bearer YOUR_TOKEN" \\
  https://your-worker.workers.dev/api/emails/EMAIL_ID
\`\`\`

Response:
\`\`\`json
{
  "email": {
    "id": "email-uuid",
    "from": "sender@example.com",
    "to": "john@yourdomain.com",
    "subject": "Hello!",
    "body_text": "Plain text body",
    "body_html": "<p>HTML body</p>",
    "received_at": 1234567890,
    "expires_at": 1237159890
  }
}
\`\`\`

### Delete Email

\`\`\`bash
curl -X DELETE \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  https://your-worker.workers.dev/api/emails/EMAIL_ID
\`\`\`

## Sending Emails

### Request Send Permission

\`\`\`bash
curl -X POST \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  https://your-worker.workers.dev/api/emails/address/ADDRESS_ID/request-send
\`\`\`

Response:
\`\`\`json
{
  "success": true,
  "permission": {
    "id": "permission-uuid",
    "status": "pending",
    "requested_at": 1234567890
  }
}
\`\`\`

### Send Email (After Approval)

\`\`\`bash
curl -X POST https://your-worker.workers.dev/api/emails/send \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "john@yourdomain.com",
    "to": "recipient@example.com",
    "subject": "Test Email",
    "text": "This is a test email",
    "html": "<p>This is a test email</p>"
  }'
\`\`\`

## Admin Operations

### Get System Statistics

\`\`\`bash
curl -H "Authorization: Bearer ADMIN_TOKEN" \\
  https://your-worker.workers.dev/api/admin/stats
\`\`\`

Response:
\`\`\`json
{
  "users": 42,
  "addresses": 156,
  "emails": 1234,
  "pending_permissions": 5
}
\`\`\`

### List All Users

\`\`\`bash
curl -H "Authorization: Bearer ADMIN_TOKEN" \\
  https://your-worker.workers.dev/api/admin/users
\`\`\`

### Ban User

\`\`\`bash
curl -X POST \\
  -H "Authorization: Bearer ADMIN_TOKEN" \\
  https://your-worker.workers.dev/api/admin/users/USER_ID/ban
\`\`\`

### Unban User

\`\`\`bash
curl -X POST \\
  -H "Authorization: Bearer ADMIN_TOKEN" \\
  https://your-worker.workers.dev/api/admin/users/USER_ID/unban
\`\`\`

### Delete User

\`\`\`bash
curl -X DELETE \\
  -H "Authorization: Bearer ADMIN_TOKEN" \\
  https://your-worker.workers.dev/api/admin/users/USER_ID
\`\`\`

### Get Pending Send Permissions

\`\`\`bash
curl -H "Authorization: Bearer ADMIN_TOKEN" \\
  https://your-worker.workers.dev/api/admin/permissions/pending
\`\`\`

### Approve Send Permission

\`\`\`bash
curl -X POST \\
  -H "Authorization: Bearer ADMIN_TOKEN" \\
  https://your-worker.workers.dev/api/admin/permissions/PERMISSION_ID/approve
\`\`\`

### Reject Send Permission

\`\`\`bash
curl -X POST \\
  -H "Authorization: Bearer ADMIN_TOKEN" \\
  https://your-worker.workers.dev/api/admin/permissions/PERMISSION_ID/reject
\`\`\`

### Get TTL Setting

\`\`\`bash
curl -H "Authorization: Bearer ADMIN_TOKEN" \\
  https://your-worker.workers.dev/api/admin/settings/ttl
\`\`\`

### Update TTL Setting

\`\`\`bash
curl -X PUT https://your-worker.workers.dev/api/admin/settings/ttl \\
  -H "Authorization: Bearer ADMIN_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"ttl_days": 30}'
\`\`\`

### Get Domain Setting

\`\`\`bash
curl -H "Authorization: Bearer ADMIN_TOKEN" \\
  https://your-worker.workers.dev/api/admin/settings/domain
\`\`\`

### Update Domain Setting

\`\`\`bash
curl -X PUT https://your-worker.workers.dev/api/admin/settings/domain \\
  -H "Authorization: Bearer ADMIN_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"domain": "yourdomain.com"}'
\`\`\`

### List All Email Addresses

\`\`\`bash
curl -H "Authorization: Bearer ADMIN_TOKEN" \\
  https://your-worker.workers.dev/api/admin/addresses
\`\`\`

### List All Emails

\`\`\`bash
curl -H "Authorization: Bearer ADMIN_TOKEN" \\
  "https://your-worker.workers.dev/api/admin/emails?limit=100&offset=0"
\`\`\`

## JavaScript/TypeScript Example

\`\`\`typescript
const API_BASE = 'https://your-worker.workers.dev/api';
const TOKEN = 'your-token-here';

async function createEmailAddress(prefix?: string) {
  const response = await fetch(\`\${API_BASE}/addresses/\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${TOKEN}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prefix })
  });
  
  const data = await response.json();
  return data;
}

async function getEmails(addressId: string) {
  const response = await fetch(\`\${API_BASE}/emails/address/\${addressId}\`, {
    headers: {
      'Authorization': \`Bearer \${TOKEN}\`
    }
  });
  
  const data = await response.json();
  return data.emails;
}

// Usage
const address = await createEmailAddress('myemail');
console.log('Created:', address.address.address);

const emails = await getEmails(address.address.id);
console.log('Emails:', emails);
\`\`\`

## Python Example

\`\`\`python
import requests

API_BASE = 'https://your-worker.workers.dev/api'
TOKEN = 'your-token-here'

def create_email_address(prefix=None):
    headers = {
        'Authorization': f'Bearer {TOKEN}',
        'Content-Type': 'application/json'
    }
    data = {'prefix': prefix} if prefix else {}
    
    response = requests.post(f'{API_BASE}/addresses/', 
                            headers=headers, 
                            json=data)
    return response.json()

def get_emails(address_id):
    headers = {'Authorization': f'Bearer {TOKEN}'}
    response = requests.get(f'{API_BASE}/emails/address/{address_id}', 
                           headers=headers)
    return response.json()['emails']

# Usage
address = create_email_address('myemail')
print(f"Created: {address['address']['address']}")

emails = get_emails(address['address']['id'])
print(f"Emails: {len(emails)}")
\`\`\`

## Error Responses

All endpoints return standard error responses:

\`\`\`json
{
  "error": "Error message describing what went wrong"
}
\`\`\`

Common HTTP status codes:
- \`400\`: Bad Request (invalid input)
- \`401\`: Unauthorized (missing/invalid token)
- \`403\`: Forbidden (admin access required)
- \`404\`: Not Found (resource doesn't exist)
- \`409\`: Conflict (duplicate email address)
- \`500\`: Internal Server Error
