"use client";

import { useTheme } from "next-themes";

export default function ThemeToggle() {
    const { setTheme } = useTheme();
    const handleChange = (e) => {
      const value = e.target.value;
      if (value === "light" || value === "dark" || value === "system") {
        setTheme(value);
      }
    };
    return (
      <div>
        <select onChange={handleChange} className="theme-select">
          <option value="light" >Light</option>
          <option value="dark" >Dark</option>
          <option value="system" >System</option>
        </select>
        <h1>Themes</h1>
      </div>
    );
  }
  