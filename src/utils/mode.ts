/**
 * Detects whether the app is running embedded inside a Global Navigation
 * microfrontend host. When true the AppLayout renders only an <Outlet />,
 * deferring chrome (header, sidebar) to the shell. When false the app
 * renders its own standalone layout and handles auth independently.
 */
export const MICROFRONTEND_MODE = !!document.querySelector('[data-id="microfrontend-container"]')
