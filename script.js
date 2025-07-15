// PhD Mastery Portfolio - JavaScript Functionality

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Global variables
let pomodoroTimer = null;
let pomodoroSeconds = 25 * 60; // 25 minutes in seconds

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
    // Load today's step from localStorage
    const todayStep = localStorage.getItem('todayStep');
    if (todayStep) {
        const input = document.getElementById('todayStep');
        if (input) input.value = todayStep;
    }
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('todayStep')?.setAttribute('placeholder', 'What\'s your focus for today?');
}

// Save today's step to localStorage
function saveTodayStep() {
    const input = document.getElementById('todayStep');
    if (input) {
        localStorage.setItem('todayStep', input.value);
        showNotification('Today\'s step saved successfully!');
    }
}

// RESEARCH PAGE FUNCTIONALITY
function initResearchPage() {
    loadResearchEntries();
    setupResearchForm();
    initializeSampleResearch();
}

// Sample research data
const sampleResearchData = [
    {
        id: 1,
        title: "Computational Methods for Multiphase Flows",
        link: "https://example.com/multiphase-flows",
        tags: ["Three-Phase", "VOF", "Computational"],
        firstPrinciples: "Based on Navier-Stokes equations with volume fraction tracking. Conservation of mass and momentum at interfaces.",
        mentalModel: "Interface as sharp boundaries with continuous properties",
        confidence: 8,
        connections: "Direct application to my three-phase reconstruction work. Provides foundation for ML-golden search optimization.",
        keyEquations: "∇·u = 0 (continuity), ∂α/∂t + u·∇α = 0 (volume fraction transport)"
    },
    {
        id: 2,
        title: "Machine Learning for Interface Reconstruction",
        link: "https://example.com/ml-interface",
        tags: ["ML", "Interface", "Reconstruction"],
        firstPrinciples: "Neural networks approximate complex interface geometry from volume fraction data. Supervised learning on synthetic datasets.",
        mentalModel: "ML as pattern recognition for interface shapes",
        confidence: 7,
        connections: "Core to my research. ML-integrated golden search speeds up traditional VOF methods by 10-50x.",
        keyEquations: "Loss = MSE(predicted_interface, true_interface), Golden_ratio = (1+√5)/2"
    },
    {
        id: 3,
        title: "Three-Phase Flow Dynamics",
        link: "https://example.com/three-phase",
        tags: ["Three-Phase", "Dynamics", "Theory"],
        firstPrinciples: "Extension of two-phase flow with additional complexity. Three volume fractions: α₁ + α₂ + α₃ = 1",
        mentalModel: "Three fluids competing for space like territorial animals",
        confidence: 6,
        connections: "My research focus. Understanding three-phase interactions critical for industrial applications.",
        keyEquations: "∑αᵢ = 1, ∂αᵢ/∂t + ∇·(αᵢuᵢ) = 0 for i=1,2,3"
    }
];

// Initialize sample research data
function initializeSampleResearch() {
    const existingData = JSON.parse(localStorage.getItem('researchEntries')) || [];
    if (existingData.length === 0) {
        localStorage.setItem('researchEntries', JSON.stringify(sampleResearchData));
        loadResearchEntries();
    }
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
    initializeSampleModels();
}

// Sample mental models data
const sampleMentalModels = [
    {
        id: 1,
        name: "Flow Observer",
        description: "Multi-layer cognitive framework for analyzing complex fluid dynamics and interface behavior.",
        layers: [
            "Surface Flow: Spot patterns and anomalies in fluid behavior",
            "Interface Reconstruction: Break complex interfaces to basic geometric primitives",
            "Optimization Stream: Connect optimization techniques with physical constraints",
            "Turbulence Alert: Flag non-linear behaviors and instabilities"
        ],
        researchApplication: "Apply to three-phase flow analysis. Surface layer identifies interface regions, reconstruction layer applies VOF methods, optimization layer integrates ML-golden search.",
        example: "When analyzing simulation results, first observe overall flow patterns (Surface), then focus on interface geometry (Reconstruction), apply optimization (Stream), and check for instabilities (Alert)."
    },
    {
        id: 2,
        name: "First Principles Ladder",
        description: "Systematic approach to breaking down complex problems into fundamental physics.",
        layers: [
            "Conservation Laws: Start with mass, momentum, energy conservation",
            "Constitutive Relations: Material properties and interface conditions",
            "Boundary Conditions: Physical constraints and domain limits",
            "Numerical Methods: Discretization and solution algorithms"
        ],
        researchApplication: "For interface reconstruction: (1) Conservation of volume fractions, (2) Surface tension effects, (3) Contact angle conditions, (4) VOF discretization schemes.",
        example: "When stuck on interface problem, climb ladder: What's conserved? → How do materials behave? → What are the boundaries? → How to solve numerically?"
    },
    {
        id: 3,
        name: "Jello Interface Model",
        description: "Visualize fluid interfaces as flexible jello layers that can deform but maintain topology.",
        layers: [
            "Jello Sheet: Interface as deformable 2D surface",
            "Flexibility: Can bend and stretch but not break",
            "Topology Preservation: Maintains connectivity",
            "Forces: Surface tension acts like elastic energy"
        ],
        researchApplication: "Helps understand interface reconstruction challenges. Jello model shows why sharp interfaces are difficult - they're like rigid sheets in flexible jello.",
        example: "When debugging interface reconstruction, imagine jello: Is the interface too rigid? Are we allowing natural deformation? Are we preserving the jello's integrity?"
    }
];

// Initialize sample mental models
function initializeSampleModels() {
    const existingData = JSON.parse(localStorage.getItem('mentalModels')) || [];
    if (existingData.length === 0) {
        localStorage.setItem('mentalModels', JSON.stringify(sampleMentalModels));
        loadMentalModels();
    }
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
    initializeSampleProgress();
    createConcentrationChart();
    loadReflectionNotes();
}

// Sample progress data
const sampleProgressData = [
    {
        id: 1,
        week: "2025-01-20",
        quickWins: "Applied 3-Layer Read to VOF paper, debugged ML-golden search algorithm, set up simulation framework",
        concentrationScore: 8,
        endorphinsLog: "20-min morning walk, 15-min stretching, afternoon coffee with colleagues",
        milestones: "Completed literature review section, achieved 30% speedup in interface reconstruction"
    },
    {
        id: 2,
        week: "2025-01-13",
        quickWins: "Implemented Flow Observer model, fixed boundary condition bugs, wrote first principles notes",
        concentrationScore: 7,
        endorphinsLog: "Gym session, bike ride to campus, healthy lunch",
        milestones: "Successfully integrated ML model with VOF solver, presented initial results to advisor"
    },
    {
        id: 3,
        week: "2025-01-06",
        quickWins: "Set up development environment, created mental models framework, organized research papers",
        concentrationScore: 6,
        endorphinsLog: "Morning yoga, walk around campus, team lunch",
        milestones: "Established research methodology, defined project scope and timeline"
    }
];

// Initialize sample progress data
function initializeSampleProgress() {
    const existingData = JSON.parse(localStorage.getItem('progressEntries')) || [];
    if (existingData.length === 0) {
        localStorage.setItem('progressEntries', JSON.stringify(sampleProgressData));
        loadProgressEntries();
    }
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
    initializeSampleSessions();
    updateConcentrationStats();
    setCurrentDate();
}

// Sample concentration sessions
const sampleConcentrationSessions = [
    {
        id: 1,
        date: "2025-01-25",
        duration: "25 min",
        score: 8,
        notes: "Applied Pomodoro technique. Focused on VOF algorithm implementation. Good flow state."
    },
    {
        id: 2,
        date: "2025-01-25",
        duration: "45 min",
        score: 7,
        notes: "Deep work session on literature review. Some distractions from notifications."
    },
    {
        id: 3,
        date: "2025-01-24",
        duration: "30 min",
        score: 9,
        notes: "Excellent focus during ML model debugging. Used noise-cancelling headphones."
    },
    {
        id: 4,
        date: "2025-01-24",
        duration: "20 min",
        score: 6,
        notes: "Short session on paper writing. Interrupted by advisor meeting."
    },
    {
        id: 5,
        date: "2025-01-23",
        duration: "90 min",
        score: 9,
        notes: "Amazing deep work session. Implemented interface reconstruction algorithm. Perfect environment."
    }
];

// Initialize sample concentration sessions
function initializeSampleSessions() {
    const existingData = JSON.parse(localStorage.getItem('concentrationSessions')) || [];
    if (existingData.length === 0) {
        localStorage.setItem('concentrationSessions', JSON.stringify(sampleConcentrationSessions));
        loadConcentrationSessions();
    }
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
function startTimer() {
    const timerDisplay = document.getElementById('timerDisplay');
    const timerText = document.getElementById('timerText');
    
    timerDisplay.style.display = 'flex';
    
    pomodoroTimer = setInterval(() => {
        const minutes = Math.floor(pomodoroSeconds / 60);
        const seconds = pomodoroSeconds % 60;
        
        timerText.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (pomodoroSeconds <= 0) {
            clearInterval(pomodoroTimer);
            showNotification('Pomodoro session complete! Take a break.');
            pomodoroSeconds = 25 * 60; // Reset
        }
        
        pomodoroSeconds--;
    }, 1000);
}

function stopTimer() {
    clearInterval(pomodoroTimer);
    pomodoroSeconds = 25 * 60; // Reset
    document.getElementById('timerDisplay').style.display = 'none';
    document.getElementById('timerText').textContent = '25:00';
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