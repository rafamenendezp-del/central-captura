// ============================================================================
// CENTRAL · roles.js  — guardián compartido de sesión y roles
// Se carga en cada pantalla (después de config.js). Determina el rol del usuario
// según su número de sesión y lo deja pasar solo si su rol está permitido.
//
//   Rol se determina así:
//     - número en 'despachadores' (activo)  -> 'despachador'
//     - número en 'personal' (activo)        -> su rol ('chofer' | 'carga')
//     - en ninguno                           -> 'oficina'
//   (Un número debe estar en UN solo lugar.)
//
// Uso en una pantalla:
//   protegerRol(sb, ['oficina'], function(yo){ /* yo.numero, yo.rol, yo.nombre */ cargar(); });
// ============================================================================

var ROL_HOME = {
  despachador: 'pedidos-libres.html',
  chofer:      'chofer.html',
  carga:       'carga.html',
  oficina:     'tablero.html',
  admin:       'tablero.html'
};

function protegerRol(sb, permitidos, onOk){
  if (!sb){ var g0 = document.getElementById('gate'); if (g0) g0.style.display = 'none'; return; }
  sb.auth.getSession().then(function(r){
    if (!r.data.session){ location.href = 'login.html'; return; }
    var email = (r.data.session.user && r.data.session.user.email) || '';
    var num = email.split('@')[0];

    function seguir(rol, nombre){
      if (permitidos.indexOf(rol) < 0){ location.href = ROL_HOME[rol] || 'tablero.html'; return; }
      var u = document.getElementById('usuario'); if (u) u.textContent = 'Usuario: ' + num;
      var g = document.getElementById('gate'); if (g) g.style.display = 'none';
      if (onOk) onOk({ numero: num, rol: rol, nombre: nombre || '' });
    }

    // 1) ¿es despachador?
    sb.from('despachadores').select('numero,nombre').eq('numero', num).eq('activo', true).then(function(rd){
      if (rd.data && rd.data.length){ seguir('despachador', rd.data[0].nombre); return; }
      // 2) ¿es chofer o carga?
      sb.from('personal').select('rol,nombre').eq('numero', num).eq('activo', true).then(function(rp){
        if (rp.data && rp.data.length) seguir(rp.data[0].rol, rp.data[0].nombre);
        else seguir('oficina', '');   // 3) oficina
      });
    });
  });
}

// Determina el rol de un número (sin proteger nada) y lo devuelve por callback.
function rolDe(sb, num, cb){
  sb.from('despachadores').select('numero').eq('numero', num).eq('activo', true).then(function(rd){
    if (rd.data && rd.data.length){ cb('despachador'); return; }
    sb.from('personal').select('rol').eq('numero', num).eq('activo', true).then(function(rp){
      cb((rp.data && rp.data.length) ? rp.data[0].rol : 'oficina');
    });
  });
}

// Manda al usuario a la pantalla que le toca según su rol (se usa tras iniciar sesión).
function irSegunRol(sb, numero){ rolDe(sb, numero, function(rol){ location.href = ROL_HOME[rol] || 'tablero.html'; }); }

function cerrarSesionRol(sb){ if (sb) sb.auth.signOut().then(function(){ location.href = 'login.html'; }); }
