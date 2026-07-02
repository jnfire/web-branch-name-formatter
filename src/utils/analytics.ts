// Utilities for Google Analytics 4 integration with dynamic opt-in consent

export function initAnalytics(gaId: string) {
  if (!gaId) return;
  
  // Prevent duplicate insertion
  if (document.getElementById('google-analytics-script')) return;

  const scriptLink = document.createElement('script');
  scriptLink.id = 'google-analytics-script';
  scriptLink.async = true;
  scriptLink.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(scriptLink);

  const scriptInit = document.createElement('script');
  scriptInit.id = 'google-analytics-init';
  scriptInit.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaId}', { 'anonymize_ip': true });
  `;
  document.head.appendChild(scriptInit);
}
