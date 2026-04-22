import React from "react";
import { Link } from "react-router-dom";

function Navbar({ user, cartCount, onOpenCart, onLogout }) {
  return (
    <nav className="navbar">
      <div className="brand">
        <h2>Zan Cafe</h2>
        <span>Fresh. Fast. Crafted.</span>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/pizza">Pizza</Link>
        <Link to="/pasta">Pasta</Link>
        <Link to="/checkout">Checkout</Link>
      </div>

      <div className="nav-actions">
        <button type="button" onClick={onOpenCart}>
          Cart ({cartCount})
        </button>
        {user ? (
          <button type="button" className="ghost" onClick={onLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link className="nav-auth-link" to="/login">
              Login
            </Link>
            <Link className="nav-auth-link" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;