import { useState, useEffect } from "react";

/* ── Load jsPDF + html2canvas ── */
function useLibs() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const loaded = { jspdf: !!window.jspdf, h2c: !!window.html2canvas };
    if (loaded.jspdf && loaded.h2c) { setReady(true); return; }
    let count = 0;
    const check = () => { count++; if (count === 2) setReady(true); };
    if (!window.jspdf) {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      s.onload = check; document.head.appendChild(s);
    } else check();
    if (!window.html2canvas) {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      s.onload = check; document.head.appendChild(s);
    } else check();
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

/* ── A4 dimensions at 96dpi ── */
const A4_W_PX = 794;   // 210mm @ 96dpi
const A4_H_PX = 1123;  // 297mm @ 96dpi

function Field({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#f5c518", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4, fontFamily: "monospace" }}>{label}</div>
      <input value={value} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #1e3050", borderRadius: 6, fontSize: 13, fontFamily: FONT, color: "#e8edf5", outline: "none", background: "#0d1b2e", transition: "border-color 0.15s" }}
        onFocus={e => { e.target.style.borderColor = "#f5c518"; e.target.style.boxShadow = "0 0 0 2px rgba(245,197,24,0.15)"; }}
        onBlur={e => { e.target.style.borderColor = "#1e3050"; e.target.style.boxShadow = "none"; }}
      />
    </div>
  );
}

function SalaryRow({ label, m, a, onChange }) {
  const inputStyle = { width: "100%", border: "1.5px solid #1e3050", borderRadius: 6, padding: "8px 10px", fontSize: 12, fontFamily: FONT, outline: "none", background: "#0d1b2e", color: "#e8edf5", transition: "border-color 0.15s" };
  const focus = e => { e.target.style.borderColor = "#f5c518"; e.target.style.boxShadow = "0 0 0 2px rgba(245,197,24,0.15)"; };
  const blur  = e => { e.target.style.borderColor = "#1e3050"; e.target.style.boxShadow = "none"; };
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#f5c518", marginBottom: 5 }}>{label}</div>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, color: "#7a8fa6", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>Monthly ₹</div>
          <input type="number" value={m} onChange={e => onChange(Number(e.target.value), Number(e.target.value) * 12)}
            style={inputStyle} onFocus={focus} onBlur={blur} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, color: "#7a8fa6", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>Annual ₹</div>
          <input type="number" value={a} onChange={e => onChange(Math.round(Number(e.target.value) / 12), Number(e.target.value))}
            style={inputStyle} onFocus={focus} onBlur={blur} />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   OFFER LETTER — each page is a separate div
   with data-pdf-page attribute
══════════════════════════════════════════ */
function OfferLetterDoc({ d }) {
  const comp = d.compensation;
  const totalM = Object.values(comp).reduce((s, c) => s + Number(c.monthly), 0);
  const totalA = Object.values(comp).reduce((s, c) => s + Number(c.annual), 0);
  const F = FONT;

  const secTitle = { fontSize: 11, fontWeight: 800, color: NAVY, letterSpacing: "0.05em", textTransform: "uppercase", borderBottom: `2px solid ${BLUE}`, paddingBottom: 4, marginBottom: 10, marginTop: 18, fontFamily: F };
  const subHead  = { fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 3, marginTop: 12, fontFamily: F };
  const bodyP    = { fontSize: 10, marginBottom: 8, textAlign: "justify", fontFamily: F };
  const tblWrap  = { width: "100%", borderCollapse: "collapse", marginBottom: 10, fontSize: 10, fontFamily: F };
  const th       = { background: NAVY, color: "#fff", padding: "7px 10px", fontWeight: 700, textAlign: "left", fontSize: 9.5, fontFamily: F };
  const thR      = { ...th, textAlign: "right" };
  const tdL      = { padding: "6px 10px", fontWeight: 700, color: NAVY, background: "#eef2f8", borderBottom: "1px solid #dde3ed", width: "36%", fontSize: 9.5, verticalAlign: "top", fontFamily: F };
  const tdV      = { padding: "6px 10px", borderBottom: "1px solid #dde3ed", fontSize: 9.5, verticalAlign: "top", fontFamily: F };
  const tdN      = { padding: "6px 10px", borderBottom: "1px solid #dde3ed", textAlign: "right", fontSize: 9.5, fontFamily: F };
  const tblBorder = "1px solid #c8d3e6";

  const pageStyle = {
    width: A4_W_PX, minHeight: A4_H_PX, background: "#fff",
    boxSizing: "border-box", position: "relative", overflow: "hidden",
  };
  const contentPage = { ...pageStyle, padding: "53px 60px 60px" };

  const Footer = ({ pg }) => (
    <div style={{ position: "absolute", bottom: 10, left: 60, right: 60, borderTop: "1px solid #dde3ed", paddingTop: 5, display: "flex", justifyContent: "space-between", fontSize: 8, color: "#94a3b8", fontFamily: F }}>
      <span>Eject Solutions | Confidential Offer Letter</span>
      <span>Page {pg}</span>
    </div>
  );

  const Letterhead = () => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: NAVY, letterSpacing: "0.08em", fontFamily: F }}>EJECT SOLUTIONS</div>
      <div style={{ fontSize: 9.5, color: BLUE, fontStyle: "italic", fontFamily: F }}>Empowering Digital Innovation</div>
      <div style={{ fontSize: 9, color: "#64748b", fontFamily: F }}>www.ejectsolutions.com | {d.hrEmail}</div>
      <div style={{ height: 1, background: "#c8d3e6", margin: "8px 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, fontFamily: F }}>
        <span>Ref. No: {d.refNo}</span><span>Date: {d.issueDate}</span>
      </div>
      <div style={{ height: 1, background: "#c8d3e6", margin: "8px 0 14px" }} />
    </div>
  );

  return (
    <div id="ol-pages">

      {/* PAGE 1 — Cover */}
      <div data-pdf-page="1" style={{ ...pageStyle, display: "flex", flexDirection: "column" }}>
        <div style={{ background: NAVY, height: A4_H_PX * 0.28, width: "100%", flexShrink: 0 }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 80px", textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: NAVY, letterSpacing: "0.1em", marginBottom: 4, fontFamily: F }}>EJECT SOLUTIONS</div>
          <div style={{ fontSize: 11, color: BLUE, fontStyle: "italic", marginBottom: 20, fontFamily: F }}>Empowering Digital Innovation</div>
          <div style={{ width: 220, height: 2, background: BLUE, marginBottom: 20 }} />
          <div style={{ fontSize: 18, fontWeight: 800, color: NAVY, letterSpacing: "0.12em", marginBottom: 4, fontFamily: F }}>OFFER OF EMPLOYMENT</div>
          <div style={{ fontSize: 11, color: BLUE, fontStyle: "italic", marginBottom: 20, fontFamily: F }}>Letter of Appointment</div>
          <div style={{ width: 220, height: 2, background: BLUE, marginBottom: 28 }} />
          <div style={{ fontSize: 9.5, color: "#64748b", marginBottom: 6, fontFamily: F }}>Prepared for:</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: NAVY, marginBottom: 3, fontFamily: F }}>{d.candidate.fullName}</div>
          <div style={{ fontSize: 11, color: BLUE, marginBottom: 20, fontFamily: F }}>{d.candidate.designation}</div>
          <div style={{ fontSize: 9.5, color: "#64748b", fontFamily: F }}>Date of Issue: {d.issueDate}</div>
          <div style={{ fontSize: 9.5, color: "#64748b", fontFamily: F }}>Date of Joining: {d.joiningDate}</div>
        </div>
        <div style={{ background: NAVY, height: 48, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", fontFamily: F }}>CONFIDENTIAL | EJECT SOLUTIONS</span>
        </div>
      </div>

      {/* PAGE 2 — Letter of Offer + Appointment Details */}
      <div data-pdf-page="2" style={contentPage}>
        <Letterhead />
        <p style={{ ...bodyP, fontWeight: 700 }}>Dear {d.candidate.fullName},</p>
        <div style={secTitle}>1. Letter of Offer</div>
        <p style={bodyP}>We are delighted to extend this formal offer of employment to you at <strong>Eject Solutions</strong>. After a thorough evaluation of your profile, experience, and skill set, we are pleased to welcome you to our team as a <span style={{ color: BLUE, fontWeight: 700 }}>{d.candidate.designation}</span>. Your expertise in Generative AI, LLM engineering, and full stack development aligns perfectly with our vision and growth trajectory.</p>
        <p style={bodyP}>This offer is extended contingent upon successful completion of all pre-employment verification formalities as outlined herein. We look forward to having you as a key contributor to Eject Solutions.</p>
        <div style={secTitle}>2. Appointment Details</div>
        <table style={{ ...tblWrap, border: tblBorder }}>
          <tbody>
            {[["Full Name",d.candidate.fullName],["Designation",d.candidate.designation],["Department",d.candidate.department],["Date of Joining",d.joiningDate],["Employment Type",d.candidate.employmentType],["Work Location",d.candidate.workLocation],["Reporting To",d.candidate.reportingTo],["Mobile",d.candidate.mobile],["Email",d.candidate.email]].map(([k,v])=>(
              <tr key={k}><td style={tdL}>{k}</td><td style={tdV}>{v}</td></tr>
            ))}
          </tbody>
        </table>
        <Footer pg={2} />
      </div>

      {/* PAGE 3 — Compensation + Responsibilities */}
      <div data-pdf-page="3" style={contentPage}>
        <div style={secTitle}>3. Compensation &amp; Benefits</div>
        <p style={bodyP}>Your compensation package has been structured competitively to reflect your experience and the scope of the role. The total fixed Cost to Company (CTC) is detailed below:</p>
        <table style={{ ...tblWrap, border: tblBorder }}>
          <thead><tr><th style={th}>Component</th><th style={thR}>Monthly (INR)</th><th style={thR}>Annual (INR)</th></tr></thead>
          <tbody>
            {[["Basic Salary",comp.basic],["House Rent Allowance (HRA)",comp.hra],["Special Allowance",comp.special],["Medical Allowance",comp.medical],["Transport / Fuel Allowance",comp.transport]].map(([label,c])=>(
              <tr key={label}><td style={{...tdV,width:"50%"}}>{label}</td><td style={tdN}>{INR(c.monthly)}</td><td style={tdN}>{INR(c.annual)}</td></tr>
            ))}
            <tr>
              <td style={{...tdV,background:NAVY,color:"#fff",fontWeight:800,border:"none"}}>TOTAL FIXED CTC</td>
              <td style={{...tdN,background:NAVY,color:"#fff",fontWeight:800,border:"none"}}>{INR(totalM)}</td>
              <td style={{...tdN,background:NAVY,color:"#fff",fontWeight:800,border:"none"}}>{INR(totalA)}</td>
            </tr>
          </tbody>
        </table>
        <p style={{...bodyP,fontSize:9.5}}><strong>Note:</strong> The above compensation is a fixed annual CTC of <strong style={{color:BLUE}}>INR {INR(totalA)} (Rupees {d.ctcWords})</strong>. All components are payable as per company policy. Statutory deductions (PF, TDS, ESI if applicable) will be applied as per prevailing regulations.</p>
        <div style={secTitle}>4. Role &amp; Key Responsibilities</div>
        <p style={bodyP}>As a {d.candidate.designation} at Eject Solutions, you will be expected to contribute across the following areas:</p>
        <ul style={{paddingLeft:18,fontSize:10,lineHeight:1.6,marginBottom:8,fontFamily:F}}>
          {["Design, develop, and deploy Generative AI applications leveraging LLMs including OpenAI, Gemini, AWS Bedrock, and Groq.","Build and maintain RAG (Retrieval Augmented Generation) pipelines with vector databases (ChromaDB, Qdrant) for enterprise knowledge retrieval.","Develop agentic AI systems using LangChain and LangGraph, including multi-step ReAct agent orchestration.","Build scalable backend APIs using FastAPI (Python) and Node.js/Express.js for AI-driven product features.","Develop responsive frontend interfaces using React.js and Next.js, consuming AI and backend services.","Deploy and manage containerized microservices on AWS (EKS, Lambda, RDS, S3, ElastiCache) with CI/CD pipelines via GitHub Actions.","Collaborate with product, design, and data science teams to translate business requirements into production-grade AI solutions.","Contribute to code reviews, technical documentation, and continuous improvement of engineering standards.","Stay current with the rapidly evolving GenAI landscape and propose innovative solutions."].map((item,i)=>(
            <li key={i} style={{marginBottom:3}}>{item}</li>
          ))}
        </ul>
        <Footer pg={3} />
      </div>

      {/* PAGE 4 — Terms & Conditions */}
      <div data-pdf-page="4" style={contentPage}>
        <div style={secTitle}>5. Terms &amp; Conditions of Employment</div>
        {[
          ["5.1 Probation Period",`You will be on a probationary period of ${d.probationMonths} months from the date of joining. During this period, your performance will be reviewed, and upon satisfactory completion, you will be confirmed as a permanent employee. The company reserves the right to extend probation by an additional three (3) months based on performance evaluation.`],
          ["5.2 Working Hours & Location",`Your primary work location will be Hyderabad, Telangana, with a hybrid working arrangement (a minimum of three days per week at the office). Standard working hours are 9:00 AM to 6:00 PM (Monday to Friday), with flexibility as required by project demands.`],
          ["5.3 Confidentiality & Intellectual Property",`You are required to sign and adhere to Eject Solutions' Non-Disclosure Agreement (NDA) and Intellectual Property (IP) Assignment Agreement on or before the date of joining. All work, code, inventions, and deliverables created during your tenure shall be the exclusive property of Eject Solutions.`],
          ["5.4 Notice Period",`Either party may terminate the employment by providing a notice period of ${d.noticeDays} days in writing. During the probation period, the notice period shall be ${d.noticeProb} days from either side. The company reserves the right to pay in lieu of notice.`],
          ["5.5 Background Verification",`This offer is subject to satisfactory completion of background verification checks, including but not limited to employment history, educational credentials, identity verification, and reference checks. Any discrepancy found may result in withdrawal of this offer or termination of employment.`],
          ["5.6 Code of Conduct",`You are expected to adhere to Eject Solutions' Code of Conduct, policies, and procedures as communicated from time to time. This includes but is not limited to data security policies, anti-harassment policies, and professional ethics standards.`],
        ].map(([title,body])=>(
          <div key={title}><div style={subHead}>{title}</div><p style={bodyP}>{body}</p></div>
        ))}
        <Footer pg={4} />
      </div>

      {/* PAGE 5 — Employee Benefits + Offer Validity */}
      <div data-pdf-page="5" style={contentPage}>
        <div style={secTitle}>6. Employee Benefits</div>
        <p style={bodyP}>In addition to your fixed compensation, you will be entitled to the following benefits as part of your employment at Eject Solutions:</p>
        <table style={{...tblWrap,border:tblBorder}}>
          <thead><tr><th style={{...th,width:"35%"}}>Benefit</th><th style={th}>Details</th></tr></thead>
          <tbody>
            {[["Health Insurance","Group medical insurance coverage of INR 5 Lakhs for employee and immediate family (spouse & 2 children)"],["Annual Leave","18 days of paid annual leave per calendar year, accrued monthly"],["Sick Leave","10 days of paid sick leave per calendar year"],["Public Holidays","As per Government of Telangana and national holiday calendar"],["Learning & Development","Annual budget of INR 30,000 for certifications, courses, and conferences"],["Performance Bonus","Annual performance-linked bonus subject to company and individual performance (to be communicated separately)"],["Flexible Working","Hybrid model with flexible timing as per team and project requirements"],["Team Events","Quarterly team outings and annual company offsite"]].map(([k,v])=>(
              <tr key={k}><td style={tdL}>{k}</td><td style={tdV}>{v}</td></tr>
            ))}
          </tbody>
        </table>
        <div style={secTitle}>7. Offer Validity</div>
        <p style={bodyP}>This offer of employment is valid until <strong>{d.offerValidity}</strong>. Kindly revert with your acceptance by signing and returning a copy of this letter before the stated deadline. Failure to respond within the stipulated time may result in the offer being withdrawn.</p>
        <p style={bodyP}>To formally accept this offer, please sign the acceptance section at the end of this document and send a scanned copy to <span style={{color:BLUE}}>{d.hrEmail}</span>. Please carry the original signed copy on your date of joining along with the required documents listed in the next section.</p>
        <Footer pg={5} />
      </div>

      {/* PAGE 6 — Documents + Acceptance */}
      <div data-pdf-page="6" style={contentPage}>
        <div style={secTitle}>8. Documents to be Submitted on Joining</div>
        <p style={bodyP}>Please carry the following documents in original along with self-attested photocopies on your date of joining:</p>
        <ol style={{paddingLeft:20,fontSize:10,lineHeight:1.7,marginBottom:20,fontFamily:F}}>
          {["Recent passport-sized photographs (4 copies)","Aadhaar Card (original + photocopy)","PAN Card (original + photocopy)","Class 10th and 12th mark sheets and passing certificates","B.Tech / Graduation degree certificate and all semester mark sheets (KL University, 2022)","Previous employment offer letter(s), appointment letter(s), and experience letter(s)","Last 3 months' salary slips from most recent employer","Bank account details (cancelled cheque / bank passbook copy)","No Objection Certificate (NOC) from previous employer, if applicable","Any certifications relevant to your role (Full Stack, Node.js, or others)"].map((item,i)=>(
            <li key={i}>{item}</li>
          ))}
        </ol>
        <div style={secTitle}>9. Acceptance of Offer</div>
        <p style={bodyP}>By signing below, you acknowledge that you have read, understood, and accepted all the terms and conditions outlined in this offer letter. You confirm that the information provided by you during the recruitment process is accurate and complete, and you agree to abide by all policies of Eject Solutions.</p>
        <table style={{width:"100%",borderCollapse:"collapse",marginTop:24,marginBottom:16,fontFamily:F}}>
          <tbody><tr>
            <td style={{width:"50%",verticalAlign:"top",paddingRight:28}}>
              <div style={{fontWeight:700,fontSize:11,color:NAVY,marginBottom:36,fontFamily:F}}>For Eject Solutions</div>
              <div style={{borderTop:"1px solid #334155",width:180,paddingTop:5}}>
                <div style={{fontSize:10,fontFamily:F}}>Authorised Signatory</div>
                <div style={{fontSize:9,color:"#64748b",fontFamily:F}}>Human Resources | Eject Solutions</div>
              </div>
            </td>
            <td style={{width:"50%",verticalAlign:"top"}}>
              <div style={{fontWeight:700,fontSize:11,color:NAVY,marginBottom:36,fontFamily:F}}>Accepted by Candidate</div>
              <div style={{borderTop:"1px solid #334155",width:180,paddingTop:5}}>
                <div style={{fontSize:10,fontFamily:F}}>{d.candidate.fullName}</div>
                <div style={{fontSize:9,color:"#64748b",fontFamily:F}}>Date: ____________________</div>
              </div>
            </td>
          </tr></tbody>
        </table>
        <p style={{fontSize:10,textAlign:"center",color:"#334155",marginTop:14,fontFamily:F}}>Place: Hyderabad, Telangana, India</p>
        <div style={{height:1,background:"#c8d3e6",margin:"14px 0 8px"}} />
        <p style={{fontSize:8.5,color:"#94a3b8",textAlign:"center",fontStyle:"italic",fontFamily:F}}>This is a computer-generated document. For queries, contact {d.hrEmail} | This document is strictly confidential.</p>
        <Footer pg={6} />
      </div>

    </div>
  );
}

/* ════════ MAIN APP ════════ */
export default function App() {
  const [data, setData] = useState(defaultData);
  const [tab, setTab] = useState("basic");
  const [downloading, setDownloading] = useState(false);
  const [mobileView, setMobileView] = useState("editor");
  const libsReady = useLibs();

  const setC = (k, v) => setData(d => ({ ...d, candidate: { ...d.candidate, [k]: v } }));
  const setComp = (key, monthly, annual) =>
    setData(d => ({ ...d, compensation: { ...d.compensation, [key]: { monthly, annual } } }));

  /* ── PDF generation: capture each page div separately → one PDF ── */
  const downloadPDF = async () => {
    if (!libsReady) return;
    setDownloading(true);
    try {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const A4_W_MM = 210, A4_H_MM = 297;
      const pages = document.querySelectorAll("[data-pdf-page]");

      for (let i = 0; i < pages.length; i++) {
        const el = pages[i];
        const canvas = await window.html2canvas(el, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          width: A4_W_PX,
          height: A4_H_PX,
          windowWidth: A4_W_PX,
          scrollX: 0, scrollY: 0,
        });
        const imgData = canvas.toDataURL("image/jpeg", 0.97);
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, 0, A4_W_MM, A4_H_MM);
      }

      const name = data.candidate.fullName.replace(/\s+/g, "_");
      pdf.save(`Eject_Solutions_OL_${name}.pdf`);
    } catch (e) {
      console.error("PDF error:", e);
    }
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
        /* ── Deep Navy + Yellow Theme ── */
        :root {
          --ui-navy:    #0d1b2e;
          --ui-navy2:   #112240;
          --ui-navy3:   #1a3560;
          --ui-yellow:  #f5c518;
          --ui-yellow2: #ffd84d;
          --ui-yellow3: #fff3b0;
          --ui-text:    #e8edf5;
          --ui-muted:   #7a8fa6;
          --ui-border:  #1e3050;
          --ui-bg:      #0a1628;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--ui-bg); font-family: 'Montserrat', sans-serif; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: var(--ui-navy); }
        ::-webkit-scrollbar-thumb { background: var(--ui-yellow); border-radius: 3px; }

        .app-shell { display: flex; flex-direction: column; min-height: 100vh; background: var(--ui-bg); }

        /* TOP BAR */
        .topbar {
          background: var(--ui-navy); color: var(--ui-text);
          padding: 12px 20px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 200;
          box-shadow: 0 2px 20px rgba(0,0,0,0.6);
          border-bottom: 2px solid var(--ui-yellow); gap: 12px;
        }
        .topbar-brand { display: flex; align-items: center; gap: 10px; }
        .topbar-dot { width: 8px; height: 8px; background: var(--ui-yellow); border-radius: 50%; flex-shrink: 0; }
        .topbar-title { font-weight: 800; font-size: 15px; letter-spacing: 0.1em; color: #fff; }
        .topbar-sub   { font-size: 9px; color: var(--ui-yellow); letter-spacing: 0.15em; margin-top: 1px; }

        .dl-btn {
          background: var(--ui-yellow); color: var(--ui-navy);
          border: none; border-radius: 7px;
          padding: 9px 18px; font-weight: 800; font-size: 12px; cursor: pointer;
          font-family: 'Montserrat', sans-serif; letter-spacing: 0.05em;
          box-shadow: 0 2px 12px rgba(245,197,24,0.4);
          display: flex; align-items: center; gap: 6px;
          white-space: nowrap; flex-shrink: 0; transition: background 0.15s, transform 0.1s;
        }
        .dl-btn:hover:not(:disabled) { background: var(--ui-yellow2); transform: translateY(-1px); }
        .dl-btn:disabled { background: #2a3f5f; color: var(--ui-muted); cursor: not-allowed; box-shadow: none; }

        /* MOBILE TOGGLE */
        .mobile-toggle { display: none; background: var(--ui-navy2); border-bottom: 1px solid var(--ui-border); }
        .mobile-toggle button {
          flex: 1; padding: 11px; border: none; cursor: pointer;
          font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 700;
          letter-spacing: 0.05em; transition: all 0.15s;
        }
        .mobile-toggle button.active {
          background: var(--ui-yellow); color: var(--ui-navy);
          border-bottom: 2px solid var(--ui-yellow2);
        }
        .mobile-toggle button:not(.active) {
          background: transparent; color: var(--ui-muted);
          border-bottom: 2px solid transparent;
        }

        /* BODY */
        .body-wrap {
          display: flex; flex: 1; padding: 20px; gap: 20px;
          max-width: 1380px; margin: 0 auto; width: 100%; align-items: flex-start;
        }

        /* EDITOR PANEL */
        .editor-panel {
          width: 310px; min-width: 280px; flex-shrink: 0;
          background: var(--ui-navy2);
          border: 1px solid var(--ui-border);
          border-radius: 10px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.4); overflow: hidden;
        }
        .tab-bar {
          display: flex; background: var(--ui-navy);
          border-bottom: 1px solid var(--ui-border);
        }
        .tab-btn {
          flex: 1; padding: 11px 3px; border: none; cursor: pointer;
          font-family: 'Montserrat', sans-serif; font-size: 10px;
          font-weight: 700; letter-spacing: 0.02em; transition: all 0.15s;
        }
        .tab-btn.active {
          background: var(--ui-yellow); color: var(--ui-navy);
          border-bottom: 2px solid var(--ui-yellow2);
        }
        .tab-btn:not(.active) {
          background: transparent; color: var(--ui-muted);
          border-bottom: 2px solid transparent;
        }
        .tab-btn:not(.active):hover { color: var(--ui-yellow); }

        .editor-content {
          padding: 16px; max-height: calc(100vh - 145px); overflow-y: auto;
          background: var(--ui-navy2);
        }

        /* Override Field inputs inside dark panel */
        .editor-content input {
          background: var(--ui-navy) !important;
          border-color: var(--ui-border) !important;
          color: var(--ui-text) !important;
        }
        .editor-content input:focus {
          border-color: var(--ui-yellow) !important;
          box-shadow: 0 0 0 2px rgba(245,197,24,0.15);
        }

        /* Field labels inside dark panel */
        .editor-content .field-label { color: var(--ui-yellow) !important; }

        /* Salary section text */
        .editor-content p { color: var(--ui-muted); }
        .salary-label { color: var(--ui-yellow) !important; }

        /* PREVIEW */
        .preview-panel { flex: 1; min-width: 0; }
        .preview-label { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .preview-label span { color: var(--ui-yellow); }
        .preview-scroll { overflow-x: auto; border-radius: 10px; box-shadow: 0 4px 28px rgba(0,0,0,0.5); }

        #ol-pages {
          background: var(--ui-bg);
          display: flex; flex-direction: column; gap: 16px; padding: 16px;
        }
        #ol-pages > div {
          border-radius: 4px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,197,24,0.08);
        }

        .salary-total {
          background: var(--ui-yellow); color: var(--ui-navy);
          border-radius: 7px; padding: 10px 12px; margin-top: 10px;
          font-size: 12px; font-weight: 800; line-height: 1.6;
        }

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
        .spinner {
          display: inline-block; width: 14px; height: 14px;
          border: 2px solid var(--ui-navy); border-top-color: transparent;
          border-radius: 50%; animation: spin 0.7s linear infinite;
        }
      `}</style>

      <div className="app-shell">
        <div className="topbar">
          <div className="topbar-brand">
            <div className="topbar-dot" />
            <div>
              <div className="topbar-title">EJECT SOLUTIONS</div>
              <div className="topbar-sub">OFFER LETTER EDITOR</div>
            </div>
          </div>
          <button className="dl-btn" onClick={downloadPDF} disabled={downloading || !libsReady}>
            {downloading ? <><span className="spinner" /> Generating…</> : <>⬇ Download PDF</>}
          </button>
        </div>

        <div className="mobile-toggle">
          <button className={mobileView === "editor" ? "active" : ""} onClick={() => setMobileView("editor")}>✏️ Editor</button>
          <button className={mobileView === "preview" ? "active" : ""} onClick={() => setMobileView("preview")}>👁 Preview</button>
        </div>

        <div className="body-wrap">
          <div className={`editor-panel${mobileView === "editor" ? " mobile-visible" : ""}`}>
            <div className="tab-bar">
              {tabs.map(t => (
                <button key={t.id} className={`tab-btn${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>
              ))}
            </div>
            <div className="editor-content">
              {tab === "basic" && <>
                <Field label="Ref Number"     value={data.refNo}         onChange={v => setData(d => ({ ...d, refNo: v }))} />
                <Field label="Issue Date"     value={data.issueDate}     onChange={v => setData(d => ({ ...d, issueDate: v }))} />
                <Field label="Joining Date"   value={data.joiningDate}   onChange={v => setData(d => ({ ...d, joiningDate: v }))} />
                <Field label="Offer Validity" value={data.offerValidity} onChange={v => setData(d => ({ ...d, offerValidity: v }))} />
                <Field label="HR Email"       value={data.hrEmail}       onChange={v => setData(d => ({ ...d, hrEmail: v }))} />
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
                <p style={{ fontSize: 11, color: "#7a8fa6", marginBottom: 14 }}>Edit monthly → annual auto-calc (×12)</p>
                {[["Basic Salary","basic"],["HRA","hra"],["Special Allowance","special"],["Medical","medical"],["Transport","transport"]].map(([label, key]) => (
                  <SalaryRow key={key} label={label} m={data.compensation[key].monthly} a={data.compensation[key].annual} onChange={(m,a) => setComp(key,m,a)} />
                ))}
                <div className="salary-total">Monthly: ₹{INR(totalM)}<br/>Annual CTC: ₹{INR(totalA)}</div>
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

          <div className={`preview-panel${mobileView === "preview" ? " mobile-visible" : ""}`}>
            <div className="preview-label">
              <div style={{ height: 2.5, width: 20, background: "#f5c518", borderRadius: 2 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em" }}>LIVE PREVIEW</span>
            </div>
            <div className="preview-scroll">
              <OfferLetterDoc d={data} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
