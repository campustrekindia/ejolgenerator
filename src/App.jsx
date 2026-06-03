import { useState, useEffect } from "react";

/* ── load html2pdf.js once ── */
function useHtml2Pdf() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.html2pdf) { setReady(true); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    s.onload = () => setReady(true);
    document.head.appendChild(s);
  }, []);
  return ready;
}

const defaultData = {
  refNo: "ES/OL/2026/0012",
  issueDate: "June 02, 2026",
  joiningDate: "June 04, 2026",
  offerValidity: "June 03, 2026 (5:00 PM IST)",
  candidate: {
    fullName: "Devi Vara Prasad Nanduru",
    designation: "Full Stack GenAI Engineer",
    department: "Engineering & AI Products",
    employmentType: "Full-Time, Permanent",
    workLocation: "Hyderabad, Telangana (Hybrid)",
    reportingTo: "Engineering Manager / CTO",
    mobile: "+91-9912902136",
    email: "kamalnanduruitqueries@gmail.com",
  },
  compensation: {
    basic:     { monthly: 55167,  annual: 662004 },
    hra:       { monthly: 22067,  annual: 264804 },
    special:   { monthly: 33100,  annual: 397200 },
    medical:   { monthly: 6250,   annual: 75000  },
    transport: { monthly: 1600,   annual: 19200  },
  },
  ctcWords: "Sixteen Lakhs Only",
  probationMonths: "six (6)",
  noticeDays: "sixty (60)",
  noticeProb: "thirty (30)",
  hrEmail: "hr@ejectsolutions.com",
};

const INR = (n) => Number(n).toLocaleString("en-IN");
const NAVY = "#1a3560";
const BLUE = "#2563a8";
const FONT = "'Montserrat', Arial, sans-serif";

/* ────────────────────── FIELD ────────────────────── */
function Field({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4, fontFamily: "monospace" }}>{label}</div>
      <input value={value} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 6, fontSize: 13, fontFamily: FONT, color: "#0f172a", outline: "none", background: "#fff", transition: "border-color 0.15s" }}
        onFocus={e => e.target.style.borderColor = NAVY}
        onBlur={e => e.target.style.borderColor = "#e2e8f0"}
      />
    </div>
  );
}

/* ────────────────────── SALARY ROW ────────────────────── */
function SalaryRow({ label, m, a, onChange }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 5 }}>{label}</div>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, color: "#94a3b8", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>Monthly ₹</div>
          <input type="number" value={m} onChange={e => onChange(Number(e.target.value), Number(e.target.value) * 12)}
            style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 6, padding: "8px 10px", fontSize: 12, fontFamily: FONT, outline: "none", background: "#fff" }}
            onFocus={e => e.target.style.borderColor = NAVY} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, color: "#94a3b8", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>Annual ₹</div>
          <input type="number" value={a} onChange={e => onChange(Math.round(Number(e.target.value) / 12), Number(e.target.value))}
            style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 6, padding: "8px 10px", fontSize: 12, fontFamily: FONT, outline: "none", background: "#fff" }}
            onFocus={e => e.target.style.borderColor = NAVY} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
        </div>
      </div>
    </div>
  );
}

/* ────────────────────── OFFER LETTER DOC ────────────────────── */
function OfferLetterDoc({ d }) {
  const comp = d.compensation;
  const totalM = Object.values(comp).reduce((s, c) => s + Number(c.monthly), 0);
  const totalA = Object.values(comp).reduce((s, c) => s + Number(c.annual), 0);

  const F = FONT;

  // Shared inline styles
  const secTitle = {
    fontSize: "10.5pt", fontWeight: 800, color: NAVY,
    letterSpacing: "0.05em", textTransform: "uppercase",
    borderBottom: `2px solid ${BLUE}`, paddingBottom: 4,
    marginBottom: 10, marginTop: 18, fontFamily: F,
  };
  const subHead = { fontSize: "10.5pt", fontWeight: 700, color: NAVY, marginBottom: 3, marginTop: 12, fontFamily: F };
  const bodyP = { fontSize: "10pt", marginBottom: 8, textAlign: "justify", fontFamily: F };
  const tblWrap = { width: "100%", borderCollapse: "collapse", marginBottom: 10, fontSize: "10pt", fontFamily: F };
  const th = { background: NAVY, color: "#fff", padding: "7px 10px", fontWeight: 700, textAlign: "left", fontSize: "9.5pt", fontFamily: F };
  const thR = { ...th, textAlign: "right" };
  const tdL = { padding: "6px 10px", fontWeight: 700, color: NAVY, background: "#eef2f8", borderBottom: "1px solid #dde3ed", width: "36%", fontSize: "9.5pt", verticalAlign: "top", fontFamily: F };
  const tdV = { padding: "6px 10px", borderBottom: "1px solid #dde3ed", fontSize: "9.5pt", verticalAlign: "top", fontFamily: F };
  const tdN = { padding: "6px 10px", borderBottom: "1px solid #dde3ed", textAlign: "right", fontSize: "9.5pt", fontFamily: F };
  const tblBorder = "1px solid #c8d3e6";

  // Page break marker — forces a new PDF page, no blank page side-effect
  const PB = () => <div className="pdf-page-break" style={{ pageBreakBefore: "always", breakBefore: "page", height: 0, margin: 0, padding: 0 }} />;

  const Footer = ({ pg }) => (
    <div style={{ borderTop: "1px solid #dde3ed", marginTop: 24, paddingTop: 5, display: "flex", justifyContent: "space-between", fontSize: "8pt", color: "#94a3b8", fontFamily: F }}>
      <span>Eject Solutions | Confidential Offer Letter</span>
      <span>Page {pg}</span>
    </div>
  );

  // Letterhead block reused on content pages
  const Letterhead = () => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: "16pt", fontWeight: 800, color: NAVY, letterSpacing: "0.08em", fontFamily: F }}>EJECT SOLUTIONS</div>
      <div style={{ fontSize: "9.5pt", color: BLUE, fontStyle: "italic", fontFamily: F }}>Empowering Digital Innovation</div>
      <div style={{ fontSize: "9pt", color: "#64748b", fontFamily: F }}>www.ejectsolutions.com | {d.hrEmail}</div>
      <div style={{ height: 1, background: "#c8d3e6", margin: "8px 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9pt", fontFamily: F }}>
        <span>Ref. No: {d.refNo}</span><span>Date: {d.issueDate}</span>
      </div>
      <div style={{ height: 1, background: "#c8d3e6", margin: "8px 0 14px" }} />
    </div>
  );

  return (
    <div id="ol-document" style={{ background: "#fff", fontFamily: F }}>

      {/* ── PAGE 1: COVER ── */}
      <div style={{ width: "210mm", height: "297mm", background: "#fff", display: "flex", flexDirection: "column", boxSizing: "border-box", overflow: "hidden" }}>
        <div style={{ background: NAVY, height: "28%", width: "100%", flexShrink: 0 }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10mm 20mm", textAlign: "center" }}>
          <div style={{ fontSize: "22pt", fontWeight: 800, color: NAVY, letterSpacing: "0.1em", marginBottom: 4, fontFamily: F }}>EJECT SOLUTIONS</div>
          <div style={{ fontSize: "10.5pt", color: BLUE, fontStyle: "italic", marginBottom: 20, fontFamily: F }}>Empowering Digital Innovation</div>
          <div style={{ width: 240, height: 2, background: BLUE, marginBottom: 20 }} />
          <div style={{ fontSize: "17pt", fontWeight: 800, color: NAVY, letterSpacing: "0.12em", marginBottom: 4, fontFamily: F }}>OFFER OF EMPLOYMENT</div>
          <div style={{ fontSize: "10.5pt", color: BLUE, fontStyle: "italic", marginBottom: 20, fontFamily: F }}>Letter of Appointment</div>
          <div style={{ width: 240, height: 2, background: BLUE, marginBottom: 28 }} />
          <div style={{ fontSize: "9.5pt", color: "#64748b", marginBottom: 6, fontFamily: F }}>Prepared for:</div>
          <div style={{ fontSize: "17pt", fontWeight: 800, color: NAVY, marginBottom: 3, fontFamily: F }}>{d.candidate.fullName}</div>
          <div style={{ fontSize: "10.5pt", color: BLUE, marginBottom: 20, fontFamily: F }}>{d.candidate.designation}</div>
          <div style={{ fontSize: "9.5pt", color: "#64748b", fontFamily: F }}>Date of Issue: {d.issueDate}</div>
          <div style={{ fontSize: "9.5pt", color: "#64748b", fontFamily: F }}>Date of Joining: {d.joiningDate}</div>
        </div>
        <div style={{ background: NAVY, height: 50, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ color: "#fff", fontSize: "9pt", fontWeight: 700, letterSpacing: "0.18em", fontFamily: F }}>CONFIDENTIAL | EJECT SOLUTIONS</span>
        </div>
      </div>

      {/* ── PAGE 2: Sections 1 & 2 ── */}
      <PB />
      <div style={{ padding: "14mm 16mm 20mm", boxSizing: "border-box", background: "#fff" }}>
        <Letterhead />
        <p style={{ ...bodyP, fontWeight: 700 }}>Dear {d.candidate.fullName},</p>
        <div style={secTitle}>1. Letter of Offer</div>
        <p style={bodyP}>We are delighted to extend this formal offer of employment to you at <strong>Eject Solutions</strong>. After a thorough evaluation of your profile, experience, and skill set, we are pleased to welcome you to our team as a <span style={{ color: BLUE, fontWeight: 700 }}>{d.candidate.designation}</span>. Your expertise in Generative AI, LLM engineering, and full stack development aligns perfectly with our vision and growth trajectory.</p>
        <p style={bodyP}>This offer is extended contingent upon successful completion of all pre-employment verification formalities as outlined herein. We look forward to having you as a key contributor to Eject Solutions.</p>
        <div style={secTitle}>2. Appointment Details</div>
        <table style={{ ...tblWrap, border: tblBorder }}>
          <tbody>
            {[["Full Name", d.candidate.fullName],["Designation", d.candidate.designation],["Department", d.candidate.department],["Date of Joining", d.joiningDate],["Employment Type", d.candidate.employmentType],["Work Location", d.candidate.workLocation],["Reporting To", d.candidate.reportingTo],["Mobile", d.candidate.mobile],["Email", d.candidate.email]].map(([k, v]) => (
              <tr key={k}><td style={tdL}>{k}</td><td style={tdV}>{v}</td></tr>
            ))}
          </tbody>
        </table>
        <Footer pg={2} />
      </div>

      {/* ── PAGE 3: Sections 3 & 4 ── */}
      <PB />
      <div style={{ padding: "14mm 16mm 20mm", boxSizing: "border-box", background: "#fff" }}>
        <div style={secTitle}>3. Compensation &amp; Benefits</div>
        <p style={bodyP}>Your compensation package has been structured competitively to reflect your experience and the scope of the role. The total fixed Cost to Company (CTC) is detailed below:</p>
        <table style={{ ...tblWrap, border: tblBorder }}>
          <thead><tr><th style={th}>Component</th><th style={thR}>Monthly (INR)</th><th style={thR}>Annual (INR)</th></tr></thead>
          <tbody>
            {[["Basic Salary", comp.basic],["House Rent Allowance (HRA)", comp.hra],["Special Allowance", comp.special],["Medical Allowance", comp.medical],["Transport / Fuel Allowance", comp.transport]].map(([label, c]) => (
              <tr key={label}><td style={{ ...tdV, width: "50%" }}>{label}</td><td style={tdN}>{INR(c.monthly)}</td><td style={tdN}>{INR(c.annual)}</td></tr>
            ))}
            <tr>
              <td style={{ ...tdV, background: NAVY, color: "#fff", fontWeight: 800, border: "none" }}>TOTAL FIXED CTC</td>
              <td style={{ ...tdN, background: NAVY, color: "#fff", fontWeight: 800, border: "none" }}>{INR(totalM)}</td>
              <td style={{ ...tdN, background: NAVY, color: "#fff", fontWeight: 800, border: "none" }}>{INR(totalA)}</td>
            </tr>
          </tbody>
        </table>
        <p style={{ ...bodyP, fontSize: "9.5pt" }}><strong>Note:</strong> The above compensation is a fixed annual CTC of <strong style={{ color: BLUE }}>INR {INR(totalA)} (Rupees {d.ctcWords})</strong>. All components are payable as per company policy. Statutory deductions (PF, TDS, ESI if applicable) will be applied as per prevailing regulations.</p>
        <div style={secTitle}>4. Role &amp; Key Responsibilities</div>
        <p style={bodyP}>As a {d.candidate.designation} at Eject Solutions, you will be expected to contribute across the following areas:</p>
        <ul style={{ paddingLeft: 18, fontSize: "10pt", lineHeight: 1.65, marginBottom: 8, fontFamily: F }}>
          {["Design, develop, and deploy Generative AI applications leveraging LLMs including OpenAI, Gemini, AWS Bedrock, and Groq.","Build and maintain RAG (Retrieval Augmented Generation) pipelines with vector databases (ChromaDB, Qdrant) for enterprise knowledge retrieval.","Develop agentic AI systems using LangChain and LangGraph, including multi-step ReAct agent orchestration.","Build scalable backend APIs using FastAPI (Python) and Node.js/Express.js for AI-driven product features.","Develop responsive frontend interfaces using React.js and Next.js, consuming AI and backend services.","Deploy and manage containerized microservices on AWS (EKS, Lambda, RDS, S3, ElastiCache) with CI/CD pipelines via GitHub Actions.","Collaborate with product, design, and data science teams to translate business requirements into production-grade AI solutions.","Contribute to code reviews, technical documentation, and continuous improvement of engineering standards.","Stay current with the rapidly evolving GenAI landscape and propose innovative solutions."].map((item, i) => (
            <li key={i} style={{ marginBottom: 3 }}>{item}</li>
          ))}
        </ul>
        <Footer pg={3} />
      </div>

      {/* ── PAGE 4: Section 5 ── */}
      <PB />
      <div style={{ padding: "14mm 16mm 20mm", boxSizing: "border-box", background: "#fff" }}>
        <div style={secTitle}>5. Terms &amp; Conditions of Employment</div>
        {[
          ["5.1 Probation Period", `You will be on a probationary period of ${d.probationMonths} months from the date of joining. During this period, your performance will be reviewed, and upon satisfactory completion, you will be confirmed as a permanent employee. The company reserves the right to extend probation by an additional three (3) months based on performance evaluation.`],
          ["5.2 Working Hours & Location", `Your primary work location will be Hyderabad, Telangana, with a hybrid working arrangement (a minimum of three days per week at the office). Standard working hours are 9:00 AM to 6:00 PM (Monday to Friday), with flexibility as required by project demands.`],
          ["5.3 Confidentiality & Intellectual Property", `You are required to sign and adhere to Eject Solutions' Non-Disclosure Agreement (NDA) and Intellectual Property (IP) Assignment Agreement on or before the date of joining. All work, code, inventions, and deliverables created during your tenure shall be the exclusive property of Eject Solutions.`],
          ["5.4 Notice Period", `Either party may terminate the employment by providing a notice period of ${d.noticeDays} days in writing. During the probation period, the notice period shall be ${d.noticeProb} days from either side. The company reserves the right to pay in lieu of notice.`],
          ["5.5 Background Verification", `This offer is subject to satisfactory completion of background verification checks, including but not limited to employment history, educational credentials, identity verification, and reference checks. Any discrepancy found may result in withdrawal of this offer or termination of employment.`],
          ["5.6 Code of Conduct", `You are expected to adhere to Eject Solutions' Code of Conduct, policies, and procedures as communicated from time to time. This includes but is not limited to data security policies, anti-harassment policies, and professional ethics standards.`],
        ].map(([title, body]) => (
          <div key={title}>
            <div style={subHead}>{title}</div>
            <p style={bodyP}>{body}</p>
          </div>
        ))}
        <Footer pg={4} />
      </div>

      {/* ── PAGE 5: Sections 6 & 7 ── */}
      <PB />
      <div style={{ padding: "14mm 16mm 20mm", boxSizing: "border-box", background: "#fff" }}>
        <div style={secTitle}>6. Employee Benefits</div>
        <p style={bodyP}>In addition to your fixed compensation, you will be entitled to the following benefits as part of your employment at Eject Solutions:</p>
        <table style={{ ...tblWrap, border: tblBorder }}>
          <thead><tr><th style={{ ...th, width: "35%" }}>Benefit</th><th style={th}>Details</th></tr></thead>
          <tbody>
            {[["Health Insurance","Group medical insurance coverage of INR 5 Lakhs for employee and immediate family (spouse & 2 children)"],["Annual Leave","18 days of paid annual leave per calendar year, accrued monthly"],["Sick Leave","10 days of paid sick leave per calendar year"],["Public Holidays","As per Government of Telangana and national holiday calendar"],["Learning & Development","Annual budget of INR 30,000 for certifications, courses, and conferences"],["Performance Bonus","Annual performance-linked bonus subject to company and individual performance (to be communicated separately)"],["Flexible Working","Hybrid model with flexible timing as per team and project requirements"],["Team Events","Quarterly team outings and annual company offsite"]].map(([k, v]) => (
              <tr key={k}><td style={tdL}>{k}</td><td style={tdV}>{v}</td></tr>
            ))}
          </tbody>
        </table>
        <div style={secTitle}>7. Offer Validity</div>
        <p style={bodyP}>This offer of employment is valid until <strong>{d.offerValidity}</strong>. Kindly revert with your acceptance by signing and returning a copy of this letter before the stated deadline. Failure to respond within the stipulated time may result in the offer being withdrawn.</p>
        <p style={bodyP}>To formally accept this offer, please sign the acceptance section at the end of this document and send a scanned copy to <span style={{ color: BLUE }}>{d.hrEmail}</span>. Please carry the original signed copy on your date of joining along with the required documents listed in the next section.</p>
        <Footer pg={5} />
      </div>

      {/* ── PAGE 6: Sections 8 & 9 ── */}
      <PB />
      <div style={{ padding: "14mm 16mm 20mm", boxSizing: "border-box", background: "#fff" }}>
        <div style={secTitle}>8. Documents to be Submitted on Joining</div>
        <p style={bodyP}>Please carry the following documents in original along with self-attested photocopies on your date of joining:</p>
        <ol style={{ paddingLeft: 20, fontSize: "10pt", lineHeight: 1.7, marginBottom: 20, fontFamily: F }}>
          {["Recent passport-sized photographs (4 copies)","Aadhaar Card (original + photocopy)","PAN Card (original + photocopy)","Class 10th and 12th mark sheets and passing certificates","B.Tech / Graduation degree certificate and all semester mark sheets (KL University, 2022)","Previous employment offer letter(s), appointment letter(s), and experience letter(s)","Last 3 months' salary slips from most recent employer","Bank account details (cancelled cheque / bank passbook copy)","No Objection Certificate (NOC) from previous employer, if applicable","Any certifications relevant to your role (Full Stack, Node.js, or others)"].map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
        <div style={secTitle}>9. Acceptance of Offer</div>
        <p style={bodyP}>By signing below, you acknowledge that you have read, understood, and accepted all the terms and conditions outlined in this offer letter. You confirm that the information provided by you during the recruitment process is accurate and complete, and you agree to abide by all policies of Eject Solutions.</p>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 24, marginBottom: 16, fontFamily: F }}>
          <tbody><tr>
            <td style={{ width: "50%", verticalAlign: "top", paddingRight: 28 }}>
              <div style={{ fontWeight: 700, fontSize: "10.5pt", color: NAVY, marginBottom: 36, fontFamily: F }}>For Eject Solutions</div>
              <div style={{ borderTop: "1px solid #334155", width: 180, paddingTop: 5 }}>
                <div style={{ fontSize: "10pt", fontFamily: F }}>Authorised Signatory</div>
                <div style={{ fontSize: "9pt", color: "#64748b", fontFamily: F }}>Human Resources | Eject Solutions</div>
              </div>
            </td>
            <td style={{ width: "50%", verticalAlign: "top" }}>
              <div style={{ fontWeight: 700, fontSize: "10.5pt", color: NAVY, marginBottom: 36, fontFamily: F }}>Accepted by Candidate</div>
              <div style={{ borderTop: "1px solid #334155", width: 180, paddingTop: 5 }}>
                <div style={{ fontSize: "10pt", fontFamily: F }}>{d.candidate.fullName}</div>
                <div style={{ fontSize: "9pt", color: "#64748b", fontFamily: F }}>Date: ____________________</div>
              </div>
            </td>
          </tr></tbody>
        </table>
        <p style={{ fontSize: "10pt", textAlign: "center", color: "#334155", marginTop: 14, fontFamily: F }}>Place: Hyderabad, Telangana, India</p>
        <div style={{ height: 1, background: "#c8d3e6", margin: "14px 0 8px" }} />
        <p style={{ fontSize: "8.5pt", color: "#94a3b8", textAlign: "center", fontStyle: "italic", fontFamily: F }}>This is a computer-generated document. For queries, contact {d.hrEmail} | This document is strictly confidential.</p>
        <Footer pg={6} />
      </div>

    </div>
  );
}

/* ────────────────────── MAIN APP ────────────────────── */
export default function App() {
  const [data, setData] = useState(defaultData);
  const [tab, setTab] = useState("basic");
  const [downloading, setDownloading] = useState(false);
  const [mobileView, setMobileView] = useState("editor");
  const pdfReady = useHtml2Pdf();

  const setC = (k, v) => setData(d => ({ ...d, candidate: { ...d.candidate, [k]: v } }));
  const setComp = (key, monthly, annual) =>
    setData(d => ({ ...d, compensation: { ...d.compensation, [key]: { monthly, annual } } }));

  const downloadPDF = async () => {
    if (!pdfReady || !window.html2pdf) return;
    setDownloading(true);
    const el = document.getElementById("ol-document");
    const name = data.candidate.fullName.replace(/\s+/g, "_");
    const opt = {
      margin: 0,
      filename: `Eject_Solutions_OL_${name}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, scrollY: 0, windowWidth: 794 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: "css", before: ".pdf-page-break" },
    };
    await window.html2pdf().set(opt).from(el).save();
    setDownloading(false);
  };

  const tabs = [
    { id: "basic",     label: "📋 Basic" },
    { id: "candidate", label: "👤 Candidate" },
    { id: "comp",      label: "💰 Salary" },
    { id: "terms",     label: "📜 Terms" },
  ];

  const totalM = Object.values(data.compensation).reduce((s, c) => s + Number(c.monthly), 0);
  const totalA = Object.values(data.compensation).reduce((s, c) => s + Number(c.annual), 0);

  return (
    <>
      <style>{`
        .app-shell { display: flex; flex-direction: column; min-height: 100vh; }
        .topbar {
          background: ${NAVY}; color: #fff; padding: 12px 16px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 200;
          box-shadow: 0 2px 16px rgba(0,0,0,0.35); gap: 12px;
        }
        .topbar-title { font-weight: 800; font-size: 14px; letter-spacing: 0.08em; }
        .topbar-sub   { font-size: 9px; color: #94a3b8; letter-spacing: 0.12em; }
        .dl-btn {
          background: #2563a8; color: #fff; border: none; border-radius: 7px;
          padding: 9px 16px; font-weight: 700; font-size: 12px; cursor: pointer;
          font-family: 'Montserrat', sans-serif; letter-spacing: 0.04em;
          box-shadow: 0 2px 10px rgba(37,99,168,0.45);
          display: flex; align-items: center; gap: 6px; white-space: nowrap; flex-shrink: 0;
        }
        .dl-btn:disabled { background: #475569; cursor: not-allowed; }
        .mobile-toggle { display: none; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
        .mobile-toggle button {
          flex: 1; padding: 11px; border: none; cursor: pointer;
          font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 700;
          letter-spacing: 0.05em; transition: all 0.15s;
        }
        .mobile-toggle button.active { background: ${NAVY}; color: #fff; }
        .mobile-toggle button:not(.active) { background: transparent; color: #64748b; }
        .body-wrap {
          display: flex; flex: 1; padding: 20px; gap: 20px;
          max-width: 1380px; margin: 0 auto; width: 100%; align-items: flex-start;
        }
        .editor-panel {
          width: 310px; min-width: 280px; flex-shrink: 0; background: #fff;
          border-radius: 10px; box-shadow: 0 2px 16px rgba(0,0,0,0.08); overflow: hidden;
        }
        .tab-bar { display: flex; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
        .tab-btn {
          flex: 1; padding: 10px 3px; border: none; cursor: pointer;
          font-family: 'Montserrat', sans-serif; font-size: 10px;
          font-weight: 700; letter-spacing: 0.02em; transition: all 0.15s;
        }
        .tab-btn.active { background: ${NAVY}; color: #fff; border-bottom: 2px solid #2563a8; }
        .tab-btn:not(.active) { background: transparent; color: #64748b; border-bottom: 2px solid transparent; }
        .editor-content { padding: 16px; max-height: calc(100vh - 145px); overflow-y: auto; }
        .preview-panel { flex: 1; min-width: 0; }
        .preview-label { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .preview-inner { border-radius: 10px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.12); overflow-x: auto; }
        .salary-total { background: ${NAVY}; color: #fff; border-radius: 7px; padding: 10px 12px; margin-top: 10px; font-size: 12px; font-weight: 700; line-height: 1.6; }

        /* PDF page break helper — zero height, only for html2pdf */
        .pdf-page-break { page-break-before: always; break-before: page; height: 0; margin: 0; padding: 0; }

        @media (max-width: 768px) {
          .body-wrap { padding: 12px 12px 24px; flex-direction: column; gap: 0; }
          .mobile-toggle { display: flex; }
          .editor-panel { width: 100%; min-width: unset; border-radius: 0 0 10px 10px; display: none; }
          .editor-panel.mobile-visible { display: block; }
          .preview-panel { display: none; }
          .preview-panel.mobile-visible { display: block; width: 100%; }
          .editor-content { max-height: none; overflow-y: visible; }
          .tab-btn { font-size: 9px; padding: 10px 1px; }
          .preview-label { display: none; }
          .preview-inner { border-radius: 8px; }
          .topbar { padding: 10px 12px; }
          .topbar-title { font-size: 13px; }
          .dl-btn { padding: 8px 12px; font-size: 11px; }
        }
        @media (min-width: 769px) {
          .mobile-toggle { display: none !important; }
          .editor-panel { display: block !important; }
          .preview-panel { display: block !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid #fff; border-top-color: transparent; border-radius: 50%; animation: spin 0.7s linear infinite; }
      `}</style>

      <div className="app-shell">

        {/* TOP BAR */}
        <div className="topbar">
          <div>
            <div className="topbar-title">EJECT SOLUTIONS</div>
            <div className="topbar-sub">OFFER LETTER EDITOR</div>
          </div>
          <button className="dl-btn" onClick={downloadPDF} disabled={downloading || !pdfReady}>
            {downloading ? <><span className="spinner" /> Generating…</> : <>⬇ Download PDF</>}
          </button>
        </div>

        {/* MOBILE TOGGLE */}
        <div className="mobile-toggle">
          <button className={mobileView === "editor" ? "active" : ""} onClick={() => setMobileView("editor")}>✏️ Editor</button>
          <button className={mobileView === "preview" ? "active" : ""} onClick={() => setMobileView("preview")}>👁 Preview</button>
        </div>

        {/* BODY */}
        <div className="body-wrap">

          {/* EDITOR PANEL */}
          <div className={`editor-panel${mobileView === "editor" ? " mobile-visible" : ""}`}>
            <div className="tab-bar">
              {tabs.map(t => (
                <button key={t.id} className={`tab-btn${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>
              ))}
            </div>
            <div className="editor-content">
              {tab === "basic" && <>
                <Field label="Ref Number"     value={data.refNo}          onChange={v => setData(d => ({ ...d, refNo: v }))} />
                <Field label="Issue Date"     value={data.issueDate}      onChange={v => setData(d => ({ ...d, issueDate: v }))} />
                <Field label="Joining Date"   value={data.joiningDate}    onChange={v => setData(d => ({ ...d, joiningDate: v }))} />
                <Field label="Offer Validity" value={data.offerValidity}  onChange={v => setData(d => ({ ...d, offerValidity: v }))} />
                <Field label="HR Email"       value={data.hrEmail}        onChange={v => setData(d => ({ ...d, hrEmail: v }))} />
              </>}
              {tab === "candidate" && <>
                <Field label="Full Name"       value={data.candidate.fullName}       onChange={v => setC("fullName", v)} />
                <Field label="Designation"     value={data.candidate.designation}    onChange={v => setC("designation", v)} />
                <Field label="Department"      value={data.candidate.department}     onChange={v => setC("department", v)} />
                <Field label="Employment Type" value={data.candidate.employmentType} onChange={v => setC("employmentType", v)} />
                <Field label="Work Location"   value={data.candidate.workLocation}   onChange={v => setC("workLocation", v)} />
                <Field label="Reporting To"    value={data.candidate.reportingTo}    onChange={v => setC("reportingTo", v)} />
                <Field label="Mobile"          value={data.candidate.mobile}         onChange={v => setC("mobile", v)} />
                <Field label="Email"           value={data.candidate.email}          onChange={v => setC("email", v)} />
              </>}
              {tab === "comp" && <>
                <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 14 }}>Edit monthly → annual auto-calc (×12)</p>
                {[["Basic Salary","basic"],["HRA","hra"],["Special Allowance","special"],["Medical","medical"],["Transport","transport"]].map(([label, key]) => (
                  <SalaryRow key={key} label={label} m={data.compensation[key].monthly} a={data.compensation[key].annual} onChange={(m, a) => setComp(key, m, a)} />
                ))}
                <div className="salary-total">Monthly: ₹{INR(totalM)}<br />Annual CTC: ₹{INR(totalA)}</div>
                <div style={{ marginTop: 14 }}>
                  <Field label="CTC in Words" value={data.ctcWords} onChange={v => setData(d => ({ ...d, ctcWords: v }))} />
                </div>
              </>}
              {tab === "terms" && <>
                <Field label="Probation Duration"        value={data.probationMonths} onChange={v => setData(d => ({ ...d, probationMonths: v }))} />
                <Field label="Notice Period (Confirmed)" value={data.noticeDays}      onChange={v => setData(d => ({ ...d, noticeDays: v }))} />
                <Field label="Notice Period (Probation)" value={data.noticeProb}      onChange={v => setData(d => ({ ...d, noticeProb: v }))} />
              </>}
            </div>
          </div>

          {/* PREVIEW PANEL */}
          <div className={`preview-panel${mobileView === "preview" ? " mobile-visible" : ""}`}>
            <div className="preview-label">
              <div style={{ height: 2.5, width: 20, background: "#2563a8", borderRadius: 2 }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.12em" }}>LIVE PREVIEW</span>
            </div>
            <div className="preview-inner">
              <OfferLetterDoc d={data} />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
