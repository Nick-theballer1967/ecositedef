(function () {
  function trackEvent(name, params) {
    if (typeof window.gtag !== 'function') {
      return;
    }
    window.gtag('event', name, params);
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[data-ga-event], button[data-ga-event]');
    if (!link) {
      return;
    }

    trackEvent(link.dataset.gaEvent, {
      page_location: window.location.pathname,
      link_text: link.dataset.gaLinkText || link.textContent.trim(),
      section_name: link.dataset.gaSection || 'unspecified'
    });
  });

  document.addEventListener('submit', function (event) {
    var form = event.target;

    if (!form.matches('.contact-form')) {
      return;
    }

    try {
      sessionStorage.setItem('ecoai_lead_pending', '1');
    } catch (e) {}

    trackEvent('lead_form_submit_attempt', {
      page_location: window.location.pathname,
      section_name: 'contact_form'
    });
  });
})();
