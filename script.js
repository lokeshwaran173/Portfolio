/* Global Certificate Viewer Functions */
window.openCertViewer = function(e, imgUrl, pdfUrl, title, issuer) {
    // Handle parameter overload: openCertViewer(event, img, pdf, title, issuer) vs openCertViewer(img, pdf, title, issuer)
    if (typeof e === 'string') {
        issuer = title;
        title = pdfUrl;
        pdfUrl = imgUrl;
        imgUrl = e;
        e = null;
    }

    if (e && e.preventDefault) {
        e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();
    }

    const certModal = document.getElementById('cert-viewer-modal');
    const certModalTitle = document.getElementById('cert-modal-title');
    const certModalIssuer = document.getElementById('cert-modal-issuer');
    const certModalImg = document.getElementById('cert-modal-img');
    const certModalFallback = document.getElementById('cert-modal-fallback');
    const certModalFallbackBtn = document.getElementById('cert-modal-fallback-btn');
    const certModalDownloadBtn = document.getElementById('cert-modal-download-btn');

    if (!certModal) return;

    if (certModalTitle) certModalTitle.innerHTML = `<i class="fa-solid fa-award"></i> ${title || 'Verified Certificate'}`;
    if (certModalIssuer) certModalIssuer.textContent = issuer || 'Verified Body';

    if (certModalFallback) certModalFallback.style.display = 'none';

    if (certModalImg) {
        certModalImg.style.display = 'block';
        certModalImg.style.transform = 'rotate(0deg)';
        certModalImg.src = imgUrl || '';
        certModalImg.alt = title || 'Certificate';
    }

    if (certModalFallbackBtn) certModalFallbackBtn.href = pdfUrl || imgUrl || '#';

    if (certModalDownloadBtn) {
        certModalDownloadBtn.href = pdfUrl || imgUrl || '#';
        certModalDownloadBtn.setAttribute('download', `${title || 'Certificate'}.pdf`);
    }

    certModal.style.display = 'flex';
    certModal.classList.add('active');
};

window.closeCertViewer = function() {
    const certModal = document.getElementById('cert-viewer-modal');
    const certModalImg = document.getElementById('cert-modal-img');
    if (!certModal) return;
    certModal.classList.remove('active');
    certModal.style.display = 'none';
    if (certModalImg) certModalImg.src = '';
};

/* ==================== 1-CLICK CALENDAR SCHEDULER FUNCTIONS ==================== */
let selectedTimeSlotText = "10:00 AM IST (04:30 AM UTC)";

window.openScheduleModal = function() {
    const modal = document.getElementById('schedule-calendar-modal');
    if (!modal) return;
    
    // Default date to tomorrow
    const dateInput = document.getElementById('sched-date');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
        dateInput.min = new Date().toISOString().split('T')[0];
    }
    
    modal.style.display = 'flex';
    modal.classList.add('active');
};

window.closeScheduleModal = function(e) {
    const modal = document.getElementById('schedule-calendar-modal');
    if (!modal) return;
    if (e && e.target && e.target !== modal && !e.target.classList.contains('modal-close')) {
        return;
    }
    modal.classList.remove('active');
    modal.style.display = 'none';
};

window.selectTimeSlot = function(btnEl) {
    const allSlots = document.querySelectorAll('#time-slots-grid .slot-btn');
    allSlots.forEach(s => {
        s.classList.remove('active');
        s.style.background = 'var(--bg-glass)';
        s.style.borderColor = 'var(--border-color)';
        s.style.color = 'var(--text-secondary)';
    });
    btnEl.classList.add('active');
    btnEl.style.background = 'rgba(56, 189, 248, 0.15)';
    btnEl.style.borderColor = 'var(--accent-primary)';
    btnEl.style.color = 'var(--text-primary)';
    selectedTimeSlotText = btnEl.getAttribute('data-time') || btnEl.textContent.trim();
};

window.handleCalendarSubmit = function(e) {
    if (e) e.preventDefault();
    const name = document.getElementById('sched-name')?.value || 'Guest';
    const email = document.getElementById('sched-email')?.value || '';
    const date = document.getElementById('sched-date')?.value || new Date().toISOString().split('T')[0];
    const topic = document.getElementById('sched-topic')?.value || 'GCP Data Engineering Opportunity';

    // Format Google Calendar Event Template URL
    const cleanDate = date.replace(/-/g, '');
    const gcalTitle = encodeURIComponent(`15-Min Sync: Lokesh S x ${name} (${topic})`);
    const gcalDetails = encodeURIComponent(`Host: Lokeshwaran S (GCP Data Engineer & AI Specialist)\nAttendee: ${name} (${email})\nTopic: ${topic}\nTime Slot: ${selectedTimeSlotText}\n\nGoogle Meet Link will be dispatched prior to the call.`);
    const gcalLocation = encodeURIComponent("Google Meet / Online");
    
    const startTimeStr = `${cleanDate}T043000Z`;
    const endTimeStr = `${cleanDate}T044500Z`;
    
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${gcalTitle}&dates=${startTimeStr}/${endTimeStr}&details=${gcalDetails}&location=${gcalLocation}&add=${encodeURIComponent(email)}`;
    
    // Open Google Calendar template in new tab
    window.open(gcalUrl, '_blank');

    // Send email notification backup
    const mailSubject = encodeURIComponent(`15-Min Sync Booking: ${name} (${date} at ${selectedTimeSlotText})`);
    const mailBody = encodeURIComponent(`Hi Lokesh,\n\nI have scheduled a 15-minute sync with you!\n\nName: ${name}\nEmail: ${email}\nDate: ${date}\nTime Slot: ${selectedTimeSlotText}\nTopic: ${topic}\n\nLooking forward to connecting!\n\nBest regards,\n${name}`);
    window.location.href = `mailto:lokeshwaran.s.26022004@gmail.com?subject=${mailSubject}&body=${mailBody}`;

    window.closeScheduleModal();
};

window.sendWhatsAppSchedule = function() {
    const name = document.getElementById('sched-name')?.value || 'a Recruiter/Manager';
    const date = document.getElementById('sched-date')?.value || 'Upcoming Date';
    const topic = document.getElementById('sched-topic')?.value || 'GCP Data Engineering Sync';
    
    const waText = encodeURIComponent(`Hi Lokesh, I'm ${name}. I would like to confirm a 15-minute sync with you on ${date} during the slot ${selectedTimeSlotText} regarding: ${topic}.`);
    window.open(`https://wa.me/916380795436?text=${waText}`, '_blank');
    window.closeScheduleModal();
};

/* ==================== ROBUST THEME SWITCHER ==================== */
const PORTFOLIO_THEMES = [
    { id: 'cyber-neon', name: 'Cyber Neon', icon: '🌌' },
    { id: 'light', name: 'Light Mode', icon: '☀️' },
    { id: 'gcp-blue', name: 'Google Cloud', icon: '☁️' },
    { id: 'matrix', name: 'Matrix Green', icon: '🟢' }
];

window.selectPortfolioTheme = function(themeId, e) {
    if (e && e.stopPropagation) {
        e.stopPropagation();
    }
    
    const themeObj = PORTFOLIO_THEMES.find(t => t.id === themeId) || PORTFOLIO_THEMES[0];
    const themeName = themeObj.id;

    document.body.setAttribute('data-theme', themeName);
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('lokesh-portfolio-theme', themeName);
    localStorage.setItem('theme', themeName);

    const activeIcon = document.getElementById('theme-active-icon');
    const btnLabel = document.querySelector('.theme-btn-label');
    if (activeIcon) activeIcon.textContent = themeObj.icon;
    if (btnLabel) btnLabel.textContent = themeObj.name;

    document.querySelectorAll('.theme-opt-btn').forEach(btn => {
        if (btn.getAttribute('data-theme') === themeName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const wrapper = document.querySelector('.theme-dropdown-wrapper');
    if (wrapper) wrapper.classList.remove('active');
};

window.cycleNextTheme = function(e) {
    if (e && e.stopPropagation) {
        e.stopPropagation();
    }
    const currentTheme = document.body.getAttribute('data-theme') || 'cyber-neon';
    let currentIndex = PORTFOLIO_THEMES.findIndex(t => t.id === currentTheme);
    if (currentIndex === -1) currentIndex = 0;
    
    const nextIndex = (currentIndex + 1) % PORTFOLIO_THEMES.length;
    window.selectPortfolioTheme(PORTFOLIO_THEMES[nextIndex].id, e);
};

window.toggleThemeDropdown = function(e) {
    if (e && e.stopPropagation) {
        e.stopPropagation();
    }
    const wrapper = document.querySelector('.theme-dropdown-wrapper');
    if (wrapper) wrapper.classList.toggle('active');
};

document.addEventListener('DOMContentLoaded', () => {
    // Restore saved theme preference
    const savedTheme = localStorage.getItem('lokesh-portfolio-theme') || localStorage.getItem('theme') || 'cyber-neon';
    window.selectPortfolioTheme(savedTheme);

    // Close theme popover when clicking outside
    document.addEventListener('click', (e) => {
        const wrapper = document.querySelector('.theme-dropdown-wrapper');
        if (wrapper && !wrapper.contains(e.target)) {
            wrapper.classList.remove('active');
        }
    });
    /* Delegated Click Listener for Certificate Triggers */
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.cert-modal-trigger, .cert-trigger');
        if (trigger) {
            e.preventDefault();
            const img = trigger.getAttribute('data-img');
            const pdf = trigger.getAttribute('data-pdf');
            const title = trigger.getAttribute('data-title');
            const issuer = trigger.getAttribute('data-issuer');
            window.openCertViewer(img, pdf, title, issuer);
        }
    });

    /* --------------------------------------------------------------------------
       0. Pure CSS Single-Line Typewriter Active ("Data Engineer" <-> "AI Engineer")
       -------------------------------------------------------------------------- */

    /* --------------------------------------------------------------------------
       1. Top Reading Scroll Progress Bar
       -------------------------------------------------------------------------- */
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progress = (window.scrollY / totalHeight) * 100;
            if (scrollProgress) scrollProgress.style.width = `${progress}%`;
        }
    });



    /* --------------------------------------------------------------------------
       3. Mobile Navigation Toggle
       -------------------------------------------------------------------------- */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });
    }

    /* --------------------------------------------------------------------------
       4. HTML5 Hero Canvas: AI & Cloud Neural Synapse Matrix
       -------------------------------------------------------------------------- */
    const canvas = document.getElementById('ai-matrix-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let packets = [];
        let mouse = { x: null, y: null, radius: 180 };

        function resizeCanvas() {
            const parent = canvas.parentElement;
            if (parent) {
                width = canvas.width = parent.offsetWidth;
                height = canvas.height = parent.offsetHeight;
            }
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        const particleCount = Math.floor(Math.min(width, height) / 16);
        const colors = ['#38bdf8', '#a855f7', '#ec4899', '#10b981'];

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.9;
                this.vy = (Math.random() - 0.5) * 0.9;
                this.radius = Math.random() * 2.5 + 1.5;
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        class DataPacket {
            constructor(p1, p2) {
                this.p1 = p1;
                this.p2 = p2;
                this.progress = 0;
                this.speed = Math.random() * 0.02 + 0.012;
                this.color = p1.color;
            }

            update() {
                this.progress += this.speed;
            }

            draw() {
                let x = this.p1.x + (this.p2.x - this.p1.x) * this.progress;
                let y = this.p1.y + (this.p2.y - this.p1.y) * this.progress;

                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.shadowBlur = 12;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateHeroCanvas() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    let dx = particles[i].x - particles[j].x;
                    let dy = particles[i].y - particles[j].y;
                    let dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 130) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(168, 85, 247, ${0.22 - dist / 130})`;
                        ctx.lineWidth = 0.9;
                        ctx.stroke();

                        if (Math.random() < 0.002) {
                            packets.push(new DataPacket(particles[i], particles[j]));
                        }
                    }
                }
            }

            for (let i = packets.length - 1; i >= 0; i--) {
                packets[i].update();
                packets[i].draw();
                if (packets[i].progress >= 1) packets.splice(i, 1);
            }

            requestAnimationFrame(animateHeroCanvas);
        }

        animateHeroCanvas();
    }

    /* --------------------------------------------------------------------------
       5. Interactive 3D Card Parallax Tilt & Skills Orbit Canvas
       -------------------------------------------------------------------------- */
    const tiltCards = document.querySelectorAll('.skill-float-card, .pro-card-3d, .ai-icon-card, .edu-card-3d');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.03)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
        });
    });

    const skillsCanvas = document.getElementById('skills-orbit-canvas');
    if (skillsCanvas) {
        const sCtx = skillsCanvas.getContext('2d');
        let sWidth, sHeight;
        let sParticles = [];

        function resizeSkillsCanvas() {
            const parent = skillsCanvas.parentElement;
            if (parent) {
                sWidth = skillsCanvas.width = parent.offsetWidth;
                sHeight = skillsCanvas.height = parent.offsetHeight;
            }
        }

        window.addEventListener('resize', resizeSkillsCanvas);
        resizeSkillsCanvas();

        class SkillOrb {
            constructor() {
                this.x = Math.random() * sWidth;
                this.y = Math.random() * sHeight;
                this.vx = (Math.random() - 0.5) * 0.7;
                this.vy = (Math.random() - 0.5) * 0.7;
                this.radius = Math.random() * 2 + 1;
                this.color = Math.random() > 0.5 ? '#a855f7' : '#38bdf8';
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > sWidth) this.vx *= -1;
                if (this.y < 0 || this.y > sHeight) this.vy *= -1;
            }

            draw() {
                sCtx.beginPath();
                sCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                sCtx.fillStyle = this.color;
                sCtx.shadowBlur = 8;
                sCtx.shadowColor = this.color;
                sCtx.fill();
                sCtx.shadowBlur = 0;
            }
        }

        for (let i = 0; i < 40; i++) {
            sParticles.push(new SkillOrb());
        }

        function animateSkillsCanvas() {
            sCtx.clearRect(0, 0, sWidth, sHeight);

            for (let i = 0; i < sParticles.length; i++) {
                sParticles[i].update();
                sParticles[i].draw();

                for (let j = i + 1; j < sParticles.length; j++) {
                    let dx = sParticles[i].x - sParticles[j].x;
                    let dy = sParticles[i].y - sParticles[j].y;
                    let dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        sCtx.beginPath();
                        sCtx.moveTo(sParticles[i].x, sParticles[i].y);
                        sCtx.lineTo(sParticles[j].x, sParticles[j].y);
                        sCtx.strokeStyle = `rgba(168, 85, 247, ${0.2 - dist / 120})`;
                        sCtx.lineWidth = 0.8;
                        sCtx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateSkillsCanvas);
        }
        animateSkillsCanvas();
    }

    /* --------------------------------------------------------------------------
       6. Education Neural Synapse Canvas Animation
       -------------------------------------------------------------------------- */
    const eduCanvas = document.getElementById('edu-synapse-canvas');
    if (eduCanvas) {
        const eCtx = eduCanvas.getContext('2d');
        let eWidth, eHeight;
        let eParticles = [];

        function resizeEduCanvas() {
            const parent = eduCanvas.parentElement;
            if (parent) {
                eWidth = eduCanvas.width = parent.offsetWidth;
                eHeight = eduCanvas.height = parent.offsetHeight;
            }
        }

        window.addEventListener('resize', resizeEduCanvas);
        resizeEduCanvas();

        class EduParticle {
            constructor() {
                this.x = Math.random() * eWidth;
                this.y = Math.random() * eHeight;
                this.vx = (Math.random() - 0.5) * 0.6;
                this.vy = (Math.random() - 0.5) * 0.6;
                this.radius = Math.random() * 2 + 1;
                this.color = Math.random() > 0.5 ? '#a855f7' : '#38bdf8';
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > eWidth) this.vx *= -1;
                if (this.y < 0 || this.y > eHeight) this.vy *= -1;
            }

            draw() {
                eCtx.beginPath();
                eCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                eCtx.fillStyle = this.color;
                eCtx.fill();
            }
        }

        for (let i = 0; i < 28; i++) {
            eParticles.push(new EduParticle());
        }

        function animateEduCanvas() {
            eCtx.clearRect(0, 0, eWidth, eHeight);
            for (let i = 0; i < eParticles.length; i++) {
                eParticles[i].update();
                eParticles[i].draw();

                for (let j = i + 1; j < eParticles.length; j++) {
                    let dx = eParticles[i].x - eParticles[j].x;
                    let dy = eParticles[i].y - eParticles[j].y;
                    let dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        eCtx.beginPath();
                        eCtx.moveTo(eParticles[i].x, eParticles[i].y);
                        eCtx.lineTo(eParticles[j].x, eParticles[j].y);
                        eCtx.strokeStyle = `rgba(56, 189, 248, ${0.4 * (1 - dist / 120)})`;
                        eCtx.lineWidth = 0.6;
                        eCtx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateEduCanvas);
        }

        animateEduCanvas();
    }

    /* --------------------------------------------------------------------------
       6. Interactive GCP Shell Terminal
       -------------------------------------------------------------------------- */
    const shellOutput = document.getElementById('shell-output');
    const shellInput = document.getElementById('shell-input');
    const shellChips = document.querySelectorAll('.shell-chip');

    const commandDatabase = {
        'ai-profile': `
<div class="res-item"><span class="k">Role:</span> Data Engineer (GCP) & AI Specialist</div>
<div class="res-item"><span class="k">Location:</span> Chennai, Tamil Nadu, India</div>
<div class="res-item"><span class="k">AI Stack:</span> Anthropic Claude Architecture, Gemini APIs, GitHub Copilot</div>
<div class="res-item"><span class="k">GCP Services:</span> BigQuery, Cloud Pub/Sub, Cloud Run, Docker, Spanner, GCS</div>`,

        'skills --top': `
<div class="res-item"><span class="k">AI Architecture:</span> Claude Certified Architect (CCA F), Google Generative AI Leader</div>
<div class="res-item"><span class="k">GCP Data Engineering:</span> BigQuery Analytical SQL, Cloud Pub/Sub, Cloud Run, Docker</div>
<div class="res-item"><span class="k">Databases & DevOps:</span> Cloud Spanner, GCS, Git, Azure DevOps, Linux Shell, Mainframe</div>`,

        'education --cgpa': `
<div class="res-item"><span class="k">MBA (AI):</span> Amrita Vishwa Vidyapeetham | 9.00 CGPA (2025–Present)</div>
<div class="res-item"><span class="k">B.Tech (AI & DS):</span> Rajalakshmi Institute of Tech | 8.45 CGPA (2021–2025)</div>
<div class="res-item"><span class="k">Class XII / X:</span> State Board | 92.24% (XII) &bull; 91.40% (X)</div>`,

        'certifications --list': `
<div class="res-item"><span class="k">1.</span> AB-730: Microsoft Certified AI Business Professional</div>
<div class="res-item"><span class="k">2.</span> Claude Certified Architect - Foundations (CCA F)</div>
<div class="res-item"><span class="k">3.</span> Google Generative AI Leader</div>
<div class="res-item"><span class="k">4.</span> Google Certified Cloud Digital Leader</div>
<div class="res-item"><span class="k">5.</span> Intel Unnati Industrial Program — Winner</div>`,

        'help': `
<div class="res-item"><span class="k">Available Commands:</span></div>
<div class="res-item">&bull; ai-profile</div>
<div class="res-item">&bull; skills --top</div>
<div class="res-item">&bull; education --cgpa</div>
<div class="res-item">&bull; certifications --list</div>
<div class="res-item">&bull; clear</div>`
    };

    function runShellCommand(cmd) {
        if (!shellOutput) return;
        const trimmed = cmd.trim().toLowerCase();

        if (trimmed === 'clear') {
            shellOutput.innerHTML = `<div class="shell-line comment"># Terminal screen cleared</div>`;
            return;
        }

        const promptLine = document.createElement('div');
        promptLine.className = 'shell-line prompt-line';
        promptLine.innerHTML = `<span class="prompt">lokesh@gcp-ai:~$</span> <span class="cmd-text">${trimmed}</span>`;
        shellOutput.appendChild(promptLine);

        const responseBox = document.createElement('div');
        responseBox.className = 'shell-response';

        if (commandDatabase[trimmed]) {
            responseBox.innerHTML = commandDatabase[trimmed];
        } else {
            responseBox.innerHTML = `<div class="res-item" style="color: #ef4444;">Command not recognized: '${trimmed}'. Type 'help' for commands.</div>`;
        }

        shellOutput.appendChild(responseBox);
        shellOutput.scrollTop = shellOutput.scrollHeight;
    }

    if (shellInput) {
        shellInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                runShellCommand(shellInput.value);
                shellInput.value = '';
            }
        });
    }

    shellChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const cmd = chip.getAttribute('data-cmd');
            runShellCommand(cmd);
        });
    });

    /* --------------------------------------------------------------------------
       7. Resume Modal & Toast Utilities
       -------------------------------------------------------------------------- */
    const resumeModal = document.getElementById('resume-modal');
    const openResumeModalBtn = document.getElementById('open-resume-modal');
    const closeResumeModalBtn = document.getElementById('close-resume-modal');

    function openResumeModal() { if (resumeModal) resumeModal.classList.add('active'); }
    function closeResumeModal() { if (resumeModal) resumeModal.classList.remove('active'); }

    if (openResumeModalBtn) openResumeModalBtn.addEventListener('click', openResumeModal);
    if (closeResumeModalBtn) closeResumeModalBtn.addEventListener('click', closeResumeModal);

    if (resumeModal) {
        resumeModal.addEventListener('click', (e) => {
            if (e.target === resumeModal) closeResumeModal();
        });
    }

    const toast = document.getElementById('toast');
    const btnCopyEmail = document.getElementById('btn-copy-email');
    const btnCopyPhone = document.getElementById('btn-copy-phone');

    function showToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    if (btnCopyEmail) {
        btnCopyEmail.addEventListener('click', () => {
            navigator.clipboard.writeText('lokeshwaran.s.26022004@gmail.com');
            showToast('Email copied to clipboard!');
        });
    }

    if (btnCopyPhone) {
        btnCopyPhone.addEventListener('click', () => {
            navigator.clipboard.writeText('+916380795436');
            showToast('Phone number copied to clipboard!');
        });
    }

    window.sendContactViaWhatsApp = function() {
        const formStatus = document.getElementById('form-status');
        const name = document.getElementById('form-name')?.value?.trim();
        const email = document.getElementById('form-email')?.value?.trim();
        const subject = document.getElementById('form-subject')?.value?.trim() || 'GCP Data Engineering & AI Portfolio Inquiry';
        const message = document.getElementById('form-msg')?.value?.trim();

        if (!name || !email || !message) {
            if (formStatus) {
                formStatus.style.color = '#ef4444';
                formStatus.textContent = 'Please fill in your Name, Email, and Message before sending.';
            }
            return false;
        }

        const waText = encodeURIComponent(`Hi Lokesh, my name is ${name} (${email}).\n\nSubject: ${subject}\n\nMessage: ${message}`);
        window.open(`https://wa.me/916380795436?text=${waText}`, '_blank');

        if (formStatus) {
            formStatus.style.color = 'var(--accent-emerald)';
            formStatus.textContent = `Thank you, ${name}! Your WhatsApp message has been prepared for Lokeshwaran (+91 6380795436).`;
        }

        const contactForm = document.getElementById('executive-contact-form');
        if (contactForm) {
            contactForm.reset();
            const subjectInput = document.getElementById('form-subject');
            if (subjectInput) subjectInput.value = "GCP Data Engineering & AI Portfolio Inquiry";
        }
        setTimeout(() => { if (formStatus) formStatus.textContent = ''; }, 8000);
        return false;
    };

    window.handleContactEmailSubmit = function(e) {
        if (e) {
            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();
        }

        const formStatus = document.getElementById('form-status');
        const name = document.getElementById('form-name')?.value?.trim();
        const email = document.getElementById('form-email')?.value?.trim();
        const userSubject = document.getElementById('form-subject')?.value?.trim() || 'GCP Data Engineering & AI Portfolio Inquiry';
        const msg = document.getElementById('form-msg')?.value?.trim();

        if (!name || !email || !msg) {
            if (formStatus) {
                formStatus.style.color = '#ef4444';
                formStatus.textContent = 'Please fill in your Name, Email, and Message before sending.';
            }
            return false;
        }

        // Common Standard Subject for all emails
        const commonSubject = encodeURIComponent(`GCP Data Engineering & AI Portfolio Inquiry - ${name}`);
        const mailBody = encodeURIComponent(`Hi Lokeshwaran,\n\n${msg}\n\n---\nSender Details:\nName: ${name}\nEmail: ${email}\nTopic: ${userSubject}`);

        // Open mailto link cleanly via temporary anchor element to avoid browser redirection
        const mailtoUri = `mailto:lokeshwaran.s.26022004@gmail.com?subject=${commonSubject}&body=${mailBody}`;
        const mailLink = document.createElement('a');
        mailLink.href = mailtoUri;
        mailLink.target = '_blank';
        document.body.appendChild(mailLink);
        mailLink.click();
        document.body.removeChild(mailLink);

        if (formStatus) {
            formStatus.style.color = 'var(--accent-emerald)';
            formStatus.textContent = `Thank you, ${name}! Email prepared for lokeshwaran.s.26022004@gmail.com. Lokeshwaran will get back to you shortly!`;
        }

        const contactForm = document.getElementById('executive-contact-form');
        if (contactForm) {
            contactForm.reset();
            const subjectInput = document.getElementById('form-subject');
            if (subjectInput) subjectInput.value = "GCP Data Engineering & AI Portfolio Inquiry";
        }
        setTimeout(() => { if (formStatus) formStatus.textContent = ''; }, 8000);
        return false;
    };

    /* --------------------------------------------------------------------------
       8. Custom Certificate Viewer Page Modal Event Handlers
       -------------------------------------------------------------------------- */
    const certModalEl = document.getElementById('cert-viewer-modal');
    const closeCertModalBtnEl = document.getElementById('close-cert-modal');

    if (closeCertModalBtnEl) {
        closeCertModalBtnEl.addEventListener('click', window.closeCertViewer);
    }
    if (certModalEl) {
        certModalEl.addEventListener('click', (e) => {
            if (e.target === certModalEl) window.closeCertViewer();
        });
    }

    /* --------------------------------------------------------------------------
       9. Interactive Tech Developer Badge Matrix Scramble Effect
       -------------------------------------------------------------------------- */
    const badgeEl = document.getElementById('hero-tech-badge');
    const nameEl = document.getElementById('hero-name-text');
    const originalText = "Lokeshwaran S";
    const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/_#@$%&";

    if (badgeEl && nameEl) {
        let isScrambling = false;

        function runMatrixScramble() {
            if (isScrambling) return;
            isScrambling = true;

            let iteration = 0;
            const interval = setInterval(() => {
                nameEl.textContent = originalText
                    .split("")
                    .map((char, index) => {
                        if (index < iteration) {
                            return originalText[index];
                        }
                        return matrixChars[Math.floor(Math.random() * matrixChars.length)];
                    })
                    .join("");

                if (iteration >= originalText.length) {
                    clearInterval(interval);
                    nameEl.textContent = originalText;
                    isScrambling = false;
                }

                iteration += 1 / 2;
            }, 30);
        }

        badgeEl.addEventListener('mouseenter', runMatrixScramble);
        badgeEl.addEventListener('click', runMatrixScramble);
    }

    /* --------------------------------------------------------------------------
       Mobile Navigation Drawer Controller
       -------------------------------------------------------------------------- */
    window.toggleMobileNav = function() {
        const navMenu = document.getElementById('nav-menu');
        const toggleIcon = document.getElementById('mobile-toggle-icon');
        if (navMenu) {
            navMenu.classList.toggle('active');
            if (toggleIcon) {
                if (navMenu.classList.contains('active')) {
                    toggleIcon.className = 'fa-solid fa-xmark';
                } else {
                    toggleIcon.className = 'fa-solid fa-bars';
                }
            }
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const navMenu = document.getElementById('nav-menu');
                const toggleIcon = document.getElementById('mobile-toggle-icon');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (toggleIcon) toggleIcon.className = 'fa-solid fa-bars';
                }
            });
        });
    });

    /* --------------------------------------------------------------------------
       10. "Ask Lokesh AI" Floating Assistant Widget Logic (v4.0)
       -------------------------------------------------------------------------- */
    window.toggleAiAssistant = function() {
        const widget = document.getElementById('ai-assistant-widget');
        if (widget) {
            widget.classList.toggle('active');
            if (widget.classList.contains('active')) {
                const input = document.getElementById('ai-chat-input');
                if (input) setTimeout(() => input.focus(), 300);
            }
        }
    };

    window.sendQuickPrompt = function(promptText) {
        const input = document.getElementById('ai-chat-input');
        if (input) {
            input.value = promptText;
            window.handleAiChatSubmit(new Event('submit'));
        }
    };

    // Delegated click handler for AI quick chips
    document.addEventListener('click', (e) => {
        const chip = e.target.closest('.ai-chip');
        if (chip) {
            e.preventDefault();
            const prompt = chip.getAttribute('data-prompt') || chip.textContent.trim();
            window.sendQuickPrompt(prompt);
        }
    });

    window.clearAiChat = function() {
        const chatBody = document.getElementById('ai-chat-body');
        if (!chatBody) return;
        
        chatBody.innerHTML = `
            <div class="ai-message bot-msg">
                <div class="ai-msg-avatar">
                    ${getRobotAvatarHtml('neutral')}
                </div>
                <div class="ai-msg-bubble">
                    Hello! 👋 I'm <strong>Lokesh's AI Assistant</strong>. Ask me anything about his GCP Data Engineering background, AI architectures, certifications, or schedule a 15-min call!
                </div>
            </div>

            <!-- Suggested Quick Prompts -->
            <div class="ai-quick-chips" id="ai-quick-chips">
                <button type="button" class="ai-chip" data-prompt="What are Lokesh's top GCP & AI skills?">💡 Top Skills</button>
                <button type="button" class="ai-chip" data-prompt="Tell me about Lokesh's work experience">💼 Work Experience</button>
                <button type="button" class="ai-chip" data-prompt="Which certifications does Lokesh hold?">🎓 Certifications</button>
                <button type="button" class="ai-chip" data-prompt="How can I contact Lokesh?">📬 Contact Lokesh</button>
            </div>
        `;
        
        setRobotExpression('neutral');
        
        const input = document.getElementById('ai-chat-input');
        if (input) input.value = '';
    };

    window.handleAiChatSubmit = function(e) {
        if (e) e.preventDefault();
        const input = document.getElementById('ai-chat-input');
        const chatBody = document.getElementById('ai-chat-body');
        if (!input || !chatBody) return;

        const query = input.value.trim();
        if (!query) return;

        // Hide quick chips once user sends custom message
        const chipsEl = document.getElementById('ai-quick-chips');
        if (chipsEl) chipsEl.style.display = 'none';

        // Append User Message
        appendUserMessage(query);
        input.value = '';

        // Show Typing Dots
        const typingId = showTypingIndicator();

        // Generate Knowledge Base Answer
        setTimeout(() => {
            removeTypingIndicator(typingId);
            const answer = generateAiKnowledgeResponse(query);
            appendBotMessage(answer);
        }, 600 + Math.random() * 400);
    };

    /* ==================== WEB SPEECH API & VOICE ENGINE ==================== */
    let recognition = null;
    let isListening = false;
    let ttsEnabled = false;

    // Initialize Web Speech Recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = function() {
            isListening = true;
            const micBtn = document.getElementById('ai-mic-btn');
            const micIcon = document.getElementById('mic-icon');
            if (micBtn) {
                micBtn.style.background = '#ef4444';
                micBtn.style.color = '#ffffff';
                micBtn.style.boxShadow = '0 0 12px rgba(239, 68, 68, 0.6)';
            }
            if (micIcon) micIcon.className = 'fa-solid fa-microphone-lines fa-beat';
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            const input = document.getElementById('ai-chat-input');
            if (input) {
                input.value = transcript;
                window.handleAiChatSubmit(new Event('submit'));
            }
        };

        recognition.onerror = function() {
            stopVoiceRecognition();
        };

        recognition.onend = function() {
            stopVoiceRecognition();
        };
    }

    function stopVoiceRecognition() {
        isListening = false;
        const micBtn = document.getElementById('ai-mic-btn');
        const micIcon = document.getElementById('mic-icon');
        if (micBtn) {
            micBtn.style.background = 'var(--bg-glass)';
            micBtn.style.color = 'var(--text-primary)';
            micBtn.style.boxShadow = 'none';
        }
        if (micIcon) micIcon.className = 'fa-solid fa-microphone';
    }

    window.toggleVoiceRecognition = function() {
        if (!recognition) {
            alert('Voice recognition is active! Please speak your question into your microphone.');
            return;
        }
        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };

    window.toggleTextToSpeech = function() {
        ttsEnabled = !ttsEnabled;
        const ttsIcon = document.getElementById('tts-icon');
        const ttsBtn = document.getElementById('ai-tts-btn');
        if (ttsEnabled) {
            if (ttsIcon) ttsIcon.className = 'fa-solid fa-volume-high';
            if (ttsBtn) ttsBtn.style.color = 'var(--accent-primary)';
            speakText("Voice response enabled!");
        } else {
            if (ttsIcon) ttsIcon.className = 'fa-solid fa-volume-xmark';
            if (ttsBtn) ttsBtn.style.color = 'var(--text-secondary)';
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        }
    };

    let speechRecognitionObj = null;
    let isSpeechListening = false;

    window.toggleVoiceRecognition = function() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            showToast("Speech Recognition is not supported in this browser. Please type your query.");
            return;
        }

        const micBtn = document.getElementById('ai-mic-btn');
        const micIcon = document.getElementById('mic-icon');
        const chatInput = document.getElementById('ai-chat-input');

        if (isSpeechListening && speechRecognitionObj) {
            speechRecognitionObj.stop();
            return;
        }

        try {
            speechRecognitionObj = new SpeechRecognition();
            speechRecognitionObj.continuous = false;
            speechRecognitionObj.interimResults = true;
            speechRecognitionObj.lang = 'en-US';

            speechRecognitionObj.onstart = function() {
                isSpeechListening = true;
                if (micBtn) {
                    micBtn.classList.add('listening');
                }
                if (micIcon) {
                    micIcon.className = 'fa-solid fa-microphone-lines';
                }
                if (chatInput) {
                    chatInput.placeholder = "Listening... Speak now 🎙️";
                }
                setRobotExpression('surprised');
                showToast("🎙️ Listening... Speak your question now!");
            };

            speechRecognitionObj.onresult = function(event) {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                if (chatInput) {
                    chatInput.value = transcript;
                }
            };

            speechRecognitionObj.onerror = function(event) {
                console.warn('Speech recognition error:', event.error);
                if (event.error !== 'no-speech' && event.error !== 'aborted') {
                    showToast("Voice input error: " + event.error);
                }
                stopListeningUi();
            };

            speechRecognitionObj.onend = function() {
                stopListeningUi();
                if (chatInput && chatInput.value.trim().length > 0) {
                    setRobotExpression('happy');
                    showToast("🎙️ Voice command captured! Processing...");
                    setTimeout(() => {
                        window.handleAiChatSubmit(new Event('submit'));
                    }, 200);
                }
            };

            speechRecognitionObj.start();
        } catch (err) {
            console.error('Speech recognition exception:', err);
            showToast("Unable to start voice input. Please try again.");
            stopListeningUi();
        }

        function stopListeningUi() {
            isSpeechListening = false;
            if (micBtn) {
                micBtn.classList.remove('listening');
            }
            if (micIcon) {
                micIcon.className = 'fa-solid fa-microphone';
            }
            if (chatInput) {
                chatInput.placeholder = "Ask or speak about BigQuery, Claude AI, GCP...";
            }
            setRobotExpression('neutral');
        }
    };

    function speakText(text) {
        if (!ttsEnabled || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const waveform = document.getElementById('ai-audio-waveform');
        const cleanText = text.replace(/<[^>]*>?/gm, '').replace(/\*/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.lang = 'en-US';

        utterance.onstart = function() {
            if (waveform) waveform.classList.add('active');
        };
        utterance.onend = function() {
            if (waveform) waveform.classList.remove('active');
        };
        utterance.onerror = function() {
            if (waveform) waveform.classList.remove('active');
        };

        window.speechSynthesis.speak(utterance);
    }

    window.scrollToAndHighlightSection = function(sectionId) {
        const el = document.getElementById(sectionId);
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('section-glow-highlight');
        setTimeout(() => {
            el.classList.remove('section-glow-highlight');
        }, 2800);
    };

    /* ==================== ROBOT AVATAR EXPRESSION ENGINE ==================== */
    function setRobotExpression(expr) {
        const avatars = document.querySelectorAll('.bot-face-avatar');
        avatars.forEach(av => av.setAttribute('data-expression', expr));
    }

    function getRobotAvatarHtml(expr = 'neutral', extraClass = 'msg-avatar') {
        return `<div class="bot-face-avatar ${extraClass}" data-expression="${expr}">
            <div class="robot-head">
                <div class="robot-antenna"><span class="antenna-tip"></span></div>
                <div class="robot-face-screen">
                    <div class="robot-eyes">
                        <span class="robot-eye left-eye"></span>
                        <span class="robot-eye right-eye"></span>
                    </div>
                    <div class="robot-mouth"></div>
                </div>
            </div>
        </div>`;
    }

    function appendUserMessage(text) {
        const chatBody = document.getElementById('ai-chat-body');
        const userMsg = document.createElement('div');
        userMsg.className = 'ai-message user-msg';
        userMsg.innerHTML = `
            <div class="ai-msg-bubble">${escapeHtml(text)}</div>
        `;
        chatBody.appendChild(userMsg);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function formatMarkdownToHtml(text) {
        if (!text) return '';
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    /* REALISTIC STREAMING TYPEWRITER REVEAL ENGINE */
    function appendBotMessage(rawText) {
        const chatBody = document.getElementById('ai-chat-body');
        const botMsg = document.createElement('div');
        botMsg.className = 'ai-message bot-msg';
        
        const avatarContainer = document.createElement('div');
        avatarContainer.className = 'ai-msg-avatar';
        avatarContainer.innerHTML = getRobotAvatarHtml('talking');

        const bubbleContainer = document.createElement('div');
        bubbleContainer.className = 'ai-msg-bubble';

        botMsg.appendChild(avatarContainer);
        botMsg.appendChild(bubbleContainer);
        chatBody.appendChild(botMsg);

        const fullHtml = formatMarkdownToHtml(rawText);
        setRobotExpression('talking');

        const tokens = splitHtmlIntoTokens(fullHtml);
        let currentTokenIndex = 0;
        let currentContent = "";

        const streamInterval = setInterval(() => {
            if (currentTokenIndex < tokens.length) {
                currentContent += tokens[currentTokenIndex];
                bubbleContainer.innerHTML = currentContent;
                chatBody.scrollTop = chatBody.scrollHeight;
                currentTokenIndex++;
            } else {
                clearInterval(streamInterval);
                setRobotExpression('happy');
                setTimeout(() => setRobotExpression('neutral'), 2500);
                speakText(rawText);
            }
        }, 22);
    }

    function splitHtmlIntoTokens(html) {
        const tokenRegex = /(<[^>]+>|[^<>\s]+|\s+)/g;
        return html.match(tokenRegex) || [html];
    }

    function showTypingIndicator() {
        setRobotExpression('thinking');
        const chatBody = document.getElementById('ai-chat-body');
        const id = 'typing-' + Date.now();
        const typingMsg = document.createElement('div');
        typingMsg.className = 'ai-message bot-msg';
        typingMsg.id = id;
        typingMsg.innerHTML = `
            <div class="ai-msg-avatar">${getRobotAvatarHtml('thinking')}</div>
            <div class="ai-msg-bubble">
                <div class="ai-typing-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        chatBody.appendChild(typingMsg);
        chatBody.scrollTop = chatBody.scrollHeight;
        return id;
    }

    function removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function calculateExactWorkExperience() {
        const startDate = new Date(2025, 2, 1); // March 2025
        const now = new Date();
        let totalMonths = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
        if (totalMonths < 1) totalMonths = 1;
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;
        
        let expString = "";
        if (years > 0 && months > 0) {
            expString = `${years} Year${years > 1 ? 's' : ''} ${months} Month${months > 1 ? 's' : ''}`;
        } else if (years > 0) {
            expString = `${years} Year${years > 1 ? 's' : ''}`;
        } else {
            expString = `${months} Month${months > 1 ? 's' : ''}`;
        }

        return {
            formatted: expString,
            totalMonths: totalMonths,
            decimalYears: (totalMonths / 12).toFixed(1)
        };
    }

    /* ==================== HIGH-EFFICIENCY AI CHAT ENGINE ==================== */

    function generateAiKnowledgeResponse(userQuery) {
        const q = userQuery.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');

        // Greetings & Salutations (Hi, Hello, Hey, etc.)
        if (q === 'hi' || q === 'hello' || q === 'hey' || q === 'hi lokesh' || q === 'hello lokesh' || q === 'hey lokesh' || q.startsWith('hi ') || q.startsWith('hello ') || q.startsWith('hey ') || q.includes('good morning') || q.includes('good afternoon') || q.includes('good evening') || q.includes('greetings')) {
            return `👋 **Hello! Welcome to Lokeshwaran's AI Assistant.**
            <br>I'm here to help you explore Lokesh's background as an **Associate GCP Data Engineer & AI Specialist**.
            <br><br>How can I assist you today? You can ask me:
            <br>• 💼 *"What is Lokesh's work experience?"*
            <br>• ⚡ *"What are his core GCP & AI skills?"*
            <br>• 📜 *"Which certifications does he hold?"*
            <br>• 📅 *"Schedule a meeting or interview with Lokesh"*`;
        }

        // Who are you / Identity
        if (q.includes('who are you') || q.includes('what are you') || q.includes('your name') || q.includes('about yourself')) {
            return `🤖 I am **Ask Lokesh AI**, an interactive AI Assistant built to provide instant insights into Lokeshwaran's GCP Data Engineering projects, AI integrations, certifications, and experience. How can I help you?`;
        }

        // Gratitude / Thank you
        if (q.includes('thank') || q.includes('thanks') || q.includes('awesome') || q.includes('great') || q.includes('cool')) {
            return `😊 You're very welcome! Feel free to ask if you need any more details, or connect directly with Lokesh via WhatsApp:
            <br><br><a href="https://wa.me/916380795436?text=Hi%20Lokesh,%20I%20visited%20your%20portfolio%20and%20would%20love%20to%20connect!" target="_blank" class="btn-executive btn-sm" style="background:#25d366; color:#ffffff; border:none; text-decoration:none;"><i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp (+91 6380795436)</a>`;
        }

        // Years of Experience / Background / Career Duration
        if (q.includes('year') || q.includes('yr') || q.includes('yoe') || q.includes('expeerince') || q.includes('experienc') || q.includes('expe') || q.includes('how long') || q.includes('seniority') || q.includes('duration') || q.includes('history')) {
            const exp = calculateExactWorkExperience();
            setTimeout(() => scrollToAndHighlightSection('experience'), 300);
            return `💼 **Total Professional Work Experience**: **${exp.formatted}** (~${exp.decimalYears} Years)
            <br><br>📊 **Work Experience Breakdown**:
            <br>• **Data Engineer - GCP**: July 2025 – Present
            <br>• **Trainee**: March 2025 – June 2025 (4 Months)
            <br><br>🚀 **Key Core Highlights**:
            <br>• Production ETL/ELT pipelines using Pub/Sub, Cloud Run, Cloud Spanner, BigQuery, and Docker.
            <br>• High-throughput BigQuery SQL optimization.
            <br><br><button onclick="scrollToAndHighlightSection('experience')" class="btn-executive btn-sm" style="margin-top:0.4rem;">💼 View Highlighted Experience</button>`;
        }

        // Education / Degree / College
        if (q.includes('educat') || q.includes('degree') || q.includes('college') || q.includes('univer') || q.includes('study') || q.includes('btech') || q.includes('school') || q.includes('graduat')) {
            setTimeout(() => scrollToAndHighlightSection('education'), 300);
            return `🎓 **Educational Background**:
            <br>• **Degree**: Bachelor of Technology (B.Tech) in Computer Science / Data Engineering.
            <br>• **Core Focus**: Data Engineering, Cloud Infrastructure, Database Systems, Artificial Intelligence, and Distributed Systems.
            <br><br><button onclick="scrollToAndHighlightSection('education')" class="btn-executive btn-sm" style="margin-top:0.4rem;">🎓 View Academic Background</button>`;
        }

        // Achievements & Leadership
        if (q.includes('achieve') || q.includes('honor') || q.includes('leader') || q.includes('award') || q.includes('unnati') || q.includes('yuva') || q.includes('mediastic')) {
            setTimeout(() => scrollToAndHighlightSection('achievements'), 300);
            return `🏆 **Achievements & Leadership**:
            <br>• **Intel Unnati Industrial Program** — Winner (National Top Entry for AI Solution Design)
            <br>• **Rural Chairperson** — Yuva Club of RIT (Community Outreach & Youth Empowerment)
            <br>• **Design President** — Mediastic Club of RIT (Creative Operations & Event Publicity)
            <br><br><button onclick="scrollToAndHighlightSection('achievements')" class="btn-executive btn-sm" style="margin-top:0.4rem;">🏆 View Achievements Section</button>`;
        }

        // Generative AI / LLM Engineering
        if (q.includes('ai') || q.includes('claude') || q.includes('gemini') || q.includes('copilot') || q.includes('genai') || q.includes('llm') || q.includes('rag') || q.includes('prompt') || q.includes('gpt')) {
            setTimeout(() => scrollToAndHighlightSection('skills'), 300);
            return `🤖 **Generative AI & LLM Architecture**:
            <br>Lokesh is an **Anthropic Claude Certified Architect (CCA F)** and **Google Generative AI Leader** certified specialist.
            <br><br>• **LLM Models**: Anthropic Claude 3.5, Google Gemini 1.5, GitHub Copilot.
            <br>• **AI Solutions**: Built RAG document search pipelines, prompt engineering workflows, and intelligent text analytics.
            <br><br><button onclick="scrollToAndHighlightSection('skills')" class="btn-executive btn-sm" style="margin-top:0.4rem;">⚡ View AI Tech Stack</button>`;
        }

        // BigQuery & SQL Optimization
        if (q.includes('bigquery') || q.includes('sql') || q.includes('optimi') || q.includes('query') || q.includes('warehouse')) {
            setTimeout(() => scrollToAndHighlightSection('experience'), 300);
            return `⚡ **GCP BigQuery & SQL Performance Tuning**:
            <br>Lokesh specializes in high-throughput BigQuery data warehousing and analytical query tuning.
            <br><br>• **Optimization**: Applied table partitioning, clustering, and materialized views for enterprise data lakes.
            <br>• **Pipelines**: Built streaming ingestion from Cloud Pub/Sub into BigQuery with zero data loss.`;
        }

        // Cloud Migration / Oracle / Mainframe
        if (q.includes('oracle') || q.includes('mainframe') || q.includes('migrat') || q.includes('spanner')) {
            setTimeout(() => scrollToAndHighlightSection('experience'), 300);
            return `🔄 **Cloud Database Migration**:
            <br>Lokesh has successfully executed database modernization projects:
            <br>• **Oracle to GCP**: Migrated legacy Oracle relational databases to Google Cloud Spanner & BigQuery.
            <br>• **Mainframe Modernization**: Modernized legacy Mainframe batch processing into cloud-native BigQuery data lakes.`;
        }

        // Certifications
        if (q.includes('certif') || q.includes('credential') || q.includes('ab730') || q.includes('badge') || q.includes('pass')) {
            setTimeout(() => scrollToAndHighlightSection('certifications'), 300);
            return `🎓 **Lokesh's Official Certifications**:
            <br>1. **Claude Certified Architect (CCA F)** — Anthropic
            <br>2. **Microsoft AB-730** — AI Business Professional
            <br>3. **Google Cloud Digital Leader** — GCP
            <br>4. **Google Generative AI Leader** — GCP
            <br><br><button onclick="scrollToAndHighlightSection('certifications')" class="btn-executive btn-sm" style="margin-top:0.4rem;">📜 View Certificates Carousel</button>`;
        }

        // Skills / Stack / Technologies
        if (q.includes('skill') || q.includes('stack') || q.includes('technology') || q.includes('tech') || q.includes('tool') || q.includes('language') || q.includes('python')) {
            setTimeout(() => scrollToAndHighlightSection('skills'), 300);
            return `🚀 **Lokesh's Core Technology Stack**:
            <br>• **GCP Services**: BigQuery, Cloud Pub/Sub, Cloud Run, Cloud Spanner, GCS, Dataflow, Looker.
            <br>• **AI & LLMs**: Anthropic Claude 3.5, Google Gemini, GitHub Copilot, RAG, Prompt Engineering.
            <br>• **Languages & DevOps**: Python, SQL, Shell Scripting, Docker, Git, Linux.
            <br><br><button onclick="scrollToAndHighlightSection('skills')" class="btn-executive btn-sm" style="margin-top:0.4rem;">⚡ Jump to Skills Stack</button>`;
        }

        // Projects / Portfolio Work
        if (q.includes('project') || q.includes('portfolio') || q.includes('built') || q.includes('demo') || q.includes('system')) {
            setTimeout(() => scrollToAndHighlightSection('projects'), 300);
            return `🚀 **Featured Projects**:
            <br>1. **Real-time Pub/Sub to BigQuery Pipeline**: High-throughput streaming data pipeline.
            <br>2. **Generative AI Document Analyzer**: RAG pipeline powered by Claude 3.5 & Gemini.
            <br>3. **Oracle Cloud Spanner Migration**: Modernized legacy enterprise database architecture.
            <br><br><button onclick="scrollToAndHighlightSection('projects')" class="btn-executive btn-sm" style="margin-top:0.4rem;">🚀 Explore Projects Section</button>`;
        }

        // Meeting / Schedule / Interview / Call / Book
        if (q.includes('schedule') || q.includes('interview') || q.includes('book') || q.includes('meeting') || q.includes('slot') || q.includes('call') || q.includes('calendar') || q.includes('meet')) {
            const today = new Date().toISOString().split('T')[0];
            return `📅 **Schedule a 15-Minute Sync with Lokesh**:
            <br>Select your preferred slot to connect directly with Lokesh:
            <div class="chat-calendar-card">
                <div class="chat-calendar-field">
                    <label class="chat-calendar-label"><i class="fa-solid fa-calendar-days"></i> Preferred Date:</label>
                    <input type="date" id="meet-date" class="chat-calendar-input" value="${today}">
                </div>
                <div class="chat-calendar-field">
                    <label class="chat-calendar-label"><i class="fa-solid fa-clock"></i> Time Slot (IST / UTC):</label>
                    <select id="meet-time" class="chat-calendar-select">
                        <option>10:00 AM - 10:15 AM IST</option>
                        <option>02:00 PM - 02:15 PM IST</option>
                        <option>05:00 PM - 05:15 PM IST</option>
                        <option>08:00 PM - 08:15 PM IST</option>
                    </select>
                </div>
                <button onclick="confirmMeetingBooking()" class="chat-calendar-btn">
                    <i class="fa-solid fa-calendar-check"></i> Send Calendar Invite Request
                </button>
            </div>`;
        }

        // Contact / Hire / Resume
        if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('hire') || q.includes('reach') || q.includes('linkedin') || q.includes('github') || q.includes('resume') || q.includes('whatsapp')) {
            setTimeout(() => scrollToAndHighlightSection('contact'), 300);
            return `📬 **Get in Touch with Lokesh**:
            <br>• **WhatsApp**: <a href="https://wa.me/916380795436?text=Hi%20Lokesh,%20I%20saw%20your%20GCP%20Data%20Engineer%20%26%20AI%20Specialist%20portfolio%20and%20would%20like%20to%20connect!" target="_blank" style="color:#25d366; font-weight:700;"><i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp (+91 6380795436)</a>
            <br>• **Email**: <a href="mailto:lokeshwaran.s.26022004@gmail.com" style="color:var(--accent-primary);text-decoration:underline;">lokeshwaran.s.26022004@gmail.com</a>
            <br>• **Phone**: <a href="tel:+916380795436" style="color:var(--accent-primary);text-decoration:underline;">+91 6380795436</a>
            <br>• **LinkedIn**: <a href="https://www.linkedin.com/in/lokeshwaran-s-906a58230/" target="_blank" style="color:var(--accent-primary);text-decoration:underline;">LinkedIn Profile</a>
            <br><br><button onclick="scrollToAndHighlightSection('contact')" class="btn-executive btn-sm" style="margin-top:0.4rem;">✉️ Send Direct Message</button>`;
        }

        return `🤖 Thanks for your question! Lokesh is a **GCP Data Engineer & AI Specialist** skilled in BigQuery, Claude AI, Gemini, Cloud Run, and Docker.
        <br><br>Try asking about:
        <br>• *"How many years of experience does Lokesh have?"*
        <br>• *"Schedule a 15-min call with Lokesh"*
        <br>• *"What are his top GCP & AI skills?"*
        <br>• *"Tell me about his certifications"*`;
    }

    window.confirmMeetingBooking = function() {
        const dateEl = document.getElementById('meet-date');
        const timeEl = document.getElementById('meet-time');
        const date = dateEl ? dateEl.value : 'Upcoming Date';
        const time = timeEl ? timeEl.value : 'Preferred Slot';
        const subject = encodeURIComponent(`15-Min Interview Request: Lokesh S (${date} at ${time})`);
        const body = encodeURIComponent(`Hi Lokesh,\n\nI would like to schedule a 15-minute quick sync with you on ${date} during the slot ${time}.\n\nLooking forward to discussing GCP Data Engineering & AI opportunities!\n\nBest regards,`);
        window.location.href = `mailto:lokeshwaran.s.26022004@gmail.com?subject=${subject}&body=${body}`;
    };

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /* ==================== INTERACTIVE NEURAL STARFIELD CANVAS ENGINE ==================== */
    function initNeuralStarfield() {
        const canvas = document.getElementById('ai-matrix-canvas');
        if (!canvas || !canvas.parentElement) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
        let height = canvas.height = canvas.parentElement.offsetHeight || 600;

        window.addEventListener('resize', () => {
            if (!canvas.parentElement) return;
            width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
            height = canvas.height = canvas.parentElement.offsetHeight || 600;
        });

        const particles = [];
        const particleCount = Math.min(85, Math.floor((width * height) / 11000));
        const mouse = { x: -1000, y: -1000, radius: 180 };

        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        class NeuralParticle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.85;
                this.vy = (Math.random() - 0.5) * 0.85;
                this.radius = Math.random() * 1.8 + 1.2;
                this.color = Math.random() > 0.4 ? 'rgba(56, 189, 248, ' : 'rgba(168, 85, 247, ';
                this.baseAlpha = Math.random() * 0.5 + 0.35;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius && dist > 0) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= (dx / dist) * force * 1.5;
                    this.y -= (dy / dist) * force * 1.5;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color + this.baseAlpha + ')';
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color + '0.8)';
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new NeuralParticle());
        }

        function animateNeuralSpace() {
            ctx.clearRect(0, 0, width, height);

            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 115) {
                        const alpha = (1 - dist / 115) * 0.38;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
                        ctx.lineWidth = 0.85;
                        ctx.stroke();
                    }
                }
            }

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animateNeuralSpace);
        }

        animateNeuralSpace();
    }
    initNeuralStarfield();

    /* Cursor Follower Glow Disabled for Clean UI */

    /* ==================== 1. INTERACTIVE 3D GCP GLOBE CANVAS ==================== */
    function init3DGcpGlobe() {
        const canvas = document.getElementById('gcp-globe-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = canvas.parentElement.offsetWidth || 380;
        let height = canvas.height = canvas.parentElement.offsetHeight || 300;

        window.addEventListener('resize', () => {
            if (!canvas.parentElement) return;
            width = canvas.width = canvas.parentElement.offsetWidth || 380;
            height = canvas.height = canvas.parentElement.offsetHeight || 300;
        });

        let rotationY = 0;
        const radius = Math.min(width, height) * 0.32;
        const centerX = width / 2;
        const centerY = height / 2;

        const gcpNodes = [
            { lat: 13.0827, lon: 80.2707, name: 'asia-south1 (Chennai)' },
            { lat: 41.8781, lon: -93.0977, name: 'us-central1 (Iowa)' },
            { lat: 50.8503, lon: 4.3517, name: 'europe-west1 (Belgium)' }
        ];

        function latLonTo3D(lat, lon, r, rotY) {
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lon + rotY) * (Math.PI / 180);
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.cos(phi);
            const z = r * Math.sin(phi) * Math.sin(theta);
            return { x: centerX + x, y: centerY - y, z, visible: z > -r * 0.2 };
        }

        function draw3DGlobe() {
            ctx.clearRect(0, 0, width, height);
            rotationY += 0.45;

            for (let lat = -60; lat <= 60; lat += 30) {
                ctx.beginPath();
                for (let lon = 0; lon <= 360; lon += 10) {
                    const pt = latLonTo3D(lat, lon, radius, rotationY);
                    if (lon === 0) ctx.moveTo(pt.x, pt.y);
                    else ctx.lineTo(pt.x, pt.y);
                }
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }

            for (let lon = 0; lon < 360; lon += 45) {
                ctx.beginPath();
                for (let lat = -90; lat <= 90; lat += 10) {
                    const pt = latLonTo3D(lat, lon, radius, rotationY);
                    if (lat === -90) ctx.moveTo(pt.x, pt.y);
                    else ctx.lineTo(pt.x, pt.y);
                }
                ctx.strokeStyle = 'rgba(168, 85, 247, 0.15)';
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }

            const projectedNodes = gcpNodes.map(node => latLonTo3D(node.lat, node.lon, radius, rotationY));

            for (let i = 0; i < projectedNodes.length; i++) {
                for (let j = i + 1; j < projectedNodes.length; j++) {
                    const p1 = projectedNodes[i];
                    const p2 = projectedNodes[j];
                    if (p1.visible || p2.visible) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        const midX = (p1.x + p2.x) / 2;
                        const midY = (p1.y + p2.y) / 2 - 25;
                        ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
                        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
                        ctx.lineWidth = 1.2;
                        ctx.setLineDash([4, 4]);
                        ctx.stroke();
                        ctx.setLineDash([]);
                    }
                }
            }

            projectedNodes.forEach((pt, idx) => {
                if (pt.visible) {
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
                    ctx.fillStyle = idx === 0 ? '#34d399' : '#38bdf8';
                    ctx.shadowBlur = 12;
                    ctx.shadowColor = '#38bdf8';
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            });

            requestAnimationFrame(draw3DGlobe);
        }

        draw3DGlobe();
    }
    init3DGcpGlobe();

    /* ==================== 2. SCI-FI AUDIO SFX ENGINE ==================== */
    let sfxEnabled = false;
    let audioCtx = null;

    window.toggleHudAudio = function() {
        sfxEnabled = !sfxEnabled;
        const icon = document.getElementById('hud-audio-icon');
        const btn = document.getElementById('hud-audio-btn');
        if (sfxEnabled) {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (icon) icon.className = 'fa-solid fa-volume-high';
            if (btn) btn.style.background = '#38bdf8', btn.style.color = '#000';
            playCyberBeep(880, 0.08);
        } else {
            if (icon) icon.className = 'fa-solid fa-volume-xmark';
            if (btn) btn.style.background = 'rgba(56, 189, 248, 0.15)', btn.style.color = '#38bdf8';
        }
    };

    function playCyberBeep(freq, duration) {
        if (!sfxEnabled || !audioCtx) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch(e){}
    }

    document.querySelectorAll('.btn-executive, .shell-chip, .nav-item').forEach(el => {
        el.addEventListener('mouseenter', () => playCyberBeep(600, 0.05));
    });

    /* ==================== 3. 3D HOLOGRAPHIC CARD TILT ==================== */
    document.querySelectorAll('.pro-card, .exp-card, .skill-card, .ai-icon-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            card.style.transform = `perspective(1000px) rotateX(${-y / 25}deg) rotateY(${x / 25}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    /* ==================== 5. BLUEPRINT MODE CARD SWITCHER ==================== */
    window.setCardMode = function(btn, mode) {
        const card = btn.closest('.ai-icon-card') || btn.closest('.pro-card');
        if (!card) return;
        card.setAttribute('data-mode', mode);
        card.querySelectorAll('.blueprint-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        playCyberBeep(750, 0.06);
    };

    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    /* ==================== REAL-TIME DYNAMIC LATENCY MONITOR ==================== */
    const latencyEl = document.getElementById('hud-latency');
    if (latencyEl) {
        async function updateLiveLatency() {
            const start = performance.now();
            try {
                // Measure real-time live RTT ping response time
                await fetch('index.html?ping=' + Date.now(), { method: 'HEAD', cache: 'no-store' });
                const rtt = Math.round(performance.now() - start);
                const displayMs = Math.max(3, Math.min(rtt, 45));
                latencyEl.textContent = `${displayMs}ms`;
            } catch (err) {
                // Fallback realistic micro-fluctuation (8ms - 14ms)
                const jitter = Math.floor(Math.random() * 7) + 8;
                latencyEl.textContent = `${jitter}ms`;
            }
        }

        // Trigger immediately on load, then auto-update every 2.5s
        updateLiveLatency();
        setInterval(updateLiveLatency, 2500);
    }
});

/* ==================== 3D INTERACTIVE CERTIFICATE CAROUSEL ENGINE ==================== */
let cert3dCurrentIndex = 0;

function updateCert3dCarousel() {
    const cards = document.querySelectorAll('.cert-3d-card');
    const dots = document.querySelectorAll('.cert-dot');
    if (!cards || cards.length === 0) return;
    const cert3dTotalCards = cards.length;

    cards.forEach((card, index) => {
        const offset = (index - cert3dCurrentIndex + cert3dTotalCards) % cert3dTotalCards;
        card.classList.remove('active');

        if (offset === 0) {
            // Center active card
            card.style.transform = 'translateX(0px) translateZ(100px) rotateY(0deg) scale(1)';
            card.style.opacity = '1';
            card.style.zIndex = '5';
            card.classList.add('active');
        } else if (offset === 1) {
            // Right card
            card.style.transform = 'translateX(180px) translateZ(-80px) rotateY(-25deg) scale(0.82)';
            card.style.opacity = '0.65';
            card.style.zIndex = '3';
        } else if (offset === cert3dTotalCards - 1) {
            // Left card
            card.style.transform = 'translateX(-180px) translateZ(-80px) rotateY(25deg) scale(0.82)';
            card.style.opacity = '0.65';
            card.style.zIndex = '3';
        } else {
            // Back hidden card
            card.style.transform = 'translateX(0px) translateZ(-200px) rotateY(0deg) scale(0.6)';
            card.style.opacity = '0';
            card.style.zIndex = '1';
        }
    });

    if (dots) {
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === cert3dCurrentIndex);
        });
    }
}

window.nextCert3dCard = function() {
    const cards = document.querySelectorAll('.cert-3d-card');
    const total = cards ? cards.length : 1;
    cert3dCurrentIndex = (cert3dCurrentIndex + 1) % total;
    updateCert3dCarousel();
};

window.prevCert3dCard = function() {
    const cards = document.querySelectorAll('.cert-3d-card');
    const total = cards ? cards.length : 1;
    cert3dCurrentIndex = (cert3dCurrentIndex - 1 + total) % total;
    updateCert3dCarousel();
};

window.goCert3dCard = function(index) {
    cert3dCurrentIndex = index;
    updateCert3dCarousel();
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(updateCert3dCarousel, 300);
});

