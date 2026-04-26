import { useState } from 'react';

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(date).toLocaleDateString();
};

const METHOD_LABEL = { cod: 'Cash on delivery', card: 'Card', online: 'Online' };

export default function NotificationCard({ notification, onMarkRead, onViewOrder }) {
  const [expanded, setExpanded] = useState(false);
  const {
    _id, relatedId, items = [], totalAmount, subtotal,
    shippingFee, deliveryAddress, paymentMethod,
    status, createdAt, isRead, message,
  } = notification;

  const visible = expanded ? items : items.slice(0, 2);

  return (
    <div style={{
      border: `1.5px solid ${isRead ? '#f0ece8' : '#e87722'}`,
      borderRadius: 14, padding: 16, marginBottom: 12,
      background: isRead ? '#fff' : '#fff8f3',
      transition: 'border-color 0.3s',
    }}>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 42, height: 42, borderRadius: '50%',
          background: '#fff4ec', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: 20,
        }}>🛒</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>New Order</div>
          <div style={{ fontSize: 12, color: '#999' }}>
            #{String(relatedId || '').slice(-6).toUpperCase()} · {timeAgo(createdAt)}
          </div>
        </div>
        <span style={{
          background: '#fff4ec', color: '#e87722',
          fontSize: 11, fontWeight: 700,
          padding: '3px 10px', borderRadius: 20,
          border: '1px solid #fde4c8',
        }}>
          {(status || 'pending').toUpperCase()}
        </span>
      </div>

      {/* Items list */}
      {items.length > 0 ? (
        <>
          {visible.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#faf8f6', borderRadius: 10,
              padding: '8px 10px', marginBottom: 8,
            }}>
              {item.image
                ? <img src={item.image} alt={item.name} style={{
                    width: 52, height: 52, borderRadius: 8,
                    objectFit: 'cover', border: '1px solid #f0ece8',
                  }}/>
                : <div style={{
                    width: 52, height: 52, borderRadius: 8,
                    background: '#f0ece8', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: 22,
                  }}>📦</div>
              }
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{item.name}</div>
                <div style={{ fontSize: 12, color: '#999' }}>
                  ${item.price?.toFixed(2)} × {item.quantity}
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
          {items.length > 2 && (
            <button onClick={() => setExpanded(e => !e)} style={{
              background: 'none', border: 'none', color: '#e87722',
              fontSize: 12, cursor: 'pointer', padding: '2px 0', marginBottom: 8,
            }}>
              {expanded ? 'Show less ▲' : `+${items.length - 2} more items ▼`}
            </button>
          )}
        </>
      ) : (
        // Fallback if items array is empty — show the text message
        <div style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>{message}</div>
      )}

      {/* Delivery info */}
      {deliveryAddress?.street && (
        <div style={{
          fontSize: 12, color: '#666', padding: '8px 10px',
          background: '#f5f2ef', borderRadius: 8, marginBottom: 10,
          display: 'flex', flexDirection: 'column', gap: 3,
        }}>
          {deliveryAddress.street && <span>📍 {deliveryAddress.street}</span>}
          {deliveryAddress.phone  && <span>📞 {deliveryAddress.phone}</span>}
          {deliveryAddress.type   && <span>🚚 {deliveryAddress.type}</span>}
          {deliveryAddress.instructions && <span>📝 {deliveryAddress.instructions}</span>}
        </div>
      )}

      {/* Price breakdown */}
      {totalAmount && (
        <div style={{
          fontSize: 12, color: '#999', marginBottom: 10,
          display: 'flex', flexDirection: 'column', gap: 3,
        }}>
          {subtotal    && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>}
          {shippingFee && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Shipping</span><span>${shippingFee.toFixed(2)}</span></div>}
          {paymentMethod && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Payment</span><span>{METHOD_LABEL[paymentMethod] || paymentMethod}</span></div>}
        </div>
      )}

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 10, borderTop: '1px solid #f0ece8',
      }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: '#1a1a1a' }}>
          {totalAmount ? `Total: $${totalAmount.toFixed(2)}` : ''}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {!isRead && (
            <button onClick={() => onMarkRead?.(_id)} style={{
              background: 'none', border: '1px solid #f0ece8',
              borderRadius: 8, padding: '6px 12px',
              fontSize: 12, cursor: 'pointer', color: '#999',
            }}>
              Mark read
            </button>
          )}
          <button onClick={() => onViewOrder?.(relatedId)} style={{
            background: '#e87722', color: '#fff', border: 'none',
            borderRadius: 8, padding: '6px 16px',
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}>
            View Order
          </button>
        </div>
      </div>
    </div>
  );
}