const navigationLinks = [...document.querySelectorAll('.menu-link[data-section]')];
const sections = [...document.querySelectorAll('main section[id]')];
let navigationLockUntil = 0;
let pendingNavigation = null;
let navigationTimer = null;

const setActiveLink = (sectionId) => {
	navigationLinks.forEach((link) => {
		link.classList.toggle('active', link.dataset.section === sectionId);
	});
};

navigationLinks.forEach((link) => {
	link.addEventListener('click', (event) => {
		clearTimeout(navigationTimer);
		pendingNavigation = link;
		setActiveLink(link.dataset.section);
		navigationLockUntil = performance.now() + 1400;
		navigationLinks.forEach((item) => item.classList.remove('selection-flash'));
		void link.offsetWidth;
		link.classList.add('selection-flash');
		navigationTimer = window.setTimeout(() => {
			if (pendingNavigation === link) {
				window.location.hash = link.dataset.section;
				pendingNavigation = null;
			}
		}, 300);
	});
	link.addEventListener('animationend', () => {
		link.classList.remove('selection-flash');
	});
});

const sectionObserver = new IntersectionObserver((entries) => {
	if (performance.now() < navigationLockUntil) {
		return;
	}

	const visibleSection = entries
		.filter((entry) => entry.isIntersecting)
		.sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

	if (visibleSection) {
		setActiveLink(visibleSection.target.id);
	}
}, { rootMargin: '-30px 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });

sections.forEach((section) => sectionObserver.observe(section));

const systemMenuBtn = document.getElementById('system-menu-btn');
const systemMenu = document.getElementById('system-menu');

if (systemMenuBtn && systemMenu) {
	systemMenuBtn.addEventListener('click', (e) => {
		e.stopPropagation();
		const isExpanded = systemMenuBtn.getAttribute('aria-expanded') === 'true';
		systemMenuBtn.setAttribute('aria-expanded', !isExpanded);
		systemMenu.classList.toggle('show');
	});

	document.addEventListener('click', (e) => {
		if (systemMenu.classList.contains('show') && !systemMenu.contains(e.target)) {
			systemMenu.classList.remove('show');
			systemMenuBtn.setAttribute('aria-expanded', 'false');
		}
	});
}

document.querySelectorAll('.contributors-widget').forEach(widget => {
	const dock = widget.querySelector('.contributors-dock');
	const leftBtn = widget.querySelector('.scroll-btn.left');
	const rightBtn = widget.querySelector('.scroll-btn.right');
	
	if (dock && leftBtn && rightBtn) {
		leftBtn.addEventListener('click', () => {
			dock.scrollBy({ left: -395, behavior: 'auto' });
		});
		rightBtn.addEventListener('click', () => {
			dock.scrollBy({ left: 395, behavior: 'auto' });
		});
	}
});
