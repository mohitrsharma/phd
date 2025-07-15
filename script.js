// PhD Mastery Portfolio - JavaScript Functionality

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Global variables
let pomodoroTimer = null;
let pomodoroSeconds = 25 * 60; // 25 minutes in seconds
let isPaused = false;
let isRunning = false;

// Initialize the application
function initializeApp() {
    // Set up mobile navigation
    setupMobileNav();
    
    // Initialize page-specific functionality
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'index':
            initHomePage();
            break;
        case 'research':
            initResearchPage();
            break;
        case 'models':
            initModelsPage();
            break;
        case 'progress':
            initProgressPage();
            break;
        case 'concentration':
            initConcentrationPage();
            break;
    }
    
    // Initialize MathJax if available
    if (window.MathJax) {
        MathJax.typesetPromise();
    }
}

// Get current page from URL
function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    return filename.replace('.html', '');
}

// Mobile navigation setup
function setupMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

// HOME PAGE FUNCTIONALITY
function initHomePage() {
    loadPapers();
    loadBooksummary();
    loadSkills();
    loadResearchUpdates();
    loadPomodoroStats();
    loadSessionHistory();
}

// PAPERS FUNCTIONALITY
function showAddPaperForm() {
    document.getElementById('addPaperForm').style.display = 'block';
}

function hideAddPaperForm() {
    document.getElementById('addPaperForm').style.display = 'none';
    document.getElementById('paperTitle').value = '';
    document.getElementById('paperZoteroLink').value = '';
}

function addPaper() {
    const title = document.getElementById('paperTitle').value.trim();
    const zoteroLink = document.getElementById('paperZoteroLink').value.trim();
    
    if (!title) {
        showNotification('Please enter a paper title');
        return;
    }
    
    const paper = {
        id: Date.now(),
        title: title,
        zoteroLink: zoteroLink,
        dateAdded: new Date().toISOString()
    };
    
    const papers = JSON.parse(localStorage.getItem('papers')) || [];
    papers.push(paper);
    localStorage.setItem('papers', JSON.stringify(papers));
    
    loadPapers();
    hideAddPaperForm();
    showNotification('Paper added successfully!');
}

function loadPapers() {
    const papers = JSON.parse(localStorage.getItem('papers')) || [];
    const papersList = document.getElementById('papersList');
    
    if (!papersList) return;
    
    papersList.innerHTML = '';
    
    papers.forEach(paper => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="paper-info">
                <span class="paper-title">${paper.title}</span>
                ${paper.zoteroLink ? `<a href="${paper.zoteroLink}" target="_blank" class="paper-link">→ Click to Zotero</a>` : ''}
            </div>
            <button class="action-btn delete-btn" onclick="deletePaper(${paper.id})">×</button>
        `;
        papersList.appendChild(li);
    });
}

function deletePaper(id) {
    if (confirm('Are you sure you want to delete this paper?')) {
        const papers = JSON.parse(localStorage.getItem('papers')) || [];
        const filteredPapers = papers.filter(paper => paper.id !== id);
        localStorage.setItem('papers', JSON.stringify(filteredPapers));
        loadPapers();
        showNotification('Paper deleted successfully!');
    }
}

// BOOKS SUMMARY FUNCTIONALITY
function saveBooksSummary() {
    const summary = document.getElementById('booksSummary').value;
    localStorage.setItem('booksSummary', summary);
    showNotification('Books summary saved successfully!');
}

function loadBooksummary() {
    const summary = localStorage.getItem('booksSummary');
    const textarea = document.getElementById('booksSummary');
    if (textarea && summary) {
        textarea.value = summary;
    }
}

// SKILLS FUNCTIONALITY
function showAddSkillForm() {
    document.getElementById('addSkillForm').style.display = 'block';
}

function hideAddSkillForm() {
    document.getElementById('addSkillForm').style.display = 'none';
    document.getElementById('skillTitle').value = '';
    document.getElementById('skillNotes').value = '';
}

function addSkill() {
    const title = document.getElementById('skillTitle').value.trim();
    const notes = document.getElementById('skillNotes').value.trim();
    
    if (!title) {
        showNotification('Please enter a skill/learning topic');
        return;
    }
    
    const skill = {
        id: Date.now(),
        title: title,
        notes: notes,
        dateAdded: new Date().toISOString()
    };
    
    const skills = JSON.parse(localStorage.getItem('skills')) || [];
    skills.push(skill);
    localStorage.setItem('skills', JSON.stringify(skills));
    
    loadSkills();
    hideAddSkillForm();
    showNotification('Learning entry added successfully!');
}

function loadSkills() {
    const skills = JSON.parse(localStorage.getItem('skills')) || [];
    const skillsList = document.getElementById('skillsList');
    
    if (!skillsList) return;
    
    skillsList.innerHTML = '';
    
    skills.forEach(skill => {
        const div = document.createElement('div');
        div.className = 'skill-item';
        div.innerHTML = `
            <h5>${skill.title}</h5>
            <p>${skill.notes}</p>
            <div class="skill-date">${formatDate(skill.dateAdded)}</div>
            <button class="action-btn delete-btn" onclick="deleteSkill(${skill.id})">Delete</button>
        `;
        skillsList.appendChild(div);
    });
}

function deleteSkill(id) {
    if (confirm('Are you sure you want to delete this learning entry?')) {
        const skills = JSON.parse(localStorage.getItem('skills')) || [];
        const filteredSkills = skills.filter(skill => skill.id !== id);
        localStorage.setItem('skills', JSON.stringify(filteredSkills));
        loadSkills();
        showNotification('Learning entry deleted successfully!');
    }
}

// RESEARCH UPDATES FUNCTIONALITY
function saveResearchUpdates() {
    const updates = document.getElementById('researchUpdates').value;
    localStorage.setItem('researchUpdates', updates);
    showNotification('Research updates saved successfully!');
}

function loadResearchUpdates() {
    const updates = localStorage.getItem('researchUpdates');
    const textarea = document.getElementById('researchUpdates');
    if (textarea && updates) {
        textarea.value = updates;
    }
}

// RESEARCH PAGE FUNCTIONALITY
function initResearchPage() {
    loadResearchEntries();
    setupResearchForm();
}

// Load research entries from localStorage
function loadResearchEntries() {
    const entries = JSON.parse(localStorage.getItem('researchEntries')) || [];
    const container = document.getElementById('researchGrid');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    entries.forEach(entry => {
        const card = createResearchCard(entry);
        container.appendChild(card);
    });
}

// Create research card HTML
function createResearchCard(entry) {
    const card = document.createElement('div');
    card.className = 'research-card';
    card.innerHTML = `
        <h4>${entry.title}</h4>
        <div class="research-tags">
            ${entry.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <p><strong>First Principles:</strong> ${entry.firstPrinciples}</p>
        <p><strong>Mental Model:</strong> ${entry.mentalModel}</p>
        <div class="confidence-rating">
            <span>Confidence:</span>
            <div class="rating-stars">
                ${generateStars(entry.confidence)}
            </div>
            <span>${entry.confidence}/10</span>
        </div>
        <p><strong>Connections:</strong> ${entry.connections}</p>
        <div class="key-equations">
            <strong>Key Equations:</strong>
            <div class="equation-display">${entry.keyEquations}</div>
        </div>
        ${entry.link ? `<a href="${entry.link}" target="_blank" class="btn btn-secondary">View Paper</a>` : ''}
        <button class="action-btn delete-btn" onclick="deleteResearchEntry(${entry.id})">Delete</button>
    `;
    return card;
}

// Generate star rating
function generateStars(rating) {
    const stars = [];
    for (let i = 1; i <= 10; i++) {
        stars.push(`<span class="star">${i <= rating ? '★' : '☆'}</span>`);
    }
    return stars.join('');
}

// Setup research form
function setupResearchForm() {
    const form = document.getElementById('researchForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            addResearchEntry();
        });
    }
}

// Add new research entry
function addResearchEntry() {
    const title = document.getElementById('title').value;
    const link = document.getElementById('link').value;
    const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());
    const firstPrinciples = document.getElementById('firstPrinciples').value;
    const mentalModel = document.getElementById('mentalModel').value;
    const confidence = parseInt(document.getElementById('confidence').value);
    const connections = document.getElementById('connections').value;
    const keyEquations = document.getElementById('keyEquations').value;
    
    const entry = {
        id: Date.now(),
        title,
        link,
        tags,
        firstPrinciples,
        mentalModel,
        confidence,
        connections,
        keyEquations
    };
    
    const entries = JSON.parse(localStorage.getItem('researchEntries')) || [];
    entries.push(entry);
    localStorage.setItem('researchEntries', JSON.stringify(entries));
    
    loadResearchEntries();
    hideAddForm();
    showNotification('Research entry added successfully!');
    
    // Reset form
    document.getElementById('researchForm').reset();
}

// Delete research entry
function deleteResearchEntry(id) {
    if (confirm('Are you sure you want to delete this research entry?')) {
        const entries = JSON.parse(localStorage.getItem('researchEntries')) || [];
        const filteredEntries = entries.filter(entry => entry.id !== id);
        localStorage.setItem('researchEntries', JSON.stringify(filteredEntries));
        loadResearchEntries();
        showNotification('Research entry deleted successfully!');
    }
}

// Search research entries
function searchResearch() {
    const searchTerm = document.getElementById('searchResearch').value.toLowerCase();
    const entries = JSON.parse(localStorage.getItem('researchEntries')) || [];
    const filteredEntries = entries.filter(entry => 
        entry.title.toLowerCase().includes(searchTerm) ||
        entry.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        entry.firstPrinciples.toLowerCase().includes(searchTerm)
    );
    
    displayResearchEntries(filteredEntries);
}

// Display filtered research entries
function displayResearchEntries(entries) {
    const container = document.getElementById('researchGrid');
    if (!container) return;
    
    container.innerHTML = '';
    entries.forEach(entry => {
        const card = createResearchCard(entry);
        container.appendChild(card);
    });
}

// Show/hide add form
function showAddForm() {
    document.getElementById('addResearchForm').style.display = 'block';
}

function hideAddForm() {
    document.getElementById('addResearchForm').style.display = 'none';
}

// MENTAL MODELS PAGE FUNCTIONALITY
function initModelsPage() {
    loadMentalModels();
    setupModelsForm();
}

// Load mental models
function loadMentalModels() {
    const models = JSON.parse(localStorage.getItem('mentalModels')) || [];
    const container = document.getElementById('modelsAccordion');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    models.forEach(model => {
        const item = createModelAccordion(model);
        container.appendChild(item);
    });
}

// Create mental model accordion item
function createModelAccordion(model) {
    const item = document.createElement('div');
    item.className = 'accordion-item';
    item.innerHTML = `
        <div class="accordion-header" onclick="toggleAccordion(${model.id})">
            <h4>${model.name}</h4>
            <span class="accordion-toggle">▼</span>
        </div>
        <div class="accordion-content" id="accordion-${model.id}">
            <p><strong>Description:</strong> ${model.description}</p>
            <div class="model-layers">
                <h5>Layers/Components:</h5>
                ${model.layers.map(layer => `<div class="model-layer">${layer}</div>`).join('')}
            </div>
            <p><strong>Application to Research:</strong> ${model.researchApplication}</p>
            <p><strong>Example:</strong> ${model.example}</p>
            <div class="model-sketch">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDIwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjlmYWZiIiBzdHJva2U9IiNlNWU3ZWIiLz4KPHRleHQgeD0iMTAwIiB5PSI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZiNzI4MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPlNrZXRjaCBQbGFjZWhvbGRlcjwvdGV4dD4KPC9zdmc+" alt="Model sketch placeholder" style="width: 100%; max-width: 300px; margin: 1rem 0;">
            </div>
            <button class="action-btn delete-btn" onclick="deleteMentalModel(${model.id})">Delete</button>
        </div>
    `;
    return item;
}

// Toggle accordion
function toggleAccordion(id) {
    const content = document.getElementById(`accordion-${id}`);
    if (content) {
        content.classList.toggle('active');
    }
}

// Setup mental models form
function setupModelsForm() {
    const form = document.getElementById('modelForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            addMentalModel();
        });
    }
}

// Add new mental model
function addMentalModel() {
    const name = document.getElementById('modelName').value;
    const description = document.getElementById('modelDescription').value;
    const layers = document.getElementById('modelLayers').value.split('\n').filter(layer => layer.trim());
    const researchApplication = document.getElementById('researchApplication').value;
    const example = document.getElementById('modelExample').value;
    
    const model = {
        id: Date.now(),
        name,
        description,
        layers,
        researchApplication,
        example
    };
    
    const models = JSON.parse(localStorage.getItem('mentalModels')) || [];
    models.push(model);
    localStorage.setItem('mentalModels', JSON.stringify(models));
    
    loadMentalModels();
    hideAddModelForm();
    showNotification('Mental model added successfully!');
    
    // Reset form
    document.getElementById('modelForm').reset();
}

// Delete mental model
function deleteMentalModel(id) {
    if (confirm('Are you sure you want to delete this mental model?')) {
        const models = JSON.parse(localStorage.getItem('mentalModels')) || [];
        const filteredModels = models.filter(model => model.id !== id);
        localStorage.setItem('mentalModels', JSON.stringify(filteredModels));
        loadMentalModels();
        showNotification('Mental model deleted successfully!');
    }
}

// Search mental models
function searchModels() {
    const searchTerm = document.getElementById('searchModels').value.toLowerCase();
    const models = JSON.parse(localStorage.getItem('mentalModels')) || [];
    const filteredModels = models.filter(model => 
        model.name.toLowerCase().includes(searchTerm) ||
        model.description.toLowerCase().includes(searchTerm) ||
        model.layers.some(layer => layer.toLowerCase().includes(searchTerm))
    );
    
    displayMentalModels(filteredModels);
}

// Display filtered mental models
function displayMentalModels(models) {
    const container = document.getElementById('modelsAccordion');
    if (!container) return;
    
    container.innerHTML = '';
    models.forEach(model => {
        const item = createModelAccordion(model);
        container.appendChild(item);
    });
}

// Show/hide add model form
function showAddModelForm() {
    document.getElementById('addModelForm').style.display = 'block';
}

function hideAddModelForm() {
    document.getElementById('addModelForm').style.display = 'none';
}

// PROGRESS PAGE FUNCTIONALITY
function initProgressPage() {
    loadProgressEntries();
    setupProgressForm();
    createConcentrationChart();
    loadReflectionNotes();
}

// Load progress entries
function loadProgressEntries() {
    const entries = JSON.parse(localStorage.getItem('progressEntries')) || [];
    const tbody = document.getElementById('progressTableBody');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    entries.forEach(entry => {
        const row = createProgressRow(entry);
        tbody.appendChild(row);
    });
    
    updateProgressStats(entries);
}

// Create progress table row
function createProgressRow(entry) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${formatDate(entry.week)}</td>
        <td>${entry.quickWins}</td>
        <td><span class="confidence-score">${entry.concentrationScore}/10</span></td>
        <td>${entry.endorphinsLog}</td>
        <td>${entry.milestones}</td>
        <td>
            <button class="action-btn delete-btn" onclick="deleteProgressEntry(${entry.id})">Delete</button>
        </td>
    `;
    return row;
}

// Update progress statistics
function updateProgressStats(entries) {
    const avgConcentration = entries.reduce((sum, entry) => sum + entry.concentrationScore, 0) / entries.length;
    const totalQuickWins = entries.length * 3; // Approximate
    
    document.getElementById('avgConcentration').textContent = avgConcentration.toFixed(1);
    document.getElementById('weeklyEntries').textContent = entries.length;
    document.getElementById('totalQuickWins').textContent = totalQuickWins;
}

// Setup progress form
function setupProgressForm() {
    const form = document.getElementById('progressForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            addProgressEntry();
        });
    }
}

// Add new progress entry
function addProgressEntry() {
    const week = document.getElementById('progressWeek').value;
    const quickWins = document.getElementById('quickWins').value;
    const concentrationScore = parseInt(document.getElementById('concentrationScore').value);
    const endorphinsLog = document.getElementById('endorphinsLog').value;
    const milestones = document.getElementById('milestones').value;
    
    const entry = {
        id: Date.now(),
        week,
        quickWins,
        concentrationScore,
        endorphinsLog,
        milestones
    };
    
    const entries = JSON.parse(localStorage.getItem('progressEntries')) || [];
    entries.push(entry);
    localStorage.setItem('progressEntries', JSON.stringify(entries));
    
    loadProgressEntries();
    hideAddProgressForm();
    showNotification('Progress entry added successfully!');
    
    // Reset form
    document.getElementById('progressForm').reset();
    
    // Update chart
    createConcentrationChart();
}

// Delete progress entry
function deleteProgressEntry(id) {
    if (confirm('Are you sure you want to delete this progress entry?')) {
        const entries = JSON.parse(localStorage.getItem('progressEntries')) || [];
        const filteredEntries = entries.filter(entry => entry.id !== id);
        localStorage.setItem('progressEntries', JSON.stringify(filteredEntries));
        loadProgressEntries();
        createConcentrationChart();
        showNotification('Progress entry deleted successfully!');
    }
}

// Create concentration chart
function createConcentrationChart() {
    const ctx = document.getElementById('concentrationChart');
    if (!ctx) return;
    
    const entries = JSON.parse(localStorage.getItem('progressEntries')) || [];
    const labels = entries.map(entry => formatDate(entry.week));
    const data = entries.map(entry => entry.concentrationScore);
    
    // Destroy existing chart if it exists
    if (window.concentrationChartInstance) {
        window.concentrationChartInstance.destroy();
    }
    
    window.concentrationChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Concentration Score',
                data: data,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10
                }
            }
        }
    });
}

// Load reflection notes
function loadReflectionNotes() {
    const notes = localStorage.getItem('reflectionNotes');
    const textarea = document.getElementById('reflectionNotes');
    if (textarea && notes) {
        textarea.value = notes;
    }
}

// Save reflection notes
function saveReflection() {
    const notes = document.getElementById('reflectionNotes').value;
    localStorage.setItem('reflectionNotes', notes);
    showNotification('Reflection notes saved successfully!');
}

// Export progress data
function exportProgress() {
    const entries = JSON.parse(localStorage.getItem('progressEntries')) || [];
    const dataStr = JSON.stringify(entries, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'progress_data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Progress data exported successfully!');
}

// Show/hide add progress form
function showAddProgressForm() {
    document.getElementById('addProgressForm').style.display = 'block';
}

function hideAddProgressForm() {
    document.getElementById('addProgressForm').style.display = 'none';
}

// CONCENTRATION PAGE FUNCTIONALITY
function initConcentrationPage() {
    loadConcentrationSessions();
    setupConcentrationForm();
    updateConcentrationStats();
    setCurrentDate();
}

// Set current date in form
function setCurrentDate() {
    const dateInput = document.getElementById('sessionDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
}

// Load concentration sessions
function loadConcentrationSessions() {
    const sessions = JSON.parse(localStorage.getItem('concentrationSessions')) || [];
    const tbody = document.getElementById('concentrationTableBody');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    sessions.forEach(session => {
        const row = createConcentrationRow(session);
        tbody.appendChild(row);
    });
}

// Create concentration table row
function createConcentrationRow(session) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${formatDate(session.date)}</td>
        <td>${session.duration}</td>
        <td><span class="score-badge score-${getScoreClass(session.score)}">${session.score}/10</span></td>
        <td>${session.notes}</td>
        <td>
            <button class="action-btn" onclick="editConcentrationSession(${session.id})">Edit</button>
            <button class="action-btn delete-btn" onclick="deleteConcentrationSession(${session.id})">Delete</button>
        </td>
    `;
    return row;
}

// Get score class for styling
function getScoreClass(score) {
    if (score >= 9) return 'excellent';
    if (score >= 7) return 'good';
    if (score >= 5) return 'average';
    return 'poor';
}

// Setup concentration form
function setupConcentrationForm() {
    const form = document.getElementById('sessionForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            addConcentrationSession();
        });
    }
}

// Add new concentration session
function addConcentrationSession() {
    const date = document.getElementById('sessionDate').value;
    const duration = document.getElementById('focusDuration').value;
    const score = parseInt(document.getElementById('focusScore').value);
    const notes = document.getElementById('sessionNotes').value;
    
    const session = {
        id: Date.now(),
        date,
        duration,
        score,
        notes
    };
    
    const sessions = JSON.parse(localStorage.getItem('concentrationSessions')) || [];
    sessions.push(session);
    localStorage.setItem('concentrationSessions', JSON.stringify(sessions));
    
    loadConcentrationSessions();
    hideAddSessionForm();
    updateConcentrationStats();
    showNotification('Focus session added successfully!');
    
    // Reset form
    document.getElementById('sessionForm').reset();
    setCurrentDate();
}

// Delete concentration session
function deleteConcentrationSession(id) {
    if (confirm('Are you sure you want to delete this focus session?')) {
        const sessions = JSON.parse(localStorage.getItem('concentrationSessions')) || [];
        const filteredSessions = sessions.filter(session => session.id !== id);
        localStorage.setItem('concentrationSessions', JSON.stringify(filteredSessions));
        loadConcentrationSessions();
        updateConcentrationStats();
        showNotification('Focus session deleted successfully!');
    }
}

// Edit concentration session (placeholder)
function editConcentrationSession(id) {
    // This would open an edit form - simplified for now
    showNotification('Edit functionality coming soon!');
}

// Update concentration statistics
function updateConcentrationStats() {
    const sessions = JSON.parse(localStorage.getItem('concentrationSessions')) || [];
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate today's focus
    const todaySessions = sessions.filter(s => s.date === today);
    const todayMinutes = todaySessions.reduce((total, s) => {
        const minutes = parseInt(s.duration.match(/\d+/)[0]);
        return total + minutes;
    }, 0);
    
    // Calculate average score
    const avgScore = sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length;
    
    // Find best session
    const bestSession = sessions.reduce((best, s) => {
        const minutes = parseInt(s.duration.match(/\d+/)[0]);
        const bestMinutes = parseInt(best.duration.match(/\d+/)[0]);
        return minutes > bestMinutes ? s : best;
    }, sessions[0] || { duration: '0 min' });
    
    // Calculate weekly total
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekSessions = sessions.filter(s => new Date(s.date) >= weekAgo);
    const weeklyMinutes = weekSessions.reduce((total, s) => {
        const minutes = parseInt(s.duration.match(/\d+/)[0]);
        return total + minutes;
    }, 0);
    
    // Update display
    document.getElementById('todayFocus').textContent = `${(todayMinutes / 60).toFixed(1)} hrs`;
    document.getElementById('avgScore').textContent = avgScore.toFixed(1);
    document.getElementById('bestSession').textContent = bestSession.duration;
    document.getElementById('weeklyTotal').textContent = `${(weeklyMinutes / 60).toFixed(1)} hrs`;
}

// Search concentration sessions
function searchSessions() {
    const searchTerm = document.getElementById('searchSessions').value.toLowerCase();
    const sessions = JSON.parse(localStorage.getItem('concentrationSessions')) || [];
    const filteredSessions = sessions.filter(session => 
        session.notes.toLowerCase().includes(searchTerm) ||
        session.duration.toLowerCase().includes(searchTerm)
    );
    
    displayConcentrationSessions(filteredSessions);
}

// Filter concentration sessions
function filterSessions() {
    const filterValue = document.getElementById('filterScore').value;
    const sessions = JSON.parse(localStorage.getItem('concentrationSessions')) || [];
    
    let filteredSessions = sessions;
    
    if (filterValue) {
        const [min, max] = filterValue.split('-').map(Number);
        filteredSessions = sessions.filter(session => 
            session.score >= min && session.score <= max
        );
    }
    
    displayConcentrationSessions(filteredSessions);
}

// Display filtered concentration sessions
function displayConcentrationSessions(sessions) {
    const tbody = document.getElementById('concentrationTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    sessions.forEach(session => {
        const row = createConcentrationRow(session);
        tbody.appendChild(row);
    });
}

// Show/hide add session form
function showAddSessionForm() {
    document.getElementById('addSessionForm').style.display = 'block';
}

function hideAddSessionForm() {
    document.getElementById('addSessionForm').style.display = 'none';
}

// POMODORO TIMER FUNCTIONALITY
function startPomodoro() {
    if (isRunning && !isPaused) return;
    
    isRunning = true;
    isPaused = false;
    
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const timerCircle = document.querySelector('.timer-circle');
    
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    timerCircle.classList.add('active');
    
    pomodoroTimer = setInterval(() => {
        const minutes = Math.floor(pomodoroSeconds / 60);
        const seconds = pomodoroSeconds % 60;
        
        document.getElementById('pomodoroTime').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (pomodoroSeconds <= 0) {
            clearInterval(pomodoroTimer);
            completeSession();
            return;
        }
        
        pomodoroSeconds--;
    }, 1000);
}

function pausePomodoro() {
    if (!isRunning) return;
    
    clearInterval(pomodoroTimer);
    isPaused = true;
    
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const timerCircle = document.querySelector('.timer-circle');
    
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    timerCircle.classList.remove('active');
    
    startBtn.textContent = 'Resume';
}

function resetPomodoro() {
    clearInterval(pomodoroTimer);
    pomodoroSeconds = 25 * 60;
    isRunning = false;
    isPaused = false;
    
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const timerCircle = document.querySelector('.timer-circle');
    
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    startBtn.textContent = 'Start';
    timerCircle.classList.remove('active');
    
    document.getElementById('pomodoroTime').textContent = '25:00';
}

function completeSession() {
    isRunning = false;
    isPaused = false;
    
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const timerCircle = document.querySelector('.timer-circle');
    
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    startBtn.textContent = 'Start';
    timerCircle.classList.remove('active');
    
    // Play audio alert
    playCompletionSound();
    
    // Save session
    saveSession();
    
    // Reset timer
    pomodoroSeconds = 25 * 60;
    document.getElementById('pomodoroTime').textContent = '25:00';
    
    showNotification('Pomodoro session complete! Take a break.');
}

function playCompletionSound() {
    // Create audio context for a simple beep
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('Audio not supported');
    }
}

function saveSession() {
    const sessions = JSON.parse(localStorage.getItem('pomodoroSessions')) || [];
    const session = {
        id: Date.now(),
        date: new Date().toISOString(),
        duration: 25 * 60, // 25 minutes in seconds
        completed: true
    };
    
    sessions.push(session);
    localStorage.setItem('pomodoroSessions', JSON.stringify(sessions));
    
    loadPomodoroStats();
    loadSessionHistory();
}

function loadPomodoroStats() {
    const sessions = JSON.parse(localStorage.getItem('pomodoroSessions')) || [];
    const today = new Date().toISOString().split('T')[0];
    
    const todaySessions = sessions.filter(session => 
        session.date.split('T')[0] === today
    );
    
    document.getElementById('sessionsToday').textContent = todaySessions.length;
    document.getElementById('totalSessions').textContent = sessions.length;
}

function loadSessionHistory() {
    const sessions = JSON.parse(localStorage.getItem('pomodoroSessions')) || [];
    const sessionHistory = document.getElementById('sessionHistory');
    
    if (!sessionHistory) return;
    
    sessionHistory.innerHTML = '';
    
    // Show last 5 sessions
    sessions.slice(-5).reverse().forEach(session => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>Session completed</div>
            <div class="session-time">${formatDateTime(session.date)}</div>
        `;
        sessionHistory.appendChild(li);
    });
}

// UTILITY FUNCTIONS
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add CSS animation
    if (!document.getElementById('notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS for score badges
const scoreStyles = document.createElement('style');
scoreStyles.textContent = `
    .score-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-weight: 500;
        font-size: 0.875rem;
    }
    
    .score-excellent {
        background-color: #10b981;
        color: white;
    }
    
    .score-good {
        background-color: #3b82f6;
        color: white;
    }
    
    .score-average {
        background-color: #f59e0b;
        color: white;
    }
    
    .score-poor {
        background-color: #ef4444;
        color: white;
    }
    
    .confidence-score {
        font-weight: 600;
        color: #2563eb;
    }
`;
document.head.appendChild(scoreStyles);

// Initialize MathJax when content is added dynamically
function reinitializeMathJax() {
    if (window.MathJax) {
        MathJax.typesetPromise();
    }
}

// Call reinitializeMathJax after content updates
window.addEventListener('load', reinitializeMathJax); 