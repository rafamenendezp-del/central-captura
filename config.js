// ====== CENTRAL · cerrar sesion al cerrar el navegador (#15) ======
// Cada vez que se abre el navegador de cero, se borra la sesion guardada
// y se vuelve a pedir usuario y contrasena. Mientras el navegador siga
// abierto (aunque cambies de pestana o recargues), la sesion sigue viva.
try {
  if (!sessionStorage.getItem('central_sesion_viva')) {
    for (var i = localStorage.length - 1; i >= 0; i--) {
      var k = localStorage.key(i);
      if (k && k.indexOf('sb-') === 0 && k.indexOf('auth-token') >= 0) localStorage.removeItem(k);
    }
    sessionStorage.setItem('central_sesion_viva', '1');
  }
} catch (e) {}
// ==================================================================

// Datos de conexion de CENTRAL. Se llena una vez y ya no se toca.
window.CENTRAL_URL  = "https://rbvegwvfmfqxbfovgcyb.supabase.co";
window.CENTRAL_ANON = "sb_publishable_ASUo91elaRUnxSmThrlT3g_rKqjZoAo";
