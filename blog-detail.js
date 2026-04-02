document.addEventListener('DOMContentLoaded', () => {
    // 1. Get ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if(!postId) {
        document.getElementById('blog-content-dynamic').innerHTML = '<p>Makale bulunamadı veya link eksik. <a href="index.html#blog" style="color:var(--accent-blue);">Akademi paneline geri dön</a>.</p>';
        document.getElementById('skeleton-loader').style.display = 'none';
        return;
    }

    // 2. Fetch Blog Data
    fetch('content/blogs.json')
        .then(res => res.json())
        .then(data => {
            const post = data.posts.find(p => p.id === postId);
            
            document.getElementById('skeleton-loader').style.display = 'none';

            if(!post) {
                document.getElementById('blog-content-dynamic').innerHTML = '<p>Makale bulunamadı. <a href="index.html#blog" style="color:var(--accent-blue);">Akademi paneline geri dön</a>.</p>';
                return;
            }

            // Fill Meta
            const dateObj = new Date(post.date);
            const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
            
            document.getElementById('blog-modal-date').innerText = dateStr;
            document.getElementById('blog-modal-title').innerText = post.title;
            document.getElementById('blog-modal-author').innerText = `Yazar: ${post.author}`;
            
            // Set Page Title for SEO
            document.title = `${post.title} | Intergenz Akademi`;

            document.getElementById('blog-meta-info').style.display = 'block';

            // Fill Content
            const contentDiv = document.getElementById('blog-content-dynamic');
            contentDiv.innerHTML = post.content;

            // Generate TOC
            const tocList = document.getElementById('toc-list');
            const headings = contentDiv.querySelectorAll('h2');
            
            if(headings.length > 0) {
                headings.forEach((heading, idx) => {
                    const anchorId = 'heading-' + idx;
                    heading.id = anchorId;
                    
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = '#' + anchorId;
                    a.innerText = heading.innerText;
                    
                    a.onclick = (e) => {
                        e.preventDefault();
                        const targetPos = heading.getBoundingClientRect().top + window.scrollY - 100;
                        window.scrollTo({ top: targetPos, behavior: 'smooth' });
                    };
                    
                    li.appendChild(a);
                    tocList.appendChild(li);
                });
                document.getElementById('toc-container').style.display = 'block';
            }

            // Route CTA links back to index.html contact safely
            const internalCTAs = contentDiv.querySelectorAll('.btn-close-from-post');
            internalCTAs.forEach(btn => {
                btn.href = "index.html#contact";
            });

            // Set Share Links
            const currentUrl = encodeURIComponent(window.location.href);
            const postTitle = encodeURIComponent(post.title);
            
            const linkedInShare = document.getElementById('share-linkedin');
            if(linkedInShare) {
                linkedInShare.href = `https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}&title=${postTitle}`;
            }

            const waShare = document.getElementById('share-whatsapp');
            if(waShare) {
                waShare.href = `https://wa.me/?text=${postTitle}%20-%20${currentUrl}`;
            }

        })
        .catch(err => {
            console.error(err);
            document.getElementById('blog-content-dynamic').innerHTML = '<p>Bağlantı hatası oluştu, içerik yüklenemedi.</p>';
        });

    // 3. Reading Progress Event
    const readingBar = document.getElementById('reading-bar');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        if(readingBar) {
            readingBar.style.width = scrollPercent + '%';
        }
    });

    // 4. Cursor Follower Logic (same as main)
    const cursorDot = document.querySelector("[data-cursor-dot]");
    const cursorOutline = document.querySelector("[data-cursor-outline]");
    if (cursorDot && cursorOutline) {
        window.addEventListener("mousemove", function(e) {
            cursorDot.style.left = e.clientX + "px";
            cursorDot.style.top = e.clientY + "px";
            cursorOutline.animate({
                left: e.clientX + "px",
                top: e.clientY + "px"
            }, { duration: 500, fill: "forwards" });
        });
    }

    // 5. Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
        document.documentElement.setAttribute('data-theme', currentTheme);
        themeToggle.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            let switchToTheme = theme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', switchToTheme);
            localStorage.setItem('theme', switchToTheme);
        });
    }
});
