/**
 * Order Total Calculations Utility
 * Ensures consistent calculation of order totals across the application
 */

/**
 * Calculate order breakdown from items
 * @param {Array} items - Array of items with price and quantity
 * @param {Number} deliveryCharge - Delivery charge (optional)
 * @param {Number} discount - Discount amount (optional)
 * @returns {Object} Breakdown with subtotal, tax, delivery, total
 */
function calculateOrderTotal(items, deliveryCharge = 0, discount = 0) {
  if (!items || items.length === 0) {
    return {
      subtotal: 0,
      taxAmount: 0,
      deliveryCharge: deliveryCharge,
      discount: Math.max(0, discount),
      totalAmount: Math.max(0, deliveryCharge - Math.max(0, discount))
    };
  }

  // Calculate items subtotal
  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return sum + (price * quantity);
  }, 0);

  // Calculate tax (5% GST for India by default)
  const taxAmount = Math.round(subtotal * 0.05 * 100) / 100;

  // Ensure discount doesn't exceed total
  const maxDiscount = subtotal + taxAmount;
  const appliedDiscount = Math.max(0, Math.min(discount, maxDiscount));

  // Total = Subtotal + Tax + Delivery - Discount
  const totalAmount = Math.max(0, subtotal + taxAmount + deliveryCharge - appliedDiscount);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxAmount: taxAmount,
    deliveryCharge: Math.max(0, deliveryCharge),
    discount: appliedDiscount,
    totalAmount: Math.round(totalAmount * 100) / 100
  };
}

/**
 * Validate order total - ensures frontend calculation matches backend
 * @param {Number} claimedTotal - Total sent from frontend
 * @param {Array} items - Order items
 * @param {Number} deliveryCharge - Delivery charge
 * @param {Number} discount - Discount
 * @returns {Object} Validation result with isValid and recalculatedTotal
 */
function validateOrderTotal(claimedTotal, items, deliveryCharge = 0, discount = 0) {
  const calculated = calculateOrderTotal(items, deliveryCharge, discount);
  
  // Allow 1 rupee tolerance for rounding errors
  const tolerance = 1;
  const isValid = Math.abs(claimedTotal - calculated.totalAmount) <= tolerance;

  return {
    isValid: isValid,
    claimedTotal: claimedTotal,
    calculatedTotal: calculated.totalAmount,
    difference: calculated.totalAmount - claimedTotal,
    breakdown: calculated
  };
}

module.exports = {
  calculateOrderTotal,
  validateOrderTotal
};
