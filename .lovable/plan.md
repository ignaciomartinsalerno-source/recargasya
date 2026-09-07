# Plan: métodos de pago con tarjeta y oferta de bienvenida

## Alcance
Agregar a la landing de RecargaYa la opción de "abonar con tarjeta de crédito y débito" y una oferta visual de bienvenida: en la primera recarga con tarjeta se suman $5000 de crédito de bono. Todo sigue siendo demostración, sin procesamiento de pagos reales ni backend.

## Cambios propuestos

### 1. Banner de oferta en la portada
- Insertar una cinta/banner debajo del header o sobre el formulario de recarga con el texto:
  "Primera recarga con tarjeta: te regalamos $5000 de crédito de bono".
- Usar color de acento (`--brand` o `--success`) para que resalte, con un ícono de regalo o etiqueta.

### 2. Paso de pago en la tarjeta de recarga (`RechargeCard`)
- Agregar un cuarto paso: "Elegí cómo pagar".
- Mostrar dos opciones seleccionables:
  - Tarjeta de crédito
  - Tarjeta de débito
- Incluir íconos representativos de tarjeta.
- Al seleccionar tarjeta, mostrar un resumen visual con el bono:
  - Monto a recargar
  - Bono de bienvenida: +$5.000
  - Total de crédito a recibir
- El botón "Recargar ahora" sigue mostrando el aviso de demostración.

### 3. Sección de promociones o confianza de pagos
- Agregar una pequeña sección o modificar la sección de beneficios para destacar:
  - "Pagá con tarjeta de crédito o débito"
  - "Promo primer abono: $5000 de bono"
- Mantener el estilo existente con íconos y tarjetas.

### 4. Ajustes visuales
- Agregar estilos necesarios en `src/styles.css` solo si hace falta un nuevo token semántico (por ejemplo, `--promo` o `--bonus`).
- No hardcodear colores; usar los tokens existentes (`--brand`, `--success`, `--sky`).
- Mantener el diseño responsive: en móvil los pasos y opciones se apilan.

## Archivos a modificar
- `src/components/recharge-card.tsx` — paso de pago, resumen con bono.
- `src/routes/index.tsx` — banner de oferta y sección de pagos/promociones.
- `src/styles.css` — solo si se necesita un nuevo token semántico.

## No incluye
- Integración real con Stripe, Paddle u otra pasarela de pagos.
- Base de datos, usuarios, historial de transacciones o acreditación real del bono.
- Cambios en el dominio o publicación.

## Resultado esperado
La página muestra el flujo completo de recarga incluyendo la elección de tarjeta de crédito/débito y el bono de $5000, pero al hacer clic en "Recargar ahora" sigue apareciendo el aviso de demostración.