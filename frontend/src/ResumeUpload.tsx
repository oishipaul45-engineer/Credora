
import { useRef, useState } from "react";

const API = "http://127.0.0.1:8000";

interface SuggestedSkill {
  name: string;
  category: string;
}

interface ParsedResume {
  email: string | null;
  phone: string | null;
  education: string | null;
  suggested_skills: SuggestedSkill[];
}

interface ResumeUploadProps {
  token: string;
  onApplied: () => void;
}

function getErrorMessage(data: any, fallback: string) {
  if (typeof data?.detail === "string") return data.detail;

  if (Array.isArray(data?.detail)) {
    return data.detail.map((item: any) => item.msg).join(", ");
  }

  return fallback;
}

export default function ResumeUpload({
  token,
  onApplied,
}: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [parsed, setParsed] = useState<ParsedResume | null>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [education, setEducation] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const chooseFile = (selected: File | null) => {
    setError("");
    setSuccess("");
    setParsed(null);
    setFile(null);
    setSelectedSkills([]);

    if (!selected) return;

    const extension = selected.name.split(".").pop()?.toLowerCase();

    if (!["pdf", "docx"].includes(extension || "")) {
      setError("Please select a PDF or DOCX file.");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError("Your resume must be smaller than 5 MB.");
      return;
    }

    setFile(selected);
  };

  const analyzeResume = async () => {
    if (!file) {
      setError("Choose your resume first.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API}/resume/analyze`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, "Could not analyze your resume.")
        );
      }

      const result = data.parsed as ParsedResume;

      setParsed(result);
      setEmail(result.email || "");
      setPhone(result.phone || "");
      setEducation(result.education || "");
      setSelectedSkills(
        result.suggested_skills.map((skill) => skill.name)
      );

      setSuccess(
        "Your resume has been analyzed. Review the details below."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while analyzing your resume."
      );
    } finally {
      setUploading(false);
    }
  };

  const toggleSkill = (name: string) => {
    setSelectedSkills((current) =>
      current.includes(name)
        ? current.filter((skill) => skill !== name)
        : [...current, name]
    );
  };

  const applyResume = async () => {
    if (!parsed) return;

    setApplying(true);
    setError("");
    setSuccess("");

    try {
      const profileUpdates: Record<string, string> = {};

      if (email.trim()) profileUpdates.email = email.trim();
      if (phone.trim()) profileUpdates.phone = phone.trim();
      if (education.trim()) profileUpdates.education = education.trim();

      if (Object.keys(profileUpdates).length > 0) {
        const profileResponse = await fetch(`${API}/profile/me`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profileUpdates),
        });

        const profileData = await profileResponse.json().catch(() => ({}));

        if (!profileResponse.ok) {
          throw new Error(
            getErrorMessage(
              profileData,
              "Could not update your profile."
            )
          );
        }
      }

      const existingResponse = await fetch(`${API}/skills/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!existingResponse.ok) {
        throw new Error("Could not retrieve your existing skills.");
      }

      const existingSkills = await existingResponse.json();

      const existingNames = new Set(
        (Array.isArray(existingSkills) ? existingSkills : []).map(
          (skill: any) => skill.name.trim().toLowerCase()
        )
      );

      const skillsToAdd = parsed.suggested_skills.filter(
        (skill) =>
          selectedSkills.includes(skill.name) &&
          !existingNames.has(skill.name.toLowerCase())
      );

      for (const skill of skillsToAdd) {
        const response = await fetch(`${API}/skills/me`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: skill.name,
            category: skill.category,
            proficiency_level: "Beginner",
            description: "Identified from uploaded resume.",
          }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));

          throw new Error(
            getErrorMessage(data, `Could not add ${skill.name}.`)
          );
        }
      }

      setSuccess(
        `Profile updated. ${skillsToAdd.length} new skill(s) added.`
      );

      onApplied();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not apply your resume information."
      );
    } finally {
      setApplying(false);
    }
  };

  return (
    <section className="resume-intelligence">
      <style>{`
        .resume-intelligence {
          margin: 0 0 35px;
          padding: 27px;
          background: #fbf6ec;
          border: 1px solid rgba(32,32,43,.14);
          color: #20202b;
        }

        .resume-intelligence *,
        .resume-intelligence *::before,
        .resume-intelligence *::after {
          box-sizing: border-box;
        }

        .resume-kicker {
          color: #3449e8;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.8px;
        }

        .resume-intelligence h2 {
          margin: 12px 0 8px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 27px;
          letter-spacing: -1.2px;
        }

        .resume-intelligence h2 em {
          color: #f05a35;
          font-style: normal;
        }

        .resume-description {
          max-width: 600px;
          color: #77716c;
          font-size: 13px;
          line-height: 1.7;
        }

        .resume-upload-area {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          margin-top: 22px;
        }

        .resume-file-button,
        .resume-analyze-button,
        .resume-apply-button {
          min-height: 45px;
          padding: 0 18px;
          border: 1px solid #20202b;
          background: #20202b;
          color: #fbf6ec;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          cursor: pointer;
          transition: .2s ease;
        }

        .resume-file-button {
          background: transparent;
          color: #20202b;
        }

        .resume-file-button:hover {
          background: #d7ed50;
        }

        .resume-analyze-button:hover,
        .resume-apply-button:hover {
          background: #3449e8;
          border-color: #3449e8;
        }

        .resume-analyze-button:disabled,
        .resume-apply-button:disabled {
          opacity: .5;
          cursor: not-allowed;
        }

        .resume-file-name {
          color: #77716c;
          font-size: 12px;
          overflow-wrap: anywhere;
        }

        .resume-message {
          margin-top: 16px;
          padding: 12px 14px;
          font-size: 12px;
          line-height: 1.6;
        }

        .resume-error {
          background: rgba(240,90,53,.1);
          border-left: 3px solid #f05a35;
          color: #a83b25;
        }

        .resume-success {
          background: rgba(215,237,80,.2);
          border-left: 3px solid #9eb51f;
          color: #424b12;
        }

        .resume-preview {
          margin-top: 25px;
          padding-top: 22px;
          border-top: 1px solid rgba(32,32,43,.13);
        }

        .resume-preview-heading {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 10px;
          align-items: center;
          margin-bottom: 18px;
        }

        .resume-preview-heading h3 {
          margin: 0;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 19px;
        }

        .resume-preview-fields {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 15px;
        }

        .resume-preview-fields label {
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: #77716c;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .resume-preview-fields input,
        .resume-preview-fields textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid rgba(32,32,43,.17);
          border-radius: 0;
          background: #fffdf8;
          color: #20202b;
          font: inherit;
          font-size: 13px;
          outline: none;
        }

        .resume-preview-fields input:focus,
        .resume-preview-fields textarea:focus {
          border-color: #3449e8;
        }

        .resume-education-field {
          grid-column: 1 / -1;
        }

        .resume-skill-heading {
          margin: 24px 0 13px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 16px;
        }

        .resume-skill-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .resume-skill-option {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 11px;
          border: 1px solid rgba(32,32,43,.18);
          background: transparent;
          color: #20202b;
          font-size: 11px;
          cursor: pointer;
        }

        .resume-skill-option.selected {
          border-color: #3449e8;
          background: rgba(52,73,232,.08);
        }

        .resume-skill-option input {
          accent-color: #3449e8;
        }

        .resume-apply-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-top: 25px;
        }

        .resume-apply-note {
          color: #77716c;
          font-size: 11px;
          line-height: 1.6;
        }

        @media(max-width: 600px) {
          .resume-intelligence { padding: 20px; }
          .resume-preview-fields { grid-template-columns: 1fr; }
          .resume-education-field { grid-column: auto; }
          .resume-apply-button { width: 100%; }
        }
      `}</style>

      <span className="resume-kicker">
        CREDORA INTELLIGENCE / 006
      </span>

      <h2>
        Let your resume<br />
        <em>tell your story.</em>
      </h2>

      <p className="resume-description">
        Upload your resume and let Credora identify your skills,
        education and contact details. Review everything before
        adding it to your professional identity.
      </p>

      <div className="resume-upload-area">
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          hidden
          onChange={(event) =>
            chooseFile(event.target.files?.[0] || null)
          }
        />

        <button
          type="button"
          className="resume-file-button"
          onClick={() => inputRef.current?.click()}
        >
          CHOOSE RESUME ↗
        </button>

        <span className="resume-file-name">
          {file ? file.name : "PDF or DOCX · Maximum 5 MB"}
        </span>

        <button
          type="button"
          className="resume-analyze-button"
          disabled={!file || uploading}
          onClick={() => void analyzeResume()}
        >
          {uploading ? "ANALYZING..." : "ANALYZE RESUME ↗"}
        </button>
      </div>

      {error && (
        <div className="resume-message resume-error">
          {error}
        </div>
      )}

      {success && (
        <div className="resume-message resume-success">
          {success}
        </div>
      )}

      {parsed && (
        <div className="resume-preview">
          <div className="resume-preview-heading">
            <h3>Your extracted information</h3>
            <span className="resume-kicker">REVIEW BEFORE APPLYING</span>
          </div>

          <div className="resume-preview-fields">
            <label>
              EMAIL ADDRESS
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="No email detected"
              />
            </label>

            <label>
              PHONE NUMBER
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="No phone detected"
              />
            </label>

            <label className="resume-education-field">
              EDUCATION
              <textarea
                rows={3}
                value={education}
                onChange={(event) => setEducation(event.target.value)}
                placeholder="No education information detected"
              />
            </label>
          </div>

          <h4 className="resume-skill-heading">
            Skills found ({parsed.suggested_skills.length})
          </h4>

          {parsed.suggested_skills.length === 0 ? (
            <p className="resume-description">
              No matching skills were found. You can still update
              your profile details.
            </p>
          ) : (
            <div className="resume-skill-list">
              {parsed.suggested_skills.map((skill) => (
                <label
                  className={`resume-skill-option ${
                    selectedSkills.includes(skill.name) ? "selected" : ""
                  }`}
                  key={skill.name}
                >
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(skill.name)}
                    onChange={() => toggleSkill(skill.name)}
                  />
                  {skill.name}
                  <span>· {skill.category}</span>
                </label>
              ))}
            </div>
          )}

          <div className="resume-apply-row">
            <span className="resume-apply-note">
              Only selected skills will be added.<br />
              Existing skills will not be duplicated.
            </span>

            <button
              type="button"
              className="resume-apply-button"
              disabled={applying}
              onClick={() => void applyResume()}
            >
              {applying ? "APPLYING..." : "APPLY TO MY PROFILE ↗"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
