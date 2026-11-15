
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import ResumeUpload from "./ResumeUpload";
import JobMatching from "./JobMatching";
import "./App.css";

const API = "http://127.0.0.1:8000";

interface Profile {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  headline: string | null;
  location: string | null;
  education: string | null;
  career_goal: string | null;
  about: string | null;
}

interface Skill {
  id: number;
  profile_id: number;
  name: string;
  category: string;
  proficiency_level: string;
  description: string | null;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
}

type Page =
  | "Overview"
  | "My Skills"
  | "Job Matching"
  | "Career Roadmap"
  | "Insights"
  | "Profile";

const navigation: { name: Page; symbol: string; number: string }[] = [
  { name: "Overview", symbol: "✳", number: "01" },
  { name: "My Skills", symbol: "◈", number: "02" },
  { name: "Job Matching", symbol: "◎", number: "03" },
  { name: "Career Roadmap", symbol: "↗", number: "04" },
  { name: "Insights", symbol: "◉", number: "05" },
  { name: "Profile", symbol: "✺", number: "06" },
];

const levelValue: Record<string, number> = {
  Beginner: 25,
  Intermediate: 55,
  Advanced: 80,
  Expert: 100,
};

const levelColor: Record<string, string> = {
  Beginner: "lime",
  Intermediate: "blue",
  Advanced: "orange",
  Expert: "violet",
};

const roadmap = [
  {
    number: "01",
    title: "Build your foundation",
    description:
      "Strengthen programming fundamentals, problem-solving and core technical concepts.",
    time: "START HERE",
    color: "lime",
    symbol: "✳",
  },
  {
    number: "02",
    title: "Create real things",
    description:
      "Turn your knowledge into projects. Build, experiment, break things and learn.",
    time: "NEXT CHAPTER",
    color: "blue",
    symbol: "◈",
  },
  {
    number: "03",
    title: "Develop your edge",
    description:
      "Explore advanced tools, deeper concepts and the skills that distinguish your work.",
    time: "LEVEL UP",
    color: "orange",
    symbol: "↗",
  },
  {
    number: "04",
    title: "Show the world",
    description:
      "Present your projects, document your progress and build a professional identity.",
    time: "YOUR NEXT MILESTONE",
    color: "violet",
    symbol: "✺",
  },
];

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "C"
  );
}

function getErrorMessage(data: any, fallback: string) {
  if (typeof data?.detail === "string") return data.detail;

  if (Array.isArray(data?.detail)) {
    return data.detail.map((item: any) => item.msg).join(", ");
  }

  return fallback;
}

function App() {
  const [page, setPage] = useState<Page>("Overview");

  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);

  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [logoutOpen, setLogoutOpen] = useState(false);

  const [skillForm, setSkillForm] = useState({
    name: "",
    category: "Programming",
    proficiency_level: "Beginner",
    description: "",
  });

  const [profileForm, setProfileForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    headline: "",
    location: "",
    education: "",
    career_goal: "",
    about: "",
  });

  const loadData = async (currentToken: string) => {
    setLoading(true);
    setError("");

    try {
      const headers = {
        Authorization: `Bearer ${currentToken}`,
      };

      const [profileResponse, skillsResponse] = await Promise.all([
        fetch(`${API}/profile/me`, { headers }),
        fetch(`${API}/skills/me`, { headers }),
      ]);

      if (
        profileResponse.status === 401 ||
        profileResponse.status === 403 ||
        skillsResponse.status === 401 ||
        skillsResponse.status === 403
      ) {
        localStorage.removeItem("credora_token");
        setToken(null);
        setProfile(null);
        setSkills([]);
        setError("");
        return;
      }

      if (!profileResponse.ok) {
        throw new Error("Could not load your profile. Please try again.");
      }

      if (!skillsResponse.ok) {
        throw new Error("Could not load your skills. Please try again.");
      }

      const profileData: Profile = await profileResponse.json();
      const skillsData: Skill[] = await skillsResponse.json();

      setProfile(profileData);
      setSkills(Array.isArray(skillsData) ? skillsData : []);

      setProfileForm({
        full_name: profileData.full_name ?? "",
        email: profileData.email ?? "",
        phone: profileData.phone ?? "",
        headline: profileData.headline ?? "",
        location: profileData.location ?? "",
        education: profileData.education ?? "",
        career_goal: profileData.career_goal ?? "",
        about: profileData.about ?? "",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading your account."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("credora_token");

    if (!savedToken) {
      setLoading(false);
      return;
    }

    setToken(savedToken);
    void loadData(savedToken);
  }, []);

  useEffect(() => {
    if (!notice) return;

    const timeout = window.setTimeout(() => setNotice(""), 3200);

    return () => window.clearTimeout(timeout);
  }, [notice]);

  useEffect(() => {
    if (!logoutOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLogoutOpen(false);
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [logoutOpen]);

  const handleAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setAuthError("");
    setAuthLoading(true);

    try {
      const endpoint =
        authMode === "signup" ? "/auth/signup" : "/auth/login";

      const body =
        authMode === "signup"
          ? {
              full_name: authName.trim(),
              email: authEmail.trim(),
              password: authPassword,
            }
          : {
              email: authEmail.trim(),
              password: authPassword,
            };

      const response = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            data,
            authMode === "signup"
              ? "Could not create your account."
              : "Invalid email or password."
          )
        );
      }

      const result = data as AuthResponse;

      if (!result.access_token) {
        throw new Error("The server did not return an access token.");
      }

      localStorage.setItem("credora_token", result.access_token);
      setToken(result.access_token);

      setAuthPassword("");
      setPage("Overview");

      await loadData(result.access_token);
    } catch (err) {
      setAuthError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("credora_token");

    setToken(null);
    setProfile(null);
    setSkills([]);
    setError("");
    setNotice("");
    setLogoutOpen(false);

    setAuthMode("login");
    setAuthPassword("");
    setAuthError("");
    setAuthName("");
    setAuthEmail("");
    setPage("Overview");
  };

  const completion = useMemo(() => {
    const fields = [
      profileForm.full_name,
      profileForm.email,
      profileForm.headline,
      profileForm.location,
      profileForm.education,
      profileForm.career_goal,
      profileForm.about,
    ];

    return Math.round(
      (fields.filter((field) => field.trim()).length / fields.length) * 100
    );
  }, [profileForm]);

  const advancedCount = skills.filter((skill) =>
    ["Advanced", "Expert"].includes(skill.proficiency_level)
  ).length;

  const categoriesCount = new Set(
    skills.map((skill) => skill.category)
  ).size;

  const addSkill = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!skillForm.name.trim()) {
      setNotice("Give your skill a name first.");
      return;
    }

    if (!token) return;

    setSaving(true);

    try {
      const response = await fetch(`${API}/skills/me`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: skillForm.name.trim(),
          category: skillForm.category,
          proficiency_level: skillForm.proficiency_level,
          description: skillForm.description.trim() || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(getErrorMessage(data, "Could not add this skill."));
      }

      setSkillForm({
        name: "",
        category: "Programming",
        proficiency_level: "Beginner",
        description: "",
      });

      await loadData(token);
      setNotice("New skill added to your universe ✳");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Could not add skill.");
    } finally {
      setSaving(false);
    }
  };

  const deleteSkill = async (skillId: number) => {
    if (!token) return;

    if (!window.confirm("Remove this skill from your profile?")) return;

    setSaving(true);

    try {
      const response = await fetch(`${API}/skills/item/${skillId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(getErrorMessage(data, "Could not delete this skill."));
      }

      setSkills((current) =>
        current.filter((skill) => skill.id !== skillId)
      );

      setNotice("Skill removed.");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Could not delete skill.");
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token || !profile) return;

    setSaving(true);

    try {
      const response = await fetch(`${API}/profile/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...profileForm,
          phone: profileForm.phone || null,
          headline: profileForm.headline || null,
          location: profileForm.location || null,
          education: profileForm.education || null,
          career_goal: profileForm.career_goal || null,
          about: profileForm.about || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(getErrorMessage(data, "Could not save your profile."));
      }

      await loadData(token);
      setNotice("Your identity has been updated ✳");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  const updateProfileField = (
    field: keyof typeof profileForm,
    value: string
  ) => {
    setProfileForm((current) => ({ ...current, [field]: value }));
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="loader-orbit">
          <span />
          <span />
          <span />
        </div>
        <div className="loading-brand">
          credora<span>®</span>
        </div>
        <p>Assembling your universe...</p>
      </main>
    );
  }

  if (!token || !profile) {
    return (
      <>
        <style>{`
          .auth-screen {
            min-height: 100vh;
            background: #f2eadb;
            color: #20202b;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 32px 20px;
            font-family: 'DM Sans', sans-serif;
            position: relative;
            overflow: hidden;
          }
          .auth-screen::before {
            content: "✳";
            position: absolute;
            font-size: 360px;
            color: rgba(52,73,232,.055);
            right: -65px;
            top: -115px;
            pointer-events: none;
          }
          .auth-screen::after {
            content: "C";
            position: absolute;
            font-family: 'Space Grotesk', sans-serif;
            font-size: 500px;
            font-weight: 700;
            color: rgba(240,90,53,.045);
            left: -120px;
            bottom: -240px;
            pointer-events: none;
          }
          .auth-card {
            width: 100%;
            max-width: 470px;
            padding: 46px;
            position: relative;
            z-index: 1;
            background: rgba(255,255,255,.64);
            border: 1px solid rgba(32,32,43,.12);
            border-radius: 8px;
            box-shadow: 0 25px 80px rgba(32,32,43,.09);
            animation: authAppear .6s ease both;
          }
          @keyframes authAppear {
            from { opacity: 0; transform: translateY(18px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .auth-brand {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 30px;
            font-weight: 800;
            letter-spacing: -2px;
          }
          .auth-brand span { color: #f05a35; }
          .auth-index {
            display: block;
            margin-top: 48px;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 2px;
            color: #3449e8;
          }
          .auth-card h1 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: clamp(36px, 8vw, 52px);
            line-height: 1.15;
            letter-spacing: -2px;
            margin: 14px 0 20px;
            display: block;
            color: #20202b !important;
            -webkit-text-fill-color: #20202b !important;
            opacity: 1 !important;
            visibility: visible !important;
            overflow: visible;
            min-height: 110px;
            position: relative;
            z-index: 2;
          }
          .auth-card h1 em {
            color: #f05a35 !important;
            -webkit-text-fill-color: #f05a35 !important;
            font-style: normal;
          }
          .auth-description {
            color: #686775;
            font-size: 14px;
            line-height: 1.7;
            margin-bottom: 30px;
          }
          .auth-form {
            display: flex;
            flex-direction: column;
            gap: 17px;
          }
          .auth-form label {
            display: flex;
            flex-direction: column;
            gap: 8px;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 1.1px;
          }
          .auth-form input {
            width: 100%;
            box-sizing: border-box;
            padding: 14px 15px;
            border: 1px solid rgba(32,32,43,.17);
            border-radius: 3px;
            outline: none;
            background: #fffdf8;
            color: #20202b;
            font: inherit;
            font-size: 14px;
            transition: border .2s, box-shadow .2s;
          }
          .auth-form input:focus {
            border-color: #3449e8;
            box-shadow: 0 0 0 3px rgba(52,73,232,.1);
          }
          .auth-submit {
            margin-top: 8px;
            width: 100%;
            border: 0;
            padding: 16px;
            background: #20202b;
            color: white;
            font: inherit;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 1.5px;
            cursor: pointer;
            transition: background .2s, transform .2s;
          }
          .auth-submit:hover {
            background: #3449e8;
            transform: translateY(-2px);
          }
          .auth-submit:disabled {
            opacity: .55;
            cursor: not-allowed;
            transform: none;
          }
          .auth-switch {
            text-align: center;
            margin-top: 24px;
            font-size: 13px;
            color: #686775;
          }
          .auth-switch button {
            border: 0;
            background: none;
            color: #3449e8;
            font: inherit;
            font-weight: 800;
            cursor: pointer;
            padding: 4px;
          }
          .auth-error {
            padding: 12px 14px;
            background: rgba(240,90,53,.1);
            border-left: 3px solid #f05a35;
            color: #a83b25;
            font-size: 13px;
            line-height: 1.5;
          }
          .auth-foot {
            margin-top: 30px;
            padding-top: 18px;
            border-top: 1px solid rgba(32,32,43,.12);
            display: flex;
            justify-content: space-between;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 1px;
            color: #8a8790;
          }
          @media(max-width: 520px) {
            .auth-card { padding: 30px 23px; }
            .auth-index { margin-top: 35px; }
          }
        `}</style>

        <main className="auth-screen">
          <section className="auth-card">
            <div className="auth-brand">
              credora<span>✳</span>
            </div>

            <span className="auth-index">
              YOUR PERSONAL UNIVERSE / 001
            </span>

            <h1>
              {authMode === "login" ? (
                <>
                  Welcome
                  <br />
                  <em>back.</em>
                </>
              ) : (
                <>
                  Find your
                  <br />
                  <em>beginning.</em>
                </>
              )}
            </h1>

            <p className="auth-description">
              {authMode === "login"
                ? "Your universe is waiting. Sign in and pick up where your story left off."
                : "Create your space. Collect your skills. Build an identity that is entirely yours."}
            </p>

            <form className="auth-form" onSubmit={handleAuth}>
              {authMode === "signup" && (
                <label>
                  YOUR NAME
                  <input
                    type="text"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                  />
                </label>
              )}

              <label>
                EMAIL ADDRESS
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </label>

              <label>
                PASSWORD
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete={
                    authMode === "login" ? "current-password" : "new-password"
                  }
                  minLength={6}
                  required
                />
              </label>

              {authError && (
                <div className="auth-error">{authError}</div>
              )}

              <button
                className="auth-submit"
                type="submit"
                disabled={authLoading}
              >
                {authLoading
                  ? "PLEASE WAIT..."
                  : authMode === "login"
                    ? "ENTER YOUR UNIVERSE ↗"
                    : "CREATE MY ACCOUNT ↗"}
              </button>
            </form>

            <div className="auth-switch">
              {authMode === "login"
                ? "New to Credora?"
                : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === "login" ? "signup" : "login");
                  setAuthError("");
                }}
              >
                {authMode === "login" ? "Create account" : "Sign in"}
              </button>
            </div>

            <div className="auth-foot">
              <span>© CREDORA 2026</span>
              <span>KEEP BECOMING ✳</span>
            </div>
          </section>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <main className="error-screen">
        <div className="error-art">!</div>
        <p className="eyebrow">A LITTLE COSMIC INTERRUPTION</p>
        <h1>We lost the signal.</h1>
        <p>{error}</p>
        <button
          className="button button-dark"
          onClick={() => token && void loadData(token)}
        >
          Try again ↗
        </button>
        <button
          className="button button-dark"
          onClick={() => setLogoutOpen(true)}
          style={{ marginLeft: 10 }}
        >
          Sign out
        </button>

        {logoutOpen && (
          <div className="logout-overlay" onClick={() => setLogoutOpen(false)}>
            <section
              className="logout-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="logout-title"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className="logout-close"
                onClick={() => setLogoutOpen(false)}
                aria-label="Close logout confirmation"
              >
                ×
              </button>
              <span className="logout-eyebrow">CREDORA / SESSION 001</span>
              <div className="logout-orbit-mark">✳</div>
              <h2 id="logout-title">
                Leaving your
                <br />
                <em>orbit?</em>
              </h2>
              <p>
                Your progress is right where you left it. Are you sure you
                want to end this session?
              </p>
              <button
                className="logout-stay"
                onClick={() => setLogoutOpen(false)}
              >
                STAY A LITTLE LONGER <span>✳</span>
              </button>
              <button className="logout-end" onClick={logout}>
                END SESSION <span>↗</span>
              </button>
              <span className="logout-footnote">YOUR UNIVERSE WILL BE HERE.</span>
            </section>
          </div>
        )}
      </main>
    );
  }

  const displayName = profile.full_name || "Explorer";

  return (
    <>
      <style>{`
        .logout-trigger {
          width: 100%;
          min-height: 43px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 0 13px;
          margin-top: 15px;
          border: 1px solid rgba(255,255,255,.2);
          background: rgba(255,255,255,.035);
          color: #f2eadb;
          cursor: pointer;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-align: left;
          transition: background .25s ease, border-color .25s ease,
            transform .25s ease;
          flex-shrink: 0;
          position: relative;
          z-index: 2;
        }
        .logout-trigger:hover {
          background: #f05a35;
          border-color: #f05a35;
          color: #fff;
          transform: translateY(-2px);
        }
        .logout-trigger-label {
          display: flex;
          align-items: center;
          gap: 9px;
        }
        .logout-trigger-symbol {
          color: #f05a35;
          font-size: 15px;
          transition: transform .35s ease, color .25s ease;
        }
        .logout-trigger:hover .logout-trigger-symbol {
          color: #fff;
          transform: rotate(90deg);
        }
        .logout-trigger-arrow {
          font-size: 15px;
          transition: transform .25s ease;
        }
        .logout-trigger:hover .logout-trigger-arrow {
          transform: translate(3px, -3px);
        }
        .logout-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 22px;
          background: rgba(17,17,27,.76);
          backdrop-filter: blur(9px);
          animation: logoutFade .25s ease both;
        }
        .logout-dialog {
          width: 100%;
          max-width: 430px;
          box-sizing: border-box;
          padding: 43px 42px 30px;
          position: relative;
          overflow: hidden;
          background: #f2eadb;
          color: #20202b;
          border: 1px solid rgba(255,255,255,.5);
          box-shadow: 0 30px 100px rgba(0,0,0,.3);
          animation: logoutRise .35s cubic-bezier(.2,.8,.2,1) both;
        }
        .logout-dialog::before {
          content: "";
          position: absolute;
          width: 190px;
          height: 190px;
          border: 1px solid rgba(52,73,232,.15);
          border-radius: 50%;
          right: -100px;
          top: -100px;
          box-shadow: 0 0 0 18px rgba(52,73,232,.035),
            0 0 0 38px rgba(52,73,232,.025);
          pointer-events: none;
        }
        .logout-close {
          position: absolute;
          top: 15px;
          right: 17px;
          width: 30px;
          height: 30px;
          border: 1px solid rgba(32,32,43,.18);
          background: transparent;
          color: #20202b;
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
          transition: background .2s, color .2s;
        }
        .logout-close:hover {
          background: #20202b;
          color: #f2eadb;
        }
        .logout-eyebrow {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 2px;
          color: #3449e8;
        }
        .logout-orbit-mark {
          width: 65px;
          height: 65px;
          display: grid;
          place-items: center;
          margin: 32px 0 20px;
          border-radius: 50%;
          background: #d7ed50;
          color: #20202b;
          font-size: 35px;
          animation: logoutSpin 15s linear infinite;
        }
        .logout-dialog h2 {
          margin: 0;
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(35px, 7vw, 47px);
          line-height: 1.04;
          letter-spacing: -2.5px;
          color: #20202b;
        }
        .logout-dialog h2 em {
          color: #f05a35;
          font-style: normal;
        }
        .logout-dialog p {
          margin: 18px 0 27px;
          max-width: 300px;
          color: #77716c;
          font-size: 13px;
          line-height: 1.8;
        }
        .logout-stay,
        .logout-end {
          width: 100%;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.2px;
          cursor: pointer;
          transition: background .2s, color .2s, transform .2s;
        }
        .logout-stay {
          border: 0;
          background: #20202b;
          color: #f2eadb;
        }
        .logout-stay span {
          color: #d7ed50;
          font-size: 16px;
        }
        .logout-stay:hover {
          background: #3449e8;
          transform: translateY(-2px);
        }
        .logout-end {
          margin-top: 9px;
          border: 1px solid rgba(32,32,43,.2);
          background: transparent;
          color: #20202b;
        }
        .logout-end span {
          color: #f05a35;
          font-size: 16px;
        }
        .logout-end:hover {
          border-color: #f05a35;
          background: rgba(240,90,53,.08);
          transform: translateY(-2px);
        }
        .logout-footnote {
          display: block;
          margin-top: 25px;
          text-align: center;
          color: #96908a;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 1.7px;
        }
        @keyframes logoutFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes logoutRise {
          from { opacity: 0; transform: translateY(18px) scale(.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes logoutSpin {
          to { transform: rotate(360deg); }
        }
        @media(max-width: 520px) {
          .logout-dialog { padding: 38px 25px 25px; }
        }
      `}</style>

      <div className="app-shell">
        <div className="background-noise" />

        <aside className="sidebar">
          <a
            className="brand"
            href="#"
            onClick={(event) => {
              event.preventDefault();
              setPage("Overview");
            }}
          >
            <span className="brand-symbol">c<span>✳</span></span>
            <span className="brand-word">credora<span>®</span></span>
          </a>

          <div className="sidebar-intro">
            <span className="sidebar-kicker">YOUR PERSONAL UNIVERSE</span>
            <span className="sidebar-orbit">✳</span>
          </div>

          <nav className="side-navigation" aria-label="Main navigation">
            <span className="nav-caption">EXPLORE</span>
            {navigation.map((item) => (
              <button
                key={item.name}
                className={`nav-item ${page === item.name ? "active" : ""}`}
                onClick={() => setPage(item.name)}
              >
                <span className="nav-number">{item.number}</span>
                <span className="nav-symbol">{item.symbol}</span>
                <span className="nav-label">{item.name}</span>
                {page === item.name && <span className="nav-arrow">↗</span>}
              </button>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <div className="sidebar-sticker">
              MAKE<br />YOUR<br /><span>MARK.</span>
            </div>

            <div className="sidebar-user">
              <div className="user-avatar">{getInitials(displayName)}</div>
              <div className="user-info">
                <strong>{displayName}</strong>
                <span>THE ORIGINAL YOU</span>
              </div>
              <span className="user-spark">✳</span>
            </div>

            <button
              type="button"
              className="logout-trigger"
              onClick={() => setLogoutOpen(true)}
              aria-label="Open logout confirmation"
            >
              <span className="logout-trigger-label">
                <span className="logout-trigger-symbol">✳</span>
                UNTIL NEXT ORBIT
              </span>
              <span className="logout-trigger-arrow">↗</span>
            </button>

            <div className="sidebar-footer">BUILT FOR WHAT'S NEXT. © 2026</div>
          </div>
        </aside>

        <main className="main-area">
          <header className="topbar">
            <div className="breadcrumb">
              <span>YOUR SPACE</span>
              <span className="breadcrumb-slash">/</span>
              <strong>{page.toUpperCase()}</strong>
            </div>

            <div className="topbar-right">
              <span className="live-indicator"><i /> YOUR UNIVERSE IS LIVE</span>
              <button
                className="top-avatar"
                onClick={() => setPage("Profile")}
                title="Open profile"
              >
                {getInitials(displayName)}
              </button>
            </div>
          </header>

          <div className="page-content">
            {notice && <div className="notice"><span>✳</span>{notice}</div>}

            {/* DASHBOARD */}
            {page === "Overview" && (
              <section className="overview-page dashboard-v2">
                <div className="dash-hero">
                  <div className="dash-hero-copy">
                    <div className="dash-kicker">
                      <span className="dash-kicker-dot" />
                      YOUR PERSONAL UNIVERSE
                      <span className="dash-kicker-line" />
                      VOL. 001
                    </div>

                    <p className="dash-date-label">A NEW DAY TO BECOME MORE.</p>

                    <h1>
                      Hello,
                      <br />
                      <span>{displayName.split(" ")[0] || "Explorer"}.</span>
                    </h1>

                    <p className="dash-description">
                      You are not a finished product. You're a collection of
                      ideas, skills, experiments and possibilities.
                    </p>

                    <div className="dash-hero-actions">
                      <button
                        className="dash-primary-button"
                        onClick={() => setPage("My Skills")}
                      >
                        Explore my universe <span>↗</span>
                      </button>
                      <button
                        className="dash-secondary-button"
                        onClick={() => setPage("Profile")}
                      >
                        Edit profile <span>→</span>
                      </button>
                    </div>

                    <div className="dash-hero-bottom">
                      <span>SCROLL TO DISCOVER</span>
                      <span className="dash-bottom-star">✳</span>
                      <span>01 — 06</span>
                    </div>
                  </div>

                  <div className="dash-art">
                    <div className="dash-art-top">
                      <span>FIG. 001</span>
                      <span>THE SHAPE OF POTENTIAL</span>
                    </div>

                    <div className="dash-art-image">
                      <img
                        src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1100&q=90"
                        alt="Cosmic landscape"
                      />
                    </div>

                    <div className="dash-art-glow" />
                    <div className="dash-orbit orbit-a" />
                    <div className="dash-orbit orbit-b" />
                    <div className="dash-orbit orbit-c" />

                    <div className="dash-art-core">
                      <div className="dash-core-inner">C</div>
                    </div>

                    <div className="dash-art-star star-a">✳</div>
                    <div className="dash-art-star star-b">✦</div>
                    <div className="dash-art-star star-c">✧</div>

                    <div className="dash-art-stamp">
                      <span>ALWAYS</span>
                      <strong>IN</strong>
                      <span>MOTION.</span>
                    </div>

                    <div className="dash-art-caption">
                      A WORK OF BECOMING — NEVER A FINAL VERSION
                    </div>
                  </div>
                </div>

                <div className="dash-metrics-heading">
                  <div>
                    <span className="section-index">01 / YOUR CURRENT UNIVERSE</span>
                    <h2>The things that<br /><em>make you, you.</em></h2>
                  </div>
                  <p>
                    Not a score. Not a competition. Just a little evidence
                    of how far you've come.
                  </p>
                </div>

                <div className="dash-metrics">
                  <article className="dash-metric dash-metric-main">
                    <div className="dash-metric-label">
                      <span>SKILLS IN YOUR WORLD</span><span>✳</span>
                    </div>
                    <div className="dash-metric-value">
                      {skills.length.toString().padStart(2, "0")}
                    </div>
                    <div className="dash-metric-footer">
                      <span>Every skill starts somewhere.</span><span>↗</span>
                    </div>
                    <div className="dash-metric-decoration">✳</div>
                  </article>

                  <article className="dash-metric dash-metric-blue">
                    <div className="dash-metric-label">
                      <span>LEVELLED UP</span><span>◈</span>
                    </div>
                    <div className="dash-metric-value">
                      {advancedCount.toString().padStart(2, "0")}
                    </div>
                    <div className="dash-metric-footer">
                      <span>Advanced + Expert</span><span>↗</span>
                    </div>
                  </article>

                  <article className="dash-metric dash-metric-lime">
                    <div className="dash-metric-label">
                      <span>DOMAINS EXPLORED</span><span>✺</span>
                    </div>
                    <div className="dash-metric-value">
                      {categoriesCount.toString().padStart(2, "0")}
                    </div>
                    <div className="dash-metric-footer">
                      <span>Different territories</span><span>↗</span>
                    </div>
                  </article>

                  <article className="dash-metric dash-metric-lilac">
                    <div className="dash-metric-label">
                      <span>IDENTITY BUILT</span><span>◎</span>
                    </div>
                    <div className="dash-completion">
                      <strong>{completion}</strong><span>%</span>
                    </div>
                    <div className="dash-completion-track">
                      <span style={{ width: `${completion}%` }} />
                    </div>
                    <div className="dash-metric-footer">
                      <span>Profile completeness</span><span>↗</span>
                    </div>
                  </article>
                </div>

                <div className="dash-bottom-grid">
                  <section className="dash-skills-panel">
                    <div className="dash-panel-heading">
                      <div>
                        <span className="section-index">02 / YOUR TOOLKIT</span>
                        <h2>Your growing<br /><em>collection.</em></h2>
                      </div>
                      <button
                        className="dash-circle-button"
                        onClick={() => setPage("My Skills")}
                        aria-label="Explore all skills"
                      >
                        ↗
                      </button>
                    </div>

                    {skills.length === 0 ? (
                      <div className="dash-empty">
                        <span>✳</span>
                        <h3>Every universe starts with one star.</h3>
                        <p>Add your first skill and give your collection a beginning.</p>
                        <button
                          className="dash-primary-button"
                          onClick={() => setPage("My Skills")}
                        >
                          Add my first skill ↗
                        </button>
                      </div>
                    ) : (
                      <div className="dash-skill-list">
                        {skills.slice(0, 4).map((skill, index) => (
                          <div className="dash-skill-row" key={skill.id}>
                            <span className={`dash-skill-number dash-color-${index % 4}`}>
                              0{index + 1}
                            </span>
                            <div className="dash-skill-name">
                              <strong>{skill.name}</strong>
                              <span>{skill.category}</span>
                            </div>
                            <span className={`level-pill ${levelColor[skill.proficiency_level] || "blue"}`}>
                              {skill.proficiency_level}
                            </span>
                            <span className="dash-skill-arrow">↗</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {skills.length > 4 && (
                      <button
                        className="dash-view-all"
                        onClick={() => setPage("My Skills")}
                      >
                        VIEW ALL {skills.length} SKILLS ↗
                      </button>
                    )}
                  </section>

                  <section className="dash-direction-panel">
                    <div className="dash-direction-image">
                      <img
                        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=90"
                        alt="Mountain landscape"
                      />
                      <div className="dash-direction-image-overlay" />
                      <span className="dash-direction-tag">THE NEXT CHAPTER</span>
                      <span className="dash-direction-symbol">↗</span>
                    </div>

                    <div className="dash-direction-content">
                      <span className="section-index">03 / YOUR DIRECTION</span>
                      <h2>Beyond<br />where you <em>are.</em></h2>
                      <p>
                        {profile.career_goal ||
                          "Your next chapter is waiting to be written. Give your ambitions a direction."}
                      </p>
                      <button
                        className="dash-direction-link"
                        onClick={() => setPage("Career Roadmap")}
                      >
                        EXPLORE YOUR ROADMAP <span>↗</span>
                      </button>
                    </div>
                  </section>
                </div>

                <div className="dash-closing">
                  <span className="dash-closing-symbol">✳</span>
                  <div>
                    <span>THE CREDORA PHILOSOPHY</span>
                    <strong>Never just one thing.</strong>
                  </div>
                  <p>Keep learning. Keep making. Keep becoming.</p>
                  <span className="dash-infinity">∞</span>
                </div>
              </section>
            )}

            {/* MY SKILLS */}
            {page === "My Skills" && (
              <section className="inner-page">
                <div className="page-hero page-hero-orange">
                  <div>
                    <span className="section-index">02 / THE COLLECTION</span>
                    <h1>Your skills.<br /><em>Your superpowers.</em></h1>
                    <p>A living collection of everything you can do, make and imagine.</p>
                  </div>
                  <div className="page-hero-art skill-hero-art">
                    <div className="skill-orb orb-a">✳</div>
                    <div className="skill-orb orb-b">◈</div>
                    <div className="skill-orb orb-c">✺</div>
                    <span className="orbit-caption">SKILL SYSTEM / 001</span>
                  </div>
                </div>

                <div className="inner-stats">
                  <div><strong>{skills.length}</strong><span>TOTAL SKILLS</span></div>
                  <div><strong>{categoriesCount}</strong><span>CATEGORIES</span></div>
                  <div><strong>{advancedCount}</strong><span>ADVANCED + EXPERT</span></div>
                </div>

                <div className="skills-page-grid">
                  <section className="skills-collection">
                    <div className="section-title-row">
                      <div><span className="section-index">THE INVENTORY</span><h2>Your collection</h2></div>
                      <span className="collection-count">{skills.length.toString().padStart(2, "0")} ITEMS</span>
                    </div>

                    {skills.length === 0 ? (
                      <div className="empty-skills large-empty">
                        <span>◈</span>
                        <h3>Nothing in orbit. Yet.</h3>
                        <p>Start with a skill you know. Big or small, it belongs here.</p>
                      </div>
                    ) : (
                      <div className="skill-catalog">
                        {skills.map((skill, index) => (
                          <article className={`catalog-card catalog-${index % 4}`} key={skill.id}>
                            <div className="catalog-card-top">
                              <span className="catalog-number">SKILL / {(index + 1).toString().padStart(2, "0")}</span>
                              <span className="catalog-symbol">{["✳", "◈", "✺", "✧"][index % 4]}</span>
                            </div>
                            <h3>{skill.name}</h3>
                            <div className="catalog-meta"><span>{skill.category}</span><span>{skill.proficiency_level}</span></div>
                            <div className="catalog-meter">
                              <span style={{ width: `${levelValue[skill.proficiency_level] || 25}%` }} />
                            </div>
                            {skill.description && <p>{skill.description}</p>}
                            <button className="catalog-delete" onClick={() => void deleteSkill(skill.id)} disabled={saving}>
                              REMOVE ↗
                            </button>
                          </article>
                        ))}
                      </div>
                    )}
                  </section>

                  <aside className="add-skill-panel">
                    <span className="section-index">ADD TO YOUR UNIVERSE</span>
                    <div className="add-panel-symbol">✳</div>
                    <h2>Something<br /><em>new?</em></h2>
                    <p>Every skill is another dimension of you.</p>
                    <form className="creative-form" onSubmit={addSkill}>
                      <label>WHAT'S THE SKILL CALLED?
                        <input value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} placeholder="e.g. Python, UI design..." required />
                      </label>
                      <label>WHICH UNIVERSE?
                        <select value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}>
                          <option>Programming</option>
                          <option>Design</option>
                          <option>Communication</option>
                          <option>Technology</option>
                          <option>Business</option>
                          <option>Creative</option>
                          <option>Other</option>
                        </select>
                      </label>
                      <label>YOUR CURRENT LEVEL
                        <select value={skillForm.proficiency_level} onChange={(e) => setSkillForm({ ...skillForm, proficiency_level: e.target.value })}>
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Advanced</option>
                          <option>Expert</option>
                        </select>
                      </label>
                      <label>A LITTLE CONTEXT
                        <textarea value={skillForm.description} onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })} placeholder="What have you done with it?" rows={3} />
                      </label>
                      <button className="button button-dark full-button" disabled={saving}>
                        {saving ? "ADDING..." : "ADD THIS SKILL"} <span>↗</span>
                      </button>
                    </form>
                    <div className="form-footnote">GOOD THINGS TAKE PRACTICE. ✳</div>
                  </aside>
                </div>
              </section>
            )}

            {/* JOB MATCHING */}
            {page === "Job Matching" && token && (
              <JobMatching token={token} />
            )}

            {/* CAREER ROADMAP */}
{page === "Career Roadmap" && (
  <CareerRoadmap
    profile={profile ?? undefined}
    skills={skills}
  />
)}
            {/* INSIGHTS */}
            {page === "Insights" && (
              <section className="inner-page">
                <div className="page-hero page-hero-lime">
                  <div>
                    <span className="section-index">05 / THE PATTERNS</span>
                    <h1>Look what<br /><em>you're becoming.</em></h1>
                    <p>A different perspective on your learning, your strengths and your growing toolkit.</p>
                  </div>
                  <div className="page-hero-art insights-hero-art">
                    <div className="insight-flower flower-one">✳</div>
                    <div className="insight-flower flower-two">✺</div>
                    <div className="insight-flower flower-three">✧</div>
                    <span className="insight-orbit">DATA, BUT MAKE IT HUMAN.</span>
                  </div>
                </div>

                <div className="insights-summary">
                  <div className="insight-summary-card">
                    <span className="section-index">TOTAL SKILLS</span>
                    <strong>{skills.length}</strong>
                    <span>Things in your toolkit</span>
                  </div>
                  <div className="insight-summary-card">
                    <span className="section-index">DOMAINS</span>
                    <strong>{categoriesCount}</strong>
                    <span>Areas you've explored</span>
                  </div>
                  <div className="insight-summary-card">
                    <span className="section-index">PROFILE</span>
                    <strong>{completion}%</strong>
                    <span>Identity completeness</span>
                  </div>
                </div>

                <div className="insights-content-grid">
                  <section className="insights-panel">
                    <span className="section-index">01 / SKILL MIX</span>
                    <h2>Your skills have<br /><em>different colours.</em></h2>
                    {skills.length === 0 ? (
                      <p className="insights-empty">Add skills to see your skill mix come to life.</p>
                    ) : (
                      <div className="category-bars">
                        {Array.from(new Set(skills.map((skill) => skill.category))).map((category, index) => {
                          const count = skills.filter((skill) => skill.category === category).length;
                          const percent = Math.round((count / skills.length) * 100);
                          return (
                            <div className="category-row" key={category}>
                              <div className="category-label"><strong>{category}</strong><span>{count} {count === 1 ? "skill" : "skills"}</span></div>
                              <div className={`category-track category-track-${index % 4}`}><span style={{ width: `${percent}%` }} /></div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>

                  <section className="insights-panel insight-level-panel">
                    <span className="section-index">02 / EXPERIENCE LEVELS</span>
                    <h2>Where you<br /><em>stand today.</em></h2>
                    <div className="level-breakdown">
                      {["Beginner", "Intermediate", "Advanced", "Expert"].map((level, index) => {
                        const count = skills.filter((skill) => skill.proficiency_level === level).length;
                        return (
                          <div className="level-breakdown-row" key={level}>
                            <span className={`level-dot level-dot-${index}`} />
                            <span>{level}</span>
                            <strong>{count.toString().padStart(2, "0")}</strong>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </div>

                <div className="insight-quote">
                  <span>“</span>
                  <p>Progress isn't always a straight line. Sometimes it's a constellation.</p>
                  <small>YOUR CREDORA FIELD NOTES</small>
                </div>
              </section>
            )}

            {/* PROFILE */}
            {page === "Profile" && (
              <section className="inner-page">
                <div className="page-hero page-hero-lilac">
                  <div>
                    <span className="section-index">06 / THE PERSON BEHIND IT ALL</span>
                    <h1>Not just a<br /><em>name on a page.</em></h1>
                    <p>This is your corner of the internet. Make it sound, look and feel like you.</p>
                  </div>
                  <div className="page-hero-art profile-hero-art">
                    <div className="profile-sun" />
                    <div className="profile-orbit profile-orbit-one" />
                    <div className="profile-orbit profile-orbit-two" />
                    <div className="profile-monogram">{getInitials(profileForm.full_name)}</div>
                    <span className="profile-spark">✳</span>
                  </div>
                </div>

                <ResumeUpload
                  token={token}
                  onApplied={() => void loadData(token)}
                />

                <div className="profile-editor">
                  <aside className="profile-preview">
                    <span className="section-index">YOUR DIGITAL IDENTITY</span>
                    <div className="preview-avatar">{getInitials(profileForm.full_name)}</div>
                    <h2>{profileForm.full_name || "Your name goes here"}</h2>
                    <p>{profileForm.headline || "Your headline is waiting..."}</p>
                    <div className="preview-divider" />
                    <div className="preview-detail"><span>LOCATION</span><strong>{profileForm.location || "Not added yet"}</strong></div>
                    <div className="preview-detail"><span>ASPIRATION</span><strong>{profileForm.career_goal || "Still exploring"}</strong></div>
                    <div className="preview-progress">
                      <div><span>PROFILE COMPLETION</span><strong>{completion}%</strong></div>
                      <div className="preview-progress-track"><span style={{ width: `${completion}%` }} /></div>
                    </div>
                    <span className="preview-stamp">ONE OF ONE ✳</span>
                  </aside>

                  <section className="profile-form-panel">
                    <div className="section-title-row">
                      <div><span className="section-index">EDIT YOUR DETAILS</span><h2>Make it yours.</h2></div>
                      <span className="edit-star">✳</span>
                    </div>

                    <form className="creative-form profile-form" onSubmit={saveProfile}>
                      <div className="form-two">
                        <label>FULL NAME
                          <input value={profileForm.full_name} onChange={(e) => updateProfileField("full_name", e.target.value)} placeholder="Your name" required />
                        </label>
                        <label>EMAIL ADDRESS
                          <input type="email" value={profileForm.email} onChange={(e) => updateProfileField("email", e.target.value)} placeholder="you@example.com" required />
                        </label>
                      </div>

                      <div className="form-two">
                        <label>PHONE
                          <input value={profileForm.phone} onChange={(e) => updateProfileField("phone", e.target.value)} placeholder="Your phone number" />
                        </label>
                        <label>LOCATION
                          <input value={profileForm.location} onChange={(e) => updateProfileField("location", e.target.value)} placeholder="City, country" />
                        </label>
                      </div>

                      <label>YOUR HEADLINE
                        <input value={profileForm.headline} onChange={(e) => updateProfileField("headline", e.target.value)} placeholder="e.g. Aspiring AI Engineer" />
                      </label>

                      <div className="form-two">
                        <label>EDUCATION
                          <input value={profileForm.education} onChange={(e) => updateProfileField("education", e.target.value)} placeholder="Your education" />
                        </label>
                        <label>CAREER DIRECTION
                          <input value={profileForm.career_goal} onChange={(e) => updateProfileField("career_goal", e.target.value)} placeholder="Where you want to go" />
                        </label>
                      </div>

                      <label>YOUR STORY
                        <textarea rows={5} value={profileForm.about} onChange={(e) => updateProfileField("about", e.target.value)} placeholder="Tell the world a little about yourself..." />
                      </label>

                      <div className="form-submit-row">
                        <span>YOUR STORY. YOUR RULES. ✳</span>
                        <button className="button button-dark" disabled={saving}>
                          {saving ? "SAVING..." : "SAVE MY IDENTITY"} <span>↗</span>
                        </button>
                      </div>
                    </form>
                  </section>
                </div>
              </section>
            )}

            <footer className="page-footer">
              <span>© CREDORA 2026</span>
              <span>MADE OF MANY THINGS. <b>✳</b></span>
              <span>KEEP BECOMING ↗</span>
            </footer>
          </div>
        </main>

        {/* CUSTOM LOGOUT CONFIRMATION */}
        {logoutOpen && (
          <div
            className="logout-overlay"
            onClick={() => setLogoutOpen(false)}
          >
            <section
              className="logout-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="logout-title"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className="logout-close"
                onClick={() => setLogoutOpen(false)}
                aria-label="Close logout confirmation"
              >
                ×
              </button>

              <span className="logout-eyebrow">CREDORA / SESSION 001</span>

              <div className="logout-orbit-mark">✳</div>

              <h2 id="logout-title">
                Leaving your
                <br />
                <em>orbit?</em>
              </h2>

              <p>
                Your progress is right where you left it. Are you sure you
                want to end this session?
              </p>

              <button
                className="logout-stay"
                onClick={() => setLogoutOpen(false)}
              >
                STAY A LITTLE LONGER <span>✳</span>
              </button>

              <button className="logout-end" onClick={logout}>
                END SESSION <span>↗</span>
              </button>

              <span className="logout-footnote">
                YOUR UNIVERSE WILL BE HERE.
              </span>
            </section>
          </div>
        )}
      </div>
    </>
  );
}

type CareerRoadmapProps = {
  profile?: Profile;
  skills: Skill[];
};

function CareerRoadmap({ profile, skills }: CareerRoadmapProps) {
  const focus =
    profile?.career_goal ||
    "Define the direction you want to grow toward and let the roadmap guide your next steps.";

  const completedCount = skills.length;

  return (
    <section className="inner-page">
      <div
        className="page-hero page-hero-blue"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div>
          <span className="section-index">04 / YOUR NEXT MOVES</span>

          <h1>
            Build a path.
            <br />
            <em>One chapter at a time.</em>
          </h1>

          <p>
            A simple roadmap for turning curiosity into craft, momentum
            and confidence.
          </p>
        </div>

        <div
          className="page-hero-art"
          style={{
            position: "relative",
            minWidth: 180,
            display: "grid",
            placeItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 90,
              color: "#3449e8",
              fontWeight: 800,
            }}
          >
            ↗
          </div>

          <span
            className="orbit-caption"
            style={{
              position: "absolute",
              bottom: 16,
              left: 0,
              right: 0,
              textAlign: "center",
            }}
          >
            ROADMAP / 001
          </span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
          gap: 16,
          marginTop: 28,
        }}
      >
        {roadmap.map((step, index) => (
          <article
            key={step.number}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              padding: 25,
              minHeight: 245,
              background: "#fffdf8",
              border: "1px solid rgba(32,32,43,.12)",
              borderRadius: 12,
              boxShadow: "0 8px 25px rgba(32,32,43,.045)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: 2,
                  fontWeight: 800,
                  color: "#77716c",
                }}
              >
                {step.number} / {step.time}
              </span>

              <span
                style={{
                  width: 48,
                  height: 48,
                  flexShrink: 0,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  background:
                    step.color === "lime"
                      ? "#d7ed50"
                      : step.color === "blue"
                        ? "#b9c5ff"
                        : step.color === "orange"
                          ? "#ffc4a8"
                          : "#d8c7f5",
                  color: "#20202b",
                  fontSize: 23,
                  fontWeight: 800,
                }}
              >
                {step.symbol}
              </span>
            </div>

            <div>
              <h3
                style={{
                  margin: "8px 0 10px",
                  fontSize: 23,
                  lineHeight: 1.2,
                  color: "#20202b",
                  fontFamily: "'Space Grotesk', sans-serif",
                  letterSpacing: "-.7px",
                }}
              >
                {step.title}
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#686775",
                  lineHeight: 1.8,
                  fontSize: 13,
                }}
              >
                {step.description}
              </p>
            </div>

            <div
              style={{
                marginTop: "auto",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 15,
                borderTop: "1px solid rgba(32,32,43,.1)",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: 1.5,
                  color: "#8a8790",
                }}
              >
                CHAPTER {index + 1}
              </span>

              <span
                style={{
                  fontSize: 20,
                  color: "#f05a35",
                  fontWeight: 800,
                }}
              >
                ↗
              </span>
            </div>
          </article>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
          gap: 16,
          marginTop: 28,
        }}
      >
        <div
          style={{
            padding: 25,
            background: "#fffdf8",
            border: "1px solid rgba(32,32,43,.12)",
            borderRadius: 12,
          }}
        >
          <div
            style={{
              color: "#3449e8",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            YOUR CURRENT FOCUS
          </div>

          <strong
            style={{
              display: "block",
              marginTop: 14,
              color: "#20202b",
              fontSize: 19,
              lineHeight: 1.5,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {focus}
          </strong>
        </div>

        <div
          style={{
            padding: 25,
            background: "#d7ed50",
            borderRadius: 12,
            color: "#20202b",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            SKILLS IN YOUR ORBIT
          </div>

          <strong
            style={{
              display: "block",
              marginTop: 8,
              fontSize: 54,
              lineHeight: 1.2,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {completedCount.toString().padStart(2, "0")}
          </strong>

          <p
            style={{
              margin: "8px 0 0",
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            Every skill you add is another step in your journey.
          </p>
        </div>
      </div>

      <div
        style={{
          marginTop: 25,
          padding: "25px 0",
          borderTop: "1px solid rgba(32,32,43,.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 15,
          flexWrap: "wrap",
        }}
      >
        <div>
          <span className="section-index">THE CREDORA PHILOSOPHY</span>
          <h2
            style={{
              margin: "8px 0 0",
              color: "#20202b",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Your journey. Your pace.
          </h2>
        </div>

        <span
          style={{
            fontSize: 35,
            color: "#f05a35",
          }}
        >
          ✳
        </span>
      </div>
    </section>
  );
}
export default App;
