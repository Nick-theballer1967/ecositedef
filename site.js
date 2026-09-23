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

  var hubspotWidgetObserver;
  var observedHubSpotWidget;

  function observeHubSpotWidget(widget) {
    if (!('MutationObserver' in window) || observedHubSpotWidget === widget) {
      return;
    }

    if (hubspotWidgetObserver) {
      hubspotWidgetObserver.disconnect();
    }

    observedHubSpotWidget = widget;
    hubspotWidgetObserver = new MutationObserver(updateHubSpotClearance);
    hubspotWidgetObserver.observe(widget, {
      attributes: true,
      attributeFilter: ['class', 'style']
    });
  }

  function updateHubSpotClearance() {
    var widget = document.getElementById('hubspot-messages-iframe-container');

    if (!widget) {
      if (hubspotWidgetObserver) {
        hubspotWidgetObserver.disconnect();
        hubspotWidgetObserver = null;
      }

      observedHubSpotWidget = null;
      document.body.classList.remove('has-hubspot-widget');
      document.documentElement.style.removeProperty('--hubspot-mobile-clearance');
      return;
    }

    observeHubSpotWidget(widget);

    var height = Math.ceil(widget.getBoundingClientRect().height);
    document.body.classList.add('has-hubspot-widget');
    document.documentElement.style.setProperty('--hubspot-mobile-clearance', (height + 8) + 'px');
  }

  if ('MutationObserver' in window) {
    var hubspotBodyObserver = new MutationObserver(updateHubSpotClearance);
    hubspotBodyObserver.observe(document.body, {
      childList: true,
      subtree: false
    });
  }

  window.addEventListener('load', updateHubSpotClearance);
  window.addEventListener('resize', updateHubSpotClearance);
  window.setTimeout(updateHubSpotClearance, 1500);
  window.setTimeout(updateHubSpotClearance, 5000);
})();
