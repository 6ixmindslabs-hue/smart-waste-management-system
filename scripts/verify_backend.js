import axios from 'axios';

const baseUrl = (process.argv[2] || process.env.BACKEND_URL || 'http://localhost:3000').replace(/\/$/, '');
const updateUrl = `${baseUrl}/api/bin/update`;
const statusUrl = `${baseUrl}/api/bin/status?deviceId=ScriptDebug`;
const historyUrl = `${baseUrl}/api/bin/history?deviceId=ScriptDebug`;

async function testBackend() {
    console.log('--- Testing Backend API ---');
    console.log(`Base URL: ${baseUrl}`);

    console.log(`\n[TEST 1] Sending simulated hardware update to: ${updateUrl}`);
    try {
        const updateRes = await axios.post(updateUrl, {
            deviceId: 'ScriptDebug',
            fillPercentage: 75
        });
        console.log('Update SUCCESS:', updateRes.data);
    } catch (error) {
        console.error('Update FAILED:', error.response ? error.response.data : error.message);
        process.exitCode = 1;
        return;
    }

    console.log(`\n[TEST 2] Fetching status from: ${statusUrl}`);
    try {
        const statusRes = await axios.get(statusUrl);
        console.log('Status Fetch SUCCESS:', statusRes.data);
    } catch (error) {
        console.error('Status Fetch FAILED:', error.response ? error.response.data : error.message);
        process.exitCode = 1;
        return;
    }

    console.log(`\n[TEST 3] Fetching history from: ${historyUrl}`);
    try {
        const historyRes = await axios.get(historyUrl);
        console.log(`History Fetch SUCCESS: ${Array.isArray(historyRes.data) ? historyRes.data.length : 0} record(s)`);
    } catch (error) {
        console.error('History Fetch FAILED:', error.response ? error.response.data : error.message);
        process.exitCode = 1;
    }
}

testBackend();
