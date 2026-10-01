/* ============================================================
   College Care Desk — Full Application Logic v2
   Pure HTML/CSS/JS  ·  localStorage persistence
   ============================================================ */

// ─────────────────────────────────────────────────────────────
// DATA LAYER
// ─────────────────────────────────────────────────────────────
const DB = {
  getUsers()        { return JSON.parse(localStorage.getItem('ccd_users')        || '[]');   },
  saveUsers(u)      { localStorage.setItem('ccd_users',        JSON.stringify(u)); },
  getComplaints()   { return JSON.parse(localStorage.getItem('ccd_complaints')   || '[]');   },
  saveComplaints(c) { localStorage.setItem('ccd_complaints',   JSON.stringify(c)); },
  getCurrentUser()  { return JSON.parse(sessionStorage.getItem('ccd_current')    || 'null'); },
  setCurrentUser(u) { sessionStorage.setItem('ccd_current',    JSON.stringify(u)); },
  clearCurrentUser(){ sessionStorage.removeItem('ccd_current'); },
  getPending()      { return JSON.parse(localStorage.getItem('ccd_pending_admin')|| 'null'); },
  setPending(u)     { localStorage.setItem('ccd_pending_admin', JSON.stringify(u)); },
  clearPending()    { localStorage.removeItem('ccd_pending_admin'); }
};

// ─────────────────────────────────────────────────────────────
// SEED DEMO DATA  — force re-seed if old broken version present
// ─────────────────────────────────────────────────────────────
function seedDemoData() {
  // Version stamp — if missing, wipe and re-seed clean data
  if (localStorage.getItem('ccd_version') === 'v2') {
    if (DB.getUsers().length > 0) return;
  } else {
    // Clear any stale data from v1
    localStorage.removeItem('ccd_users');
    localStorage.removeItem('ccd_complaints');
    localStorage.removeItem('ccd_pending_admin');
    localStorage.setItem('ccd_version', 'v2');
  }

  DB.saveUsers([
    { id:'u1', role:'student', email:'student@demo.com', password:'demo123',
      firstName:'Alex',    lastName:'Johnson', studentId:'STU2024001',
      department:'Computer Science',        verified:true,  createdAt: daysAgo(30) },
    { id:'u2', role:'admin',   email:'admin@demo.com',   password:'admin123',
      firstName:'Dr. Sarah', lastName:'Williams', employeeId:'ADM2024001',
      department:'IT & Systems',            verified:true,  createdAt: daysAgo(60) },
    { id:'u3', role:'student', email:'rahul@demo.com',   password:'demo123',
      firstName:'Rahul',   lastName:'Sharma',  studentId:'STU2024002',
      department:'Electrical Engineering',  verified:true,  createdAt: daysAgo(25) },
    { id:'u4', role:'student', email:'priya@demo.com',   password:'demo123',
      firstName:'Priya',   lastName:'Patel',   studentId:'STU2024003',
      department:'Mechanical Engineering',  verified:true,  createdAt: daysAgo(20) }
  ]);

  DB.saveComplaints([
    { id:'c1', userId:'u1', title:'Hostel Water Supply Issue',
      category:'Hostel',          priority:'High',   status:'Resolved',
      description:'No hot water in Block C hostel for 3 days. Significant inconvenience during winter mornings.',
      location:'Block C, Floor 2', anonymous:false,
      studentName:'Alex Johnson',  studentEmail:'student@demo.com',
      createdAt:daysAgo(10), updatedAt:daysAgo(2),
      adminResponse:'The plumbing issue has been fixed. Hot water supply restored. Apologies for the inconvenience.' },

    { id:'c2', userId:'u1', title:'Library AC Not Functioning',
      category:'Library',         priority:'Medium', status:'In Progress',
      description:'AC in the main reading hall has not been working for a week. The heat is unbearable.',
      location:'Central Library, Ground Floor', anonymous:false,
      studentName:'Alex Johnson',  studentEmail:'student@demo.com',
      createdAt:daysAgo(7), updatedAt:daysAgo(1),
      adminResponse:'Maintenance team contacted. AC parts ordered, installation within 2 days.' },

    { id:'c3', userId:'u1', title:'WiFi Connectivity in Lab B',
      category:'WiFi/Internet',   priority:'Urgent', status:'Open',
      description:'WiFi drops every 15-20 minutes in Computer Lab B, affecting practical sessions and online assessments.',
      location:'Computer Lab B, Block A', anonymous:false,
      studentName:'Alex Johnson',  studentEmail:'student@demo.com',
      createdAt:daysAgo(2), updatedAt:daysAgo(2), adminResponse:'' },

    { id:'c4', userId:'u3', title:'Broken Chairs in Lecture Hall 3',
      category:'Infrastructure',  priority:'Low',    status:'Open',
      description:'About 15 chairs in Lecture Hall 3 are broken with sharp edges that could injure students.',
      location:'Lecture Hall 3, Block B', anonymous:false,
      studentName:'Rahul Sharma',  studentEmail:'rahul@demo.com',
      createdAt:daysAgo(5), updatedAt:daysAgo(5), adminResponse:'' },

    { id:'c5', userId:'u4', title:'Poor Food Quality in Cafeteria',
      category:'Cafeteria',       priority:'Medium', status:'Closed',
      description:'Food quality has deteriorated. Found insects in the salad bar last Tuesday.',
      location:'Main Cafeteria', anonymous:false,
      studentName:'Priya Patel',   studentEmail:'priya@demo.com',
      createdAt:daysAgo(15), updatedAt:daysAgo(3),
      adminResponse:'Inspection conducted, warning issued to cafeteria management. New hygiene protocols in place.' },

    { id:'c6', userId:'u3', title:'Transport Bus Delays on Route 5',
      category:'Transport',       priority:'High',   status:'In Progress',
      description:'Route 5 bus arriving 30-45 min late consistently for 2 weeks, causing students to miss first lectures.',
      location:'Bus Stop Route 5', anonymous:false,
      studentName:'Rahul Sharma',  studentEmail:'rahul@demo.com',
      createdAt:daysAgo(8), updatedAt:daysAgo(1),
      adminResponse:'Spoken to transport contractor. Revised schedule effective from Monday.' },

    { id:'c7', userId:'u4', title:'Projector Not Working in Room 204',
      category:'Infrastructure',  priority:'Medium', status:'Open',
      description:'Projector in Room 204 has been out of order since Monday. Lectures are being affected.',
      location:'Room 204, Block B', anonymous:false,
      studentName:'Priya Patel',   studentEmail:'priya@demo.com',
      createdAt:daysAgo(3), updatedAt:daysAgo(3), adminResponse:'' },

    { id:'c8', userId:'u3', title:'Exam Schedule Conflict',
      category:'Academic',        priority:'Urgent', status:'Resolved',
      description:'Two exams scheduled at the same time on 15th April for students in dual-major programs.',
      location:'Exam Section, Admin Block', anonymous:false,
      studentName:'Rahul Sharma',  studentEmail:'rahul@demo.com',
      createdAt:daysAgo(12), updatedAt:daysAgo(4),
      adminResponse:'Schedule has been revised. One exam moved to 16th April at 2pm. Official notice posted.' }
  ]);
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
function genId() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
}

// ─────────────────────────────────────────────────────────────
// PAGE ROUTING  — FIX: don't clear alerts globally on page switch
// ─────────────────────────────────────────────────────────────
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo(0, 0);
  }
  // Only clear auth-page alerts when navigating to auth pages
  if (['page-login','page-register'].includes(pageId)) {
    document.querySelectorAll('.alert').forEach(a => a.classList.add('hidden'));
  }
  if (pageId === 'page-student-dashboard') loadStudentDashboard();
  if (pageId === 'page-admin-dashboard')   loadAdminDashboard();
}

function scrollToFeatures() {
  document.getElementById('features-section')?.scrollIntoView({ behavior:'smooth' });
}
function toggleMobileMenu() {
  const nav = document.querySelector('.nav-links');
  if (nav) nav.style.display = (nav.style.display === 'flex') ? 'none' : 'flex';
}

// ─────────────────────────────────────────────────────────────
// AUTH — LOGIN
// ─────────────────────────────────────────────────────────────
function handleLogin(e) {
  e.preventDefault();
  const email    = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;
  const errEl    = document.getElementById('login-error');

  const user = DB.getUsers().find(u => u.email.toLowerCase() === email && u.password === password);

  if (!user) {
    showAlert(errEl, '<i class="fas fa-times-circle"></i> Invalid email or password.'); return;
  }
  if (!user.verified) {
    showAlert(errEl, '<i class="fas fa-exclamation-triangle"></i> Account pending email verification.'); return;
  }

  DB.setCurrentUser(user);
  showToast(`Welcome back, ${user.firstName}! 👋`, 'success');
  showPage(user.role === 'admin' ? 'page-admin-dashboard' : 'page-student-dashboard');
}

// ─────────────────────────────────────────────────────────────
// AUTH — REGISTER
// ─────────────────────────────────────────────────────────────
function switchRegTab(tab) {
  document.getElementById('tab-student').classList.toggle('active', tab === 'student');
  document.getElementById('tab-admin').classList.toggle('active',   tab === 'admin');
  document.getElementById('form-student').classList.toggle('hidden', tab !== 'student');
  document.getElementById('form-admin').classList.toggle('hidden',   tab !== 'admin');
  document.getElementById('register-error').classList.add('hidden');
  document.getElementById('register-success').classList.add('hidden');
}

function handleRegister(e, role) {
  e.preventDefault();
  const errEl = document.getElementById('register-error');
  const sucEl = document.getElementById('register-success');
  errEl.classList.add('hidden');
  sucEl.classList.add('hidden');

  const users = DB.getUsers();

  if (role === 'student') {
    const fname = document.getElementById('s-fname').value.trim();
    const lname = document.getElementById('s-lname').value.trim();
    const email = document.getElementById('s-email').value.trim().toLowerCase();
    const sid   = document.getElementById('s-studentid').value.trim();
    const dept  = document.getElementById('s-department').value;
    const pass  = document.getElementById('s-password').value;
    const conf  = document.getElementById('s-confirm').value;

    if (!fname || !lname || !email || !sid || !dept) {
      showAlert(errEl, '<i class="fas fa-times-circle"></i> Please fill in all fields.'); return;
    }
    if (pass !== conf) {
      showAlert(errEl, '<i class="fas fa-times-circle"></i> Passwords do not match.'); return;
    }
    if (users.find(u => u.email.toLowerCase() === email)) {
      showAlert(errEl, '<i class="fas fa-times-circle"></i> Email already registered.'); return;
    }

    const newUser = {
      id: genId(), role:'student', email, password: pass,
      firstName: fname, lastName: lname, studentId: sid,
      department: dept, verified: true, createdAt: new Date().toISOString()
    };
    users.push(newUser);
    DB.saveUsers(users);
    DB.setCurrentUser(newUser);
    showToast(`Account created! Welcome, ${fname}! 🎉`, 'success');
    showPage('page-student-dashboard');

  } else {
    const fname = document.getElementById('a-fname').value.trim();
    const lname = document.getElementById('a-lname').value.trim();
    const email = document.getElementById('a-email').value.trim().toLowerCase();
    const empid = document.getElementById('a-empid').value.trim();
    const dept  = document.getElementById('a-department').value;
    const pass  = document.getElementById('a-password').value;
    const conf  = document.getElementById('a-confirm').value;

    if (!fname || !lname || !email || !empid || !dept) {
      showAlert(errEl, '<i class="fas fa-times-circle"></i> Please fill in all fields.'); return;
    }
    if (pass !== conf) {
      showAlert(errEl, '<i class="fas fa-times-circle"></i> Passwords do not match.'); return;
    }
    if (users.find(u => u.email.toLowerCase() === email)) {
      showAlert(errEl, '<i class="fas fa-times-circle"></i> Email already registered.'); return;
    }

    const newAdmin = {
      id: genId(), role:'admin', email, password: pass,
      firstName: fname, lastName: lname, employeeId: empid,
      department: dept, verified: false, createdAt: new Date().toISOString()
    };
    users.push(newAdmin);
    DB.saveUsers(users);
    DB.setPending(newAdmin);

    document.getElementById('confirm-email-addr').textContent = email;
    // Don't use showPage() here — just manually swap to avoid clearing alerts
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-email-confirm').classList.add('active');
    window.scrollTo(0, 0);
  }
}

function simulateEmailVerify() {
  const pending = DB.getPending();
  if (!pending) { showPage('page-login'); return; }
  const users = DB.getUsers();
  const idx = users.findIndex(u => u.id === pending.id);
  if (idx !== -1) { users[idx].verified = true; DB.saveUsers(users); }
  DB.clearPending();
  showToast('✅ Email verified! You can now log in.', 'success');
  showPage('page-login');
}

function handleLogout() {
  DB.clearCurrentUser();
  showToast('Logged out successfully.', '');
  showPage('page-landing');
}

// ─────────────────────────────────────────────────────────────
// STUDENT DASHBOARD
// ─────────────────────────────────────────────────────────────
function loadStudentDashboard() {
  const user = DB.getCurrentUser();
  if (!user || user.role !== 'student') { showPage('page-login'); return; }

  const initials = (user.firstName[0] + user.lastName[0]).toUpperCase();
  setEl('student-avatar', initials);
  setEl('profile-avatar-large', initials);
  setEl('s-greeting', getGreeting());
  setEl('s-welcome-name', user.firstName);

  // Profile values
  setVal('p-name',  `${user.firstName} ${user.lastName}`);
  setVal('p-email', user.email);
  setVal('p-sid',   user.studentId  || '—');
  setVal('p-dept',  user.department || '—');
  setVal('p-role',  'Student');

  // Stats
  const mine = DB.getComplaints().filter(c => c.userId === user.id);
  setEl('sc-total',      mine.length);
  setEl('sc-pending',    mine.filter(c => c.status === 'Open').length);
  setEl('sc-inprogress', mine.filter(c => c.status === 'In Progress').length);
  setEl('sc-resolved',   mine.filter(c => c.status === 'Resolved').length);

  // Recent (last 3, newest first)
  const recent = mine.slice().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
  renderComplaintCards('student-recent-list', recent, false);

  // Full list
  renderComplaintCards('student-complaints-list',
    mine.slice().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)), true);

  // Notifications
  renderStudentNotifications(mine);
}

function renderStudentNotifications(mine) {
  const updated = mine.filter(c => c.adminResponse || c.status === 'Resolved' || c.status === 'Closed');
  const badge   = document.getElementById('notif-badge');
  const list    = document.getElementById('notif-list');
  if (!list) return;

  if (updated.length === 0) {
    if (badge) badge.classList.add('hidden');
    list.innerHTML = '<div style="padding:16px;text-align:center;color:#94a3b8;font-size:0.85rem;">No new notifications</div>';
    return;
  }
  if (badge) { badge.textContent = updated.length; badge.classList.remove('hidden'); }
  list.innerHTML = updated.map(c => `
    <div class="notif-item">
      <i class="fas fa-bell notif-icon"></i>
      <div class="notif-text">
        <strong>${escHtml(c.title)}</strong>
        <small>Status: <b>${c.status}</b> · ${timeAgo(c.updatedAt)}</small>
      </div>
    </div>`).join('');
}

function toggleNotifications() {
  document.getElementById('notif-dropdown')?.classList.toggle('hidden');
}
function clearNotifs() {
  const list  = document.getElementById('notif-list');
  const badge = document.getElementById('notif-badge');
  if (list)  list.innerHTML = '<div style="padding:16px;text-align:center;color:#94a3b8;font-size:0.85rem;">No new notifications</div>';
  if (badge) badge.classList.add('hidden');
  document.getElementById('notif-dropdown')?.classList.add('hidden');
}

function showStudentTab(tab, linkEl) {
  // Deactivate all tabs + nav items inside student dashboard
  document.querySelectorAll('#page-student-dashboard .tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('#page-student-dashboard .nav-item').forEach(n => n.classList.remove('active'));

  const target = document.getElementById(`student-tab-${tab}`);
  if (target) target.classList.add('active');

  // linkEl may be null (called programmatically)
  if (linkEl) linkEl.classList.add('active');
  else {
    // Highlight the matching nav item
    document.querySelectorAll('#page-student-dashboard .nav-item').forEach(n => {
      if (n.getAttribute('onclick')?.includes(`'${tab}'`)) n.classList.add('active');
    });
  }

  const titles = { overview:'Overview', 'new-complaint':'New Complaint', 'my-complaints':'My Complaints', profile:'Profile' };
  setEl('student-page-title', titles[tab] || 'Dashboard');

  if (tab === 'my-complaints') filterStudentComplaints();
  document.getElementById('notif-dropdown')?.classList.add('hidden');
}

function filterStudentComplaints() {
  const user   = DB.getCurrentUser();
  if (!user) return;
  const search = (document.getElementById('s-search')?.value || '').toLowerCase();
  const status = document.getElementById('s-filter-status')?.value || '';
  const cat    = document.getElementById('s-filter-cat')?.value   || '';

  let list = DB.getComplaints().filter(c => c.userId === user.id);
  if (status) list = list.filter(c => c.status   === status);
  if (cat)    list = list.filter(c => c.category === cat);
  if (search) list = list.filter(c =>
    c.title.toLowerCase().includes(search) || c.description.toLowerCase().includes(search));

  list.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  renderComplaintCards('student-complaints-list', list, true);
}

// ─────────────────────────────────────────────────────────────
// COMPLAINT SUBMISSION  — FIX: no showPage() after submit,
//   just update the success message in place
// ─────────────────────────────────────────────────────────────
function handleComplaintSubmit(e) {
  e.preventDefault();
  const user  = DB.getCurrentUser();
  const errEl = document.getElementById('complaint-submit-error');
  const sucEl = document.getElementById('complaint-submit-success');
  errEl.classList.add('hidden');
  sucEl.classList.add('hidden');

  const title    = document.getElementById('c-title').value.trim();
  const category = document.getElementById('c-category').value;
  const priority = document.getElementById('c-priority').value;
  const location = document.getElementById('c-location').value.trim();
  const desc     = document.getElementById('c-description').value.trim();
  const anon     = document.getElementById('c-anonymous').checked;

  if (!title)    { showAlert(errEl, '<i class="fas fa-times-circle"></i> Please enter a title.');       return; }
  if (!category) { showAlert(errEl, '<i class="fas fa-times-circle"></i> Please select a category.');   return; }
  if (!priority) { showAlert(errEl, '<i class="fas fa-times-circle"></i> Please select a priority.');   return; }
  if (!desc)     { showAlert(errEl, '<i class="fas fa-times-circle"></i> Please enter a description.'); return; }

  const complaint = {
    id: genId(), userId: user.id,
    title, category, priority, status: 'Open',
    description: desc, location,
    anonymous: anon,
    studentName:  anon ? 'Anonymous' : `${user.firstName} ${user.lastName}`,
    studentEmail: anon ? 'anonymous@college.edu' : user.email,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    adminResponse: ''
  };

  const all = DB.getComplaints();
  all.push(complaint);
  DB.saveComplaints(all);

  // ✅ Show success in-place — do NOT call showPage() which would kill this message
  showAlert(sucEl, '<i class="fas fa-check-circle"></i> Complaint submitted successfully! The admin team will review it shortly.');
  document.getElementById('complaint-form').reset();

  // Silently refresh stats in the background without navigating away
  const mine = DB.getComplaints().filter(c => c.userId === user.id);
  setEl('sc-total',      mine.length);
  setEl('sc-pending',    mine.filter(c => c.status === 'Open').length);
  setEl('sc-inprogress', mine.filter(c => c.status === 'In Progress').length);
  setEl('sc-resolved',   mine.filter(c => c.status === 'Resolved').length);
  renderComplaintCards('student-recent-list',
    mine.slice().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0,3), false);
  renderComplaintCards('student-complaints-list',
    mine.slice().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)), true);

  showToast('Complaint submitted! 📋', 'success');
}

function resetComplaintForm() {
  document.getElementById('complaint-form').reset();
  document.getElementById('complaint-submit-error').classList.add('hidden');
  document.getElementById('complaint-submit-success').classList.add('hidden');
}

// ─────────────────────────────────────────────────────────────
// RENDER COMPLAINT CARDS  (shared by student + admin)
// ─────────────────────────────────────────────────────────────
function renderComplaintCards(containerId, list, showEmpty, isAdmin) {
  const el = document.getElementById(containerId);
  if (!el) return;

  if (!list || list.length === 0) {
    el.innerHTML = showEmpty
      ? `<div class="empty-state">
           <i class="fas fa-inbox"></i>
           <h3>No complaints found</h3>
           <p>Try adjusting your filters or submit a new complaint.</p>
         </div>`
      : `<div class="empty-state">
           <i class="fas fa-smile"></i>
           <h3>No recent activity</h3>
           <p>All clear! No complaints filed yet.</p>
         </div>`;
    return;
  }

  el.innerHTML = list.map(c => `
    <div class="complaint-card" onclick="openComplaintModal('${c.id}', ${isAdmin ? 'true' : 'false'})">
      <div class="cc-header">
        <div class="cc-title">${escHtml(c.title)}</div>
        ${c.anonymous ? '<span class="badge badge-anon"><i class="fas fa-user-secret"></i> Anonymous</span>' : ''}
      </div>
      <div class="cc-meta">
        <span class="badge ${statusBadge(c.status)}">${c.status}</span>
        <span class="badge badge-cat">${escHtml(c.category)}</span>
        <span class="badge ${priorityBadge(c.priority)}">${c.priority}</span>
      </div>
      <div class="cc-desc">${escHtml(c.description).substring(0,130)}${c.description.length > 130 ? '…' : ''}</div>
      <div class="cc-footer">
        <span class="cc-date">
          ${isAdmin ? `<i class="fas fa-user"></i> ${escHtml(c.studentName)} &nbsp;·&nbsp;` : ''}
          <i class="fas fa-clock"></i> ${timeAgo(c.createdAt)}
        </span>
        ${c.adminResponse
          ? '<span class="cc-responded"><i class="fas fa-comment-dots"></i> Responded</span>'
          : (isAdmin ? '<span class="cc-awaiting"><i class="fas fa-comment"></i> Awaiting response</span>' : '')}
      </div>
    </div>`).join('');
}

// ─────────────────────────────────────────────────────────────
// ADMIN DASHBOARD  — FIX: render everything eagerly on load
// ─────────────────────────────────────────────────────────────
function loadAdminDashboard() {
  const user = DB.getCurrentUser();
  if (!user || user.role !== 'admin') { showPage('page-login'); return; }

  const initials = (user.firstName[0] + user.lastName[0]).toUpperCase();
  setEl('admin-avatar',         initials);
  setEl('admin-profile-avatar', initials);
  setEl('admin-welcome-name',   `Welcome back, ${user.firstName} ${user.lastName}!`);

  // Profile fields
  setVal('ap-name',  `${user.firstName} ${user.lastName}`);
  setVal('ap-email', user.email);
  setVal('ap-empid', user.employeeId || '—');
  setVal('ap-dept',  user.department || '—');
  setVal('ap-role',  'Administrator');

  const complaints = DB.getComplaints();
  const students   = DB.getUsers().filter(u => u.role === 'student');

  // Stats
  setEl('ac-total',      complaints.length);
  setEl('ac-open',       complaints.filter(c => c.status === 'Open').length);
  setEl('ac-inprogress', complaints.filter(c => c.status === 'In Progress').length);
  setEl('ac-resolved',   complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length);
  setEl('ac-users',      students.length);

  // Charts & feeds
  renderCategoryChart(complaints);
  renderActivityFeed(complaints);

  // ✅ FIX: render complaint list & user list immediately (they stay in DOM even when tab is hidden)
  renderAdminComplaintList(complaints);
  renderUserList(DB.getUsers());
}

function renderCategoryChart(complaints) {
  const el = document.getElementById('category-chart');
  if (!el) return;
  const counts = {};
  complaints.forEach(c => { counts[c.category] = (counts[c.category] || 0) + 1; });
  const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]);
  const max    = sorted[0]?.[1] || 1;

  if (!sorted.length) {
    el.innerHTML = '<div class="empty-state" style="padding:20px"><i class="fas fa-chart-bar"></i><p>No data yet</p></div>';
    return;
  }
  el.innerHTML = sorted.map(([cat, n]) => `
    <div class="bar-item">
      <div class="bar-label">${escHtml(cat)}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(n/max*100).toFixed(0)}%"></div></div>
      <div class="bar-count">${n}</div>
    </div>`).join('');
}

function renderActivityFeed(complaints) {
  const el = document.getElementById('admin-recent-activity');
  if (!el) return;
  const recent = complaints.slice()
    .sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 6);

  if (!recent.length) {
    el.innerHTML = '<div class="empty-state" style="padding:20px"><i class="fas fa-stream"></i><p>No activity yet</p></div>';
    return;
  }
  el.innerHTML = recent.map(c => `
    <div class="activity-item">
      <i class="fas ${categoryIcon(c.category)} activity-icon"></i>
      <div class="activity-text">
        <strong>${escHtml(c.title)}</strong>
        <small>${escHtml(c.studentName)} · <span class="badge ${statusBadge(c.status)}" style="font-size:0.68rem;padding:2px 7px">${c.status}</span> · ${timeAgo(c.updatedAt)}</small>
      </div>
    </div>`).join('');
}

function showAdminTab(tab, linkEl) {
  document.querySelectorAll('#page-admin-dashboard .tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('#page-admin-dashboard .nav-item').forEach(n => n.classList.remove('active'));

  const target = document.getElementById(`admin-tab-${tab}`);
  if (target) target.classList.add('active');
  if (linkEl) linkEl.classList.add('active');

  const titles = { overview:'Overview', 'all-complaints':'All Complaints', users:'Manage Users', 'admin-profile':'Profile' };
  setEl('admin-page-title', titles[tab] || 'Admin');
}

function filterAdminComplaints() {
  const search   = (document.getElementById('a-search')?.value       || '').toLowerCase();
  const status   = document.getElementById('a-filter-status')?.value || '';
  const cat      = document.getElementById('a-filter-cat')?.value    || '';
  const priority = document.getElementById('a-filter-priority')?.value || '';

  let list = DB.getComplaints();
  if (status)   list = list.filter(c => c.status   === status);
  if (cat)      list = list.filter(c => c.category === cat);
  if (priority) list = list.filter(c => c.priority === priority);
  if (search)   list = list.filter(c =>
    c.title.toLowerCase().includes(search)       ||
    c.studentName.toLowerCase().includes(search) ||
    c.description.toLowerCase().includes(search));

  list.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  renderAdminComplaintList(list);
}

function renderAdminComplaintList(list) {
  const el = document.getElementById('admin-complaints-list');
  if (!el) return;
  renderComplaintCards('admin-complaints-list', list, true, true);
}

function filterUsers() {
  const search = (document.getElementById('u-search')?.value       || '').toLowerCase();
  const role   = document.getElementById('u-filter-role')?.value   || '';

  let list = DB.getUsers();
  if (role)   list = list.filter(u => u.role === role);
  if (search) list = list.filter(u =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search) ||
    u.email.toLowerCase().includes(search));

  renderUserList(list);
}

function renderUserList(users) {
  const el = document.getElementById('admin-users-list');
  if (!el) return;

  if (!users.length) {
    el.innerHTML = `<div class="empty-state"><i class="fas fa-users"></i><h3>No users found</h3></div>`;
    return;
  }

  const complaints = DB.getComplaints();
  el.innerHTML = `
    <div class="users-table">
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th>
            <th>ID</th><th>Department</th><th>Complaints</th><th>Joined</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(u => `
          <tr>
            <td><strong>${escHtml(u.firstName)} ${escHtml(u.lastName)}</strong></td>
            <td style="color:#64748b">${escHtml(u.email)}</td>
            <td><span class="badge ${u.role==='admin'?'badge-urgent':'badge-cat'}">${u.role==='admin'?'🛡️ Admin':'🎓 Student'}</span></td>
            <td style="color:#64748b;font-size:0.8rem">${escHtml(u.studentId||u.employeeId||'—')}</td>
            <td style="font-size:0.85rem">${escHtml(u.department||'—')}</td>
            <td style="text-align:center"><strong>${u.role==='student' ? complaints.filter(c=>c.userId===u.id).length : '—'}</strong></td>
            <td style="font-size:0.8rem;color:#94a3b8">${formatDate(u.createdAt)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

// ─────────────────────────────────────────────────────────────
// COMPLAINT DETAIL MODAL
// ─────────────────────────────────────────────────────────────
function openComplaintModal(id, isAdmin) {
  const c = DB.getComplaints().find(x => x.id === id);
  if (!c) return;

  setEl('modal-title', escHtml(c.title));

  setEl('modal-meta', `
    <span class="badge ${statusBadge(c.status)}">${c.status}</span>
    <span class="badge badge-cat">${escHtml(c.category)}</span>
    <span class="badge ${priorityBadge(c.priority)}">${c.priority}</span>
    ${c.anonymous ? '<span class="badge badge-anon"><i class="fas fa-user-secret"></i> Anonymous</span>' : ''}`);

  setEl('modal-desc', `
    <div class="modal-filed-info">
      ${!c.anonymous ? `<span><i class="fas fa-user"></i> ${escHtml(c.studentName)}</span>` : ''}
      ${c.location   ? `<span><i class="fas fa-map-marker-alt"></i> ${escHtml(c.location)}</span>` : ''}
      <span><i class="fas fa-calendar-alt"></i> ${formatDate(c.createdAt)}</span>
    </div>
    <p style="line-height:1.75;color:#475569;margin-top:12px">${escHtml(c.description)}</p>`);

  const adminSec = document.getElementById('modal-admin-section');

  if (isAdmin) {
    adminSec.innerHTML = `
      <hr style="margin:18px 0;border-color:#f1f5f9"/>
      <div class="modal-admin-label"><i class="fas fa-user-shield"></i> Admin Actions</div>

      <div class="modal-action-row">
        <label style="font-size:0.82rem;font-weight:600;color:#475569;white-space:nowrap">Update Status</label>
        <select id="modal-status-sel" class="modal-sel">
          <option value="Open"        ${c.status==='Open'        ?'selected':''}>Open</option>
          <option value="In Progress" ${c.status==='In Progress' ?'selected':''}>In Progress</option>
          <option value="Resolved"    ${c.status==='Resolved'    ?'selected':''}>Resolved</option>
          <option value="Closed"      ${c.status==='Closed'      ?'selected':''}>Closed</option>
        </select>
        <button class="btn-update" onclick="updateComplaintStatus('${c.id}')">
          <i class="fas fa-save"></i> Save
        </button>
      </div>

      <div class="modal-response-box">
        <label><i class="fas fa-comment-dots"></i> Admin Response / Notes</label>
        <textarea id="modal-response-text" rows="4"
          placeholder="Add a response or update notes for the student…">${escHtml(c.adminResponse||'')}</textarea>
        <button class="btn-update btn-full" onclick="saveAdminResponse('${c.id}')">
          <i class="fas fa-paper-plane"></i> Send Response
        </button>
      </div>`;
  } else {
    adminSec.innerHTML = c.adminResponse
      ? `<div class="admin-response-display">
           <strong><i class="fas fa-user-shield"></i> Admin Response</strong>
           <p>${escHtml(c.adminResponse)}</p>
         </div>`
      : `<div class="pending-notice">
           <i class="fas fa-hourglass-half"></i>
           Your complaint is under review. You will be notified once admin responds.
         </div>`;
  }

  document.getElementById('complaint-modal').classList.remove('hidden');
}

function updateComplaintStatus(id) {
  const sel = document.getElementById('modal-status-sel');
  if (!sel) return;
  const complaints = DB.getComplaints();
  const idx = complaints.findIndex(c => c.id === id);
  if (idx === -1) return;
  complaints[idx].status    = sel.value;
  complaints[idx].updatedAt = new Date().toISOString();
  DB.saveComplaints(complaints);
  showToast(`Status updated to "${sel.value}"`, 'success');
  closeModal();
  loadAdminDashboard();
}

function saveAdminResponse(id) {
  const txt = document.getElementById('modal-response-text');
  if (!txt) return;
  const complaints = DB.getComplaints();
  const idx = complaints.findIndex(c => c.id === id);
  if (idx === -1) return;
  complaints[idx].adminResponse = txt.value.trim();
  complaints[idx].updatedAt     = new Date().toISOString();
  DB.saveComplaints(complaints);
  showToast('Response saved!', 'success');
  closeModal();
  loadAdminDashboard();
}

function closeModal() {
  document.getElementById('complaint-modal').classList.add('hidden');
}
function closeModalOutside(e) {
  if (e.target === document.getElementById('complaint-modal')) closeModal();
}

// ─────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────
function toggleSidebar(id) {
  document.getElementById(id)?.classList.toggle('open');
}

// ─────────────────────────────────────────────────────────────
// PASSWORD VISIBILITY
// ─────────────────────────────────────────────────────────────
function togglePwd(inputId, icon) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  const show = inp.type === 'password';
  inp.type = show ? 'text' : 'password';
  icon.classList.toggle('fa-eye',       !show);
  icon.classList.toggle('fa-eye-slash',  show);
}

// ─────────────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────────────
let _toastTimer;
function showToast(msg, type) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast' + (type ? ' ' + type : '');
  t.classList.remove('hidden');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.add('hidden'), 3500);
}

// ─────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────
function setEl(id, html) { const e=document.getElementById(id); if(e) e.innerHTML=html; }
function setVal(id, v)   { const e=document.getElementById(id); if(e) e.value=v; }
function showAlert(el, msg) { if(!el) return; el.innerHTML=msg; el.classList.remove('hidden'); }

function escHtml(s) {
  return String(s||'')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening';
}

function timeAgo(iso) {
  if (!iso) return '';
  const diff  = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  if (mins < 1)  return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs  < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
}

function statusBadge(s) {
  return { 'Open':'badge-open', 'In Progress':'badge-inprogress', 'Resolved':'badge-resolved', 'Closed':'badge-closed' }[s] || 'badge-open';
}
function priorityBadge(p) {
  return { 'Low':'badge-low', 'Medium':'badge-medium', 'High':'badge-high', 'Urgent':'badge-urgent' }[p] || 'badge-low';
}
function categoryIcon(cat) {
  return { 'Academic':'fa-book','Hostel':'fa-bed','Infrastructure':'fa-building',
           'Library':'fa-book-open','Transport':'fa-bus','WiFi/Internet':'fa-wifi',
           'Cafeteria':'fa-utensils','Sports':'fa-futbol','Administration':'fa-file-alt',
           'Other':'fa-ellipsis-h' }[cat] || 'fa-exclamation-circle';
}

// ─────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  seedDemoData();

  const user = DB.getCurrentUser();
  if (user) {
    showPage(user.role === 'admin' ? 'page-admin-dashboard' : 'page-student-dashboard');
  } else {
    showPage('page-landing');
  }

  // Close notification dropdown on outside click
  document.addEventListener('click', e => {
    const dd   = document.getElementById('notif-dropdown');
    const bell = document.querySelector('.notification-bell');
    if (dd && !dd.classList.contains('hidden') &&
        !dd.contains(e.target) && !bell?.contains(e.target)) {
      dd.classList.add('hidden');
    }
    // Close sidebar on mobile
    if (window.innerWidth <= 900) {
      document.querySelectorAll('.sidebar.open').forEach(s => {
        if (!s.contains(e.target) && !e.target.closest('.sidebar-toggle')) {
          s.classList.remove('open');
        }
      });
    }
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
});
