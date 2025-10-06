import React, { useState } from "react";

// 1) Types
type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
};

type CartItem = Product & { quantity: number };

// 2) Data
const farmingProducts: Product[] = [
  { id: 1, name: "Captan", price: 500, description: "Effective fungicide for Apple scab and Black rot." },
  { id: 2, name: "Myclobutanil", price: 700, description: "Fungicide for Cedar apple rust and Grape diseases." },
  { id: 3, name: "Sulfur", price: 300, description: "Controls Powdery mildew on Cherry and Squash." },
  { id: 4, name: "Azoxystrobin", price: 1000, description: "Fungicide for Corn leaf spots and rust." },
  { id: 5, name: "Mancozeb", price: 800, description: "Fungicide for Grape Black rot and Leaf blight." },
  { id: 6, name: "Copper-based sprays", price: 600, description: "Bactericide for Peach and Tomato bacterial spots." },
  { id: 7, name: "Chlorothalonil", price: 900, description: "Fungicide for Potato and Tomato blights." },
  { id: 8, name: "Abamectin", price: 1200, description: "Miticide for Spider mites on Tomato." },
  { id: 9, name: "Tractor", price: 500_000, description: "High-efficiency tractor for farming needs." },
  { id: 10, name: "Irrigation System", price: 150_000, description: "Drip irrigation system for efficient water usage." },
  { id: 11, name: "Plow", price: 20_000, description: "Durable plow for soil preparation." },
  { id: 12, name: "Seeder", price: 45_000, description: "Precision seeder for sowing crops." },
  { id: 13, name: "Harvester", price: 800_000, description: "Automated harvester for efficient crop harvesting." },
  { id: 14, name: "Compost", price: 500, description: "Organic compost to enrich soil fertility." },
  { id: 15, name: "Pesticide", price: 1200, description: "General pesticide for pest control." },
];

// 3) Currency helper (INR)
const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

// 4) Component
const Marketplace: React.FC = () => {
  // cart is an array of CartItem (Product + quantity)
  const [cart, setCart] = useState<CartItem[]>([]);

  // Add item: increment quantity if already in cart; otherwise add with quantity 1
  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  // Remove item completely
  function removeFromCart(productId: number) {
    setCart((prev) => prev.filter((i) => i.id !== productId));
  }

  // Calculate total every render (fine for small lists)
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-green-100 p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Farming Marketplace</h1>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {farmingProducts.map((product) => (
          <div key={product.id} className="bg-green-50 border border-green-300 rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold text-green-700 mb-2">{product.name}</h2>
            <p className="text-green-600 mb-2">{product.description}</p>
            <p className="text-lg font-bold text-green-900">{currency.format(product.price)}</p>
            <button
              onClick={() => addToCart(product)}
              className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Cart</h2>

        {cart.length === 0 ? (
          <p className="text-green-600">Your cart is empty.</p>
        ) : (
          <div>
            <ul>
              {cart.map((item) => (
                <li key={item.id} className="flex justify-between items-center mb-2">
                  <div>
                    <p className="text-green-700 font-semibold">{item.name}</p>
                    <p className="text-green-600">
                      {currency.format(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <p className="text-green-900 font-bold text-xl mt-4">
              Total: {currency.format(totalAmount)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
