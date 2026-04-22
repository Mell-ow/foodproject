import React from "react";
import MenuGrid from "./MenuGrid";

function Pizza({ menu, onAddToCart }) {
  const pizzas = menu.filter((item) => item.category === "pizza");

  return (
    <MenuGrid
      title="Pizza Collection"
      subtitle="Hand-stretched, loaded, and oven-finished."
      items={pizzas}
      onAddToCart={onAddToCart}
    />
  );
}

export default Pizza;