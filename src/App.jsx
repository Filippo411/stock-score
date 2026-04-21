import { useState, useCallback, useEffect } from "react";

const DEFAULTS = {
  ticker: "", price: "",
  pe: "", ps: "", revenueGrowth: "", grossMargin: "", debtEquity: "", analystTarget: "",
  forwardPe: "", peg: "", pb: "", evEbitda: "",
  roe: "", roic: "", netMargin: "", fcfMargin: "",
  epsGrowth: "", fcfGrowth: "",
  netDebtEbitda: "", currentRatio: "", interestCoverage: "",
  dividendYield: "", payoutRatio: "", insiderBuying: false,
  aboveSma50: false, aboveSma200: false, rsi: "", macdBullish: false, volumeConfirm: false,
  goldenCross: false, breakoutPattern: false, nearSupport: false,
  bullishCandle: false, divergence: false, distFrom52High: "", beta: "",
};

function score(vals) {
  let fund = 0, tech = 0, fundMax = 0, techMax = 0;
  const n = (v) => v === "" || v === undefined || v === null ? null : parseFloat(v);
  const pe = n(vals.pe);
  if (pe !== null) { fundMax += 8; if (pe > 0 && pe < 12) fund += 8; else if (pe < 18) fund += 6; else if (pe < 25) fund += 4; else if (pe < 40) fund += 2; }
  const fpe = n(vals.forwardPe);
  if (fpe !== null) { fundMax += 7; if (fpe > 0 && fpe < 12) fund += 7; else if (fpe < 18) fund += 5; else if (fpe < 25) fund += 3; else if (fpe < 40) fund += 1; }
  const peg = n(vals.peg);
  if (peg !== null) { fundMax += 10; if (peg > 0 && peg < 1) fund += 10; else if (peg < 1.5) fund += 7; else if (peg < 2) fund += 4; else fund += 1; }
  const ps = n(vals.ps);
  if (ps !== null) { fundMax += 8; if (ps < 2) fund += 8; else if (ps < 5) fund += 6; else if (ps < 10) fund += 4; else if (ps < 20) fund += 2; }
  const pb = n(vals.pb);
  if (pb !== null) { fundMax += 5; if (pb < 1) fund += 5; else if (pb < 2) fund += 4; else if (pb < 3) fund += 2; }
  const eve = n(vals.evEbitda);
  if (eve !== null) { fundMax += 7; if (eve > 0 && eve < 8) fund += 7; else if (eve < 12) fund += 5; else if (eve < 18) fund += 3; else fund += 1; }
  const roe = n(vals.roe);
  if (roe !== null) { fundMax += 6; if (roe > 20) fund += 6; else if (roe > 15) fund += 5; else if (roe > 10) fund += 3; else if (roe > 5) fund += 1; }
  const roic = n(vals.roic);
  if (roic !== null) { fundMax += 7; if (roic > 15) fund += 7; else if (roic > 10) fund += 5; else if (roic > 5) fund += 3; }
  const gm = n(vals.grossMargin);
  if (gm !== null) { fundMax += 6; if (gm > 50) fund += 6; else if (gm > 35) fund += 5; else if (gm > 20) fund += 3; else if (gm > 0) fund += 1; }
  const nm = n(vals.netMargin);
  if (nm !== null) { fundMax += 6; if (nm > 15) fund += 6; else if (nm > 10) fund += 5; else if (nm > 5) fund += 3; else if (nm > 0) fund += 1; }
  const fcfm = n(vals.fcfMargin);
  if (fcfm !== null) { fundMax += 6; if (fcfm > 15) fund += 6; else if (fcfm > 10) fund += 5; else if (fcfm > 5) fund += 3; else if (fcfm > 0) fund += 1; }
  const rg = n(vals.revenueGrowth);
  if (rg !== null) { fundMax += 9; if (rg > 30) fund += 9; else if (rg > 15) fund += 7; else if (rg > 5) fund += 4; else if (rg > 0) fund += 2; }
  const eg = n(vals.epsGrowth);
  if (eg !== null) { fundMax += 7; if (eg > 25) fund += 7; else if (eg > 15) fund += 5; else if (eg > 5) fund += 3; else if (eg > 0) fund += 1; }
  const de = n(vals.debtEquity);
  if (de !== null) { fundMax += 7; if (de < 0.3) fund += 7; else if (de < 0.5) fund += 5; else if (de < 1) fund += 3; else if (de < 2) fund += 1; }
  const nde = n(vals.netDebtEbitda);
  if (nde !== null) { fundMax += 5; if (nde < 1) fund += 5; else if (nde < 2) fund += 4; else if (nde < 3) fund += 2; }
  const cr = n(vals.currentRatio);
  if (cr !== null) { fundMax += 4; if (cr > 2) fund += 4; else if (cr > 1.5) fund += 3; else if (cr > 1) fund += 2; }
  const at = n(vals.analystTarget); const pr = n(vals.price);
  if (at !== null && pr !== null && pr > 0) { const upside = ((at - pr) / pr) * 100; fundMax += 9; if (upside > 30) fund += 9; else if (upside > 15) fund += 7; else if (upside > 5) fund += 4; else if (upside > 0) fund += 2; }
  if (vals.insiderBuying) { fundMax += 4; fund += 4; } else { fundMax += 4; }
  if (vals.aboveSma50) { techMax += 14; tech += 14; } else { techMax += 14; }
  if (vals.aboveSma200) { techMax += 14; tech += 14; } else { techMax += 14; }
  if (vals.goldenCross) { techMax += 8; tech += 8; } else { techMax += 8; }
  const rsi = n(vals.rsi);
  if (rsi !== null) { techMax += 14; if (rsi >= 40 && rsi <= 60) tech += 14; else if (rsi >= 30 && rsi < 40) tech += 11; else if (rsi > 60 && rsi <= 70) tech += 8; else if (rsi < 30) tech += 6; else tech += 2; }
  if (vals.macdBullish) { techMax += 12; tech += 12; } else { techMax += 12; }
  if (vals.volumeConfirm) { techMax += 12; tech += 12; } else { techMax += 12; }
  if (vals.breakoutPattern) { techMax += 7; tech += 7; } else { techMax += 7; }
  if (vals.nearSupport) { techMax += 7; tech += 7; } else { techMax += 7; }
  if (vals.bullishCandle) { techMax += 6; tech += 6; } else { techMax += 6; }
  if (vals.divergence) { techMax += 6; tech += 6; } else { techMax += 6; }
  const fundPct = fundMax > 0 ? Math.round((fund / fundMax) * 100) : 0;
  const techPct = techMax > 0 ? Math.round((tech / techMax) * 100) : 0;
  const composite = Math.round(fundPct * 0.55 + techPct * 0.45);
  let verdict = "", verdictColor = "";
  if (composite >= 75) { verdict = "STRONG BUY"; verdictColor = "#22c55e"; }
  else if (composite >= 60) { verdict = "BUY"; verdictColor = "#4ade80"; }
  else if (composite >= 45) { verdict = "HOLD / WATCH"; verdictColor = "#eab308"; }
  else if (composite >= 30) { verdict = "CAUTION"; verdictColor = "#f97316"; }
  else { verdict = "AVOID"; verdictColor = "#ef4444"; }
  let upsideVal = null;
  if (at !== null && pr !== null && pr > 0) upsideVal = ((at - pr) / pr * 100).toFixed(1);
  return { fundPct, techPct, composite, verdict, verdictColor, upsideVal };
}

function useIsMobile() {
  const [m, setM] = useState(typeof window !== "undefined" ? window.innerWidth < 700 : false);
  useEffect(() => { const fn = () => setM(window.innerWidth < 700); window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn); }, []);
  return m;
}

const GaugeRing = ({ value, color, size = 80, stroke = 7, label }) => {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r, offset = circ - (value / 100) * circ;
  return (<div style={{ textAlign: "center" }}>
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.6s ease" }} />
    </svg>
    <div style={{ marginTop: -size/2 - 12, fontSize: size > 75 ? 20 : 15, fontWeight: 800, color }}>{value}</div>
    <div style={{ marginTop: size > 75 ? 22 : 16, fontSize: 8, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{label}</div>
  </div>);
};

const NumField = ({ label, name, val, onChange, placeholder = "", unit = "", tip = "", mob }) => (
  <div style={{ marginBottom: mob ? 10 : 7 }}>
    <div style={{ display: "flex", alignItems: "baseline", gap: 4, flexWrap: "wrap" }}>
      <label style={{ fontSize: mob ? 12 : 10, color: "#94a3b8", fontWeight: 500 }}>{label}</label>
      {tip && <span style={{ fontSize: mob ? 9 : 8, color: "#475569" }}>({tip})</span>}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
      <input type="number" inputMode="decimal" name={name} value={val} onChange={onChange} placeholder={placeholder}
        style={{ width: "100%", background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: mob ? "10px 12px" : "6px 9px", color: "#e2e8f0", fontSize: mob ? 16 : 12, fontFamily: "'DM Mono', monospace", outline: "none", WebkitAppearance: "none", MozAppearance: "textfield" }} />
      {unit && <span style={{ fontSize: mob ? 11 : 9, color: "#475569", minWidth: 14 }}>{unit}</span>}
    </div>
  </div>
);

const Toggle = ({ label, name, val, onChange, tip = "", mob }) => (
  <div style={{ display: "flex", alignItems: "center", gap: mob ? 12 : 8, marginBottom: mob ? 8 : 5, cursor: "pointer", padding: mob ? "6px 0" : "3px 0", minHeight: mob ? 44 : "auto" }}
    onClick={() => onChange({ target: { name, type: "checkbox", checked: !val } })}>
    <div style={{ width: mob ? 22 : 16, height: mob ? 22 : 16, borderRadius: 4, border: `1.5px solid ${val ? "#22c55e" : "rgba(255,255,255,0.12)"}`, background: val ? "rgba(34,197,94,0.15)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", flexShrink: 0 }}>
      {val && <span style={{ color: "#22c55e", fontSize: mob ? 14 : 10, fontWeight: 800 }}>✓</span>}
    </div>
    <div><span style={{ fontSize: mob ? 13 : 10.5, color: val ? "#e2e8f0" : "#94a3b8" }}>{label}</span>
      {tip && <span style={{ fontSize: mob ? 9 : 8, color: "#475569", marginLeft: 4 }}>({tip})</span>}</div>
  </div>
);

const SectionTag = ({ label, color, bg, mob }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: mob ? "4px 12px" : "3px 10px", borderRadius: 4, background: bg, marginBottom: mob ? 12 : 10, marginTop: 6 }}>
    <div style={{ width: 5, height: 5, borderRadius: "50%", background: color }} />
    <span style={{ fontSize: mob ? 10 : 9, fontWeight: 700, color, letterSpacing: 1.2, textTransform: "uppercase", fontFamily: "'Outfit'" }}>{label}</span>
  </div>
);

const DeepToggle = ({ show, setShow, mob }) => (
  <div style={{ marginTop: mob ? 12 : 8 }}>
    <div onClick={() => setShow(!show)} style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5, padding: mob ? "6px 14px" : "3px 10px", borderRadius: 4, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#475569" }} />
      <span style={{ fontSize: mob ? 10 : 9, fontWeight: 700, color: "#64748b", letterSpacing: 1.2, textTransform: "uppercase", fontFamily: "'Outfit'" }}>Nice To Have</span>
      <span style={{ fontSize: mob ? 12 : 10, color: "#475569", transform: show ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>▾</span>
    </div>
  </div>
);

export default function App() {
  const [vals, setVals] = useState(DEFAULTS);
  const [result, setResult] = useState(null);
  const [showDF, setShowDF] = useState(false);
  const [showDT, setShowDT] = useState(false);
  const mob = useIsMobile();
  const h = useCallback((e) => { const { name, type, checked, value } = e.target; setVals(p => ({ ...p, [name]: type === "checkbox" ? checked : value })); }, []);
  const analyze = () => { if (vals.ticker) setResult(score(vals)); };
  const reset = () => { setVals(DEFAULTS); setResult(null); };
  const r = result;
  const pan = { background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: mob ? 10 : 9, padding: mob ? "14px 16px" : "12px 14px" };

  return (
    <div style={{ fontFamily: "'DM Mono', 'Fira Code', monospace", background: "#080b12", color: "#e2e8f0", minHeight: "100vh", padding: mob ? "12px 10px" : "14px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Outfit:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
        input:focus{border-color:rgba(96,165,250,0.4)!important}input::placeholder{color:#2d3748}
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
        input[type=number]{-moz-appearance:textfield}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#1e293b;border-radius:2px}
      `}</style>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: mob ? 12 : 14 }}>
          <h1 style={{ fontFamily: "'Outfit'", fontSize: mob ? 20 : 22, fontWeight: 900, color: "#f1f5f9", margin: 0, letterSpacing: "-0.8px" }}>
            STOCK<span style={{ color: "#3b82f6" }}>SCORE</span></h1>
          <span style={{ fontSize: mob ? 8 : 9, color: "#475569" }}>Fund + Tech</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: mob ? 12 : 14 }}>
          <input name="ticker" value={vals.ticker} onChange={h} placeholder="TICKER" type="text"
            style={{ flex: 1, background: "rgba(59,130,246,0.07)", border: "1.5px solid rgba(59,130,246,0.2)", borderRadius: 7, padding: mob ? "12px 14px" : "9px 12px", color: "#60a5fa", fontSize: mob ? 18 : 17, fontFamily: "'Outfit'", fontWeight: 700, letterSpacing: 1.5, outline: "none", textTransform: "uppercase" }} />
          <input name="price" value={vals.price} onChange={h} placeholder="Price ($)" type="number" inputMode="decimal"
            style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: mob ? "12px 14px" : "9px 12px", color: "#e2e8f0", fontSize: mob ? 18 : 17, fontFamily: "'Outfit'", fontWeight: 600, outline: "none" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: mob ? 10 : 12 }}>
          {/* FUNDAMENTAL */}
          <div style={pan}>
            <h2 style={{ fontFamily: "'Outfit'", fontSize: mob ? 13 : 12, fontWeight: 700, color: "#60a5fa", margin: "0 0 4px", letterSpacing: 1 }}>FUNDAMENTAL ANALYSIS</h2>
            <SectionTag label="Must Have" color="#3b82f6" bg="rgba(59,130,246,0.08)" mob={mob} />
            <div style={{ fontSize: mob ? 10 : 8.5, color: "#475569", marginBottom: 8, lineHeight: 1.4 }}>Insert P/E or P/S (at least one)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 8px" }}>
              <NumField label="P/E Trailing" name="pe" val={vals.pe} onChange={h} placeholder="25" unit="x" tip="profitable" mob={mob} />
              <NumField label="P/S" name="ps" val={vals.ps} onChange={h} placeholder="3.5" unit="x" tip="pre-profit" mob={mob} />
            </div>
            <NumField label="Revenue Growth YoY" name="revenueGrowth" val={vals.revenueGrowth} onChange={h} placeholder="20" unit="%" tip="top line" mob={mob} />
            <NumField label="Gross Margin" name="grossMargin" val={vals.grossMargin} onChange={h} placeholder="40" unit="%" tip="pricing power" mob={mob} />
            <NumField label="Debt / Equity" name="debtEquity" val={vals.debtEquity} onChange={h} placeholder="0.5" unit="x" tip="lower = safer" mob={mob} />
            <NumField label="Analyst Target Price" name="analystTarget" val={vals.analystTarget} onChange={h} placeholder="90" unit="$" tip="consensus 12m" mob={mob} />
            <DeepToggle show={showDF} setShow={setShowDF} mob={mob} />
            {showDF && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize: mob ? 9 : 8, color: "#475569", marginBottom: 6 }}>Valuation extras</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 8px" }}>
                  <NumField label="Forward P/E" name="forwardPe" val={vals.forwardPe} onChange={h} placeholder="20" unit="x" mob={mob} />
                  <NumField label="PEG Ratio" name="peg" val={vals.peg} onChange={h} placeholder="1.2" unit="x" mob={mob} />
                  <NumField label="P/B" name="pb" val={vals.pb} onChange={h} placeholder="2.0" unit="x" mob={mob} />
                  <NumField label="EV/EBITDA" name="evEbitda" val={vals.evEbitda} onChange={h} placeholder="12" unit="x" mob={mob} />
                </div>
                <div style={{ fontSize: mob ? 9 : 8, color: "#475569", marginBottom: 6, marginTop: 8 }}>Profitability</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 8px" }}>
                  <NumField label="ROE" name="roe" val={vals.roe} onChange={h} placeholder="15" unit="%" mob={mob} />
                  <NumField label="ROIC" name="roic" val={vals.roic} onChange={h} placeholder="12" unit="%" mob={mob} />
                  <NumField label="Net Margin" name="netMargin" val={vals.netMargin} onChange={h} placeholder="10" unit="%" mob={mob} />
                  <NumField label="FCF Margin" name="fcfMargin" val={vals.fcfMargin} onChange={h} placeholder="8" unit="%" mob={mob} />
                </div>
                <div style={{ fontSize: mob ? 9 : 8, color: "#475569", marginBottom: 6, marginTop: 8 }}>Growth extras</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 8px" }}>
                  <NumField label="EPS Growth YoY" name="epsGrowth" val={vals.epsGrowth} onChange={h} placeholder="15" unit="%" mob={mob} />
                  <NumField label="FCF Growth" name="fcfGrowth" val={vals.fcfGrowth} onChange={h} placeholder="10" unit="%" mob={mob} />
                </div>
                <div style={{ fontSize: mob ? 9 : 8, color: "#475569", marginBottom: 6, marginTop: 8 }}>Financial health</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 8px" }}>
                  <NumField label="Net Debt/EBITDA" name="netDebtEbitda" val={vals.netDebtEbitda} onChange={h} placeholder="1.5" unit="x" mob={mob} />
                  <NumField label="Current Ratio" name="currentRatio" val={vals.currentRatio} onChange={h} placeholder="1.5" unit="x" mob={mob} />
                </div>
                <div style={{ fontSize: mob ? 9 : 8, color: "#475569", marginBottom: 6, marginTop: 8 }}>Dividend & signals</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 8px" }}>
                  <NumField label="Div. Yield" name="dividendYield" val={vals.dividendYield} onChange={h} placeholder="2.0" unit="%" mob={mob} />
                  <NumField label="Payout Ratio" name="payoutRatio" val={vals.payoutRatio} onChange={h} placeholder="40" unit="%" mob={mob} />
                </div>
                <Toggle label="Insider buying (last 6 months)" name="insiderBuying" val={vals.insiderBuying} onChange={h} mob={mob} />
              </div>
            )}
          </div>

          {/* TECHNICAL */}
          <div style={pan}>
            <h2 style={{ fontFamily: "'Outfit'", fontSize: mob ? 13 : 12, fontWeight: 700, color: "#f59e0b", margin: "0 0 4px", letterSpacing: 1 }}>TECHNICAL ANALYSIS</h2>
            <SectionTag label="Must Have" color="#f59e0b" bg="rgba(245,158,11,0.08)" mob={mob} />
            <Toggle label="Price above SMA 50" name="aboveSma50" val={vals.aboveSma50} onChange={h} tip="mid-term" mob={mob} />
            <Toggle label="Price above SMA 200" name="aboveSma200" val={vals.aboveSma200} onChange={h} tip="long-term" mob={mob} />
            <NumField label="RSI (14 periods)" name="rsi" val={vals.rsi} onChange={h} placeholder="55" tip="30-70 ideal" mob={mob} />
            <Toggle label="MACD bullish crossover" name="macdBullish" val={vals.macdBullish} onChange={h} tip="momentum" mob={mob} />
            <Toggle label="Volume confirms move" name="volumeConfirm" val={vals.volumeConfirm} onChange={h} tip="above avg" mob={mob} />
            <DeepToggle show={showDT} setShow={setShowDT} mob={mob} />
            {showDT && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                <Toggle label="Golden Cross (SMA 50 > SMA 200)" name="goldenCross" val={vals.goldenCross} onChange={h} tip="strong trend" mob={mob} />
                <Toggle label="Breakout pattern detected" name="breakoutPattern" val={vals.breakoutPattern} onChange={h} tip="triangle, cup&handle" mob={mob} />
                <Toggle label="Near key support level" name="nearSupport" val={vals.nearSupport} onChange={h} tip="good R:R" mob={mob} />
                <Toggle label="Bullish reversal candle" name="bullishCandle" val={vals.bullishCandle} onChange={h} tip="hammer, engulfing" mob={mob} />
                <Toggle label="Bullish divergence" name="divergence" val={vals.divergence} onChange={h} tip="RSI/MACD vs price" mob={mob} />
                <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 8px" }}>
                  <NumField label="Dist. 52w High" name="distFrom52High" val={vals.distFrom52High} onChange={h} placeholder="-25" unit="%" mob={mob} />
                  <NumField label="Beta" name="beta" val={vals.beta} onChange={h} placeholder="1.5" mob={mob} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: mob ? 12 : 14 }}>
          <button onClick={analyze} style={{ flex: 1, padding: mob ? "14px 0" : "11px 0", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "white", border: "none", borderRadius: 7, fontSize: mob ? 15 : 13, fontFamily: "'Outfit'", fontWeight: 700, cursor: "pointer", letterSpacing: 1.5, textTransform: "uppercase", WebkitTapHighlightColor: "transparent" }}>Analyze</button>
          <button onClick={reset} style={{ padding: mob ? "14px 20px" : "11px 18px", background: "rgba(255,255,255,0.03)", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, fontSize: mob ? 12 : 11, fontFamily: "'Outfit'", fontWeight: 500, cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>Reset</button>
        </div>

        {r && (
          <div style={{ marginTop: mob ? 14 : 16, background: `${r.verdictColor}08`, border: `1.5px solid ${r.verdictColor}25`, borderRadius: 10, padding: mob ? "16px 14px" : "16px 18px", animation: "fadeIn 0.35s ease" }}>
            <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
            <div style={{ display: "flex", flexDirection: mob ? "column" : "row", justifyContent: "space-between", alignItems: "center", gap: mob ? 12 : 0 }}>
              <div style={{ textAlign: mob ? "center" : "left" }}>
                <div style={{ fontFamily: "'Outfit'", fontSize: mob ? 28 : 26, fontWeight: 900, color: r.verdictColor, letterSpacing: "-0.5px" }}>{r.verdict}</div>
                <div style={{ fontSize: mob ? 12 : 11, color: "#94a3b8", marginTop: 2 }}>
                  {vals.ticker.toUpperCase()} @ ${vals.price}
                  {r.upsideVal && <span style={{ marginLeft: 8, color: parseFloat(r.upsideVal) > 0 ? "#4ade80" : "#f87171" }}>Upside: {r.upsideVal}%</span>}
                </div>
              </div>
              <GaugeRing value={r.composite} color={r.verdictColor} size={mob ? 88 : 82} stroke={7} label="Score" />
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: mob ? 40 : 36, margin: "14px 0 10px" }}>
              <GaugeRing value={r.fundPct} color="#60a5fa" size={mob ? 68 : 62} stroke={5} label="Fundamental" />
              <GaugeRing value={r.techPct} color="#f59e0b" size={mob ? 68 : 62} stroke={5} label="Technical" />
            </div>
            <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: 6, padding: mob ? "12px" : "10px 12px", fontSize: mob ? 11 : 10, color: "#64748b", lineHeight: 1.7 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 14px" }}>
                <span><span style={{ color: "#22c55e", fontWeight: 700 }}>75+</span> Strong Buy</span>
                <span><span style={{ color: "#4ade80", fontWeight: 700 }}>60-74</span> Buy</span>
                <span><span style={{ color: "#eab308", fontWeight: 700 }}>45-59</span> Hold</span>
                <span><span style={{ color: "#f97316", fontWeight: 700 }}>30-44</span> Caution</span>
                <span><span style={{ color: "#ef4444", fontWeight: 700 }}>0-29</span> Avoid</span>
              </div>
              <div style={{ marginTop: 6, fontSize: mob ? 9 : 8, color: "#475569" }}>Score = Fundamental (55%) + Technical (45%). Only filled fields are scored.</div>
            </div>
          </div>
        )}
        <div style={{ marginTop: 10, fontSize: 7.5, color: "#1e293b", textAlign: "center" }}>Educational tool. Not financial advice.</div>
      </div>
    </div>
  );
}
