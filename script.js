// ===== Global Variables =====
let editMode = false;
let currentSlide = 0;
let autoAdvanceInterval = null;

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeEditMode();
    initializeAnimations();
    // initializeParallax(); // Removed
    loadAllContent();
    initializeInsights();
    initializeCourses();
    // initializeBooks(); // Removed old implementation
    initializeReads();
    initializeAutoSave();
});

// ===== Navigation & Smooth Scroll =====
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
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
                if (navMenu) navMenu.classList.remove('active');
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
    
    if (editToggle) {
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

// ===== Load All Content from localStorage =====
function loadAllContent() {
    // Load bio if it exists (though we are using static now, keeping for compatibility if needed)
    const bioContent = document.querySelector('.bio-content');
    const savedBio = localStorage.getItem('phd_bio');
    if (savedBio && bioContent && bioContent.classList.contains('editable')) {
        bioContent.innerHTML = savedBio;
    }
}

// ===== Auto Save Functionality =====
function initializeAutoSave() {
    const editables = document.querySelectorAll('.editable');
    
    editables.forEach(editable => {
        editable.addEventListener('blur', () => {
            saveContent(editable);
        });
        
        // Auto-save on input with debounce
        let timeout;
        editable.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                saveContent(editable);
            }, 1000);
        });
    });
}

function saveContent(element) {
    const content = element.innerHTML;
    
    // Determine what to save based on element
    if (element.classList.contains('bio-content')) {
        localStorage.setItem('phd_bio', content);
    }
}

// ===== Research Insights =====
function initializeInsights() {
    // Keeping insights static for now as per professional request, 
    // but logic can remain if we want to re-enable dynamic addition later.
    // For now, we just ensure no errors if elements are missing.
    const addBtn = document.getElementById('addInsightBtn');
    if (addBtn) {
        // ... existing logic if button existed ...
    }
}

// ===== Courses Accordion =====
function initializeCourses() {
    const accordion = document.getElementById('coursesAccordion');
    const addBtn = document.getElementById('addCourseBtn');
    
    if (accordion && addBtn) {
        // Load saved courses
        const savedCourses = JSON.parse(localStorage.getItem('phd_courses') || '[]');
        if (savedCourses.length > 0) {
            // Clear default and load saved
            // Note: This might overwrite our static "Course 1" if we aren't careful.
            // For a professional site, we might want to stick to static HTML or a proper CMS.
            // I will leave the static HTML as primary for now.
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
            // saveCourses(); // Optional: enable if we want persistence
            initializeAccordion();
        });
    } else {
        // Just init accordion if buttons are missing
        initializeAccordion();
    }
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
    if (addBtn) {
        addBtn.parentNode.insertBefore(item, addBtn);
    }
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

function deleteCourse(id) {
    const item = document.querySelector(`[data-id="${id}"]`);
    if (item) item.remove();
}

// ===== 2 Min Reads Carousel =====
function initializeReads() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const addBtn = document.getElementById('addReadBtn');
    const slidesContainer = document.getElementById('carouselSlides');
    const progressBar = document.getElementById('progressBar');
    
    if (!slidesContainer) return;

    // Load saved reads
    let reads = JSON.parse(localStorage.getItem('phd_reads') || '[]');
    if (reads.length === 0) {
        reads = [{
            id: Date.now(),
            title: 'Welcome to 2 Min Reads',
            content: 'Share quick insights and reflections here. Each read auto-advances after 2 minutes.',
            date: new Date().toLocaleDateString()
        }];
    }
    
    renderReads();
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentSlide > 0) {
                currentSlide--;
                updateCarousel();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentSlide < reads.length - 1) {
                currentSlide++;
                updateCarousel();
            }
        });
    }
    
    if (addBtn) {
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
    }
    
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
        });
        
        updateCarousel();
    }
    
    function updateCarousel() {
        slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        if (prevBtn) prevBtn.disabled = currentSlide === 0;
        if (nextBtn) nextBtn.disabled = currentSlide === reads.length - 1;
        
        if (progressBar) {
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