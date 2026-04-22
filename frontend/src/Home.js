import React from "react";

function Home({ menu, onAddToCart, onReserve, isReserving }) {
  const [form, setForm] = React.useState({
    name: "",
    people: "",
    date: "",
    time: "",
    advance: 50
  });

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submitBooking = async (event) => {
    event.preventDefault();
    await onReserve(form);
    setForm({ name: "", people: "", date: "", time: "", advance: 50 });
  };

  return (
    <>
      <section className="hero">
        <div>
          <h1>Zan Cafe</h1>
          <p>Premium flavors with a cozy dining vibe.</p>
        </div>
      </section>

      <div className="home-layout single-column">
        <section className="booking card">
          <h3>Reserve Table</h3>
          <form onSubmit={submitBooking}>
            <input
              value={form.name}
              onChange={(event) => onChange("name", event.target.value)}
              placeholder="Name"
              required
            />
            <input
              value={form.people}
              onChange={(event) => onChange("people", event.target.value)}
              type="number"
              min="1"
              placeholder="People"
              required
            />
            <input
              value={form.date}
              onChange={(event) => onChange("date", event.target.value)}
              type="date"
              required
            />
            <input
              value={form.time}
              onChange={(event) => onChange("time", event.target.value)}
              type="time"
              required
            />

            <div className="package-row">
              {[50, 100, 200].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onChange("advance", value)}
                  className={form.advance === value ? "active" : ""}
                >
                  Rs. {value}
                </button>
              ))}
            </div>

            <p className="advance-text">Advance: Rs. {form.advance}</p>
            <button type="submit" disabled={isReserving}>
              {isReserving ? "Booking..." : "Book Table"}
            </button>
          </form>
        </section>
      </div>

      <section className="menu-section">
        <div className="section-heading">
          <h2>Popular Menu</h2>
          <p>Tap any dish to add it to your cart.</p>
        </div>
        <div className="menu-items">
          {menu.map((item) => (
            <article className="menu-card" key={item.id}>
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.src = "https://picsum.photos/seed/zan-cafe-fallback/600/400";
                }}
              />
              <h3>{item.name}</h3>
              <p className="price">Rs. {item.price}</p>
              <button type="button" onClick={() => onAddToCart(item.id)}>
                Add to Cart
              </button>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;