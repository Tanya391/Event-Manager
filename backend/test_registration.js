const http = require('http');

const data = JSON.stringify({
    name: "Test User",
    email: "test.script.user@gmail.com",
    studentId: "SCRIPT1",
    department: "CSE",
    year: "2024"
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/student/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => console.log('BODY:', body));
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
