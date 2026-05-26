"use client";

export function ServiceWorkerRegister() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function(reg) {
                reg.addEventListener('updatefound', function() {
                  var w = reg.installing;
                  if (w) {
                    w.addEventListener('statechange', function() {
                      if (w.state === 'installed' && navigator.serviceWorker.controller) {
                        window.dispatchEvent(new CustomEvent('sw:update-available'));
                      }
                    });
                  }
                });
              }).catch(function() {});
            });
          }
        `,
      }}
    />
  );
}
