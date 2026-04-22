import React from "react";
import MenuGrid from "./MenuGrid";

function Pasta({ menu, onAddToCart }) {
  const pastas = menu.filter((item) => item.category === "pasta");

  return (
    <MenuGrid
      title="Pasta Collection"
      subtitle="Creamy, spicy, and chef-crafted bowls."
      items={pastas}
      onAddToCart={onAddToCart}
    />
  );
}

export default Pasta;