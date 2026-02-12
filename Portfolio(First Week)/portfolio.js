document.querySelectorAll('.port-card').forEach(card => {

    const desc = card.querySelector('.proj-desc');

    if (!desc) return;


    // Toggle overlay when the card is clicked

    card.addEventListener('click', function (e) {

        // If clicking the close button, let the close handler run

        if (e.target.closest('.close-desc')) return;


        // Hide any other open overlays

        document.querySelectorAll('.proj-desc.show').forEach(d => {

            if (d !== desc) d.classList.remove('show');

        });


        desc.classList.toggle('show');

        desc.setAttribute('aria-hidden', desc.classList.contains('show') ? 'false' : 'true');

    });


    // Close button inside overlay

    const closeBtn = card.querySelector('.close-desc');

    if (closeBtn) {

        closeBtn.addEventListener('click', function (ev) {
            desc.classList.remove('show');
        });

    }

});


// Click outside any project card closes open overlays

document.addEventListener('click', (e) => {

    if (!e.target.closest('.port-card')) {

        document.querySelectorAll('.proj-desc.show').forEach(d => d.classList.remove('show'));

    }

});


// --- Hire Me -> scroll to contact + show message ---

(() => {

    const hireBtn = document.getElementById('hire-me');

    const contactSection = document.getElementById('contact');




    if (!hireBtn || !contactSection) return;




    hireBtn.addEventListener('click', (e) => {

        e.preventDefault();

        // smooth scroll to contact section
        let messageEl = document.getElementById('contact-message');
        if (messageEl) 
            messageEl.classList.add('show');

        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    });


})();