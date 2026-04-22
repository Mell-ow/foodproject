import React, { useMemo } from "react";

function CartDrawer({
  isOpen,
  onClose,
  cart,
  onIncrement,
  onDecrement,
  onRemove,
  onClear,
  onProceedCheckout
}) {
  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  return (
    <>
      <div className={`drawer-overlay ${isOpen ? "open" : ""}`} onClick={onClose} />

      <aside className={`cart-drawer ${isOpen ? "open" : ""}`}>
        <header>
          <h3>Your Cart</h3>
          <button type="button" className="ghost" onClick={onClose}>
            Close
          </button>
        </header>

        {!cart.length ? (
          <p className="empty-text">Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div>
                    <h4>{item.name}</h4>
                    <p>Rs. {item.price}</p>
                  </div>

                  <div className="cart-actions">
                    <button type="button" onClick={() => onDecrement(item)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => onIncrement(item)}>
                      +
                    </button>
                    <button type="button" className="remove" onClick={() => onRemove(item.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <p>Total: Rs. {total}</p>
              <button type="button" className="secondary" onClick={onClear}>
                Clear Cart
              </button>
              <button type="button" onClick={onProceedCheckout}>
                Continue to Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;