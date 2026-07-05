import React from "react";

const FALLBACK_IMAGE = "https://picsum.photos/seed/zan-cafe-fallback/600/400";

function MenuGrid({ title, subtitle, items, onAddToCart }) {
  return (
    <section className="menu-section">
      <div className="section-heading">
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>

      <div className="menu-items">
        {items.map((item) => (
          <article className="menu-card" key={item.id}>
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.src = FALLBACK_IMAGE;
              }}
            />
            <h3>{item.name}</h3>
            <p className="price">₹ {item.price}</p>
            <button type="button" onClick={() => onAddToCart(item.id)}>
              Add to Cart
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default MenuGrid;