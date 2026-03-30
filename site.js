(function () {
  function trackEvent(name, params) {
    if (typeof window.gtag !== 'function') {
      return;
    }
    window.gtag('event', name, params);
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest('[data-ga-event]');
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
    if (!form.matches('[data-ga-event]')) {
      return;
    }

    trackEvent(form.dataset.gaEvent, {
      page_location: window.location.pathname,
      link_text: form.dataset.gaLinkText || 'Form submission',
      section_name: form.dataset.gaSection || 'form'
    });
  });
})();
