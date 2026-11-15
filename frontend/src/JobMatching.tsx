
import { useEffect, useMemo, useState } from "react";

const API = "http://127.0.0.1:8000";

interface JobRole {
  id: number;
  title: string;
  category: string;
  description: string;
  required_skills: string[];
  optional_skills: string[];
}

interface SkillMatch {
  name: string;
  proficiency: string;
}

interface JobMatch {
  job_id: number;
  job_title: string;
  category: string;
  description: string;
  match_percentage: number;
  match_status: string;
  total_required_skills: number;
  matched_required_count: number;
  matched_required_skills: SkillMatch[];
  missing_required_skills: string[];
  matched_optional_skills: SkillMatch[];
  missing_optional_skills: string[];
  total_optional_skills: number;
  matched_optional_count: number;
}

interface MatchResponse {
  profile_id: number;
  total_jobs_analyzed: number;
  matches: JobMatch[];
}

interface Props {
  token: string;
}

function JobMatching({ token }: Props) {
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadMatches = async () => {
      setLoading(true);
      setError("");

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [rolesResponse, matchesResponse] = await Promise.all([
          fetch(`${API}/jobs/roles`, { headers }),
          fetch(`${API}/jobs/matches`, { headers }),
        ]);

        if (!rolesResponse.ok || !matchesResponse.ok) {
          throw new Error(
            "Unable to load career matches. Please try again."
          );
        }

        const rolesData: JobRole[] = await rolesResponse.json();
        const matchesData: MatchResponse =
          await matchesResponse.json();

        if (!active) return;

        setRoles(rolesData);
        setMatches(matchesData.matches || []);

        if (matchesData.matches?.length) {
          setSelectedJob(matchesData.matches[0].job_id);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadMatches();

    return () => {
      active = false;
    };
  }, [token]);

  const selectedMatch = useMemo(
    () => matches.find((match) => match.job_id === selectedJob) || null,
    [matches, selectedJob]
  );

  const bestMatch = matches[0] || null;

  const averageMatch = matches.length
    ? Math.round(
        matches.reduce(
          (total, match) => total + match.match_percentage,
          0
        ) / matches.length
      )
    : 0;

  const selectedRole = roles.find(
    (role) => role.id === selectedJob
  );

  return (
    <section className="inner-page job-matching-page">
      <style>{`
        .job-matching-page {
          color: #20202b;
        }

        .jm-hero {
          position: relative;
          overflow: hidden;
          min-height: 290px;
          padding: 42px;
          box-sizing: border-box;
          background: #20202b;
          color: #f2eadb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
        }

        .jm-hero-copy {
          position: relative;
          z-index: 2;
          max-width: 590px;
        }

        .jm-kicker {
          color: #d7ed50;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .jm-hero h1 {
          margin: 22px 0 14px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(40px, 6vw, 64px);
          line-height: .99;
          letter-spacing: -3px;
        }

        .jm-hero h1 em {
          color: #d7ed50;
          font-style: normal;
        }

        .jm-hero p {
          max-width: 460px;
          color: rgba(242,234,219,.68);
          font-size: 13px;
          line-height: 1.8;
        }

        .jm-hero-art {
          position: relative;
          flex-shrink: 0;
          width: 190px;
          height: 190px;
          display: grid;
          place-items: center;
        }

        .jm-orbit {
          position: absolute;
          border: 1px solid rgba(215,237,80,.38);
          border-radius: 50%;
          inset: 8px;
          transform: rotate(-30deg) scaleY(.55);
        }

        .jm-orbit.two {
          inset: 25px;
          transform: rotate(45deg) scaleY(.55);
          border-color: rgba(240,90,53,.6);
        }

        .jm-orbit.three {
          inset: 42px;
          transform: rotate(90deg) scaleY(.55);
          border-color: rgba(255,255,255,.3);
        }

        .jm-core {
          width: 78px;
          height: 78px;
          display: grid;
          place-items: center;
          background: #d7ed50;
          color: #20202b;
          border-radius: 50%;
          font-size: 38px;
          animation: jmRotate 18s linear infinite;
        }

        @keyframes jmRotate {
          to { transform: rotate(360deg); }
        }

        .jm-summary {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 13px;
          margin: 25px 0 35px;
        }

        .jm-summary-card {
          padding: 22px;
          min-height: 110px;
          box-sizing: border-box;
          background: #fffdf8;
          border: 1px solid rgba(32,32,43,.1);
        }

        .jm-summary-card span {
          display: block;
          color: #85818a;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.2px;
        }

        .jm-summary-card strong {
          display: block;
          margin-top: 12px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 32px;
          letter-spacing: -1px;
        }

        .jm-section-heading {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 15px;
          margin: 34px 0 20px;
        }

        .jm-section-heading h2 {
          margin: 8px 0 0;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 27px;
          letter-spacing: -1px;
        }

        .jm-index {
          color: #3449e8;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .jm-role-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 13px;
        }

        .jm-role-card {
          width: 100%;
          box-sizing: border-box;
          padding: 21px;
          border: 1px solid rgba(32,32,43,.12);
          background: #fffdf8;
          color: #20202b;
          text-align: left;
          cursor: pointer;
          transition: border .2s, transform .2s, box-shadow .2s;
        }

        .jm-role-card:hover {
          transform: translateY(-3px);
          border-color: #3449e8;
          box-shadow: 0 12px 28px rgba(32,32,43,.07);
        }

        .jm-role-card.selected {
          border: 1.5px solid #3449e8;
          background: #f0efff;
        }

        .jm-role-top {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: center;
        }

        .jm-role-category {
          color: #85818a;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .jm-role-score {
          color: #3449e8;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 22px;
          font-weight: 800;
        }

        .jm-role-card h3 {
          margin: 17px 0 7px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 19px;
          letter-spacing: -.5px;
        }

        .jm-role-card p {
          min-height: 39px;
          margin: 0;
          color: #777580;
          font-size: 11px;
          line-height: 1.6;
        }

        .jm-track {
          height: 6px;
          margin-top: 19px;
          overflow: hidden;
          background: #e9e6df;
          border-radius: 20px;
        }

        .jm-track span {
          display: block;
          height: 100%;
          background: #3449e8;
          border-radius: 20px;
          transition: width .4s ease;
        }

        .jm-role-bottom {
          display: flex;
          justify-content: space-between;
          margin-top: 12px;
          color: #85818a;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .5px;
        }

        .jm-detail {
          margin-top: 30px;
          padding: 28px;
          background: #fffdf8;
          border: 1px solid rgba(32,32,43,.12);
        }

        .jm-detail-heading {
          display: flex;
          justify-content: space-between;
          align-items: start;
          gap: 15px;
          padding-bottom: 22px;
          border-bottom: 1px solid rgba(32,32,43,.1);
        }

        .jm-detail-heading h2 {
          margin: 9px 0 5px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(24px, 4vw, 34px);
          letter-spacing: -1.5px;
        }

        .jm-detail-heading p {
          margin: 0;
          color: #777580;
          font-size: 12px;
          line-height: 1.7;
        }

        .jm-big-score {
          min-width: 88px;
          text-align: right;
          color: #3449e8;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 35px;
          font-weight: 800;
        }

        .jm-big-score small {
          display: block;
          color: #85818a;
          font-family: 'DM Sans', sans-serif;
          font-size: 8px;
          letter-spacing: 1px;
        }

        .jm-detail-progress {
          margin: 22px 0;
        }

        .jm-detail-progress .jm-track {
          height: 10px;
          margin-top: 10px;
        }

        .jm-detail-progress .jm-track span {
          background: #d7ed50;
        }

        .jm-skills-columns {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 25px;
          margin-top: 25px;
        }

        .jm-skill-column h3 {
          margin: 0 0 15px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px;
        }

        .jm-skill-chip-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .jm-chip {
          padding: 8px 11px;
          border: 1px solid rgba(32,32,43,.12);
          font-size: 10px;
          font-weight: 700;
        }

        .jm-chip.good {
          background: #e8f1c7;
          border-color: #d7ed50;
        }

        .jm-chip.missing {
          background: #fff0e9;
          border-color: #f3c0aa;
        }

        .jm-chip.optional {
          background: #eeedff;
          border-color: #d3d0ff;
        }

        .jm-proficiency {
          display: block;
          margin-top: 4px;
          color: #777580;
          font-size: 8px;
          font-weight: 500;
        }

        .jm-empty {
          padding: 20px 0;
          color: #85818a;
          font-size: 12px;
        }

        .jm-state {
          padding: 45px 20px;
          text-align: center;
          background: #fffdf8;
          border: 1px solid rgba(32,32,43,.1);
        }

        .jm-state h2 {
          font-family: 'Space Grotesk', sans-serif;
        }

        .jm-state p {
          color: #777580;
          font-size: 13px;
          line-height: 1.7;
        }

        .jm-retry {
          margin-top: 12px;
          padding: 12px 18px;
          background: #20202b;
          color: white;
          border: 0;
          cursor: pointer;
          font-weight: 700;
        }

        @media(max-width: 700px) {
          .jm-hero {
            padding: 30px 23px;
          }
          .jm-hero-art {
            width: 115px;
            height: 115px;
          }
          .jm-core {
            width: 55px;
            height: 55px;
            font-size: 27px;
          }
          .jm-summary {
            grid-template-columns: 1fr;
          }
          .jm-role-grid,
          .jm-skills-columns {
            grid-template-columns: 1fr;
          }
          .jm-detail {
            padding: 20px;
          }
        }

        @media(max-width: 460px) {
          .jm-hero-art {
            display: none;
          }
          .jm-detail-heading {
            flex-direction: column;
          }
          .jm-big-score {
            text-align: left;
          }
        }
      `}</style>

      <div className="jm-hero">
        <div className="jm-hero-copy">
          <span className="jm-kicker">
            ✳ CREDORA / CAREER INTELLIGENCE
          </span>
          <h1>
            Find your
            <br />
            <em>next orbit.</em>
          </h1>
          <p>
            Discover career paths that connect with your existing
            abilities. See what you already bring to the table
            and what you can develop next.
          </p>
        </div>

        <div className="jm-hero-art" aria-hidden="true">
          <div className="jm-orbit" />
          <div className="jm-orbit two" />
          <div className="jm-orbit three" />
          <div className="jm-core">✳</div>
        </div>
      </div>

      {loading ? (
        <div className="jm-state">
          <h2>Mapping your possibilities...</h2>
          <p>Comparing your skills with available career paths.</p>
        </div>
      ) : error ? (
        <div className="jm-state">
          <h2>We couldn't load your matches.</h2>
          <p>{error}</p>
          <button
            className="jm-retry"
            onClick={() => window.location.reload()}
          >
            TRY AGAIN ↗
          </button>
        </div>
      ) : matches.length === 0 ? (
        <div className="jm-state">
          <h2>Your next chapter starts with a skill.</h2>
          <p>
            Add some skills to your Credora profile first.
            Then return here to discover your career matches.
          </p>
        </div>
      ) : (
        <>
          <div className="jm-summary">
            <article className="jm-summary-card">
              <span>CAREER PATHS ANALYSED</span>
              <strong>{matches.length.toString().padStart(2, "0")}</strong>
            </article>

            <article className="jm-summary-card">
              <span>BEST SKILL MATCH</span>
              <strong>{bestMatch?.match_percentage ?? 0}%</strong>
            </article>

            <article className="jm-summary-card">
              <span>AVERAGE COMPATIBILITY</span>
              <strong>{averageMatch}%</strong>
            </article>
          </div>

          <div className="jm-section-heading">
            <div>
              <span className="jm-index">01 / CAREER DISCOVERY</span>
              <h2>Where could you go?</h2>
            </div>
          </div>

          <div className="jm-role-grid">
            {matches.map((match, index) => (
              <button
                type="button"
                key={match.job_id}
                className={`jm-role-card ${
                  selectedJob === match.job_id ? "selected" : ""
                }`}
                onClick={() => setSelectedJob(match.job_id)}
              >
                <div className="jm-role-top">
                  <span className="jm-role-category">
                    {match.category.toUpperCase()}
                  </span>
                  <span className="jm-role-score">
                    {match.match_percentage}%
                  </span>
                </div>

                <h3>{match.job_title}</h3>
                <p>{match.description}</p>

                <div className="jm-track">
                  <span
                    style={{
                      width: `${match.match_percentage}%`,
                    }}
                  />
                </div>

                <div className="jm-role-bottom">
                  <span>
                    {match.matched_required_count}/
                    {match.total_required_skills} REQUIRED SKILLS
                  </span>
                  <span>
                    {selectedJob === match.job_id
                      ? "SELECTED ✓"
                      : `VIEW ${String(index + 1).padStart(2, "0")} ↗`}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {selectedMatch && (
            <section className="jm-detail">
              <div className="jm-detail-heading">
                <div>
                  <span className="jm-index">
                    02 / YOUR SKILL BREAKDOWN
                  </span>
                  <h2>{selectedMatch.job_title}</h2>
                  <p>{selectedMatch.match_status}</p>
                </div>

                <div className="jm-big-score">
                  {selectedMatch.match_percentage}%
                  <small>SKILL MATCH</small>
                </div>
              </div>

              <div className="jm-detail-progress">
                <div className="jm-role-bottom">
                  <span>REQUIRED SKILL COMPATIBILITY</span>
                  <strong>{selectedMatch.match_percentage}%</strong>
                </div>
                <div className="jm-track">
                  <span
                    style={{
                      width: `${selectedMatch.match_percentage}%`,
                    }}
                  />
                </div>
              </div>

              <div className="jm-skills-columns">
                <div className="jm-skill-column">
                  <h3>✳ Skills you already have</h3>
                  {selectedMatch.matched_required_skills.length ? (
                    <div className="jm-skill-chip-list">
                      {selectedMatch.matched_required_skills.map(
                        (skill) => (
                          <span
                            className="jm-chip good"
                            key={skill.name}
                          >
                            {skill.name}
                            <span className="jm-proficiency">
                              {skill.proficiency}
                            </span>
                          </span>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="jm-empty">
                      Your matching skills will appear here.
                    </p>
                  )}
                </div>

                <div className="jm-skill-column">
                  <h3>↗ Skills to develop</h3>
                  {selectedMatch.missing_required_skills.length ? (
                    <div className="jm-skill-chip-list">
                      {selectedMatch.missing_required_skills.map(
                        (skill) => (
                          <span
                            className="jm-chip missing"
                            key={skill}
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="jm-empty">
                      You have all the required skills listed for this role!
                    </p>
                  )}
                </div>

                <div className="jm-skill-column">
                  <h3>◈ Additional strengths</h3>
                  {selectedMatch.matched_optional_skills.length ? (
                    <div className="jm-skill-chip-list">
                      {selectedMatch.matched_optional_skills.map(
                        (skill) => (
                          <span
                            className="jm-chip good"
                            key={skill.name}
                          >
                            {skill.name}
                            <span className="jm-proficiency">
                              {skill.proficiency}
                            </span>
                          </span>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="jm-empty">
                      No optional skills matched yet.
                    </p>
                  )}
                </div>

                <div className="jm-skill-column">
                  <h3>✧ Skills worth exploring</h3>
                  {selectedMatch.missing_optional_skills.length ? (
                    <div className="jm-skill-chip-list">
                      {selectedMatch.missing_optional_skills.map(
                        (skill) => (
                          <span
                            className="jm-chip optional"
                            key={skill}
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="jm-empty">
                      You've covered all the optional skills in this role.
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}

          <div className="jm-section-heading">
            <div>
              <span className="jm-index">03 / ROLE REQUIREMENTS</span>
              <h2>What the role looks for.</h2>
            </div>
          </div>

          {selectedRole && (
            <div className="jm-detail">
              <h3>{selectedRole.title}</h3>
              <p>{selectedRole.description}</p>
              <div className="jm-skill-column">
                <h3>Required skills</h3>
                <div className="jm-skill-chip-list">
                  {selectedRole.required_skills.map((skill) => (
                    <span className="jm-chip" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="jm-skill-column" style={{ marginTop: 22 }}>
                <h3>Optional skills</h3>
                <div className="jm-skill-chip-list">
                  {selectedRole.optional_skills.map((skill) => (
                    <span className="jm-chip optional" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default JobMatching;
