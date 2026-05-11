import { Palette, Type } from "lucide-react";
import { fontOptions, themeOptions } from "../data/defaultResume";

export default function ThemePanel({ theme, setTheme, font, setFont }) {
  return (
    <section className="control-section">
      <div className="control-heading">
        <Palette size={18} />
        <h3>Theme</h3>
      </div>
      <div className="swatch-grid" aria-label="Theme colors">
        {themeOptions.map((option) => (
          <button
            type="button"
            className={`swatch ${theme.name === option.name ? "is-active" : ""}`}
            key={option.name}
            onClick={() => setTheme(option)}
            title={option.name}
            style={{ "--swatch-a": option.accent, "--swatch-b": option.secondary }}
          />
        ))}
      </div>
      <label className="select-label">
        <Type size={16} />
        <span>Resume font</span>
        <select value={font.label} onChange={(event) => setFont(fontOptions.find((item) => item.label === event.target.value))}>
          {fontOptions.map((option) => (
            <option key={option.label}>{option.label}</option>
          ))}
        </select>
      </label>
    </section>
  );
}
