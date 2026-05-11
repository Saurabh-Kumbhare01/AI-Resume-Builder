import { LayoutTemplate } from "lucide-react";
import { templateOptions } from "../data/defaultResume";

export default function TemplatePicker({ selected, onChange }) {
  return (
    <section className="control-section" id="templates">
      <div className="control-heading">
        <LayoutTemplate size={18} />
        <h3>Templates</h3>
      </div>
      <div className="template-list">
        {templateOptions.map((template) => (
          <button
            className={`template-card ${selected === template.id ? "is-active" : ""}`}
            type="button"
            key={template.id}
            onClick={() => onChange(template.id)}
          >
            <span className={`template-thumb ${template.id}`}>
              <i />
              <i />
              <i />
            </span>
            <span>
              <strong>{template.name}</strong>
              <small>{template.description}</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
