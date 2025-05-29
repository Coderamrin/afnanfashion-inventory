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
  const [printType, setPrintType] = useState("all");

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

  const getTotalAmount = (data) => {
    return data.reduce((sum, item) => sum + item.total, 0);
  };

  const handlePrint = () => {
    window.print();
  };

  const getFilteredEntries = () => {
    if (printType === "monthly") {
      const now = new Date();
      const month = now.getMonth();
      const year = now.getFullYear();
      return entries.filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() === month && d.getFullYear() === year;
      });
    }
    return entries;
  };

  const filteredEntries = getFilteredEntries();

  return (
    <div className="p-4 print:p-0 print:bg-white">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border print:border-none print:shadow-none">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-700 print:text-black">
            🛍️ আফনান ফ্যাশন
          </h1>
          <div className="flex gap-2 print:hidden">
            <select
              className="border px-2 py-1 rounded-md"
              value={printType}
              onChange={(e) => setPrintType(e.target.value)}
            >
              <option value="all">✅ সব হিসাব</option>
              <option value="monthly">📆 এই মাসের রিপোর্ট</option>
            </select>
            <button
              onClick={handlePrint}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
            >
              🖨️ প্রিন্ট করুন
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden">
          <select
            className="p-3 border rounded-lg"
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
            className="p-3 border rounded-lg"
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
            className="p-3 border rounded-lg"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="text-center mt-4 print:hidden">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-xl"
            onClick={addEntry}
          >
            ✅ যোগ করুন
          </button>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3 border-b pb-2 print:border-black print:text-black text-indigo-600">
            📋 হিসাব তালিকা
          </h2>
          {filteredEntries.length === 0 ? (
            <p className="text-gray-500 text-center">তালিকায় কোন তথ্য নেই</p>
          ) : (
            <table className="w-full text-sm border border-gray-300 print:text-xs">
              <thead className="bg-indigo-200 print:bg-gray-100">
                <tr>
                  <th className="border p-2">তারিখ</th>
                  <th className="border p-2">মাল</th>
                  <th className="border p-2">পরিমাণ</th>
                  <th className="border p-2">দাম</th>
                  <th className="border p-2">মোট</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="even:bg-indigo-50 print:even:bg-white"
                  >
                    <td className="border p-2">{entry.date}</td>
                    <td className="border p-2">{entry.product}</td>
                    <td className="border p-2">{entry.quantity}</td>
                    <td className="border p-2">৳{entry.price}</td>
                    <td className="border p-2 font-semibold">৳{entry.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {filteredEntries.length > 0 && (
          <div className="mt-6 text-right font-bold text-lg text-indigo-700 print:text-black">
            মোট টাকার পরিমাণ:{" "}
            <span className="text-red-600">
              ৳{getTotalAmount(filteredEntries)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
