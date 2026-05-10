(async function () {
    if (window.SofiaCMS) {
        try {
            await window.SofiaCMS.renderVideos();
        } catch (error) {
            console.warn("Contenido CMS no disponible, usando HTML de respaldo.", error);
        }
    }

    const revealItems = document.querySelectorAll(".reveal");
    let revealObserver = null;

    const showReveal = (item) => {
        item.classList.add("is-visible");
    };

    revealItems.forEach((item, index) => {
        item.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 0.08}s`);
    });

    if ("IntersectionObserver" in window) {
        revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    showReveal(entry.target);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

        revealItems.forEach((item) => revealObserver.observe(item));
    } else {
        revealItems.forEach(showReveal);
    }

    document.querySelectorAll(".video-card").forEach((card) => {
        const video = card.querySelector("video");
        if (!video) return;

        const play = () => {
            document.querySelectorAll(".video-card video").forEach((otherVideo) => {
                if (otherVideo !== video) {
                    otherVideo.pause();
                    otherVideo.currentTime = 0;
                }
            });

            video.muted = false;
            video.volume = 0.85;
            video.play().catch(() => {});
        };

        const stop = () => {
            video.pause();
            video.currentTime = 0;
        };

        card.addEventListener("mouseenter", play);
        card.addEventListener("mouseleave", stop);
        card.addEventListener("focusin", play);
        card.addEventListener("focusout", stop);
    });

    const loadMoreConfig = { video: 3, gallery: 6 };

    document.querySelectorAll("[data-load-more]").forEach((button) => {
        const type = button.dataset.loadMore;
        const batchSize = loadMoreConfig[type] || 3;
        const items = Array.from(document.querySelectorAll(`[data-load-item="${type}"]`));

        const updateButton = () => {
            const hiddenItems = items.filter((item) => item.classList.contains("is-hidden"));
            button.classList.toggle("is-hidden", hiddenItems.length === 0);
        };

        button.addEventListener("click", () => {
            const nextItems = items
                .filter((item) => item.classList.contains("is-hidden"))
                .slice(0, batchSize);

            nextItems.forEach((item, index) => {
                item.classList.remove("is-hidden");
                item.style.setProperty("--reveal-delay", `${index * 0.08}s`);
                showReveal(item);
            });

            updateButton();
        });

        updateButton();
    });
}());
