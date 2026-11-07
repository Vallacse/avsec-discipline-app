// --- 1. FIREBASE CONFIG & INITIALIZATION ---
const firebaseConfig = {
  apiKey: "AIzaSyCkMb0RB-V8TnpsQZtSCENtnA7nfRgxLE4",
  authDomain: "avs-discipline.firebaseapp.com",
  databaseURL: "https://avs-discipline-default-rtdb.firebaseio.com",
  projectId: "avs-discipline",
  storageBucket: "avs-discipline.firebasestorage.app",
  messagingSenderId: "7052808975",
  appId: "1:7052808975:web:40c6e367fbefb74e79e47a",
  measurementId: "G-3J48WVLRNP"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- 2. GLOBAL STATE & CONFIG DATA ---
let currentUser = null;
let userRole = null;
let currentReportMode = 'day';

const DEPARTMENTS = ["AI&DS", "BME", "CIVIL", "CSE", "CSE(AI&ML)", "ECE", "EEE", "IT", "MECH", "MBA", "MCA"];
const YEARS = ["I", "II", "III", "IV"];

// Faculty roster fallback
const sampleFaculty = [
  { id: "f-ambika", name: "Dr. K. Ambika", department: "AI&DS", email: "" },
  { id: "f-vallarasu", name: "Mr. P. Vallarasu", department: "AI&DS", email: "" },
  { id: "f-abirami", name: "Mrs. A. Abirami", department: "AI&DS", email: "" },
  { id: "f-nandhini", name: "Ms. S. Nandhini", department: "AI&DS", email: "" },
  { id: "f-mohan", name: "Dr. S. Mohan", department: "BME", email: "" },
  { id: "f-gogulprasath", name: "Mr. R. Gogulprasath", department: "BME", email: "" },
  { id: "f-ravi", name: "Mr. Ravi C", department: "CSE", email: "" },
  { id: "f-someshwaran", name: "Mr. Someshwaran S", department: "CSE", email: "" },
  { id: "f-nivetha", name: "Mrs. Nivetha KP", department: "CSE", email: "" },
  { id: "f-kisothkumar", name: "Mr. Kisothkumar S", department: "CSE", email: "" },
  { id: "f-ramya", name: "Mrs. R. S. Ramya", department: "ECE", email: "" },
  { id: "f-rajesh", name: "Mr. M. Rajesh", department: "ECE", email: "" },
  { id: "f-parthasarathy", name: "Dr. J. Parthasarathy", department: "IT", email: "" },
  { id: "f-indhumathi", name: "Mrs. Indhumathi R", department: "IT", email: "" },
  { id: "f-nithya", name: "Dr. Nithya R", department: "MBA", email: "" },
  { id: "f-balaji", name: "Mr. Balaji M", department: "MBA", email: "" },
  { id: "f-anand-ravi", name: "Mr. Anand Ravi", department: "MBA", email: "" },
  { id: "f-arulmani", name: "Dr. L. Arulmani", department: "MECH", email: "" },
  { id: "f-viswanathan", name: "Dr. R. Viswanathan", department: "MECH", email: "" },
  { id: "f-joshua", name: "Dr. D. R. Joshua", department: "MECH", email: "" },
  { id: "f-anandakumar", name: "Mr. R. Anandakumar", department: "MECH", email: "" },
  { id: "f-navaneethan", name: "Mr. Navaneethan N", department: "EEE", email: "" },
  { id: "f-umarani", name: "Dr. P. Umarani", department: "S&H", email: "" },
  { id: "f-anandhu", name: "Mr. A. Anandhu", department: "S&H", email: "" },
  { id: "f-silambarasan", name: "Mr. V. Silambarasan", department: "S&H", email: "" },
  { id: "f-sridhar", name: "Mr. P. Sridhar", department: "S&H", email: "" },
  { id: "f-arunagiri", name: "Mr. N. Arunagiri", department: "S&H", email: "" },
  { id: "f-saravanan", name: "Mr. K. Saravanan", department: "S&H", email: "" },
  { id: "f-janarthanan", name: "Dr. G. Janarthanan", department: "CIVIL", email: "" },
  { id: "f-abuthaheer", name: "Mr. S. Abuthaheer", department: "CIVIL", email: "" },
];

// Locations & Blocks
const COMMON_BLOCKS = [
  "Gate",
   "In Front of Boys Hostel",
  "Student Two-Wheeler Parking",
  "Near Coffee Day",
  "Ground",
  "Near Stage",
  "In Front of SkillEdge Block",
  "Near Bus Shed",
  "APJ Abdul Kalam Block (Main Block)",
  "H. J. Bhabha Block (EEE Block)",
  "Srinivasa Ramanujan Block (First Year Block)",
  "J. C. Bose Block (Civil & Mech Block)",
  "Ratan Tata Block (MBA Block)",
  "Mahatma Gandhi Block (Library)",
  "M. S. Dhoni Block (Canteen & Sports Complex)",
  "SkillEdge Block",
  "Kailash Boys Hostel",
  "Sivakami Ammal Girls Hostel",
  "Others"
];
const BLOCK_BY_DEPT = {
//  "AI&DS": ["AI&DS Block", "AI&DS Lab 1", "AI&DS Lab 2"],
//   "BME": ["BME Block", "Biomedical Instrumentation Lab", "Anatomy & Physiology Lab"],
//   "CIVIL": ["CIVIL Block", "Surveying Lab", "Concrete Testing Lab"],
//   "CSE": ["CSE Block - Ground Floor", "CSE Block - First Floor", "CSE Computer Lab 1", "CSE Computer Lab 2"],
//   "CSE(AI&ML)": ["CSE(AI&ML) Block", "AI&ML Lab 1", "AI&ML Lab 2"],
//   "ECE": ["ECE Block", "ECE Communication Lab", "ECE VLSI Lab"],
//   "EEE": ["EEE Block", "EEE Machines Lab", "EEE Power Systems Lab"],
//   "IT": ["IT Block", "IT Server Room", "IT Software Lab"],
//   "MECH": ["MECH Block", "MECH Workshop", "MECH CAD Lab", "Foundry Shop"],
//   "MBA": ["MBA Block", "MBA Seminar Hall"],
//   "MCA": ["MCA Block", "MCA Computer Lab"] 
};

// Issues
const COMMON_ISSUES = [
  "Late Arrival",
  "Dress Code Violation",
  "Not Wearing ID Card",
  "Wearing Ornaments",
  "Mobile Phone Usage",
  "Misbehavior",
  "Improper Hairstyle",
  "Not Wearing Shoes",
  "Roaming in Other Departments",
  "Roaming in Common Areas During Class Hours",
  "Parking Misuse",
  "Bike Stunt",
  "Playing During Class Hours",
  "Roaming During Class Hours",
  "Unauthorized Exit",
  "Inappropriate Interaction with Opposite Gender",
  "Ragging",
  "Drug Use",
  "Triple Riding",
  "Riding Without a Helmet"
];
const ISSUE_BY_DEPT = {
  // "AI&DS": ["Lab Equipment Misuse", "Unauthorized Software Usage"],
  // "BME": ["Lab Equipment Misuse", "Equipment Safety Violation"],
  // "CIVIL": ["Site Visit Safety Violation", "Survey Equipment Misuse"],
  // "CSE": ["Lab Equipment Misuse", "Unauthorized Software Usage"],
  // "CSE(AI&ML)": ["Lab Equipment Misuse", "Unauthorized Software Usage"],
  // "ECE": ["Lab Equipment Misuse", "Communication Lab Safety Violation"],
  // "EEE": ["Lab Equipment Misuse", "Electrical Safety Violation"],
  // "IT": ["Lab Equipment Misuse", "Unauthorized Software Usage", "Server Room Unauthorized Access"],
  // "MECH": ["Workshop Safety Violation", "Machine Misuse", "PPE Non-Compliance"],
  // "MBA": ["Seminar / Presentation Non-Compliance"],
  // "MCA": ["Lab Equipment Misuse", "Unauthorized Software Usage"]
};

function getBlocksForDept(dept) {
  return [...(BLOCK_BY_DEPT[dept] || []), ...COMMON_BLOCKS];
}
function getIssuesForDept(dept) {
  return [...COMMON_ISSUES, ...(ISSUE_BY_DEPT[dept] || [])];
}
function getAllFacultyFlat() {
  return (facultyCache || []).map(f => ({ name: f.name, dept: f.department || '' }));
}
function getAllIssuesFlat() {
  const set = new Set(COMMON_ISSUES);
  DEPARTMENTS.forEach(d => (ISSUE_BY_DEPT[d] || []).forEach(i => set.add(i)));
  return [...set].sort();
}

// Fallback demo students
const sampleStudents = [
  { id: "92762104001", name: "John Doe", regNo: "92762104001", department: "CSE", year: "III", section: "A" },
  { id: "92762104002", name: "Jane Smith", regNo: "92762104002", department: "ECE", year: "III", section: "B" },
  { id: "92762108012", name: "Alex Johnson", regNo: "92762108012", department: "MECH", year: "II", section: "A" },
  { id: "92762104045", name: "Sarah Williams", regNo: "92762104045", department: "IT", year: "IV", section: "B" },
  { id: "92762105021", name: "Michael Raj", regNo: "92762105021", department: "EEE", year: "II", section: "B" },
  { id: "92762106015", name: "Priya Sharma", regNo: "92762106015", department: "CIVIL", year: "III", section: "A" }
];

const studentCache = {};
let studentsSeeded = null;

async function isStudentsCollectionSeeded() {
  if (studentsSeeded !== null) return studentsSeeded;
  try {
    const snap = await db.collection('students').limit(1).get();
    studentsSeeded = !snap.empty;
  } catch (err) {
    studentsSeeded = false;
  }
  return studentsSeeded;
}

async function fetchStudentsForDeptYear(dept, year) {
  const key = `${dept}|${year}`;
  if (studentCache[key]) return studentCache[key];

  const seeded = await isStudentsCollectionSeeded();
  let list;

  if (seeded) {
    const snap = await db.collection('students')
      .where('department', '==', dept)
      .where('year', '==', year)
      .get();
    list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } else {
    list = sampleStudents.filter(s => s.department === dept && s.year === year);
  }

  studentCache[key] = list;
  return list;
}

let facultyCache = null;
let facultySeeded = null;

async function isFacultyCollectionSeeded() {
  if (facultySeeded !== null) return facultySeeded;
  try {
    const snap = await db.collection('faculty').limit(1).get();
    facultySeeded = !snap.empty;
  } catch (err) {
    facultySeeded = false;
  }
  return facultySeeded;
}

async function fetchAllFaculty(forceRefresh) {
  if (facultyCache && !forceRefresh) return facultyCache;

  const seeded = await isFacultyCollectionSeeded();
  let list;

  if (seeded) {
    const snap = await db.collection('faculty').orderBy('name').get();
    list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } else {
    list = sampleFaculty;
  }

  facultyCache = list;
  return list;
}

// --- 3. LOGIN & TAB NAVIGATION LOGIC ---

// Listen for authentication state changes (Persists login across reloads)
auth.onAuthStateChanged(async (user) => {
  if (user) {
    currentUser = user;
    try {
      const userDoc = await db.collection('users').doc(currentUser.uid).get();

      if (userDoc.exists) {
        userRole = userDoc.data().role;

        document.getElementById('login-view').classList.add('hidden');
        document.getElementById('user-info').classList.remove('hidden');

        if (userRole === 'admin') {
          document.getElementById('user-role-badge').innerText = "Admin Portal";
          document.getElementById('admin-view').classList.remove('hidden');
          loadAdminDashboard();
        } else if (userRole === 'faculty') {
          document.getElementById('user-role-badge').innerText = "Faculty Portal";
          document.getElementById('faculty-view').classList.remove('hidden');
          initFacultyRoster();
        }
      } else {
        await auth.signOut();
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      await auth.signOut();
    }
  } else {
    currentUser = null;
    userRole = null;

    document.getElementById('login-view').classList.remove('hidden');
    document.getElementById('user-info').classList.add('hidden');
    document.getElementById('admin-view').classList.add('hidden');
    document.getElementById('faculty-view').classList.add('hidden');
  }
});

// Handle Login Form Submit
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const selectedRole = document.getElementById('login-role').value;
  const loginBtn = document.getElementById('login-btn');

  loginBtn.innerText = "Authenticating...";
  loginBtn.disabled = true;

  try {
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    const res = await auth.signInWithEmailAndPassword(email, password);
    const userDoc = await db.collection('users').doc(res.user.uid).get();

    if (!userDoc.exists || userDoc.data().role !== selectedRole) {
      await auth.signOut();
      throw new Error(`Access Denied. You are not authorized for the ${selectedRole.toUpperCase()} portal.`);
    }
  } catch (err) {
    alert("Login Error: " + err.message);
  } finally {
    loginBtn.innerText = "Sign In";
    loginBtn.disabled = false;
  }
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
  auth.signOut().then(() => location.reload()).catch(() => location.reload());
});

// Bottom Nav Switcher
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const clickedBtn = e.target.closest('.nav-item');
    if (!clickedBtn) return;

    const container = clickedBtn.closest('section');
    container.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    container.querySelectorAll('.tab-content').forEach(c => {
      c.classList.remove('active');
    });

    clickedBtn.classList.add('active');
    const targetContent = document.getElementById(clickedBtn.dataset.tab);
    targetContent.classList.add('active');
  });
});

// --- 4. FACULTY INCIDENT BOOKING DROPDOWNS ---
const deptSelect = document.getElementById('select-dept');
const facultySelect = document.getElementById('faculty-name-select');
const yearSelect = document.getElementById('select-year');
const blockSelect = document.getElementById('block-name-select');
const issueSelect = document.getElementById('discipline-type');
const searchInput = document.getElementById('student-search');
const autoList = document.getElementById('autocomplete-list');

function fillSelect(selectEl, options, placeholder) {
  selectEl.innerHTML = '';
  const ph = document.createElement('option');
  ph.value = '';
  ph.innerText = placeholder;
  selectEl.appendChild(ph);
  options.forEach(opt => {
    const o = document.createElement('option');
    o.value = opt;
    o.innerText = opt;
    selectEl.appendChild(o);
  });
}

function resetStudentSelection() {
  autoList.classList.add('hidden');
  autoList.innerHTML = '';
  searchInput.value = '';
  document.getElementById('disp-reg-no').innerText = "—";
  document.getElementById('disp-year-sec').innerText = "—";
  document.getElementById('disp-prior-count').innerText = "—";
  document.getElementById('disp-prior-count-box').classList.remove('ok');
  document.getElementById('selected-student-id').value = "";
}

async function updateStudentSearchEnabled() {
  resetStudentSelection();
  const dept = deptSelect.value;
  const year = yearSelect.value;

  if (!dept || !year) {
    searchInput.disabled = true;
    searchInput.placeholder = "Select department & year first...";
    return;
  }

  searchInput.disabled = true;
  searchInput.placeholder = "Loading class list...";
  try {
    const list = await fetchStudentsForDeptYear(dept, year);
    searchInput.disabled = false;
    searchInput.placeholder = list.length
      ? "Type student name or reg no..."
      : "No students on record for this class";
  } catch (err) {
    searchInput.placeholder = "Failed to load students — try again";
  }
}

async function initFacultyRoster() {
  fillSelect(facultySelect, [], "Loading faculty...");
  facultySelect.disabled = true;
  try {
    const roster = await fetchAllFaculty();
    fillSelect(facultySelect, roster.map(f => f.name), "Select faculty");
    facultySelect.disabled = false;
  } catch (err) {
    fillSelect(facultySelect, [], "Failed to load faculty — refresh");
  }
}

deptSelect.addEventListener('change', () => {
  const dept = deptSelect.value;

  if (dept) {
    fillSelect(yearSelect, YEARS, "Select year");
    yearSelect.disabled = false;

    fillSelect(blockSelect, getBlocksForDept(dept), "Select block / location");
    blockSelect.disabled = false;

    fillSelect(issueSelect, getIssuesForDept(dept), "Select discipline issue");
    issueSelect.disabled = false;
  } else {
    fillSelect(yearSelect, [], "Select department first");
    yearSelect.disabled = true;
    fillSelect(blockSelect, [], "Select department first");
    blockSelect.disabled = true;
    fillSelect(issueSelect, [], "Select department first");
    issueSelect.disabled = true;
  }
  updateStudentSearchEnabled();
});

yearSelect.addEventListener('change', updateStudentSearchEnabled);

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase().trim();
  const selectedDept = deptSelect.value;
  const selectedYear = yearSelect.value;
  autoList.innerHTML = '';

  if (!query || !selectedDept || !selectedYear) {
    autoList.classList.add('hidden');
    return;
  }

  const list = studentCache[`${selectedDept}|${selectedYear}`] || [];
  const matches = list.filter(s =>
    s.name.toLowerCase().includes(query) || s.regNo.includes(query)
  );

  if (matches.length > 0) {
    autoList.classList.remove('hidden');
    matches.forEach(student => {
      const li = document.createElement('li');
      li.innerHTML = `${student.name} <span class="ac-reg">${student.regNo}</span>`;
      li.onclick = () => selectStudent(student);
      autoList.appendChild(li);
    });
  } else {
    autoList.classList.add('hidden');
  }
});

async function selectStudent(student) {
  searchInput.value = student.name;
  document.getElementById('disp-reg-no').innerText = student.regNo;
  document.getElementById('disp-year-sec').innerText = `${student.year} / ${student.section}`;
  document.getElementById('selected-student-id').value = student.id;
  autoList.classList.add('hidden');

  const priorEl = document.getElementById('disp-prior-count');
  const priorBox = document.getElementById('disp-prior-count-box');
  priorEl.innerText = "...";

  try {
    const snap = await db.collection('discipline_incidents').where('studentId', '==', student.id).get();
    const count = snap.size;
    priorEl.innerText = count;
    priorBox.classList.toggle('ok', count === 0);
  } catch (err) {
    priorEl.innerText = "N/A";
  }
}

// Save Incident
document.getElementById('discipline-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const incidentDate = document.getElementById('incident-date').value;
  const incidentTime = document.getElementById('incident-time').value;
  const dept = deptSelect.value;
  const year = yearSelect.value;
  const studentId = document.getElementById('selected-student-id').value;
  const facultyName = facultySelect.value;
  const blockName = blockSelect.value;
  const violationType = issueSelect.value;
  const comments = document.getElementById('other-comments').value.trim();

  if (!studentId) return alert("Please select a valid student from the search list.");

  const submitBtn = document.getElementById('submit-incident-btn');
  submitBtn.disabled = true;
  submitBtn.innerText = "Submitting...";

  try {
    const classList = studentCache[`${dept}|${year}`] || [];
    const student = classList.find(s => s.id === studentId);
    if (!student) return alert("Student record not found — please search again.");

    await db.collection('discipline_incidents').add({
      dateString: incidentDate,
      timeString: incidentTime,
      department: dept,
      year: year,
      studentId: student.id,
      studentName: student.name,
      regNo: student.regNo,
      section: student.section,
      facultyName: facultyName,
      blockName: blockName,
      violationType: violationType,
      comments: comments,
      loggedByEmail: currentUser.email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("Incident successfully registered!");
    document.getElementById('discipline-form').reset();
    document.getElementById('incident-date').value = todayStr();
    document.getElementById('incident-time').value = nowTimeStr();

    fillSelect(yearSelect, [], "Select department first");
    yearSelect.disabled = true;
    fillSelect(blockSelect, [], "Select department first");
    blockSelect.disabled = true;
    fillSelect(issueSelect, [], "Select department first");
    issueSelect.disabled = true;
    updateStudentSearchEnabled();
  } catch (err) {
    alert("Error saving record: " + err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = "Submit Incident";
  }
});

// --- 5. FACULTY REPORTS ---
document.getElementById('report-mode-toggle').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-mode]');
  if (!btn) return;
  currentReportMode = btn.dataset.mode;
  document.querySelectorAll('#report-mode-toggle button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.report-mode-panel').forEach(p => p.classList.add('hidden'));
  document.getElementById(`report-mode-${currentReportMode}`).classList.remove('hidden');
});

function docTimeMillis(doc) {
  const d = doc.data();
  return d.timestamp && d.timestamp.toMillis ? d.timestamp.toMillis() : 0;
}

document.getElementById('fetch-faculty-report').addEventListener('click', async () => {
  let label = "";
  let dayVal, startVal, endVal;

  if (currentReportMode === 'day') {
    dayVal = document.getElementById('report-date').value;
    if (!dayVal) return alert("Select a date.");
    label = dayVal;
  } else if (currentReportMode === 'range') {
    startVal = document.getElementById('report-start-date').value;
    endVal = document.getElementById('report-end-date').value;
    if (!startVal || !endVal) return alert("Select both start and end date.");
    label = `${startVal} to ${endVal}`;
  } else {
    label = "All Time";
  }

  try {
    const snapshot = await db.collection('discipline_incidents')
      .where('loggedByEmail', '==', currentUser.email)
      .get();

    let docs = snapshot.docs.filter(doc => {
      const d = doc.data();
      if (currentReportMode === 'day') return d.dateString === dayVal;
      if (currentReportMode === 'range') return d.dateString >= startVal && d.dateString <= endVal;
      return true;
    });

    docs.sort((a, b) => docTimeMillis(b) - docTimeMillis(a));

    const tbody = document.querySelector('#faculty-report-table tbody');
    tbody.innerHTML = '';

    document.getElementById('selected-date-lbl').innerText = label;
    document.getElementById('report-export-area').classList.remove('hidden');

    if (docs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;">No records found for this period.</td></tr>';
      return;
    }

    docs.forEach(doc => {
      const data = doc.data();
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${data.dateString || 'N/A'}</td>
        <td class="mono">${data.timeString || 'N/A'}</td>
        <td>${data.studentName || 'N/A'}</td>
        <td class="mono">${data.regNo || 'N/A'}</td>
        <td>${data.department || 'N/A'}</td>
        <td>${data.year || 'N/A'}</td>
        <td>${data.section || 'N/A'}</td>
        <td>${data.violationType || 'N/A'}</td>
        <td>${data.blockName || 'N/A'}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    alert("Failed to fetch reports: " + err.message);
  }
});

// --- 6. ADMIN DASHBOARD & ANALYTICS ---
function daysAgoStr(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}
function todayStr() { return new Date().toISOString().split('T')[0]; }
function nowTimeStr() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

async function loadAdminDashboard() {
  try {
    const snapshot = await db.collection('discipline_incidents').orderBy('timestamp', 'desc').get();
    const todayVal = todayStr();
    const weekStart = daysAgoStr(6);

    let total = 0;
    let todayCount = 0;
    let weekCount = 0;
    const facultyCounts = {};
    const activeFaculty = new Set();

    snapshot.forEach(doc => {
      const d = doc.data();
      total++;
      if (d.dateString === todayVal) todayCount++;
      if (d.dateString >= weekStart && d.dateString <= todayVal) weekCount++;

      const fName = d.facultyName || d.loggedByEmail || 'Unknown';
      const fDept = d.department || '';
      const key = `${fName}||${fDept}`;
      facultyCounts[key] = (facultyCounts[key] || 0) + 1;
      activeFaculty.add(fName);
    });

    document.getElementById('total-bookings-count').innerText = total;
    document.getElementById('today-bookings-count').innerText = todayCount;
    document.getElementById('week-bookings-count').innerText = weekCount;
    document.getElementById('active-faculty-count').innerText = activeFaculty.size;

    renderFacultySummary(facultyCounts);
    await populateAdminFilterOptions();
    renderAdminTable(snapshot.docs);
    refreshStudentCounts();
    refreshFacultyCounts();
  } catch (err) {
    console.error("Admin dashboard load error: ", err);
  }
}

function renderFacultySummary(facultyCounts) {
  const container = document.getElementById('faculty-summary-list');
  const entries = Object.entries(facultyCounts).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    container.innerHTML = '<p class="empty-note">No data yet.</p>';
    return;
  }

  const maxCount = entries[0][1];
  container.innerHTML = '';
  entries.forEach(([key, count]) => {
    const [name, dept] = key.split('||');
    const barWidth = Math.max(8, Math.round((count / maxCount) * 60));
    const row = document.createElement('div');
    row.className = 'faculty-summary-row';
    row.innerHTML = `
      <span class="fs-name">${name}</span>
      <span class="fs-dept">${dept}</span>
      <span class="fs-bar" style="width:${barWidth}px;"></span>
      <span class="fs-count">${count}</span>
    `;
    container.appendChild(row);
  });
}

async function populateAdminFilterOptions() {
  await fetchAllFaculty();
  const facultySelectEl = document.getElementById('admin-faculty-filter');
  const currentFacultyVal = facultySelectEl.value || 'ALL';
  facultySelectEl.innerHTML = '<option value="ALL">All Faculty</option>';
  getAllFacultyFlat().forEach(f => {
    const o = document.createElement('option');
    o.value = f.name;
    o.innerText = `${f.name} (${f.dept})`;
    facultySelectEl.appendChild(o);
  });
  facultySelectEl.value = currentFacultyVal;

  const issueSelectEl = document.getElementById('admin-issue-filter');
  const currentIssueVal = issueSelectEl.value || 'ALL';
  issueSelectEl.innerHTML = '<option value="ALL">All Discipline Issues</option>';
  getAllIssuesFlat().forEach(issue => {
    const o = document.createElement('option');
    o.value = issue;
    o.innerText = issue;
    issueSelectEl.appendChild(o);
  });
  issueSelectEl.value = currentIssueVal;
}

document.getElementById('apply-admin-filters').addEventListener('click', async () => {
  const dept = document.getElementById('admin-dept-filter').value;
  const facultyFilter = document.getElementById('admin-faculty-filter').value;
  const issueType = document.getElementById('admin-issue-filter').value;
  const searchQuery = document.getElementById('admin-student-filter').value.toLowerCase().trim();
  const startDate = document.getElementById('admin-start-date').value;
  const endDate = document.getElementById('admin-end-date').value;

  try {
    let query = db.collection('discipline_incidents');
    if (dept !== 'ALL') {
      query = query.where('department', '==', dept);
    }

    const snapshot = await query.get();
    let docs = snapshot.docs;

    docs = docs.filter(doc => {
      const d = doc.data();
      let keep = true;

      if (issueType !== 'ALL' && d.violationType !== issueType) keep = false;
      if (facultyFilter !== 'ALL' && d.facultyName !== facultyFilter) keep = false;

      if (searchQuery) {
        const matchesName = d.studentName ? d.studentName.toLowerCase().includes(searchQuery) : false;
        const matchesRegNo = d.regNo ? d.regNo.includes(searchQuery) : false;
        if (!matchesName && !matchesRegNo) keep = false;
      }

      if (startDate && d.dateString < startDate) keep = false;
      if (endDate && d.dateString > endDate) keep = false;

      return keep;
    });

    docs.sort((a, b) => docTimeMillis(b) - docTimeMillis(a));
    renderAdminTable(docs);
  } catch (err) {
    alert("Filter error: " + err.message);
  }
});

function renderAdminTable(docs) {
  const tbody = document.querySelector('#admin-report-table tbody');
  tbody.innerHTML = '';

  if (docs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;">No matching records found.</td></tr>';
    return;
  }

  docs.forEach(doc => {
    const data = doc.data();
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${data.dateString || 'N/A'}</td>
      <td class="mono">${data.timeString || 'N/A'}</td>
      <td>${data.facultyName || data.loggedByEmail || 'N/A'}</td>
      <td>${data.studentName || 'N/A'}</td>
      <td class="mono">${data.regNo || 'N/A'}</td>
      <td>${data.department || 'N/A'}</td>
      <td>${data.year || 'N/A'}</td>
      <td>${data.section || 'N/A'}</td>
      <td><strong>${data.violationType || 'N/A'}</strong></td>
      <td>${data.blockName || 'N/A'}</td>
    `;
    tbody.appendChild(tr);
  });
}

// --- 7. BULK IMPORT MANAGEMENT ---
const studentFileInput = document.getElementById('student-file-input');
const importStudentsBtn = document.getElementById('import-students-btn');
const importStatusEl = document.getElementById('import-status');
let pendingImportFile = null;

if (studentFileInput) {
  studentFileInput.addEventListener('change', () => {
    pendingImportFile = studentFileInput.files[0] || null;
    importStudentsBtn.disabled = !pendingImportFile;
    importStatusEl.classList.add('hidden');
  });
}

function readFileAsRows(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const isCsv = file.name.toLowerCase().endsWith('.csv');

    reader.onload = () => {
      try {
        const workbook = isCsv
          ? XLSX.read(reader.result, { type: 'string' })
          : XLSX.read(reader.result, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        resolve(rows);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);

    if (isCsv) reader.readAsText(file);
    else reader.readAsArrayBuffer(file);
  });
}

function setImportStatus(message, kind) {
  importStatusEl.textContent = message;
  importStatusEl.classList.remove('hidden', 'status-ok', 'status-err');
  if (kind) importStatusEl.classList.add(kind);
}

if (importStudentsBtn) {
  importStudentsBtn.addEventListener('click', async () => {
    if (!pendingImportFile) return;
    importStudentsBtn.disabled = true;
    importStudentsBtn.innerText = "Reading file...";
    setImportStatus("Reading file...", null);

    try {
      const rows = await readFileAsRows(pendingImportFile);

      const validRows = [];
      const skipped = [];
      rows.forEach((row, idx) => {
        const name = String(row.name || '').trim();
        const regNo = String(row.regNo || '').trim();
        const department = String(row.department || '').trim().toUpperCase();
        const year = String(row.year || '').trim().toUpperCase();
        const section = String(row.section || '').trim();

        if (!name || !regNo || !DEPARTMENTS.includes(department) || !YEARS.includes(year)) {
          skipped.push(idx + 2);
          return;
        }
        validRows.push({ name, regNo, department, year, section });
      });

      if (validRows.length === 0) {
        setImportStatus("No valid rows found. Check column names.", 'status-err');
        return;
      }

      importStudentsBtn.innerText = "Uploading...";
      const CHUNK_SIZE = 400;
      for (let i = 0; i < validRows.length; i += CHUNK_SIZE) {
        const chunk = validRows.slice(i, i + CHUNK_SIZE);
        const batch = db.batch();
        chunk.forEach(s => {
          const ref = db.collection('students').doc(s.regNo);
          batch.set(ref, s, { merge: true });
        });
        await batch.commit();
        setImportStatus(`Uploaded ${Math.min(i + CHUNK_SIZE, validRows.length)} / ${validRows.length}...`, null);
      }

      Object.keys(studentCache).forEach(k => delete studentCache[k]);
      studentsSeeded = null;

      let summary = `Imported ${validRows.length} student(s).`;
      if (skipped.length) summary += ` Skipped ${skipped.length} invalid row(s).`;
      setImportStatus(summary, skipped.length ? 'status-err' : 'status-ok');

      refreshStudentCounts();
      studentFileInput.value = '';
      pendingImportFile = null;
    } catch (err) {
      setImportStatus("Import failed: " + err.message, 'status-err');
    } finally {
      importStudentsBtn.disabled = true;
      importStudentsBtn.innerText = "Import Students";
    }
  });
}

async function refreshStudentCounts() {
  const container = document.getElementById('student-dept-counts');
  if (!container) return;
  try {
    const snap = await db.collection('students').get();

    if (snap.empty) {
      container.innerHTML = '<p class="empty-note">No data yet — using sample demo students.</p>';
      return;
    }

    const counts = {};
    snap.forEach(doc => {
      const d = doc.data().department || 'Unknown';
      counts[d] = (counts[d] || 0) + 1;
    });

    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const maxCount = entries[0][1];
    container.innerHTML = '';
    entries.forEach(([dept, count]) => {
      const barWidth = Math.max(8, Math.round((count / maxCount) * 60));
      const row = document.createElement('div');
      row.className = 'faculty-summary-row';
      row.innerHTML = `
        <span class="fs-name">${dept}</span>
        <span class="fs-bar" style="width:${barWidth}px;"></span>
        <span class="fs-count">${count}</span>
      `;
      container.appendChild(row);
    });
  } catch (err) {
    container.innerHTML = '<p class="empty-note">Could not load student counts.</p>';
  }
}

// Download Templates
function downloadCsvTemplate(fileName, headers, sampleRow) {
  const csv = `${headers.join(',')}\n${sampleRow.join(',')}\n`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

const downloadStudentTemplateBtn = document.getElementById('download-student-template');
if (downloadStudentTemplateBtn) {
  downloadStudentTemplateBtn.addEventListener('click', () => {
    downloadCsvTemplate(
      'student_import_template.csv',
      ['name', 'regNo', 'department', 'year', 'section'],
      ['John Doe', '92762104001', 'CSE', 'III', 'A']
    );
  });
}

const downloadFacultyTemplateBtn = document.getElementById('download-faculty-template');
if (downloadFacultyTemplateBtn) {
  downloadFacultyTemplateBtn.addEventListener('click', () => {
    downloadCsvTemplate(
      'faculty_import_template.csv',
      ['name', 'department', 'email'],
      ['Dr. K. Meenakshi', 'AI&DS', 'meenakshi@avsec.edu.in']
    );
  });
}

// Faculty Import
const facultyFileInput = document.getElementById('faculty-file-input');
const importFacultyBtn = document.getElementById('import-faculty-btn');
const importFacultyStatusEl = document.getElementById('import-faculty-status');
let pendingFacultyImportFile = null;

if (facultyFileInput) {
  facultyFileInput.addEventListener('change', () => {
    pendingFacultyImportFile = facultyFileInput.files[0] || null;
    importFacultyBtn.disabled = !pendingFacultyImportFile;
    importFacultyStatusEl.classList.add('hidden');
  });
}

function setFacultyImportStatus(message, kind) {
  importFacultyStatusEl.textContent = message;
  importFacultyStatusEl.classList.remove('hidden', 'status-ok', 'status-err');
  if (kind) importFacultyStatusEl.classList.add(kind);
}

function slugify(str) {
  return String(str).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

if (importFacultyBtn) {
  importFacultyBtn.addEventListener('click', async () => {
    if (!pendingFacultyImportFile) return;
    importFacultyBtn.disabled = true;
    importFacultyBtn.innerText = "Reading file...";
    setFacultyImportStatus("Reading file...", null);

    try {
      const rows = await readFileAsRows(pendingFacultyImportFile);

      const validRows = [];
      const skipped = [];
      rows.forEach((row, idx) => {
        const name = String(row.name || '').trim();
        const department = String(row.department || '').trim().toUpperCase();
        const email = String(row.email || '').trim();

        if (!name || !DEPARTMENTS.includes(department)) {
          skipped.push(idx + 2);
          return;
        }
        const id = email ? slugify(email) : slugify(`${name}-${department}`);
        validRows.push({ id, name, department, email });
      });

      if (validRows.length === 0) {
        setFacultyImportStatus("No valid rows found. Check columns.", 'status-err');
        return;
      }

      importFacultyBtn.innerText = "Uploading...";
      const CHUNK_SIZE = 400;
      for (let i = 0; i < validRows.length; i += CHUNK_SIZE) {
        const chunk = validRows.slice(i, i + CHUNK_SIZE);
        const batch = db.batch();
        chunk.forEach(f => {
          const ref = db.collection('faculty').doc(f.id);
          batch.set(ref, { name: f.name, department: f.department, email: f.email }, { merge: true });
        });
        await batch.commit();
        setFacultyImportStatus(`Uploaded ${Math.min(i + CHUNK_SIZE, validRows.length)} / ${validRows.length}...`, null);
      }

      facultyCache = null;
      facultySeeded = null;

      let summary = `Imported ${validRows.length} faculty member(s).`;
      if (skipped.length) summary += ` Skipped ${skipped.length} invalid row(s).`;
      setFacultyImportStatus(summary, skipped.length ? 'status-err' : 'status-ok');

      refreshFacultyCounts();
      if (userRole === 'faculty') initFacultyRoster();
      facultyFileInput.value = '';
      pendingFacultyImportFile = null;
    } catch (err) {
      setFacultyImportStatus("Import failed: " + err.message, 'status-err');
    } finally {
      importFacultyBtn.disabled = true;
      importFacultyBtn.innerText = "Import Faculty";
    }
  });
}

async function refreshFacultyCounts() {
  const container = document.getElementById('faculty-dept-counts');
  if (!container) return;
  try {
    const roster = await fetchAllFaculty(true);

    if (!roster.length) {
      container.innerHTML = '<p class="empty-note">No data yet.</p>';
      return;
    }

    const counts = {};
    roster.forEach(f => {
      const d = f.department || 'Unknown';
      counts[d] = (counts[d] || 0) + 1;
    });

    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const maxCount = entries[0][1];
    container.innerHTML = '';
    entries.forEach(([dept, count]) => {
      const barWidth = Math.max(8, Math.round((count / maxCount) * 60));
      const row = document.createElement('div');
      row.className = 'faculty-summary-row';
      row.innerHTML = `
        <span class="fs-name">${dept}</span>
        <span class="fs-bar" style="width:${barWidth}px;"></span>
        <span class="fs-count">${count}</span>
      `;
      container.appendChild(row);
    });
  } catch (err) {
    container.innerHTML = '<p class="empty-note">Could not load faculty counts.</p>';
  }
}

// --- 8. EXPORTS ---
function exportTableToPDF(elementId, fileName) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'pt', 'a4');

  html2canvas(document.getElementById(elementId), { scale: 2 }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    doc.addImage(imgData, 'PNG', 0, 20, pdfWidth, pdfHeight);
    doc.save(`${fileName}.pdf`);
  });
}

function exportTableToExcel(tableId, fileName) {
  const table = document.getElementById(tableId);
  const wb = XLSX.utils.table_to_book(table, { sheet: "Discipline Report" });
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

function exportTableToImage(elementId, fileName) {
  html2canvas(document.getElementById(elementId), { backgroundColor: '#ffffff' }).then(canvas => {
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = canvas.toDataURL();
    link.click();
  });
}

document.getElementById('export-pdf').onclick = () => exportTableToPDF('report-printable', 'Faculty_Discipline_Report');
document.getElementById('export-excel').onclick = () => exportTableToExcel('faculty-report-table', 'Faculty_Discipline_Report');
document.getElementById('export-image').onclick = () => exportTableToImage('report-printable', 'Faculty_Discipline_Report');

document.getElementById('admin-export-pdf').onclick = () => exportTableToPDF('admin-report-printable', 'Admin_Discipline_Summary');
document.getElementById('admin-export-excel').onclick = () => exportTableToExcel('admin-report-table', 'Admin_Discipline_Summary');
document.getElementById('admin-export-image').onclick = () => exportTableToImage('admin-report-printable', 'Admin_Discipline_Summary');

// Defaults
document.getElementById('incident-date').value = todayStr();
document.getElementById('incident-time').value = nowTimeStr();
document.getElementById('report-date').value = todayStr();