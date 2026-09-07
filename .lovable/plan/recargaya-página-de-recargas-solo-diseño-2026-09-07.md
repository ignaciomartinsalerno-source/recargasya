# RecargaYa — página de recargas (solo diseño)

Una única página que reproduce fielmente la imagen de referencia, en español rioplatense, con la marca RecargaYa y los operadores Movistar, Claro, Personal y Tuenti.

## Secciones (de arriba hacia abajo)

1. **Barra superior**: logo RecargaYa, enlaces Inicio / Recargas / Planes / Cómo funciona / Contacto, y botones "Iniciar sesión" y "Registrarse".
2. **Portada azul oscuro**: título "Recargá tu celular en segundos", texto de apoyo, tres puntos de confianza (carga inmediata, 100% seguro, desde cualquier dispositivo) y, a la derecha, la tarjeta blanca "Hacé tu recarga" con los tres pasos: elegir operador, ingresar número y elegir monto ($500 a $10.000) más el botón "Recargar ahora". Al costado, una imagen de celular flotando con destello azul.
3. **Nuestros operadores**: cuatro tarjetas con el nombre del operador, "Saldo, datos y packs" y enlace "Recargar".
4. **Franja de beneficios**: cuatro íconos con Recarga inmediata, Pagos seguros, Desde cualquier dispositivo y Soporte 24/7.
5. **Bloque final**: tarjeta oscura "¡Tu recarga está en camino!" con imagen de celular y botón "Ver historial", junto al formulario "Iniciar sesión" (correo, contraseña, recordarme, olvidaste tu contraseña, botón Ingresar).
6. **Pie**: logo, lema, enlaces y redes sociales.

## Comportamiento

Todo es visual: se puede seleccionar operador y monto y escribir el número (se resalta la opción elegida), pero no se procesa ninguna recarga ni se crean cuentas. El botón de recarga y el de ingresar muestran un aviso de que es una demostración.

La página se adapta bien a celular: en pantallas chicas las columnas se apilan y la tarjeta de recarga queda debajo del título.

## Detalles técnicos

- Nueva página en `src/routes/index.tsx` (reemplaza el marcador actual), con secciones en `src/components/`.
- Paleta e identidad en `src/styles.css` como variables oklch: azul marino profundo de fondo, azul brillante de acción, celeste de acento, superficies claras. Sin colores fijos en los componentes.
- Tipografía sans geométrica cargada con `<link>` en `src/routes/__root.tsx`.
- Dos imágenes generadas para los celulares (portada y bloque "recarga exitosa"); logos de operadores como marcas circulares con iniciales, sin usar logotipos oficiales.
- Título y descripción propios de la página para buscadores y vista previa al compartir.
