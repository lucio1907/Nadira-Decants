import { Order } from "@/types";
import * as React from 'react';

export const OrderConfirmationEmail = ({ order }: { order: Order }) => {
  // Brand Colors (Exact from web)
  const colors = {
    bg: '#0a1219',
    surface: '#121D27',
    surfaceRaised: '#1E2F3F',
    border: '#2C3E50', // Email-safe solid color instead of rgba
    borderVisible: '#34495E',
    textDisabled: '#718096',
    textSecondary: '#A0AEC0',
    textPrimary: '#E2E8F0',
    textDisplay: '#FFFFFF',
    accent: '#d3b000', // Gold
    success: '#4A9E5C',
  };

  const orderNumber = order.id?.slice(-8).toUpperCase() || "ORDEN";
  const nombreCompleto = `${order.clienteNombre || ''} ${order.clienteApellido || ''}`.trim();
  const isTransfer = order.mpPaymentId === 'TRANSFERENCIA_WA';

  // Fonts
  const displayFont = "'Cormorant Garamond', Georgia, serif";
  const bodyFont = "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

  return (
    <div style={{
      backgroundColor: colors.bg,
      color: colors.textPrimary,
      fontFamily: bodyFont,
      padding: '40px 10px',
      margin: '0',
      width: '100%',
    }}>
      {/* Container with shadow and rounded corners */}
      <table role="presentation" border={0} cellPadding="0" cellSpacing="0" style={{
        maxWidth: '640px',
        margin: '0 auto',
        backgroundColor: colors.surface,
        borderRadius: '16px',
        overflow: 'hidden',
        border: `1px solid ${colors.border}`,
        width: '100%',
      }}>
        <tbody>
          <tr>
            <td>
              {/* Header - Editorial Style */}
              <div style={{
                padding: '60px 40px',
                textAlign: 'center',
                backgroundColor: colors.surface,
                borderBottom: `1px solid ${colors.border}`
              }}>
                <img
                  src="https://nadiradecants.com.ar/images/logonadira.png"
                  alt="NADIRA"
                  width="110"
                  style={{ width: '110px', height: 'auto', marginBottom: '32px', display: 'block', margin: '0 auto 32px auto' }}
                />
                <h1 style={{
                  fontFamily: displayFont,
                  fontSize: '36px',
                  fontWeight: '600',
                  letterSpacing: '0.02em',
                  color: colors.textDisplay,
                  margin: '0 0 16px 0',
                }}>¡Gracias por tu compra!</h1>
                <div style={{
                  width: '40px',
                  height: '2px',
                  backgroundColor: colors.accent,
                  margin: '0 auto 24px auto'
                }}></div>
                <p style={{ color: colors.textSecondary, fontSize: '16px', maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>
                  Tu pedido <span style={{ color: colors.accent, fontWeight: 'bold' }}>#{orderNumber}</span> ha sido recibido y estamos preparándolo con dedicación.
                </p>
              </div>

              {/* Order Details Body */}
              <div style={{ padding: '40px' }}>
                <h2 style={{
                  fontSize: '12px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: '700',
                  color: colors.accent,
                  marginBottom: '24px',
                  marginTop: '0'
                }}>Detalle del Pedido</h2>

                <table role="presentation" border={0} cellPadding="0" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
                  <thead>
                    <tr>
                      <th style={{ borderBottom: `1px solid ${colors.borderVisible}`, textAlign: 'left', color: colors.textSecondary, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', paddingBottom: '16px' }}>Producto</th>
                      <th style={{ borderBottom: `1px solid ${colors.borderVisible}`, textAlign: 'center', color: colors.textSecondary, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', paddingBottom: '16px' }}>Cant.</th>
                      <th style={{ borderBottom: `1px solid ${colors.borderVisible}`, textAlign: 'right', color: colors.textSecondary, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', paddingBottom: '16px' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: '20px 0', borderBottom: `1px solid ${colors.border}` }}>
                          <span style={{ fontSize: '16px', color: colors.textDisplay, fontWeight: '500', display: 'block', marginBottom: '4px' }}>{item.nombre}</span>
                          <span style={{ fontSize: '14px', color: colors.textSecondary }}>{item.marca} — {item.variante.ml}ml</span>
                        </td>
                        <td style={{ textAlign: 'center', padding: '20px 0', fontSize: '15px', color: colors.textPrimary, borderBottom: `1px solid ${colors.border}` }}>{item.quantity}</td>
                        <td style={{ textAlign: 'right', padding: '20px 0', fontSize: '16px', color: colors.textPrimary, fontWeight: '500', borderBottom: `1px solid ${colors.border}` }}>${(item.variante.precio * item.quantity).toLocaleString('es-AR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals Section */}
                <div style={{
                  backgroundColor: colors.surfaceRaised,
                  borderRadius: '12px',
                  padding: '32px',
                  border: `1px solid ${colors.borderVisible}`
                }}>
                  <table role="presentation" border={0} cellPadding="0" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ paddingBottom: '16px', color: colors.textSecondary, fontSize: '15px' }}>Subtotal:</td>
                        <td style={{ paddingBottom: '16px', color: colors.textPrimary, fontSize: '15px', textAlign: 'right' }}>${order.items.reduce((sum, i) => sum + i.variante.precio * i.quantity, 0).toLocaleString('es-AR')}</td>
                      </tr>
                      <tr>
                        <td style={{ paddingBottom: '16px', color: colors.textSecondary, fontSize: '15px' }}>Envío:</td>
                        <td style={{ paddingBottom: '16px', color: order.shippingCost === 0 ? colors.success : colors.textPrimary, fontWeight: order.shippingCost === 0 ? '600' : '400', fontSize: '15px', textAlign: 'right' }}>
                          {order.shippingCost === 0 ? 'Gratis' : order.shippingCost ? `$${order.shippingCost.toLocaleString('es-AR')}` : 'Consultar'}
                        </td>
                      </tr>
                      {order.descuento ? (
                        <tr>
                          <td style={{ paddingBottom: '16px', color: colors.success, fontSize: '15px' }}>Descuento {isTransfer ? '(10% OFF Transf.)' : ''}:</td>
                          <td style={{ paddingBottom: '16px', color: colors.success, fontSize: '15px', textAlign: 'right', fontWeight: '600' }}>-${order.descuento.toLocaleString('es-AR')}</td>
                        </tr>
                      ) : null}
                      <tr>
                        <td colSpan={2} style={{ borderTop: `1px solid ${colors.borderVisible}`, paddingTop: '24px', marginTop: '16px' }}></td>
                      </tr>
                      <tr>
                        <td style={{
                          fontSize: '13px',
                          color: colors.textSecondary,
                          textTransform: 'uppercase',
                          letterSpacing: '0.2em',
                          fontWeight: '700',
                          verticalAlign: 'middle'
                        }}>Total</td>
                        <td style={{ fontSize: '32px', fontWeight: '800', color: colors.accent, fontFamily: displayFont, textAlign: 'right', verticalAlign: 'middle' }}>
                          ${order.total.toLocaleString('es-AR')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Logistics & Delivery */}
                <div style={{ marginTop: '48px' }}>
                  <h2 style={{
                    fontSize: '12px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    fontWeight: '700',
                    color: colors.accent,
                    marginBottom: '20px',
                    marginTop: '0'
                  }}>Detalles de Entrega</h2>
                  <div style={{
                    padding: '24px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '12px',
                    borderLeft: `4px solid ${colors.accent}`,
                    backgroundColor: colors.surfaceRaised
                  }}>
                    <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: colors.textPrimary }}>
                      <strong style={{ color: colors.textDisplay, fontSize: '16px', display: 'block', marginBottom: '4px' }}>{nombreCompleto}</strong>
                      <span style={{ color: colors.textSecondary, display: 'block', marginBottom: '16px' }}>{order.clienteTelefono}</span>
                      
                      <span style={{ display: 'block', paddingTop: '16px', borderTop: `1px solid ${colors.border}`, color: colors.textPrimary }}>
                        {order.metodoEntrega === 'retiro' ? (
                          <>
                            <span style={{ color: colors.accent, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Punto de Retiro</span>
                            <span style={{ color: colors.textPrimary }}>San Martín 1485, Baradero.</span>
                          </>
                        ) : (
                          <>
                            <span style={{ color: colors.accent, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Domicilio de Envío</span>
                            <span style={{ color: colors.textPrimary }}>
                              {order.direccionEnvio?.calle} {order.direccionEnvio?.numero}
                              {order.direccionEnvio?.piso ? `, Piso ${order.direccionEnvio?.piso}` : ''}
                              {order.direccionEnvio?.depto ? ` (Depto: ${order.direccionEnvio?.depto})` : ''}<br />
                              {order.direccionEnvio?.ciudad}, {order.direccionEnvio?.provincia} (CP: {order.direccionEnvio?.codigoPostal})
                            </span>
                          </>
                        )}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{
                padding: '60px 40px',
                textAlign: 'center',
                backgroundColor: colors.bg,
                borderTop: `1px solid ${colors.borderVisible}`
              }}>
                <p style={{ fontSize: '13px', marginBottom: '32px', color: colors.textSecondary, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Conectate con nosotros</p>
                
                <table role="presentation" border={0} cellPadding="0" cellSpacing="0" style={{ width: '100%', marginBottom: '48px' }}>
                  <tbody>
                    <tr>
                      <td style={{ textAlign: 'center' }}>
                        <a href="https://www.instagram.com/nadiradecants.baradero/" style={{ color: colors.accent, textDecoration: 'none', fontSize: '14px', fontWeight: '600', letterSpacing: '0.05em' }}>INSTAGRAM</a>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <a href="https://www.tiktok.com/@nadira.decants" style={{ color: colors.accent, textDecoration: 'none', fontSize: '14px', fontWeight: '600', letterSpacing: '0.05em' }}>TIKTOK</a>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <a href="https://wa.me/5493329516307" style={{ color: colors.accent, textDecoration: 'none', fontSize: '14px', fontWeight: '600', letterSpacing: '0.05em' }}>WHATSAPP</a>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div style={{
                  height: '1px',
                  width: '100%',
                  backgroundColor: colors.borderVisible,
                  marginBottom: '32px'
                }}></div>
                <p style={{ margin: 0, fontSize: '12px', color: colors.textDisabled, lineHeight: '1.8', letterSpacing: '0.02em' }}>
                  © {new Date().getFullYear()} NADIRA DECANTS<br />
                  Baradero, Buenos Aires, Argentina.<br />
                  <span style={{ opacity: 0.6 }}>Este es un mensaje automático, por favor no respondas a este correo.</span>
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
