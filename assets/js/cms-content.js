(function () {
    const DATA_URL = "content/site.json";

    const qs = (selector, root = document) => root.querySelector(selector);
    const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
    const text = (selector, value, root = document) => {
        const el = qs(selector, root);
        if (el && value !== undefined && value !== null) el.textContent = value;
    };
    const html = (selector, value, root = document) => {
        const el = qs(selector, root);
        if (el && value !== undefined && value !== null) el.innerHTML = value;
    };
    const attr = (selector, name, value, root = document) => {
        const el = qs(selector, root);
        if (el && value) el.setAttribute(name, value);
    };
    const esc = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#039;"
    }[char]));
    const plain = (value = "", keys = []) => {
        if (value && typeof value === "object") {
            const key = keys.find((candidate) => value[candidate] !== undefined && value[candidate] !== null);
            return key ? value[key] : "";
        }
        return value;
    };

    const setBackground = (selector, image) => {
        const el = qs(selector);
        if (el && image) el.style.backgroundImage = `url("${image}")`;
    };

    async function load() {
        if (window.__sofiaContent) return window.__sofiaContent;
        const response = await fetch(`${DATA_URL}?v=${Date.now()}`, { cache: "no-store" });
        if (!response.ok) throw new Error(`No se pudo cargar ${DATA_URL}`);
        window.__sofiaContent = await response.json();
        applySite(window.__sofiaContent);
        return window.__sofiaContent;
    }

    function applySite(data) {
        if (!data.site) return;
        document.title = data.site.title || document.title;
        const description = qs('meta[name="description"]');
        if (description && data.site.description) description.setAttribute("content", data.site.description);
        qsa(".brand, .logo").forEach((el) => { el.textContent = data.site.brand || el.textContent; });
        qsa("footer span:first-child, footer").forEach((el) => {
            if (el.children.length === 0 && data.site.copyright) el.textContent = data.site.copyright;
        });
    }

    function videoCard(item, className = "reel reveal", loadType = "") {
        const dataAttr = loadType ? ` data-load-item="${loadType}"` : "";
        return `
            <article class="${className}" tabindex="0" aria-label="Video: ${esc(item.title)}"${dataAttr}>
                <video muted loop playsinline preload="metadata">
                    <source src="${esc(item.src)}" type="video/mp4">
                </video>
                <div class="${className.includes("video-card") ? "video-info" : "reel-meta"}">
                    <h3>${esc(item.title)}</h3>
                    <p>${esc(item.subtitle || "")}</p>
                </div>
            </article>
        `;
    }

    function audioCard(item) {
        return `
            <article class="audio-take reveal">
                <p>${esc(item.label)}</p>
                <h3>${esc(item.title)}</h3>
                <div class="wave" aria-hidden="true">
                    <i style="--h:16;--d:1"></i><i style="--h:32;--d:2"></i><i style="--h:22;--d:3"></i><i style="--h:38;--d:4"></i><i style="--h:18;--d:5"></i><i style="--h:44;--d:6"></i><i style="--h:26;--d:7"></i><i style="--h:35;--d:8"></i><i style="--h:20;--d:9"></i><i style="--h:42;--d:10"></i><i style="--h:24;--d:11"></i><i style="--h:31;--d:12"></i>
                </div>
                <audio controls preload="metadata" src="${esc(item.src)}"></audio>
            </article>
        `;
    }

    function experienceCard(item) {
        return `
            <details class="experience-card reveal">
                <summary>
                    <span class="experience-media"><img src="${esc(item.image)}" alt="${esc(item.title)}"></span>
                    <span class="experience-copy">
                        <span class="experience-date">${esc(item.date || item.type || "")}</span>
                        <strong>${esc(item.title)}</strong>
                        <em>${esc(item.place || item.summary || "")}</em>
                        <span>${esc(item.excerpt || item.summary || "")}</span>
                    </span>
                </summary>
                <div class="experience-body">
                    <p>${esc(item.body)}</p>
                </div>
            </details>
        `;
    }

    function creationCard(item, index) {
        return `
            <article class="creation-card reveal" style="--i:${index + 1}">
                <img src="${esc(item.image)}" alt="${esc(item.title)}">
                <div>
                    <span>${esc(item.type)}</span>
                    <h3>${esc(item.title)}</h3>
                    <p>${esc(item.summary)}</p>
                    <details>
                        <summary>Leer más</summary>
                        <p>${esc(item.body)}</p>
                    </details>
                </div>
            </article>
        `;
    }

    function renderHome(data) {
        const home = data.home;
        if (!home) return;
        setBackground(".hero-media", home.hero.background);
        text(".hero h1", home.hero.title);
        text(".hero-subtitle", home.hero.subtitle);

        const marquee = (home.marquee || []).map((item) => `<span>${esc(plain(item, ["text"]))}</span>`).join("");
        html(".marquee-track", marquee + marquee);

        attr(".portrait-frame img", "src", home.voice.image);
        attr(".portrait-frame img", "alt", `Retrato artístico de ${data.site.brand}`);
        text("#voz .section-kicker", home.voice.kicker);
        text("#voz .section-heading", home.voice.title);
        html("#voz .bio-copy", (home.voice.paragraphs || []).map((p) => `<p class="section-copy reveal">${esc(plain(p, ["paragraph", "text"]))}</p>`).join(""));
        html("#voz .stats-strip", (home.voice.stats || []).map((s) => `<div class="stat"><strong>${esc(s.number)}</strong><span>${esc(s.label)}</span></div>`).join(""));
        const voiceBtn = qs("#voz .btn");
        if (voiceBtn) {
            voiceBtn.textContent = home.voice.buttonText;
            voiceBtn.href = home.voice.buttonUrl;
        }

        text("#reels .section-kicker", home.videosIntro.kicker);
        text("#reels .section-heading", home.videosIntro.title);
        text("#reels .section-copy", home.videosIntro.text);
        html(".reels-grid", (data.media.featuredVideos || []).map((item) => videoCard(item)).join(""));
        const videoMore = qs("#reels .video-more a");
        if (videoMore) videoMore.innerHTML = `${esc(home.videosIntro.moreText)} <span aria-hidden="true">→</span>`;

        html("#reels .audio-grid", (data.media.audios || []).map(audioCard).join(""));

        text("#galeria .section-kicker", home.galleryIntro.kicker);
        text("#galeria .section-heading", home.galleryIntro.title);
        html("#galeria .gallery", (data.media.gallery || []).slice(0, 6).map((item) => `<figure class="reveal"><img src="${esc(item.image)}" alt="${esc(item.alt)}"></figure>`).join(""));
        const galleryMore = qs("#galeria .video-more a");
        if (galleryMore) galleryMore.innerHTML = `${esc(home.galleryIntro.moreText)} <span aria-hidden="true">→</span>`;

        text("#educadora .section-kicker", home.educator.kicker);
        text("#educadora .section-heading", home.educator.title);
        text("#educadora .edu-copy h3", home.educator.cardTitle);
        text("#educadora .edu-copy p", home.educator.text);
        attr("#educadora .edu-image img", "src", home.educator.image);
        const eduBtn = qs("#educadora .btn");
        if (eduBtn) {
            eduBtn.textContent = home.educator.buttonText;
            eduBtn.href = home.educator.buttonUrl;
        }

        text("#contacto .section-kicker", home.contact.kicker);
        text("#contacto h2", home.contact.title);
        text("#contacto p", home.contact.text);
        const email = qs(".contact-email");
        if (email) {
            email.textContent = data.site.email;
            email.href = `mailto:${data.site.email}`;
        }
        qsa(".socials a").forEach((link, index) => {
            const social = data.site.socials?.[index];
            if (social) {
                link.href = social.url || "#";
                link.setAttribute("aria-label", social.name);
            } else {
                link.remove();
            }
        });
    }

    function renderVideos(data) {
        const page = data.videosPage;
        if (!page) return;
        setBackground(".page-hero", page.hero.background);
        text(".page-hero .kicker", page.hero.kicker);
        text(".page-hero h1", page.hero.title);
        text(".page-hero p", page.hero.text);
        text("#videos .section-kicker", page.videosHeader.kicker);
        text("#videos .section-title", page.videosHeader.title);
        text("#videos .section-copy", page.videosHeader.text);
        html("#videos .video-grid", (data.media.allVideos || []).map((item) => videoCard(item, "video-card reveal", "video")).join(""));
        text("#galeria .section-kicker", page.galleryHeader.kicker);
        text("#galeria .section-title", page.galleryHeader.title);
        text("#galeria .section-copy", page.galleryHeader.text);
        html("#galeria .gallery-grid", (data.media.gallery || []).map((item) => `<figure class="reveal" data-load-item="gallery"><img src="${esc(item.image)}" alt="${esc(item.alt)}"></figure>`).join(""));
        const audioSection = qsa("main > .section")[2];
        if (audioSection) {
            text(".section-kicker", page.audioHeader.kicker, audioSection);
            text(".section-title", page.audioHeader.title, audioSection);
            text(".section-copy", page.audioHeader.text, audioSection);
            html(".audio-grid", (data.media.audios || []).map(audioCard).join(""), audioSection);
        }
    }

    function renderSinger(data) {
        const page = data.singerPage;
        if (!page) return;
        setBackground(".page-hero-bg", page.hero.background);
        text(".page-hero h1", page.hero.title);
        text(".page-hero p", page.hero.subtitle);
        text("section .section-title", page.history.kicker);
        text(".bio-text h2", page.history.title);
        html(".bio-text", `<h2>${esc(page.history.title)}</h2>${(page.history.paragraphs || []).map((p) => `<p>${esc(plain(p, ["paragraph", "text"]))}</p>`).join("")}`);
        attr(".bio-image img", "src", page.history.image);
        html(".repertorio-grid", (page.repertoire || []).map((item) => `<div class="repertorio-card"><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></div>`).join(""));
        html(".timeline", (page.timeline || []).map((item, index) => `
            <div class="timeline-item"><div class="timeline-content ${index % 2 ? "right" : "left"}">
                <div class="timeline-year">${esc(item.year)}</div><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p>
            </div></div>
        `).join(""));
        html(".venues-grid", (page.venues || []).map((item) => `
            <div class="venue-card"><img src="${esc(item.image)}" alt="${esc(item.title)}"><div class="venue-info"><h3>${esc(item.title)}</h3><span>${esc(item.location)}</span></div></div>
        `).join(""));
        if (page.experiences) {
            text(".experiences-section .section-title", page.experiences.kicker);
            text(".experiences-intro h2", page.experiences.title);
            text(".experiences-intro p", page.experiences.intro);
            html(".experiences-grid", (page.experiences.items || []).map(experienceCard).join(""));
        }
        html(".colabs-grid", (page.collaborations || []).map((item) => `<div class="colab-item"><img src="${esc(item.logo)}" alt="${esc(item.name)}"></div>`).join(""));
        html(".prensa-grid", (page.press || []).map((item) => `<div class="prensa-item"><p class="prensa-quote">"${esc(item.quote)}"</p><span class="prensa-source">${esc(item.source)}</span></div>`).join(""));
        text(".cta-section h2", page.cta.title);
        text(".cta-section p", page.cta.text);
        const cta = qs(".cta-section .btn-primary");
        if (cta) {
            cta.textContent = page.cta.buttonText;
            cta.href = page.cta.buttonUrl;
        }
    }

    function renderEducator(data) {
        const page = data.educatorPage;
        if (!page) return;
        setBackground(".page-hero-bg", page.hero.background);
        text(".page-hero h1", page.hero.title);
        text(".page-hero p", page.hero.subtitle);
        text("section .section-title", page.philosophy.kicker);
        html(".filosofia-text", `<h2>${esc(page.philosophy.title)}</h2>${(page.philosophy.paragraphs || []).map((p) => `<p>${esc(plain(p, ["paragraph", "text"]))}</p>`).join("")}`);
        attr(".filosofia-image img", "src", page.philosophy.image);
        text(".cuento-details .section-title", page.story.kicker);
        text(".cuento-details h2", page.story.title);
        text(".book-3d .title", page.story.bookTitle);
        html(".cuento-details p", esc(page.story.text));
        html(".cuento-features-list", (page.story.features || []).map((item) => `<li>${esc(plain(item, ["feature", "text"]))}</li>`).join(""));
        html(".metodologia-grid", (page.methodology || []).map((item) => `
            <div class="metodo-card"><div class="metodo-number">${esc(item.number)}</div><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></div>
        `).join(""));
        if (page.creations) {
            text(".creations-section .section-title", page.creations.kicker);
            text(".creations-intro h2", page.creations.title);
            text(".creations-intro p", page.creations.intro);
            html(".creations-grid", (page.creations.items || []).map(creationCard).join(""));
        }
        if (page.experiences) {
            text(".experiences-section .section-title", page.experiences.kicker);
            text(".experiences-intro h2", page.experiences.title);
            text(".experiences-intro p", page.experiences.intro);
            html(".experiences-grid", (page.experiences.items || []).map(experienceCard).join(""));
        }
        html(".centros-grid", (page.centers || []).map((item) => `
            <div class="centro-card"><div class="centro-icon">${esc(item.initials)}</div><h3>${esc(item.name)}</h3><span>${esc(item.detail)}</span></div>
        `).join(""));
        html(".testimonios-grid", (page.testimonials || []).map((item) => `
            <div class="testimonio-card"><p class="testimonio-text">${esc(item.text)}</p><span class="testimonio-author">${esc(item.author)}</span><span class="testimonio-role">${esc(item.role)}</span></div>
        `).join(""));
        html(".formacion-list", (page.training || []).map((item) => `
            <div class="formacion-item"><span class="formacion-year">${esc(item.year)}</span><div><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></div></div>
        `).join(""));
        text(".cta-section h2", page.cta.title);
        text(".cta-section p", page.cta.text);
        const cta = qs(".cta-section .btn-primary");
        if (cta) {
            cta.textContent = page.cta.buttonText;
            cta.href = page.cta.buttonUrl;
        }
    }

    window.SofiaCMS = {
        load,
        renderHome: async () => renderHome(await load()),
        renderVideos: async () => renderVideos(await load()),
        renderSinger: async () => renderSinger(await load()),
        renderEducator: async () => renderEducator(await load())
    };
}());
