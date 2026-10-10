import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [language, setLanguage] = React.useState("en");

  const menu = [
    {
      name: "Chapatti + Chicken Peratt Combo",
      malayalam: "3 ചപ്പാത്തി + ചിക്കൻ പെരട്ട്",
      price: 100,
    },
    {
      name: "Dosa Special Combo",
      malayalam: "4 ദോശ, രസവട, 2 പപ്പടം, സിംഗിൾ ഓംലെറ്റ്, സാമ്പാർ, തേങ്ങ ചട്ണി",
      price: 100,
    },
    { name: "Tea", malayalam: "ചായ", price: 12 },
    { name: "Papadam", malayalam: "പപ്പടം", price: 5 },
    { name: "Dosa", malayalam: "ദോശ", price: 12 },
    { name: "Single Omelette", malayalam: "സിംഗിൾ ഓംലെറ്റ്", price: 20 },
    { name: "Double Omelette", malayalam: "ഡബിൾ ഓംലെറ്റ്", price: 40 },
    { name: "Rasavada", malayalam: "രസവട", price: 25 },
    { name: "Chapatti", malayalam: "ചപ്പാത്തി", price: 15 },
    { name: "Chicken Peratt", malayalam: "ചിക്കൻ പെരട്ട്", price: 80 },
  ];

  const [cart, setCart] = React.useState<
    { name: string; price: number; qty: number }[]
  >([]);

  const addToCart = (item: (typeof menu)[number]) => {
    setCart((old) => {
      const found = old.find((x) => x.name === item.name);
      if (found) {
        return old.map((x) =>
          x.name === item.name ? { ...x, qty: x.qty + 1 } : x
        );
      }
      return [...old, { name: item.name, price: item.price, qty: 1 }];
    });
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const mal = language === "ml";

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        background: "#fff8ed",
        minHeight: "100vh",
        color: "#29251f",
      }}
    >
      <header
        style={{
          background: "#146b38",
          color: "white",
          padding: "24px 16px",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: 0 }}>🍗 BUBSHI FOOD HUB</h1>
        <p>{mal ? "രുചികരമായ ഭക്ഷണം, സ്നേഹത്തോടെ!" : "Delicious Food, Made with Love!"}</p>
        <button
          onClick={() => setLanguage(mal ? "en" : "ml")}
          style={{
            padding: "10px 18px",
            borderRadius: 8,
            border: 0,
            cursor: "pointer",
          }}
        >
          {mal ? "English" : "മലയാളം"}
        </button>
      </header>

      <main style={{ padding: 16, maxWidth: 650, margin: "auto" }}>
        <h2>{mal ? "ഇന്നത്തെ മെനു" : "Today's Menu"}</h2>

        {menu.map((item) => (
          <div
            key={item.name}
            style={{
              background: "white",
              padding: 14,
              marginBottom: 10,
              borderRadius: 12,
              boxShadow: "0 2px 7px #00000012",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div>
              <strong>{mal ? item.malayalam : item.name}</strong>
              <p style={{ margin: "8px 0 0", color: "#146b38" }}>
                ₹{item.price}
              </p>
            </div>

            <button
              onClick={() => addToCart(item)}
              style={{
                background: "#e77720",
                color: "white",
                border: 0,
                padding: "10px 14px",
                borderRadius: 8,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {mal ? "ചേർക്കുക +" : "Add +"}
            </button>
          </div>
        ))}

        <section
          style={{
            background: "#ffffff",
            padding: 18,
            borderRadius: 12,
            marginTop: 22,
          }}
        >
          <h2>{mal ? "🛒 നിങ്ങളുടെ ഓർഡർ" : "🛒 Your Order"}</h2>

          {cart.length === 0 ? (
            <p>{mal ? "വിഭവങ്ങൾ തിരഞ്ഞെടുക്കുക." : "Add items to your order."}</p>
          ) : (
            cart.map((item) => (
              <p key={item.name}>
                {item.name} × {item.qty} = ₹{item.price * item.qty}
              </p>
            ))
          )}

          <h3>
            {mal ? "ആകെ തുക" : "Total"}: ₹{total}
          </h3>

          <a
            href={`https://wa.me/919975587563?text=${encodeURIComponent(
              "BUBSHI FOOD HUB Order\n" +
                cart
                  .map(
                    (item) =>
                      `${item.name} x ${item.qty} = ₹${item.price * item.qty}`
                  )
                  .join("\n") +
                `\nTotal: ₹${total}`
            )}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "block",
              textAlign: "center",
              background: "#168b48",
              color: "white",
              textDecoration: "none",
              padding: 14,
              borderRadius: 10,
              marginTop: 12,
            }}
          >
            {mal ? "WhatsApp വഴി ഓർഡർ ചെയ്യുക" : "Order via WhatsApp"}
          </a>
        </section>

        <footer style={{ textAlign: "center", padding: 24 }}>
          <p>📍 Stationkadavu Morning Fish Market</p>
          <p>📞 9975587563</p>
          <p>© BUBSHI FOOD HUB</p>
        </footer>
      </main>
    </div>
  );
}

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
              }
