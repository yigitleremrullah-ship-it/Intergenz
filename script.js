document.addEventListener('DOMContentLoaded', () => {

    /* --- Preloader --- */
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            window.scrollTo(0,0);
        }, 1500);
    }

    /* --- Theme Toggle (Dark/Light Mode) --- */
    const themeBtn = document.getElementById('theme-toggle');
    let currentTheme = localStorage.getItem('theme');
    
    // İşletim sisteminin temasını kontrol et (Otomatik Dark/Light mod)
    if(!currentTheme) {
        const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        currentTheme = prefersLight ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
    }

    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
    }
    
    if(themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            let theme = 'dark';
            if (document.body.classList.contains('light-mode')) {
                theme = 'light';
            }
            localStorage.setItem('theme', theme);
        });
    }

    /* --- Custom Cursor --- */
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    if(cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        const hoverElements = document.querySelectorAll('a, button, .faq-question, .pricing-card, .radio-card label');
        hoverElements.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.backgroundColor = 'rgba(0, 240, 255, 0.1)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorOutline.style.backgroundColor = 'transparent';
            });
        });
    }

    /* --- Hamburger Menu (Mobile) --- */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(n => n.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }));
    }

    /* --- Sticky Header --- */
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* --- Typewriter Effect in Hero --- */
    const textWords = ["Dijital Kimlik", "Premium Deneyim", "Estetik Gelecek", "Özel Yazılım"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeElement = document.getElementById('typewriter');
    
    function typeEffect() {
        if (!typeElement) return;
        const currentWord = textWords[wordIndex];
        
        if (isDeleting) {
            typeElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typeElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = 100;
        if (isDeleting) typeSpeed /= 2;

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 1500;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % textWords.length;
            typeSpeed = 500;
        }
        setTimeout(typeEffect, typeSpeed);
    }
    setTimeout(typeEffect, 1500);

    /* --- Reveal Animations on Scroll --- */
    function reveal() {
        const reveals = document.querySelectorAll('.reveal');
        for (let i = 0; i < reveals.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = reveals[i].getBoundingClientRect().top;
            const elementVisible = 100;
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('active');
            }
        }
    }
    window.addEventListener('scroll', reveal);
    reveal();

    /* --- Counter Up Animation (Stats) --- */
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    function countUp() {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const speed = 200;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }

    window.addEventListener('scroll', () => {
        const statsSection = document.getElementById('stats');
        if (!statsSection || hasCounted) return;
        const statPos = statsSection.getBoundingClientRect().top;
        if(statPos < window.innerHeight) {
            countUp();
            hasCounted = true;
        }
    });

    /* --- Process Timeline Scroll Fill --- */
    const timeline = document.querySelector('.timeline');
    const timelineFill = document.getElementById('timeline-fill');
    const timelineItems = document.querySelectorAll('.timeline-item');

    window.addEventListener('scroll', () => {
        if (!timeline) return;
        const timelineTop = timeline.getBoundingClientRect().top;
        const timelineHeight = timeline.getBoundingClientRect().height;
        let scrollPercent = 0;
        if (timelineTop < window.innerHeight / 2) {
            scrollPercent = ((window.innerHeight / 2 - timelineTop) / timelineHeight) * 100;
        }
        scrollPercent = Math.max(0, Math.min(100, scrollPercent));
        timelineFill.style.height = `${scrollPercent}%`;

        timelineItems.forEach(item => {
            if(item.getBoundingClientRect().top < window.innerHeight / 1.5) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    });

    /* --- FAQ Accordion --- */
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const parent = question.parentElement;
            if(parent.classList.contains('active')) {
                parent.classList.remove('active');
            } else {
                document.querySelectorAll('.faq-accordion').forEach(q => q.classList.remove('active'));
                parent.classList.add('active');
            }
        });
    });

    /* --- Scroll Spy & Smooth Scroll --- */
    const sections = document.querySelectorAll('section[id]');
    const spyLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    // Smooth scroll for nav links (existing behavior enhanced)
    spyLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if(link.getAttribute('href') === '#') return; // let logo be ignored or custom
            e.preventDefault();
            const targetId = document.querySelector(link.getAttribute('href'));
            if(targetId) {
                window.scrollTo({
                    top: targetId.offsetTop - 80,
                    behavior: 'smooth'
                });
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Scroll Spy Observer
    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                spyLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-20% 0px -70% 0px' });

    sections.forEach(sec => spyObserver.observe(sec));

    /* --- Wizard Form (Multi-step) & Dynamic Budget Logic --- */
    const wizardForm = document.querySelector('.wizard-form');
    if (wizardForm) {
        const steps = wizardForm.querySelectorAll('.wizard-step');
        const nextBtns = wizardForm.querySelectorAll('.btn-next');
        const prevBtns = wizardForm.querySelectorAll('.btn-prev');
        const progressBar = document.getElementById('wizard-progress-bar');
        
        // Dynamic Budget Inputs Masking
        const serviceRadios = wizardForm.querySelectorAll('input[name="service"]');
        const budgetLowCard = document.getElementById('budget_low_tier');
        const budgetRadioLow = document.getElementById('budget_radio_low');
        const budgetRadioMid = document.getElementById('budget_radio_mid');

        if(serviceRadios.length > 0) {
            serviceRadios.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    if (e.target.value === 'e_ticaret' || e.target.value === 'ozel_yazilim') {
                        if(budgetLowCard) {
                            budgetLowCard.style.display = 'none';
                            if(budgetRadioLow && budgetRadioLow.checked) {
                                if(budgetRadioMid) budgetRadioMid.checked = true;
                            }
                        }
                    } else {
                        if(budgetLowCard) {
                            budgetLowCard.style.display = 'block';
                        }
                    }
                });
            });
        }

        let currentStep = 0; // 0 indexten başlar (1. Adım)
        
        const updateWizard = () => {
            steps.forEach((step, index) => {
                if (index === currentStep) {
                    step.classList.add('active');
                    step.style.opacity = '1';
                    step.style.transform = 'translateX(0)';
                    step.style.pointerEvents = 'auto';
                } else if (index < currentStep) {
                    step.classList.remove('active');
                    step.style.opacity = '0';
                    step.style.transform = 'translateX(-50px)';
                    step.style.pointerEvents = 'none';
                } else {
                    step.classList.remove('active');
                    step.style.opacity = '0';
                    step.style.transform = 'translateX(50px)';
                    step.style.pointerEvents = 'none';
                }
            });
            // Progress Bar update
            progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
        };

        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if(currentStep < steps.length - 1) {
                    currentStep++;
                    updateWizard();
                }
            });
        });

        prevBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if(currentStep > 0) {
                    currentStep--;
                    updateWizard();
                }
            });
        });

        wizardForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = wizardForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            btn.textContent = "Gönderiliyor...";
            btn.style.opacity = "0.7";
            btn.disabled = true;

            const formData = new FormData(wizardForm);
            fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString()
            })
            .then(() => {
                btn.textContent = "Teklifiniz Alındı! Size döneceğiz.";
                btn.style.background = "#00f0ff";
                btn.style.color = "#000";
                
                setTimeout(() => {
                    wizardForm.reset();
                    currentStep = 0;
                    updateWizard();
                    btn.textContent = originalText;
                    btn.style.background = "";
                    btn.style.color = "";
                    btn.style.opacity = "1";
                    btn.disabled = false;
                }, 3000);
            })
            .catch(error => {
                btn.textContent = "Hata oluştu, tekrar deneyin.";
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.opacity = "1";
                    btn.disabled = false;
                }, 2000);
            });
        });
    }

    /* --- Lottie Animation --- */
    const lottieContainer = document.getElementById('lottie-hero');
    if (lottieContainer && typeof lottie != 'undefined') {
        lottie.loadAnimation({
            container: lottieContainer,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets2.lottiefiles.com/packages/lf20_jcikwtux.json'
        });
    }

    /* --- Process Lotties (P1 to P5) --- */
    if(typeof lottie != 'undefined') {
        const processAnimations = [
            { id: 'lottie-p1', path: 'https://assets4.lottiefiles.com/packages/lf20_z01bika0.json' }, // Keşif
            { id: 'lottie-p2', path: 'https://assets9.lottiefiles.com/packages/lf20_q5pk6p1k.json' }, // Tasarım
            { id: 'lottie-p3', path: 'https://assets10.lottiefiles.com/packages/lf20_vnikrcia.json' }, // Kodlama
            { id: 'lottie-p4', path: 'https://assets3.lottiefiles.com/packages/lf20_n2yhd0nx.json' }, // Test
            { id: 'lottie-p5', path: 'https://assets3.lottiefiles.com/packages/lf20_touohxv0.json' }  // Yayın
        ];

        processAnimations.forEach(anim => {
            const el = document.getElementById(anim.id);
            if(el) {
                lottie.loadAnimation({
                    container: el,
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    path: anim.path
                });
            }
        });
    }

    /* --- Fetch CMS Data --- */
    fetch('content/settings.json')
        .then(res => res.json())
        .then(data => {
            const titleEl = document.getElementById('hero-title');
            if(titleEl && data.title_part_1) {
                titleEl.innerHTML = `${data.title_part_1} <br><span class="gradient-text">${data.title_highlight} </span> ${data.title_part_2}`;
            }
        })
        .catch(err => console.log('CMS settings loading fallback.'));

    fetch('content/blogs.json')
        .then(res => res.json())
        .then(data => {
            const blogGrid = document.getElementById('blog-grid');
            if(blogGrid && data.posts && data.posts.length > 0) {
                let blogHTML = '';
                data.posts.forEach(post => {
                    const dateObj = new Date(post.date);
                    const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
                    blogHTML += `
                        <div class="blog-card glass">
                            <div class="blog-date">${dateStr}</div>
                            <h3>${post.title}</h3>
                            <p>${post.summary}</p>
                            <div class="blog-author">${post.author}</div>
                        </div>
                    `;
                });
                blogGrid.innerHTML = blogHTML;
            }
        })
        .catch(err => console.log('CMS blogs loading fallback.'));

    /* --- ROI Calculator Logic --- */
    const visitorSlider = document.getElementById('visitor-slider');
    const orderSlider = document.getElementById('order-slider');
    const visitorVal = document.getElementById('visitor-val');
    const orderVal = document.getElementById('order-val');
    const oldRev = document.getElementById('old-rev');
    const newRev = document.getElementById('new-rev');

    function calculateROI() {
        if(!visitorSlider || !orderSlider) return;
        
        let visitors = parseInt(visitorSlider.value);
        let orderValue = parseInt(orderSlider.value);
        
        // Update labels
        visitorVal.innerText = visitors.toLocaleString('tr-TR');
        orderVal.innerText = orderValue.toLocaleString('tr-TR') + ' ₺';
        
        // Math: 1% and 4% conversions
        let standardRevenue = visitors * 0.01 * orderValue;
        let intergenzRevenue = visitors * 0.04 * orderValue;

        // Animate/set values
        oldRev.innerText = Math.round(standardRevenue).toLocaleString('tr-TR') + ' ₺';
        newRev.innerText = Math.round(intergenzRevenue).toLocaleString('tr-TR') + ' ₺';
    }

    if(visitorSlider && orderSlider) {
        visitorSlider.addEventListener('input', calculateROI);
        orderSlider.addEventListener('input', calculateROI);
        calculateROI(); // init
    }

});
