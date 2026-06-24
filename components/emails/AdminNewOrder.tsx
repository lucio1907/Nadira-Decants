import { Order } from "@/types";
import * as React from 'react';

export const AdminNewOrderEmail = ({ order }: { order: Order }) => {
  const colors = {
    bg: '#0a1219',
    surface: '#121D27',
    surfaceRaised: '#1E2F3F',
    border: '#2C3E50',
    borderVisible: '#34495E',
    textDisabled: '#718096',
    textSecondary: '#A0AEC0',
    textPrimary: '#E2E8F0',
    textDisplay: '#FFFFFF',
    accent: '#d3b000',
    success: '#4A9E5C',
    alert: '#E2B34B',
  };

  const displayFont = "'Cormorant Garamond', Georgia, serif";
  const bodyFont = "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

  const orderNumber = order.id?.slice(-8).toUpperCase() || "ORDEN";
  const nombreCompleto = `${order.clienteNombre || ''} ${order.clienteApellido || ''}`.trim();
  const isTransfer = order.mpPaymentId === 'TRANSFERENCIA_WA';
  const subtotal = order.items.reduce((sum, i) => sum + i.variante.precio * i.quantity, 0);

  return (
    <div style={{
      backgroundColor: colors.bg,
      color: colors.textPrimary,
      fontFamily: bodyFont,
      padding: '40px 10px',
      margin: '0',
      width: '100%',
      colorScheme: 'dark only',
      supportedColorSchemes: 'dark only',
    } as any}>
      <table role="presentation" border={0} cellPadding="0" cellSpacing="0" align="center" style={{
        maxWidth: '640px',
        margin: '0 auto',
        backgroundColor: colors.surface,
        borderRadius: '16px',
        overflow: 'hidden',
        border: `1px solid ${colors.border}`,
        width: '100%',
      } as any}>
        <tbody style={{ backgroundColor: colors.surface }}>
          <tr>
            <td>
              {/* Header */}
              <div style={{
                padding: '48px 40px 40px',
                textAlign: 'center',
                backgroundColor: colors.surface,
                borderBottom: `1px solid ${colors.border}`,
              }}>
                <img
                  src="https://nadiradecants.com.ar/images/logonadira.png"
                  alt="NADIRA"
                  width="90"
                  style={{ width: '90px', height: 'auto', display: 'block', margin: '0 auto 24px auto' }}
                />
                <h1 style={{
                  fontFamily: displayFont,
                  fontSize: '40px',
                  fontWeight: '600',
                  color: colors.accent,
                  margin: '0 0 8px 0',
                  letterSpacing: '0.02em',
                }}>¡Nueva Orden!</h1>
                <p style={{
                  color: colors.textSecondary,
                  fontSize: '15px',
                  margin: '0',
                }}>
                  Pedido <span style={{ color: colors.textDisplay, fontWeight: '600' }}>#{orderNumber}</span>
                </p>
              </div>

              <div style={{ padding: '40px' }}>

                {/* Payment method badge */}
                <div style={{
                  backgroundColor: isTransfer ? '#1a2a1a' : '#1a1f2a',
                  border: `1px solid ${isTransfer ? colors.success : colors.accent}`,
                  borderRadius: '8px',
                  padding: '12px 20px',
                  marginBottom: '32px',
                  display: 'inline-block',
                  width: '100%',
                  boxSizing: 'border-box',
                } as any}>
                  <span style={{
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    fontWeight: '700',
                    color: isTransfer ? colors.success : colors.accent,
                  }}>
                    {isTransfer ? '💸 Pago por Transferencia Bancaria' : '💳 Pago por Mercado Pago'}
                  </span>
                  {order.mpPaymentId && !isTransfer && (
                    <span style={{ color: colors.textSecondary, fontSize: '13px', display: 'block', marginTop: '4px' }}>
                      ID de pago: {order.mpPaymentId}
                    </span>
                  )}
                </div>

                {/* Customer block */}
                <h2 style={{
                  fontSize: '12px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: '700',
                  color: colors.accent,
                  marginBottom: '16px',
                  marginTop: '0',
                }}>Cliente</h2>

                <div style={{
                  backgroundColor: colors.surfaceRaised,
                  borderRadius: '12px',
                  padding: '24px',
                  border: `1px solid ${colors.borderVisible}`,
                  marginBottom: '40px',
                }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: colors.textDisplay }}>
                    {nombreCompleto || 'Sin nombre'}
                  </p>
                  {order.clienteTelefono && (
                    <p style={{ margin: '0 0 6px 0', fontSize: '15px' }}>
                      <span style={{ color: colors.textSecondary }}>Tel: </span>
                      <a href={`https://wa.me/54${order.clienteTelefono.replace(/\D/g, '')}`}
                        style={{ color: colors.accent, textDecoration: 'none', fontWeight: '600' }}>
                        {order.clienteTelefono}
                      </a>
                    </p>
                  )}
                  {order.payerEmail && (
                    <p style={{ margin: '0', fontSize: '15px' }}>
                      <span style={{ color: colors.textSecondary }}>Email: </span>
                      <a href={`mailto:${order.payerEmail}`}
                        style={{ color: colors.accent, textDecoration: 'none' }}>
                        {order.payerEmail}
                      </a>
                    </p>
                  )}
                </div>

                {/* Delivery block */}
                <h2 style={{
                  fontSize: '12px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: '700',
                  color: colors.accent,
                  marginBottom: '16px',
                  marginTop: '0',
                }}>Entrega</h2>

                <div style={{
                  padding: '24px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '12px',
                  borderLeft: `4px solid ${colors.accent}`,
                  backgroundColor: colors.surfaceRaised,
                  marginBottom: '40px',
                }}>
                  {order.metodoEntrega === 'retiro' ? (
                    <>
                      <span style={{
                        color: colors.accent,
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontWeight: '700',
                        display: 'block',
                        marginBottom: '8px',
                      }}>🏪 Retiro en Local</span>
                      <span style={{ color: colors.textPrimary, fontSize: '15px' }}>San Martín 1485, Baradero.</span>
                    </>
                  ) : (
                    <>
                      <span style={{
                        color: colors.accent,
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontWeight: '700',
                        display: 'block',
                        marginBottom: '8px',
                      }}>📦 Envío a Domicilio</span>
                      <span style={{ color: colors.textPrimary, fontSize: '15px', lineHeight: '1.8', display: 'block' }}>
                        {order.direccionEnvio?.calle} {order.direccionEnvio?.numero}
                        {order.direccionEnvio?.piso ? `, Piso ${order.direccionEnvio.piso}` : ''}
                        {order.direccionEnvio?.depto ? ` (Depto: ${order.direccionEnvio.depto})` : ''}<br />
                        {order.direccionEnvio?.ciudad}, {order.direccionEnvio?.provincia}<br />
                        CP: {order.direccionEnvio?.codigoPostal}
                      </span>
                    </>
                  )}
                </div>

                {/* Items table */}
                <h2 style={{
                  fontSize: '12px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: '700',
                  color: colors.accent,
                  marginBottom: '16px',
                  marginTop: '0',
                }}>Productos</h2>

                <table role="presentation" border={0} cellPadding="0" cellSpacing="0" style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginBottom: '32px',
                }}>
                  <thead>
                    <tr>
                      <th style={{ borderBottom: `1px solid ${colors.borderVisible}`, textAlign: 'left', color: colors.textSecondary, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', paddingBottom: '12px' }}>Producto</th>
                      <th style={{ borderBottom: `1px solid ${colors.borderVisible}`, textAlign: 'center', color: colors.textSecondary, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', paddingBottom: '12px' }}>Cant.</th>
                      <th style={{ borderBottom: `1px solid ${colors.borderVisible}`, textAlign: 'right', color: colors.textSecondary, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', paddingBottom: '12px' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: '16px 0', borderBottom: `1px solid ${colors.border}` }}>
                          <span style={{ fontSize: '15px', color: colors.textDisplay, fontWeight: '500', display: 'block' }}>{item.nombre}</span>
                          <span style={{ fontSize: '13px', color: colors.textSecondary }}>{item.marca} — {item.variante.ml}ml</span>
                        </td>
                        <td style={{ textAlign: 'center', padding: '16px 0', fontSize: '15px', color: colors.textPrimary, borderBottom: `1px solid ${colors.border}` }}>{item.quantity}</td>
                        <td style={{ textAlign: 'right', padding: '16px 0', fontSize: '15px', color: colors.textPrimary, fontWeight: '500', borderBottom: `1px solid ${colors.border}` }}>${(item.variante.precio * item.quantity).toLocaleString('es-AR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div style={{
                  backgroundColor: colors.surfaceRaised,
                  borderRadius: '12px',
                  padding: '24px 32px',
                  border: `1px solid ${colors.borderVisible}`,
                }}>
                  <table role="presentation" border={0} cellPadding="0" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ paddingBottom: '12px', color: colors.textSecondary, fontSize: '14px' }}>Subtotal:</td>
                        <td style={{ paddingBottom: '12px', color: colors.textPrimary, fontSize: '14px', textAlign: 'right' }}>${subtotal.toLocaleString('es-AR')}</td>
                      </tr>
                      <tr>
                        <td style={{ paddingBottom: '12px', color: colors.textSecondary, fontSize: '14px' }}>Envío:</td>
                        <td style={{ paddingBottom: '12px', fontSize: '14px', textAlign: 'right', color: order.shippingCost === 0 ? colors.success : colors.textPrimary, fontWeight: order.shippingCost === 0 ? '600' : '400' }}>
                          {order.shippingCost === 0 ? 'Gratis' : order.shippingCost ? `$${order.shippingCost.toLocaleString('es-AR')}` : 'A coordinar'}
                        </td>
                      </tr>
                      {order.descuento ? (
                        <tr>
                          <td style={{ paddingBottom: '12px', color: colors.success, fontSize: '14px' }}>
                            Descuento {isTransfer ? '(10% OFF Transf.)' : ''}:
                          </td>
                          <td style={{ paddingBottom: '12px', color: colors.success, fontSize: '14px', textAlign: 'right', fontWeight: '600' }}>
                            -${order.descuento.toLocaleString('es-AR')}
                          </td>
                        </tr>
                      ) : null}
                      <tr>
                        <td colSpan={2} style={{ borderTop: `1px solid ${colors.borderVisible}`, paddingTop: '16px' }}></td>
                      </tr>
                      <tr>
                        <td style={{ fontSize: '13px', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: '700', verticalAlign: 'middle' }}>Total</td>
                        <td style={{ fontSize: '28px', fontWeight: '800', color: colors.accent, fontFamily: displayFont, textAlign: 'right', verticalAlign: 'middle' }}>
                          ${order.total.toLocaleString('es-AR')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div style={{
                padding: '32px 40px',
                textAlign: 'center',
                backgroundColor: colors.bg,
                borderTop: `1px solid ${colors.borderVisible}`,
              }}>
                <p style={{ margin: 0, fontSize: '12px', color: colors.textDisabled, lineHeight: '1.8' }}>
                  © {new Date().getFullYear()} NADIRA DECANTS — Panel de Administración<br />
                  <span style={{ opacity: 0.6 }}>Esta notificación fue generada automáticamente al aprobarse la orden.</span>
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
