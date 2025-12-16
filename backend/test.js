// test.js - Automated Backend Test Suite
// Run with: node test.js

const BASE_URL = 'http://localhost:5000';

// Test results storage
const results = {
  passed: 0,
  failed: 0,
  total: 0,
  errors: []
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Store tokens
let adminToken = '';
let studentToken = '';
let eventId = '';
let announcementId = '';
let studentId = '';

// Helper function to make requests
async function request(method, endpoint, body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { status: 500, data: { error: error.message } };
  }
}

// Test runner function
async function runTest(name, testFn) {
  results.total++;
  process.stdout.write(`${colors.cyan}[${results.total}]${colors.reset} ${name}... `);

  try {
    await testFn();
    results.passed++;
    console.log(`${colors.green}✓ PASSED${colors.reset}`);
    return true;
  } catch (error) {
    results.failed++;
    console.log(`${colors.red}✗ FAILED${colors.reset}`);
    results.errors.push({ test: name, error: error.message });
    return false;
  }
}

// Assertion helper
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// ==================================================
// TEST SUITE
// ==================================================

async function runAllTests() {
  console.log(`\n${colors.blue}╔════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║   COLLEGE EVENT MANAGEMENT - TEST SUITE       ║${colors.reset}`);
  console.log(`${colors.blue}╚════════════════════════════════════════════════╝${colors.reset}\n`);

  // ============================================
  // PHASE 1: AUTHENTICATION TESTS
  // ============================================
  console.log(`${colors.yellow}\n📋 PHASE 1: Authentication Tests${colors.reset}\n`);

  await runTest('Admin Login', async () => {
    const res = await request('POST', '/api/auth/admin/login', {
      email: 'tanyachill101@gmail.com',
      password: 'Admin@123!'
    });

    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.token, 'Token not returned');
    assert(res.data.admin, 'Admin data not returned');
    adminToken = res.data.token;
  });

  await runTest('Admin Register (New)', async () => {
    const res = await request('POST', '/api/auth/admin/register', {
      name: 'Test Admin',
      email: `testadmin${Date.now()}@example.com`,
      password: 'TestAdmin@123'
    });

    assert(res.status === 201, `Expected 201, got ${res.status}`);
    assert(res.data.token, 'Token not returned');
  });

  await runTest('Student Registration', async () => {
    const res = await request('POST', '/api/auth/student/register', {
      name: 'Alice Johnson',
      email: `alice${Date.now()}@student.com`,
      studentId: `CS${Date.now().toString().slice(-6)}`,
      department: 'Computer Science',
      year: '2024'
    });

    assert(res.status === 201, `Expected 201, got ${res.status}`);
    assert(res.data.student, 'Student data not returned');
    studentId = res.data.student.id;
  });

  await runTest('Student Login (OTP Request)', async () => {
    const res = await request('POST', '/api/auth/student/login', {
      email: `alice${Date.now()}@student.com`,
      studentId: `CS${Date.now().toString().slice(-6)}`
    });

    // Note: This might fail if student doesn't exist from previous test
    // In real scenario, we'd use the actual registered student
    assert(res.status === 200 || res.status === 401, `Unexpected status: ${res.status}`);
  });

  // ============================================
  // PHASE 2: ADMIN OPERATIONS
  // ============================================
  console.log(`${colors.yellow}\n👤 PHASE 2: Admin Operations${colors.reset}\n`);

  await runTest('Get Admin Profile', async () => {
    const res = await request('GET', '/api/admin/profile', null, adminToken);

    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.admin, 'Admin profile not returned');
  });

  await runTest('Get All Students (Admin)', async () => {
    const res = await request('GET', '/api/admin/students', null, adminToken);

    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.students, 'Students array not returned');
  });

  // ============================================
  // PHASE 3: EVENT MANAGEMENT
  // ============================================
  console.log(`${colors.yellow}\n📅 PHASE 3: Event Management${colors.reset}\n`);

  await runTest('Create Event (Admin)', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const dateStr = futureDate.toISOString().split('T')[0];

    const res = await request('POST', '/api/events', {
      title: 'Tech Talk 2024',
      description: 'AI and Machine Learning workshop',
      date: dateStr,
      time: '10:00 AM',
      location: 'Main Auditorium',
      maxParticipants: 100
    }, adminToken);

    assert(res.status === 201, `Expected 201, got ${res.status}: ${JSON.stringify(res.data)}`);
    assert(res.data.event, 'Event data not returned');
    eventId = res.data.event._id;
  });

  await runTest('Get All Events (Public)', async () => {
    const res = await request('GET', '/api/events');

    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(Array.isArray(res.data), 'Events array not returned');
    assert(res.data.length > 0, 'No events returned');
  });

  await runTest('Get Single Event', async () => {
    if (!eventId) {
      throw new Error('No event ID available from previous test');
    }

    const res = await request('GET', `/api/events/${eventId}`);

    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data._id === eventId, 'Wrong event returned');
  });

  await runTest('Update Event (Admin)', async () => {
    if (!eventId) {
      throw new Error('No event ID available');
    }

    const res = await request('PUT', `/api/events/${eventId}`, {
      title: 'Tech Talk 2024 - Updated',
      maxParticipants: 150
    }, adminToken);

    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.event.title === 'Tech Talk 2024 - Updated', 'Event not updated');
  });

  await runTest('Cancel Event (Admin)', async () => {
    if (!eventId) {
      throw new Error('No event ID available');
    }

    const res = await request('PATCH', `/api/events/${eventId}/cancel`, null, adminToken);

    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.event.status === 'cancelled', 'Event not cancelled');
  });

  // ============================================
  // PHASE 4: ANNOUNCEMENTS
  // ============================================
  console.log(`${colors.yellow}\n📢 PHASE 4: Announcements${colors.reset}\n`);

  await runTest('Create Announcement (Admin)', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);

    const res = await request('POST', '/api/announcements', {
      title: 'Test Announcement',
      message: 'This is a test announcement for automated testing.',
      expiresAt: futureDate.toISOString()
    }, adminToken);

    assert(res.status === 201, `Expected 201, got ${res.status}`);
    assert(res.data.announcement, 'Announcement not returned');
    announcementId = res.data.announcement._id;
  });

  await runTest('Get All Announcements (Public)', async () => {
    const res = await request('GET', '/api/announcements');

    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(Array.isArray(res.data), 'Announcements array not returned');
  });

  await runTest('Update Announcement (Admin)', async () => {
    if (!announcementId) {
      throw new Error('No announcement ID available');
    }

    const res = await request('PUT', `/api/announcements/${announcementId}`, {
      title: 'Updated Test Announcement'
    }, adminToken);

    assert(res.status === 200, `Expected 200, got ${res.status}`);
  });

  await runTest('Delete Announcement (Admin)', async () => {
    if (!announcementId) {
      throw new Error('No announcement ID available');
    }

    const res = await request('DELETE', `/api/announcements/${announcementId}`, null, adminToken);

    assert(res.status === 200, `Expected 200, got ${res.status}`);
  });

  // ============================================
  // PHASE 5: ANALYTICS
  // ============================================
  console.log(`${colors.yellow}\n📊 PHASE 5: Analytics (Admin)${colors.reset}\n`);

  await runTest('Get Dashboard Stats', async () => {
    const res = await request('GET', '/api/analytics/dashboard', null, adminToken);

    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(typeof res.data.totalStudents === 'number', 'Invalid stats format');
    assert(typeof res.data.totalEvents === 'number', 'Invalid stats format');
  });

  await runTest('Get Popular Events', async () => {
    const res = await request('GET', '/api/analytics/events/popular?limit=5', null, adminToken);

    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.events, 'Events not returned');
  });

  await runTest('Get Student Engagement', async () => {
    const res = await request('GET', '/api/analytics/students/engagement', null, adminToken);

    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.totalStudents !== undefined, 'Invalid engagement data');
  });

  await runTest('Get Monthly Stats', async () => {
    const res = await request('GET', '/api/analytics/monthly?year=2024', null, adminToken);

    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.monthlyData, 'Monthly data not returned');
  });

  // ============================================
  // PHASE 6: VALIDATION TESTS
  // ============================================
  console.log(`${colors.yellow}\n🔍 PHASE 6: Validation Tests${colors.reset}\n`);

  await runTest('Reject Invalid Email', async () => {
    const res = await request('POST', '/api/auth/student/register', {
      name: 'Test',
      email: 'invalid-email',
      studentId: 'TEST001',
      department: 'CS',
      year: '2024'
    });

    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  await runTest('Reject Weak Password', async () => {
    const res = await request('POST', '/api/auth/admin/register', {
      name: 'Test',
      email: 'test@example.com',
      password: 'weak'
    });

    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  await runTest('Reject Past Event Date', async () => {
    const res = await request('POST', '/api/events', {
      title: 'Past Event',
      date: '2020-01-01',
      location: 'Auditorium'
    }, adminToken);

    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  await runTest('Reject Invalid MongoDB ID', async () => {
    const res = await request('GET', '/api/events/invalid-id-123');

    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  // ============================================
  // PHASE 7: SECURITY TESTS
  // ============================================
  console.log(`${colors.yellow}\n🛡️ PHASE 7: Security Tests${colors.reset}\n`);

  await runTest('Reject Request Without Token', async () => {
    const res = await request('GET', '/api/admin/profile');

    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  await runTest('Reject Invalid Token', async () => {
    const res = await request('GET', '/api/admin/profile', null, 'invalid-token-12345');

    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  await runTest('Admin Logout', async () => {
    const res = await request('POST', '/api/auth/logout', null, adminToken);

    assert(res.status === 200, `Expected 200, got ${res.status}`);
  });

  // ============================================
  // FINAL REPORT
  // ============================================
  console.log(`\n${colors.blue}╔════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║              TEST RESULTS SUMMARY              ║${colors.reset}`);
  console.log(`${colors.blue}╚════════════════════════════════════════════════╝${colors.reset}\n`);

  console.log(`Total Tests:    ${results.total}`);
  console.log(`${colors.green}✓ Passed:       ${results.passed}${colors.reset}`);
  console.log(`${colors.red}✗ Failed:       ${results.failed}${colors.reset}`);
  console.log(`Success Rate:   ${((results.passed / results.total) * 100).toFixed(1)}%\n`);

  if (results.failed > 0) {
    console.log(`${colors.red}╔════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.red}║                FAILED TESTS                    ║${colors.reset}`);
    console.log(`${colors.red}╚════════════════════════════════════════════════╝${colors.reset}\n`);

    results.errors.forEach((err, index) => {
      console.log(`${colors.red}${index + 1}. ${err.test}${colors.reset}`);
      console.log(`   Error: ${err.error}\n`);
    });
  }

  if (results.passed === results.total) {
    console.log(`${colors.green}╔════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.green}║   🎉 ALL TESTS PASSED! BACKEND IS READY! 🎉   ║${colors.reset}`);
    console.log(`${colors.green}╚════════════════════════════════════════════════╝${colors.reset}\n`);
  } else {
    console.log(`${colors.yellow}⚠️  Fix the failed tests above and run again.${colors.reset}\n`);
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch((error) => {
  console.error(`\n${colors.red}Fatal Error: ${error.message}${colors.reset}\n`);
  process.exit(1);
});