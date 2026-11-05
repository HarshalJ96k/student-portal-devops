
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');

const app = require('../app');

let server;
let baseUrl;

before(async () => {
    server = http.createServer(app);

    await new Promise((resolve) => {
        server.listen(0, '127.0.0.1', resolve);
    });

    const port = server.address().port;
    baseUrl = `http://127.0.0.1:${port}`;
});

after(async () => {
    await new Promise((resolve, reject) => {
        server.close((error) => {
            if (error) reject(error);
            else resolve();
        });
    });
});

test('Health API should return successful response', async () => {
    const response = await fetch(`${baseUrl}/api/health`);

    assert.strictEqual(response.status, 200);

    const data = await response.json();

    assert.strictEqual(data.status, 'success');
    assert.strictEqual(data.application, 'Student Portal');
    assert.strictEqual(data.version, '1.0.0');
});

test('Homepage should load successfully', async () => {
    const response = await fetch(`${baseUrl}/`);

    assert.strictEqual(response.status, 200);

    const html = await response.text();

    assert.match(html, /Student Portal/);
});

const pages = [
    '/students.html',
    '/courses.html',
    '/contact.html'
];

for (const page of pages) {
    test(`${page} should load successfully`, async () => {
        const response = await fetch(`${baseUrl}${page}`);

        assert.strictEqual(response.status, 200);
    });
}
