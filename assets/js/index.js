const nav = document.querySelector(".site-nav");
        const menuToggle = document.querySelector(".menu-toggle");
        const navLinks = document.querySelector(".nav-links");
        const setNavState = () => {
            nav.classList.toggle("is-scrolled", window.scrollY > 30);
        };

        window.addEventListener("scroll", setNavState, { passive: true });
        setNavState();

        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("is-open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });

        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("is-open");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });

        const revealItems = document.querySelectorAll(".reveal");
        revealItems.forEach((item, index) => {
            item.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 0.08}s`);
        });

        if ("IntersectionObserver" in window) {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

            revealItems.forEach((item) => revealObserver.observe(item));
        } else {
            revealItems.forEach((item) => item.classList.add("is-visible"));
        }

document.querySelectorAll(".reel").forEach((card) => {
    const clip = card.querySelector("video");
    const playPreview = () => {
        document.querySelectorAll(".reel video").forEach((otherClip) => {
            if (otherClip !== clip) {
                otherClip.pause();
                otherClip.currentTime = 0;
            }
        });

        clip.muted = false;
        clip.volume = 0.85;
        clip.play().catch(() => {});
        card.classList.add("is-playing");
    };
    const stopPreview = () => {
        clip.pause();
        clip.currentTime = 0;
        card.classList.remove("is-playing");
            };

    card.addEventListener("mouseenter", playPreview);
    card.addEventListener("mouseleave", stopPreview);
    card.addEventListener("focusin", playPreview);
    card.addEventListener("focusout", stopPreview);
});
