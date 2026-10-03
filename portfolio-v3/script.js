/* Global Certificate Viewer Functions */
window.openCertViewer = function(imgUrl, pdfUrl, title, issuer) {
    const certModal = document.getElementById('cert-viewer-modal');
    const certModalTitle = document.getElementById('cert-modal-title');
    const certModalIssuer = document.getElementById('cert-modal-issuer');
    const certModalImg = document.getElementById('cert-modal-img');
    const certModalDownloadBtn = document.getElementById('cert-modal-download-btn');

    if (!certModal) return;
    if (certModalTitle) certModalTitle.innerHTML = `<i class="fa-solid fa-award"></i> ${title || 'Verified Certificate'}`;
    if (certModalIssuer) certModalIssuer.textContent = issuer || 'Verified Body';
    if (certModalImg) {
        certModalImg.src = imgUrl || '';
        certModalImg.alt = title || 'Certificate';
    }
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

document.addEventListener('DOMContentLoaded', () => {
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
       2. Theme Switcher
       -------------------------------------------------------------------------- */
    const themeToggler = document.getElementById('theme-toggler');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('theme-v3') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggler) {
        themeToggler.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme-v3', next);
            updateThemeIcon(next);
        });
    }

    function updateThemeIcon(theme) {
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
    }

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

                if (mouse.x && mouse.y) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        let force = (mouse.radius - dist) / mouse.radius;
                        this.x -= (dx / dist) * force * 2.5;
                        this.y -= (dy / dist) * force * 2.5;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.shadowBlur = 0;
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

    const contactForm = document.getElementById('executive-contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('form-name').value;
            formStatus.textContent = `Thank you, ${name}. Message sent successfully. Lokeshwaran will get back to you shortly.`;
            contactForm.reset();
            setTimeout(() => { if (formStatus) formStatus.textContent = ''; }, 6000);
        });
    }

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

    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
});
