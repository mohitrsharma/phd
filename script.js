// ===== Global Variables =====
let editMode = false;
let currentSlide = 0;
let autoAdvanceInterval = null;

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeEditMode();
    initializeAnimations();
    initializeParallax();
    loadAllContent();
    initializeInsights();
    initializeCourses();
    initializeBooks();
    initializeReads();
    initializeAutoSave();
});

// ===== Navigation & Smooth Scroll =====
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Smooth scroll and active state
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Close mobile menu
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Update active nav on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// ===== Edit Mode Toggle =====
function initializeEditMode() {
    const editToggle = document.getElementById('editModeToggle');
    const editables = document.querySelectorAll('.editable');
    
    editToggle.addEventListener('click', () => {
        editMode = !editMode;
        editToggle.classList.toggle('active');
        
        editables.forEach(editable => {
            editable.contentEditable = editMode;
            if (editMode) {
                editable.classList.add('editing');
            } else {
                editable.classList.remove('editing');
            }
        });
        
        // Handle course title editables
        const editableTitles = document.querySelectorAll('.editable-title');
        editableTitles.forEach(title => {
            title.contentEditable = editMode;
        });
    });
}

// ===== Animations & Intersection Observer =====
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.insight-card, .accordion-item, .book-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease-out';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(el => observer.observe(el));
}

// ===== Parallax Effect =====
function initializeParallax() {
    const heroBg = document.querySelector('.hero-bg');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        heroBg.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    });
}

// ===== Load All Content from localStorage =====
function loadAllContent() {
    // Load bio
    const bioContent = document.querySelector('.bio-content');
    const savedBio = localStorage.getItem('phd_bio');
    if (savedBio) {
        bioContent.innerHTML = savedBio;
    }
    
    // Load daily pods
    const pods = ['learning', 'research', 'working'];
    pods.forEach(pod => {
        const content = document.querySelector(`.${pod}-pod .pod-content`);
        const saved = localStorage.getItem(`phd_daily_${pod}`);
        if (saved) {
            content.innerHTML = saved;
        }
    });
}

// ===== Auto Save Functionality =====
function initializeAutoSave() {
    const editables = document.querySelectorAll('.editable');
    
    editables.forEach(editable => {
        editable.addEventListener('blur', () => {
            saveContent(editable);
            showSaveIndicator(editable);
        });
        
        // Auto-save on input with debounce
        let timeout;
        editable.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                saveContent(editable);
                showSaveIndicator(editable);
            }, 1000);
        });
    });
}

function saveContent(element) {
    const content = element.innerHTML;
    
    // Determine what to save based on element
    if (element.classList.contains('bio-content')) {
        localStorage.setItem('phd_bio', content);
    } else if (element.closest('.learning-pod')) {
        localStorage.setItem('phd_daily_learning', content);
    } else if (element.closest('.research-pod')) {
        localStorage.setItem('phd_daily_research', content);
    } else if (element.closest('.working-pod')) {
        localStorage.setItem('phd_daily_working', content);
    }
}

function showSaveIndicator(element) {
    const pod = element.closest('.pod');
    if (pod) {
        const indicator = pod.querySelector('.save-indicator');
        indicator.classList.add('show');
        setTimeout(() => {
            indicator.classList.remove('show');
        }, 2000);
    }
}

// ===== Research Insights =====
function initializeInsights() {
    const addBtn = document.getElementById('addInsightBtn');
    const grid = document.getElementById('insightsGrid');
    
    // Load saved insights
    const savedInsights = JSON.parse(localStorage.getItem('phd_insights') || '[]');
    savedInsights.forEach(insight => createInsightCard(insight));
    
    addBtn.addEventListener('click', () => {
        const insight = {
            id: Date.now(),
            title: 'New Insight',
            content: 'Click to edit this insight. You can use LaTeX: \\(E = mc^2\\)',
            date: new Date().toLocaleDateString()
        };
        
        createInsightCard(insight);
        saveInsights();
        
        // Re-render MathJax
        MathJax.typesetPromise();
    });
}

function createInsightCard(insight) {
    const card = document.createElement('div');
    card.className = 'insight-card';
    card.dataset.id = insight.id;
    
    card.innerHTML = `
        <h3 class="editable" contenteditable="${editMode}" data-placeholder="Insight Title">${insight.title}</h3>
        <div class="insight-content editable" contenteditable="${editMode}" data-placeholder="Your insight here...">${insight.content}</div>
        <div class="insight-meta">
            <span class="insight-date">${insight.date}</span>
            ${editMode ? '<button class="delete-insight" onclick="deleteInsight(' + insight.id + ')"><i class="fas fa-trash"></i></button>' : ''}
        </div>
    `;
    
    // Insert before the add button
    const addBtn = document.getElementById('addInsightBtn');
    addBtn.parentNode.insertBefore(card, addBtn);
    
    // Add save listeners
    const editables = card.querySelectorAll('.editable');
    editables.forEach(editable => {
        editable.addEventListener('blur', () => saveInsights());
        editable.addEventListener('input', debounce(() => saveInsights(), 1000));
    });
}

function saveInsights() {
    const cards = document.querySelectorAll('.insight-card');
    const insights = Array.from(cards).map(card => ({
        id: parseInt(card.dataset.id),
        title: card.querySelector('h3').innerHTML,
        content: card.querySelector('.insight-content').innerHTML,
        date: card.querySelector('.insight-date').textContent
    }));
    
    localStorage.setItem('phd_insights', JSON.stringify(insights));
}

function deleteInsight(id) {
    const card = document.querySelector(`[data-id="${id}"]`);
    card.remove();
    saveInsights();
}

// ===== Courses Accordion =====
function initializeCourses() {
    const accordion = document.getElementById('coursesAccordion');
    const addBtn = document.getElementById('addCourseBtn');
    
    // Load saved courses
    const savedCourses = JSON.parse(localStorage.getItem('phd_courses') || '[]');
    if (savedCourses.length === 0) {
        // Keep default course if no saved courses
        saveCourses();
    } else {
        // Clear default and load saved
        accordion.innerHTML = '';
        savedCourses.forEach(course => createCourseItem(course));
        accordion.appendChild(addBtn);
    }
    
    // Initialize accordion functionality
    initializeAccordion();
    
    addBtn.addEventListener('click', () => {
        const course = {
            id: Date.now(),
            title: 'New Course',
            content: 'Course description and materials...'
        };
        
        createCourseItem(course);
        saveCourses();
        initializeAccordion();
    });
}

function createCourseItem(course) {
    const item = document.createElement('div');
    item.className = 'accordion-item';
    item.dataset.id = course.id;
    
    item.innerHTML = `
        <button class="accordion-header">
            <i class="fas fa-graduation-cap"></i>
            <span class="editable-title" contenteditable="${editMode}" data-placeholder="Course Title">${course.title}</span>
            <i class="fas fa-chevron-down accordion-icon"></i>
        </button>
        <div class="accordion-content">
            <div class="editable" contenteditable="${editMode}" data-placeholder="Course description, materials, and links...">${course.content}</div>
            ${editMode ? '<button class="delete-course" onclick="deleteCourse(' + course.id + ')"><i class="fas fa-trash"></i> Delete Course</button>' : ''}
        </div>
    `;
    
    const addBtn = document.getElementById('addCourseBtn');
    addBtn.parentNode.insertBefore(item, addBtn);
    
    // Add save listeners
    const editables = item.querySelectorAll('.editable, .editable-title');
    editables.forEach(editable => {
        editable.addEventListener('blur', () => saveCourses());
        editable.addEventListener('input', debounce(() => saveCourses(), 1000));
    });
}

function initializeAccordion() {
    const headers = document.querySelectorAll('.accordion-header');
    
    headers.forEach(header => {
        header.removeEventListener('click', toggleAccordion);
        header.addEventListener('click', toggleAccordion);
    });
}

function toggleAccordion(e) {
    const item = e.currentTarget.parentElement;
    item.classList.toggle('active');
}

function saveCourses() {
    const items = document.querySelectorAll('.accordion-item');
    const courses = Array.from(items).map(item => ({
        id: parseInt(item.dataset.id) || Date.now(),
        title: item.querySelector('.editable-title').innerHTML,
        content: item.querySelector('.accordion-content .editable').innerHTML
    }));
    
    localStorage.setItem('phd_courses', JSON.stringify(courses));
}

function deleteCourse(id) {
    const item = document.querySelector(`[data-id="${id}"]`);
    item.remove();
    saveCourses();
}

// ===== Books Section =====
function initializeBooks() {
    const booksContent = document.querySelector('.books-content');
    const addBtn = document.getElementById('addBookBtn');
    
    // Load saved books
    const savedBooks = localStorage.getItem('phd_books');
    if (savedBooks) {
        booksContent.innerHTML = savedBooks;
        renderBookCards();
    }
    
    booksContent.addEventListener('blur', () => {
        localStorage.setItem('phd_books', booksContent.innerHTML);
        renderBookCards();
    });
    
    addBtn.addEventListener('click', () => {
        const newBook = 'New Book Title: Add your summary and notes here.\n\n';
        booksContent.innerHTML += newBook;
        booksContent.focus();
        localStorage.setItem('phd_books', booksContent.innerHTML);
        renderBookCards();
    });
}

function renderBookCards() {
    const booksContent = document.querySelector('.books-content');
    const text = booksContent.innerText;
    
    if (!text.trim()) return;
    
    // Parse books by splitting on double newline or "Title:"
    const books = text.split(/\n\n+/).filter(book => book.trim());
    
    booksContent.innerHTML = '';
    
    books.forEach(book => {
        const parts = book.split(':');
        const title = parts[0].trim();
        const content = parts.slice(1).join(':').trim();
        
        if (title) {
            const card = document.createElement('div');
            card.className = 'book-card';
            card.innerHTML = `
                <h4>${title}</h4>
                <p>${content || 'No summary yet.'}</p>
            `;
            booksContent.appendChild(card);
        }
    });
}

// ===== 2 Min Reads Carousel =====
function initializeReads() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const addBtn = document.getElementById('addReadBtn');
    const slidesContainer = document.getElementById('carouselSlides');
    const progressBar = document.getElementById('progressBar');
    
    // Load saved reads
    let reads = JSON.parse(localStorage.getItem('phd_reads') || '[]');
    if (reads.length === 0) {
        reads = [{
            id: Date.now(),
            title: 'Welcome to 2 Min Reads',
            content: 'Share quick insights and reflections here. Each read auto-advances after 2 minutes.',
            date: new Date().toLocaleDateString()
        }];
        localStorage.setItem('phd_reads', JSON.stringify(reads));
    }
    
    renderReads();
    
    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentSlide < reads.length - 1) {
            currentSlide++;
            updateCarousel();
        }
    });
    
    addBtn.addEventListener('click', () => {
        const newRead = {
            id: Date.now(),
            title: 'New 2 Min Read',
            content: 'Share a quick insight or reflection here...',
            date: new Date().toLocaleDateString()
        };
        
        reads.push(newRead);
        localStorage.setItem('phd_reads', JSON.stringify(reads));
        renderReads();
        currentSlide = reads.length - 1;
        updateCarousel();
    });
    
    function renderReads() {
        slidesContainer.innerHTML = '';
        
        reads.forEach((read, index) => {
            const slide = document.createElement('div');
            slide.className = 'read-slide';
            slide.innerHTML = `
                <h3 class="editable" contenteditable="${editMode}" data-placeholder="Read Title">${read.title}</h3>
                <div class="read-content editable" contenteditable="${editMode}" data-placeholder="Your 2-minute read content...">${read.content}</div>
                <div class="read-meta">
                    <span>${read.date}</span>
                    <span>${index + 1} / ${reads.length}</span>
                </div>
            `;
            slidesContainer.appendChild(slide);
            
            // Add save listeners
            const editables = slide.querySelectorAll('.editable');
            editables.forEach(editable => {
                editable.addEventListener('blur', () => saveReads());
                editable.addEventListener('input', debounce(() => saveReads(), 1000));
            });
        });
        
        updateCarousel();
    }
    
    function updateCarousel() {
        slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === reads.length - 1;
        
        // Reset progress bar
        progressBar.classList.remove('active');
        clearInterval(autoAdvanceInterval);
        
        // Start auto-advance (2 minutes)
        setTimeout(() => {
            progressBar.classList.add('active');
        }, 100);
        
        autoAdvanceInterval = setTimeout(() => {
            if (currentSlide < reads.length - 1) {
                currentSlide++;
                updateCarousel();
            }
        }, 120000); // 2 minutes
    }
    
    function saveReads() {
        const slides = document.querySelectorAll('.read-slide');
        reads = Array.from(slides).map((slide, index) => ({
            id: reads[index].id,
            title: slide.querySelector('h3').innerHTML,
            content: slide.querySelector('.read-content').innerHTML,
            date: reads[index].date
        }));
        
        localStorage.setItem('phd_reads', JSON.stringify(reads));
    }
}

// ===== Utility Functions =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== Export Functions for inline onclick =====
window.deleteInsight = deleteInsight;
window.deleteCourse = deleteCourse; 