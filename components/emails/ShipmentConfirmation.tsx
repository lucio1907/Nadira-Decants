import { Order } from "@/types";
import * as React from 'react';

export const ShipmentConfirmationEmail = ({ order }: { order: Order }) => {
  // Brand Colors (Exact from web)
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
    accent: '#d3b000', // Gold
    success: '#4A9E5C',
  };

  const orderNumber = order.id?.slice(-8).toUpperCase() || "ORDEN";
  const nombreCompleto = `${order.clienteNombre || ''} ${order.clienteApellido || ''}`.trim();
  
  // Fonts
  const displayFont = "'Cormorant Garamond', Georgia, serif";
  const bodyFont = "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

  const trackingUrl = `https://www.correoargentino.com.ar/seguimiento-de-envios?id=${order.trackingNumber}`;

  return (
    <div style={{
      backgroundColor: colors.bg,
      color: colors.textPrimary,
      fontFamily: bodyFont,
      padding: '40px 10px',
      margin: '0',
      width: '100%',
      // Forced Dark Mode
      colorScheme: 'dark only',
      supportedColorSchemes: 'dark only',
    } as any}>
      {/* Forced Dark Mode Meta / Styles (Internal hack for some clients) */}
      <table role="presentation" border={0} cellPadding="0" cellSpacing="0" style={{
        maxWidth: '640px',
        margin: '0 auto',
        backgroundColor: colors.surface,
        borderRadius: '16px',
        overflow: 'hidden',
        border: `1px solid ${colors.border}`,
        width: '100%',
        colorScheme: 'dark only',
        supportedColorSchemes: 'dark only',
      } as any}>
        <tbody>
          <tr>
            <td>
              {/* Header - Shipment Style */}
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
                }}>¡Tu pedido está en camino! 🚚</h1>
                <div style={{
                  width: '40px',
                  height: '2px',
                  backgroundColor: colors.accent,
                  margin: '0 auto 24px auto'
                }}></div>
                <p style={{ color: colors.textSecondary, fontSize: '16px', maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>
                  Tu pedido <span style={{ color: colors.accent, fontWeight: 'bold' }}>#{orderNumber}</span> ya ha sido despachado y está en manos del correo.
                </p>
              </div>

              {/* Tracking Info Section */}
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{
                  backgroundColor: colors.surfaceRaised,
                  borderRadius: '16px',
                  padding: '40px',
                  border: `1px solid ${colors.accent}`,
                  marginBottom: '20px'
                }}>
                   <p style={{ 
                    fontSize: '11px', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.2em', 
                    color: colors.textSecondary,
                    margin: '0 0 12px 0'
                   }}>Número de Seguimiento</p>
                   <p style={{ 
                    fontSize: '28px', 
                    fontWeight: 'bold', 
                    fontFamily: 'monospace', 
                    color: colors.textDisplay,
                    margin: '0 0 32px 0',
                    letterSpacing: '0.05em'
                   }}>{order.trackingNumber}</p>
                   
                   <a 
                    href={trackingUrl}
                    style={{
                      display: 'inline-block',
                      backgroundColor: colors.accent,
                      color: '#000000',
                      padding: '18px 36px',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase'
                    }}
                   >
                    Seguir mi Pedido
                   </a>
                </div>
                <p style={{ fontSize: '13px', color: colors.textSecondary, marginTop: '20px' }}>
                  Podes rastrear el estado de tu envío en la web oficial de Correo Argentino haciendo clic en el botón de arriba.
                </p>
              </div>

              {/* Logistics & Delivery */}
              <div style={{ padding: '0 40px 40px 40px' }}>
                <h2 style={{
                  fontSize: '12px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: '700',
                  color: colors.accent,
                  marginBottom: '20px',
                  marginTop: '0',
                  borderBottom: `1px solid ${colors.border}`,
                  paddingBottom: '10px'
                }}>Información del Envío</h2>
                <div style={{
                  padding: '24px',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  borderRadius: '12px',
                  border: `1px solid ${colors.border}`
                }}>
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.8', color: colors.textPrimary }}>
                    <strong style={{ color: colors.textDisplay, fontSize: '16px', display: 'block', marginBottom: '4px' }}>{nombreCompleto}</strong>
                    <span style={{ color: colors.textSecondary, display: 'block', marginBottom: '16px' }}>{order.clienteTelefono}</span>
                    
                    <span style={{ display: 'block', paddingTop: '16px', borderTop: `1px solid ${colors.border}`, color: colors.textPrimary }}>
                      <span style={{ color: colors.accent, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Domicilio de Envío</span>
                      <span style={{ color: colors.textPrimary }}>
                        {order.direccionEnvio?.calle} {order.direccionEnvio?.numero}
                        {order.direccionEnvio?.piso ? `, Piso ${order.direccionEnvio?.piso}` : ''}
                        {order.direccionEnvio?.depto ? ` (Depto: ${order.direccionEnvio?.depto})` : ''}<br />
                        {order.direccionEnvio?.ciudad}, {order.direccionEnvio?.provincia} (CP: {order.direccionEnvio?.codigoPostal})
                      </span>
                    </span>
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div style={{
                padding: '60px 40px',
                textAlign: 'center',
                backgroundColor: colors.bg,
                borderTop: `1px solid ${colors.borderVisible}`
              }}>
                <img
                  src="https://nadiradecants.com.ar/images/logonadira.png"
                  alt="NADIRA"
                  width="80"
                  style={{ width: '80px', height: 'auto', marginBottom: '24px', opacity: 0.8, display: 'block', margin: '0 auto 24px auto' }}
                />
                <p style={{ fontSize: '13px', marginBottom: '32px', color: colors.textSecondary, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Conectate con nosotros</p>
                
                <table role="presentation" border={0} cellPadding="0" cellSpacing="0" style={{ width: '100%', marginBottom: '48px' }}>
                  <tbody>
                    <tr>
                      <td style={{ textAlign: 'center' }}>
                        <a href="https://www.instagram.com/nadiradecants.baradero/" style={{ color: colors.accent, textDecoration: 'none', fontSize: '12px', fontWeight: '600', letterSpacing: '0.05em' }}>INSTAGRAM</a>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <a href="https://www.tiktok.com/@nadira.decants" style={{ color: colors.accent, textDecoration: 'none', fontSize: '12px', fontWeight: '600', letterSpacing: '0.05em' }}>TIKTOK</a>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <a href="https://wa.me/5493329516307" style={{ color: colors.accent, textDecoration: 'none', fontSize: '12px', fontWeight: '600', letterSpacing: '0.05em' }}>WHATSAPP</a>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <p style={{ margin: 0, fontSize: '11px', color: colors.textDisabled, lineHeight: '1.8', letterSpacing: '0.02em' }}>
                  © {new Date().getFullYear()} NADIRA DECANTS<br />
                  <span style={{ opacity: 0.6 }}>Baradero, Buenos Aires, Argentina.</span>
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
