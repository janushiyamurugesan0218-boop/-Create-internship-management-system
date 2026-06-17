// ========================================================
// INTERNSHIP MANAGEMENT SYSTEM DATA CONTROLLER
// ========================================================
const InternshipSystem = {
    STORAGE_KEY: "ims_intern_roster",
    roster: [],

    // 1. Initial System Startup Core Loader Loop
    init() {
        // Hydrate the dataset array with cached user accounts or mock standard defaults
        this.roster = JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [
            { id: "int_01", name: "Alice Vance", email: "avance@hq.com", dept: "Engineering", term: "6 Months" },
            { id: "int_02", name: "David Miller", email: "dmiller@hq.com", dept: "Design", term: "3 Months" }
        ];

        this.syncLocalStorage();
        this.calculateMetrics();
        this.renderDatabaseTable();
    },

    // 2. Add profiles to database matrix
    addIntern(name, email, dept, term) {
        const newRecord = {
            id: "int_" + Math.random().toString(36).substr(2, 9),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            dept: dept,
            term: term
        };

        this.roster.push(newRecord);
        this.syncStorageAndRebuild();
    },

    // 3. Remove profiles from directory
    terminateInternship(id) {
        this.roster = this.roster.filter(intern => intern.id !== id);
        this.syncStorageAndRebuild();
    },

    syncStorageAndRebuild() {
        this.syncLocalStorage();
        this.calculateMetrics();
        this.renderDatabaseTable();
    },

    syncLocalStorage() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.roster));
    },

    // 4. Analytics Counter Calculations Engine
    calculateMetrics() {
        const total = this.roster.length;
        const engineering = this.roster.filter(item => item.dept === "Engineering").length;
        const design = this.roster.filter(item => item.dept === "Design").length;

        // Push values to top summary viewport components
        document.getElementById('totalCount').textContent = total;
        document.getElementById('engCount').textContent = engineering;
        document.getElementById('designCount').textContent = design;
    },

    // 5. Dynamic HTML DOM Tree Table Painting
    renderDatabaseTable() {
        const tbody = document.getElementById('tableBody');
        tbody.innerHTML = ""; // Wipe workspace clean for re-draw cycle

        if (this.roster.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#64748b;">No active interns found in registry.</td></tr>`;
            return;
        }

        this.roster.forEach(intern => {
            const tr = document.createElement('tr');
            
            // Assign custom styling flags based on active track setting parameters
            let badgeClass = "badge";
            if (intern.dept === "Engineering") badgeClass += " bg-engineering";
            else if (intern.dept === "Design") badgeClass += " bg-design";
            else badgeClass += " bg-marketing";

            tr.innerHTML = `
                <td><strong>${intern.name}</strong></td>
                <td>${intern.email}</td>
                <td><span class="${badgeClass}">${intern.dept}</span></td>
                <td>${intern.term}</td>
                <td><span class="action-link" data-id="${intern.id}">Remove</span></td>
            `;

            tbody.appendChild(tr);
        });
    }
};

// ========================================================
// CONTROLLER INTERACTIVE EVENT HOOK LISTENERS
// ========================================================

// Handle adding profile records submissions
document.getElementById('internForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('fullName');
    const email = document.getElementById('email');
    const dept = document.getElementById('department');
    const term = document.getElementById('duration');

    // Route inputs straight into system abstraction core
    InternshipSystem.addIntern(name.value, email.value, dept.value, term.value);

    // Flush fields back to clear state
    name.value = "";
    email.value = "";
    dept.selectedIndex = 0;
    term.selectedIndex = 0;
});

// Event delegation listener to catch removal request pointers asynchronously
document.getElementById('tableBody').addEventListener('click', (event) => {
    if (event.target.classList.contains('action-link')) {
        const selectedId = event.target.getAttribute('data-id');
        
        if (confirm("Are you sure you want to remove this intern from active roster tracking?")) {
            InternshipSystem.terminateInternship(selectedId);
        }
    }
});

// Kickstart boot hook sequence routine once layout parsing resolves safely
document.addEventListener('DOMContentLoaded', () => {
    InternshipSystem.init();
});