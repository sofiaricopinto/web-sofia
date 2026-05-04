const revealSelectors = [
            '.page-hero-content > *',
            'section > .section-title',
            '.bio-extended > *',
            '.filosofia > *',
            '.cuento-container > *',
            '.metodologia-intro > *',
            '.metodo-card',
            '.centros-intro > *',
            '.centro-card',
            '.testimonio-card',
            '.formacion-item',
            '.repertorio-card',
            '.timeline-item',
            '.venues-intro > *',
            '.venue-card',
            '.colab-item',
            '.prensa-item',
            '.cta-section > *'
        ];

        const revealItems = document.querySelectorAll(revealSelectors.join(','));
        revealItems.forEach((item, index) => {
            item.classList.add('reveal');
            item.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 0.08}s`);
        });

        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

            revealItems.forEach((item) => revealObserver.observe(item));
        } else {
            revealItems.forEach((item) => item.classList.add('is-visible'));
        }
