import { GripVertical, ImagePlus, Plus, Trash2 } from "lucide-react";
import { sectionLabels } from "../data/defaultResume";

const emptyItems = {
  education: { school: "", degree: "", location: "", start: "", end: "", details: "" },
  projects: { name: "", role: "", start: "", end: "", link: "", description: "" },
  experience: { company: "", title: "", location: "", start: "", end: "", description: "" },
  certifications: { name: "", issuer: "", year: "" },
  links: { label: "", url: "" }
};

const fieldMaps = {
  education: ["school", "degree", "location", "start", "end", "details"],
  projects: ["name", "role", "start", "end", "link", "description"],
  experience: ["company", "title", "location", "start", "end", "description"],
  certifications: ["name", "issuer", "year"],
  links: ["label", "url"]
};

export default function ResumeForm({ resume, setResume, sectionOrder, setSectionOrder }) {
  const updatePersonal = (field, value) => {
    setResume((current) => ({
      ...current,
      personal: { ...current.personal, [field]: value }
    }));
  };

  const updateField = (field, value) => {
    setResume((current) => ({ ...current, [field]: value }));
  };

  const updateListItem = (section, index, field, value) => {
    setResume((current) => ({
      ...current,
      [section]: current[section].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addItem = (section) => {
    setResume((current) => ({
      ...current,
      [section]: [...current[section], { ...emptyItems[section] }]
    }));
  };

  const removeItem = (section, index) => {
    setResume((current) => ({
      ...current,
      [section]: current[section].filter((_, itemIndex) => itemIndex !== index)
    }));
  };

  const handleImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updatePersonal("profileImage", reader.result);
    reader.readAsDataURL(file);
  };

  const onDragStart = (event, section) => {
    event.dataTransfer.setData("text/plain", section);
  };

  const onDrop = (event, targetSection) => {
    const dragged = event.dataTransfer.getData("text/plain");
    if (!dragged || dragged === targetSection) return;
    const next = [...sectionOrder];
    const from = next.indexOf(dragged);
    const to = next.indexOf(targetSection);
    next.splice(from, 1);
    next.splice(to, 0, dragged);
    setSectionOrder(next);
  };

  return (
    <div className="form-stack">
      <section className="form-section">
        <h4>Personal Information</h4>
        <div className="profile-upload">
          <label className="image-drop">
            {resume.personal.profileImage ? (
              <img src={resume.personal.profileImage} alt="Profile preview" />
            ) : (
              <ImagePlus size={28} />
            )}
            <input type="file" accept="image/*" onChange={handleImage} />
          </label>
          <span>Profile image</span>
        </div>
        <div className="input-grid">
          {[
            ["fullName", "Full name"],
            ["headline", "Professional headline"],
            ["roleTarget", "Target role"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["location", "Location"],
            ["website", "Website"],
            ["linkedin", "LinkedIn"],
            ["github", "GitHub"]
          ].map(([field, label]) => (
            <label key={field}>
              <span>{label}</span>
              <input value={resume.personal[field]} onChange={(event) => updatePersonal(field, event.target.value)} />
            </label>
          ))}
        </div>
      </section>

      <section className="form-section">
        <h4>About Me</h4>
        <textarea value={resume.about} onChange={(event) => updateField("about", event.target.value)} rows={5} />
      </section>

      <section className="form-section">
        <h4>Skills</h4>
        <textarea
          value={resume.skills.join(", ")}
          onChange={(event) =>
            updateField(
              "skills",
              event.target.value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            )
          }
          rows={3}
        />
      </section>

      <section className="form-section">
        <h4>Drag Section Arrangement</h4>
        <div className="drag-list">
          {sectionOrder.map((section) => (
            <button
              type="button"
              draggable
              key={section}
              onDragStart={(event) => onDragStart(event, section)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => onDrop(event, section)}
            >
              <GripVertical size={16} />
              {sectionLabels[section]}
            </button>
          ))}
        </div>
      </section>

      <ListSection section="education" resume={resume} updateListItem={updateListItem} addItem={addItem} removeItem={removeItem} />
      <ListSection section="experience" resume={resume} updateListItem={updateListItem} addItem={addItem} removeItem={removeItem} />
      <ListSection section="projects" resume={resume} updateListItem={updateListItem} addItem={addItem} removeItem={removeItem} />
      <ListSection section="certifications" resume={resume} updateListItem={updateListItem} addItem={addItem} removeItem={removeItem} />

      <section className="form-section">
        <div className="section-line">
          <h4>Achievements</h4>
          <button
            type="button"
            onClick={() => setResume((current) => ({ ...current, achievements: [...current.achievements, ""] }))}
          >
            <Plus size={16} />
          </button>
        </div>
        {resume.achievements.map((item, index) => (
          <div className="inline-row" key={`achievement-${index}`}>
            <textarea
              value={item}
              onChange={(event) =>
                setResume((current) => ({
                  ...current,
                  achievements: current.achievements.map((achievement, itemIndex) =>
                    itemIndex === index ? event.target.value : achievement
                  )
                }))
              }
              rows={2}
            />
            <button
              className="icon-button danger"
              type="button"
              onClick={() =>
                setResume((current) => ({
                  ...current,
                  achievements: current.achievements.filter((_, itemIndex) => itemIndex !== index)
                }))
              }
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </section>

      <ListSection section="links" resume={resume} updateListItem={updateListItem} addItem={addItem} removeItem={removeItem} />
    </div>
  );
}

function ListSection({ section, resume, updateListItem, addItem, removeItem }) {
  return (
    <section className="form-section">
      <div className="section-line">
        <h4>{sectionLabels[section]}</h4>
        <button type="button" onClick={() => addItem(section)} aria-label={`Add ${sectionLabels[section]}`}>
          <Plus size={16} />
        </button>
      </div>

      {resume[section].map((item, index) => (
        <div className="nested-editor" key={`${section}-${index}`}>
          <div className="input-grid">
            {fieldMaps[section].map((field) => {
              const label = field.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
              const isLong = field === "description" || field === "details";
              return (
                <label key={field} className={isLong ? "wide" : ""}>
                  <span>{label}</span>
                  {isLong ? (
                    <textarea value={item[field]} onChange={(event) => updateListItem(section, index, field, event.target.value)} rows={3} />
                  ) : (
                    <input value={item[field]} onChange={(event) => updateListItem(section, index, field, event.target.value)} />
                  )}
                </label>
              );
            })}
          </div>
          <button className="remove-button" type="button" onClick={() => removeItem(section, index)}>
            <Trash2 size={16} />
            Remove
          </button>
        </div>
      ))}
    </section>
  );
}
