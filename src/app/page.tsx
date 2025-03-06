"use client";

import Link from "next/link";
import { useState } from "react";

const HomePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#212121] text-[#f5f5f5]">
      <section className="text-center py-20 bg-[#333] rounded-lg mx-6 my-6">
        <h1 className="text-3xl font-bold mb-4">Welcome to Ikshana</h1>
        <p className="text-lg mb-6">
          Your companion for monitoring your child's health, growth, and daily routines
        </p>
        <a href="/Login">
          <button className="bg-white text-black px-6 py-2 rounded-md font-bold hover:scale-105 transition">
            Get Started
          </button>
        </a>
      </section>

      <section className="py-16 mx-6">
        <h2 className="text-2xl text-center font-bold mb-8">Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 bg-[#333] rounded-lg shadow-md text-center hover:scale-105 transition">
            <h3 className="text-lg font-bold mb-2">Health Monitoring</h3>
            <p>Track Sleep & Feeding Habits effortlessly!</p>
          </div>
          <div className="p-6 bg-[#333] rounded-lg shadow-md text-center hover:scale-105 transition">
            <h3 className="text-lg font-bold mb-2">Growth Tracking</h3>
            <p>Monitor your child's growth with height and weight percentiles.</p>
          </div>
          <div className="p-6 bg-[#333] rounded-lg shadow-md text-center hover:scale-105 transition">
            <h3 className="text-lg font-bold mb-2">Medication Management</h3>
            <p>Set reminders for medications and track health progress easily.</p>
          </div>
          <div className="p-6 bg-[#333] rounded-lg shadow-md text-center hover:scale-105 transition">
            <h3 className="text-lg font-bold mb-2">Data Insights</h3>
            <p>Visualise trends with intuitive graphs and detailed reports.</p>
          </div>
        </div>
      </section>

      <section className="text-center py-16 bg-[#333] rounded-lg mx-6 my-6">
        <h2 className="text-2xl font-bold mb-8">Quick Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-[#444] rounded-lg shadow-md hover:scale-105 transition">
            <h3 className="text-lg font-bold">80%</h3>
            <p>Health Monitoring</p>
          </div>
          <div className="p-6 bg-[#444] rounded-lg shadow-md hover:scale-105 transition">
            <h3 className="text-lg font-bold">95%</h3>
            <p>Growth Tracking</p>
          </div>
          <div className="p-6 bg-[#444] rounded-lg shadow-md hover:scale-105 transition">
            <h3 className="text-lg font-bold">70%</h3>
            <p>Medication Management</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;