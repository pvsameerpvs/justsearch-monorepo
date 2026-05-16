export function RestaurantDeliveryCartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-12">
      <p className="text-lg font-semibold text-[rgb(var(--muted))]">Your cart is empty</p>
      <p className="mt-1 text-sm text-[rgb(var(--muted))]">Add items to get started</p>
    </div>
  );
}
