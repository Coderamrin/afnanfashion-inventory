"use client";
import React, { useState, useEffect } from "react";

const productList = {
  "সাবিহা ফুল সেট": 1600,
  "সাবিহা হিজাব নিকাব": 800,
  "মুহতাহা ফুল সেট": 1610,
  "মুনতাহা হিজাব নিকাব": 810,
};

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");
  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("productEntries");
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("productEntries", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    const price = selectedProduct ? productList[selectedProduct] : 0;
    setTotal(quantity && price ? Number(quantity) * price : 0);
  }, [selectedProduct, quantity]);

  const addEntry = () => {
    const price = selectedProduct ? productList[selectedProduct] : 0;
    if (!selectedProduct || !quantity || !price || !date)
      return alert("সব তথ্য পূরণ করুন");
    const newEntry = {
      id: Date.now(),
      product: selectedProduct,
      quantity: Number(quantity),
      price: Number(price),
      total: Number(quantity) * Number(price),
      date,
    };
    setEntries([newEntry, ...entries]);
    setSelectedProduct("");
    setQuantity("");
    setDate("");
    setTotal(0);
  };

  const getTotalAmount = () => {
    return entries.reduce((sum, item) => sum + item.total, 0);
  };

  const groupedDates = Array.from(new Set(entries.map((e) => e.date)));
  const getDateColor = (date) => {
    const dateIndex = groupedDates.findIndex((d) => d === date);
    return dateIndex % 2 === 0 ? "bg-white" : "bg-indigo-50";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 p-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-2xl border border-indigo-200 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-indigo-700">
            🛍️ আফনান ফ্যাশন
          </h1>
          <p className="text-sm text-gray-600 mt-1">দৈনিক মাল হিসাব</p>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">মাল সিলেক্ট করুন</option>
            {Object.keys(productList).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <input
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="পরিমাণ"
          />

          <input
            className="p-3 border rounded-lg bg-gray-100"
            value={`৳ ${total}`}
            readOnly
          />

          <input
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="text-center">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 transition-all text-white font-bold py-3 px-6 rounded-xl shadow-md"
            onClick={addEntry}
          >
            ✅ যোগ করুন
          </button>
        </div>

        {/* Entry List Section */}
        <div>
          <h2 className="text-xl font-semibold mb-3 border-b pb-2 border-gray-300 text-indigo-600">
            📋 হিসাব তালিকা
          </h2>
          {entries.length === 0 ? (
            <p className="text-gray-500 text-center">এখনো কিছু যোগ করা হয়নি</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-300 shadow-sm rounded-lg overflow-hidden">
                <thead className="bg-indigo-200 text-indigo-900 font-semibold">
                  <tr>
                    <th className="border p-3">তারিখ</th>
                    <th className="border p-3">মাল</th>
                    <th className="border p-3">পরিমাণ</th>
                    <th className="border p-3">দাম</th>
                    <th className="border p-3">মোট</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr
                      key={entry.id}
                      className={`${getDateColor(
                        entry.date
                      )} hover:bg-indigo-100 transition-all`}
                    >
                      <td className="border p-2">{entry.date}</td>
                      <td className="border p-2">{entry.product}</td>
                      <td className="border p-2">{entry.quantity}</td>
                      <td className="border p-2">৳{entry.price}</td>
                      <td className="border p-2 font-semibold text-indigo-700">
                        ৳{entry.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Total Summary */}
        {entries.length > 0 && (
          <div className="text-right text-lg font-bold text-indigo-800 mt-4">
            মোট টাকার পরিমাণ:{" "}
            <span className="text-red-600">৳{getTotalAmount()}</span>
          </div>
        )}
      </div>
    </div>
  );
}
