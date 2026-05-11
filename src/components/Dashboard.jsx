import { motion } from "framer-motion";
import { Download, Save, Server } from "lucide-react";
import ResumeForm from "./ResumeForm";
import ResumePreview from "./ResumePreview";
import TemplatePicker from "./TemplatePicker";
import ThemePanel from "./ThemePanel";
import AIAssistant from "./AIAssistant";

export default function Dashboard({
  resume,
  setResume,
  sectionOrder,
  setSectionOrder,
  template,
  setTemplate,
  theme,
  setTheme,
  font,
  setFont,
  previewRef,
  onDownload,
  onBackendPdf,
  onSave,
  showToast
}) {
  return (
    <section className="builder" id="builder">
      <div className="section-heading">
        <span className="eyebrow">Production workspace</span>
        <h2>Editor, AI guidance, and resume preview in one responsive dashboard.</h2>
      </div>

      <div className="dashboard-grid">
        <motion.aside
          className="builder-sidebar glass-panel"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <TemplatePicker selected={template} onChange={setTemplate} />
          <ThemePanel theme={theme} setTheme={setTheme} font={font} setFont={setFont} />
          <AIAssistant resume={resume} setResume={setResume} showToast={showToast} />
        </motion.aside>

        <motion.div
          className="editor-column glass-panel"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="panel-title-row">
            <div>
              <span className="eyebrow">Resume data</span>
              <h3>Builder form</h3>
            </div>
            <button className="ghost-button" type="button" onClick={onSave}>
              <Save size={16} />
              Save
            </button>
          </div>
          <ResumeForm
            resume={resume}
            setResume={setResume}
            sectionOrder={sectionOrder}
            setSectionOrder={setSectionOrder}
          />
        </motion.div>

        <motion.div
          className="preview-column"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="preview-toolbar glass-panel">
            <div>
              <span className="eyebrow">Live preview</span>
              <h3>Recruiter view</h3>
            </div>
            <div className="toolbar-actions">
              <button className="ghost-button" type="button" onClick={onBackendPdf}>
                <Server size={16} />
                Backend PDF
              </button>
              <button className="primary-button compact" type="button" onClick={onDownload}>
                <Download size={16} />
                PDF
              </button>
            </div>
          </div>
          <ResumePreview
            ref={previewRef}
            resume={resume}
            sectionOrder={sectionOrder}
            template={template}
          />
        </motion.div>
      </div>
    </section>
  );
}
