const axios = require('axios');

const BASE_URL = 'http://localhost:8000/api/v2';

async function testGuestFlow() {
    console.log("=== Starting Guest Flow Verification ===");
    try {
        // 1. Test Guest User Login
        console.log("1. Testing Guest User Login...");
        const userRes = await axios.post(`${BASE_URL}/auth/guest-login`, { role: 'user' });
        console.log(`   Guest User Login: ${userRes.data.status ? '✅ Success' : '❌ Failed'}`);
        const userToken = userRes.data.token.accessToken;

        // 2. Test Guest Admin Login
        console.log("2. Testing Guest Admin Login...");
        const adminRes = await axios.post(`${BASE_URL}/auth/guest-login`, { role: 'admin' });
        console.log(`   Guest Admin Login: ${adminRes.data.status ? '✅ Success' : '❌ Failed'}`);
        const adminToken = adminRes.data.token.accessToken;

        // 3. Test Data Protection Middleware (Guest Admin trying to edit something)
        // We will just call an admin route to ensure it works
        console.log("3. Testing Admin Authorization with Guest Token...");
        try {
            const adminUsersRes = await axios.get(`${BASE_URL}/admin/users`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log(`   Admin Route Access: ${adminUsersRes.status === 200 ? '✅ Success (Read-Only OK)' : '❌ Failed'}`);
        } catch (err) {
            console.log(`   Admin Route Access: ❌ Failed (${err.response?.status})`);
        }

        console.log("=== Guest Flow Verification Completed ===");
    } catch (error) {
        console.error("❌ Test Failed:", error.response?.data || error.message);
    }
}

testGuestFlow();
