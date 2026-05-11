import { forwardRef } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { sectionLabels } from "../data/defaultResume";

const ResumePreview = forwardRef(function ResumePreview({ resume, sectionOrder, template }, ref) {
  return (
    <article ref={ref} className={`resume-page template-${template}`}>
      <header className="resume-header">
        <div>
          <h2>{resume.personal.fullName}</h2>
          <p>{resume.personal.headline}</p>
          <div className="resume-contact">
            {resume.personal.email && (
              <span>
                <Mail size={13} />
                {resume.personal.email}
              </span>
            )}
            {resume.personal.phone && (
              <span>
                <Phone size={13} />
                {resume.personal.phone}
              </span>
            )}
            {resume.personal.location && (
              <span>
                <MapPin size={13} />
                {resume.personal.location}
              </span>
            )}
          </div>
        </div>
        {resume.personal.profileImage && <img className="resume-avatar" src={resume.personal.profileImage} alt="" />}
      </header>

      <div className="resume-body">
        {sectionOrder.map((section) => (
          <ResumeSection key={section} section={section} resume={resume} />
        ))}
      </div>
    </article>
  );
});

function ResumeSection({ section, resume }) {
  if (section === "about") {
    return (
      <section className="resume-section">
        <h3>{sectionLabels[section]}</h3>
        <p>{resume.about}</p>
      </section>
    );
  }

  if (section === "skills") {
    return (
      <section className="resume-section">
        <h3>{sectionLabels[section]}</h3>
        <div className="skill-pills">
          {resume.skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>
    );
  }

  if (section === "education") {
    return (
      <section className="resume-section">
        <h3>{sectionLabels[section]}</h3>
        {resume.education.map((item, index) => (
          <div className="resume-item" key={`${item.school}-${index}`}>
            <div>
              <strong>{item.degree}</strong>
              <span>{item.school} · {item.location}</span>
            </div>
            <em>{item.start} - {item.end}</em>
            <p>{item.details}</p>
          </div>
        ))}
      </section>
    );
  }

  if (section === "experience") {
    return (
      <section className="resume-section">
        <h3>{sectionLabels[section]}</h3>
        {resume.experience.map((item, index) => (
          <div className="resume-item" key={`${item.company}-${index}`}>
            <div>
              <strong>{item.title}</strong>
              <span>{item.company} · {item.location}</span>
            </div>
            <em>{item.start} - {item.end}</em>
            <p>{item.description}</p>
          </div>
        ))}
      </section>
    );
  }

  if (section === "projects") {
    return (
      <section className="resume-section">
        <h3>{sectionLabels[section]}</h3>
        {resume.projects.map((item, index) => (
          <div className="resume-item" key={`${item.name}-${index}`}>
            <div>
              <strong>{item.name}</strong>
              <span>{item.role} · {item.link}</span>
            </div>
            <em>{item.start} - {item.end}</em>
            <p>{item.description}</p>
          </div>
        ))}
      </section>
    );
  }

  if (section === "certifications") {
    return (
      <section className="resume-section">
        <h3>{sectionLabels[section]}</h3>
        {resume.certifications.map((item, index) => (
          <div className="resume-item compact-item" key={`${item.name}-${index}`}>
            <strong>{item.name}</strong>
            <span>{item.issuer} · {item.year}</span>
          </div>
        ))}
      </section>
    );
  }

  if (section === "achievements") {
    return (
      <section className="resume-section">
        <h3>{sectionLabels[section]}</h3>
        <ul>
          {resume.achievements.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="resume-section">
      <h3>{sectionLabels[section]}</h3>
      <div className="link-list">
        {resume.links.map((item, index) => (
          <span key={`${item.label}-${index}`}>
            <strong>{item.label}</strong>
            {item.url}
          </span>
        ))}
      </div>
    </section>
  );
}

export default ResumePreview;
