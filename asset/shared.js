// Shared UI + helpers used by every bank converter page (standardbank.html, gotyme.html).
// Bank-specific PDF extraction/parsing stays in each page's own <script>.

const { useState, useCallback, useRef, useMemo } = React;

function toCSV(rows) {
    return [
        ["Date", "Description", "Debit", "Credit", "Balance"].join(","),
        ...rows.map(r =>
            [
                r.date,
                `"${(r.description || "").replace(/"/g, '""')}"`,
                r.debit,
                r.credit,
                r.balance,
            ].join(",")
        ),
    ].join("\n");
}

function fmtR(n) {
    const v = parseFloat(n);
    return isNaN(v)
        ? "0.00"
        : Math.abs(v).toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function highlight(text, term) {
    if (!term) return text;
    const idx = text.toLowerCase().indexOf(term.toLowerCase());
    if (idx === -1) return text;
    return (
        <>
            {text.slice(0, idx)}
            <mark>{text.slice(idx, idx + term.length)}</mark>
            {text.slice(idx + term.length)}
        </>
    );
}

function parseRowDate(str) {
    const m = String(str || "").match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (!m) return null;
    return new Date(+m[3], +m[2] - 1, +m[1]);
}

function parseDateInput(str) {
    if (!str) return null;
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
}

function DropZone({ onFile, fileName, subtitle }) {
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef();

    const accept = useCallback(f => {
        if (f && f.type === "application/pdf") onFile(f);
    }, [onFile]);

    return (
        <div
            onDrop={e => { e.preventDefault(); setDragOver(false); accept(e.dataTransfer.files[0]); }}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => inputRef.current.click()}
            className={`drop-zone${dragOver ? " drag" : ""}${fileName ? " loaded" : ""}`}
        >
            <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                style={{display:"none"}}
                onChange={e => accept(e.target.files[0])}
            />
            {fileName ? (
                <>
                    <div className="drop-zone-icon"><i className="ph ph-check-circle"></i></div>
                    <p className="drop-zone-main">{fileName}</p>
                    <p className="drop-zone-sub">Click to change file</p>
                </>
            ) : (
                <>
                    <div className="drop-zone-icon"><i className="ph ph-file-pdf"></i></div>
                    <p className="drop-zone-main">
                        Drop a PDF here or <span className="drop-zone-link">browse</span>
                    </p>
                    <p className="drop-zone-sub">{subtitle}</p>
                </>
            )}
        </div>
    );
}

function StatsBar({ rows }) {
    const totalDebit  = rows.reduce((s, r) => s + (parseFloat(r.debit)  || 0), 0);
    const totalCredit = rows.reduce((s, r) => s + (parseFloat(r.credit) || 0), 0);
    const net         = totalCredit - totalDebit;

    return (
        <div className="stats-grid">
            <Stat label="Transactions"  value={rows.length}       prefix=""   />
            <Stat label="Total Debits"  value={fmtR(totalDebit)}  prefix="R " />
            <Stat label="Total Credits" value={fmtR(totalCredit)} prefix="R " />
            <Stat label="Net"           value={fmtR(Math.abs(net))} prefix={net < 0 ? "−R " : "R "} />
        </div>
    );
}

function Stat({ label, value, prefix }) {
    return (
        <div className="stat-box">
            <div className="stat-label">{label}</div>
            <div className="stat-value">{prefix}{value}</div>
        </div>
    );
}

function FilterBar({ search, onSearch, dateFrom, dateTo, onDateFrom, onDateTo, onClear, total, showing, searchPlaceholder }) {
    const active = search || dateFrom || dateTo;
    return (
        <div className="filter-bar">
            <div className="filter-group">
                <label className="filter-label">Search description</label>
                <div className="filter-input-wrap">
                    <span className="filter-icon"><i className="ph ph-magnifying-glass"></i></span>
                    <input
                        type="text"
                        value={search}
                        onChange={e => onSearch(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="has-icon"
                    />
                    {search && (
                        <button className="filter-clear-x" onClick={() => onSearch("")}>×</button>
                    )}
                </div>
            </div>

            <div className="filter-group" style={{flex:"0 0 auto", minWidth:"140px"}}>
                <label className="filter-label">From</label>
                <input type="date" value={dateFrom} onChange={e => onDateFrom(e.target.value)} />
            </div>

            <div className="filter-group" style={{flex:"0 0 auto", minWidth:"140px"}}>
                <label className="filter-label">To</label>
                <input type="date" value={dateTo} onChange={e => onDateTo(e.target.value)} />
            </div>

            <div style={{display:"flex", alignItems:"center", gap:"8px", paddingBottom:"2px"}}>
                {active ? (
                    <>
                        <span className={`filter-count${showing < total ? " active" : ""}`}>
                            {showing} / {total}
                        </span>
                        <button className="btn ghost" style={{padding:"6px 12px"}} onClick={onClear}>
                            Clear
                        </button>
                    </>
                ) : (
                    <span className="filter-count">{total} row{total !== 1 ? "s" : ""}</span>
                )}
            </div>
        </div>
    );
}

function TransactionTable({ entries, onDelete, onAddRow, onChange, search }) {
    const fields  = ["date", "description", "debit", "credit", "balance"];
    const headers = ["Date", "Description", "Debit", "Credit", "Balance"];

    const totalDebit  = entries.reduce((s, { row: r }) => s + (parseFloat(r.debit)  || 0), 0);
    const totalCredit = entries.reduce((s, { row: r }) => s + (parseFloat(r.credit) || 0), 0);

    return (
        <div className="table-wrap">
            <div className="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th className="right" style={{width:"36px"}}>#</th>
                            {headers.map(h => <th key={h}>{h}</th>)}
                            <th style={{width:"32px"}}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map(({ row: r, idx }) => (
                            <tr key={idx} className="group">
                                <td className="td-num">{idx + 1}</td>
                                {fields.map(f => (
                                    <td key={f}>
                                        {f === "description" ? (
                                            <div style={{padding:"2px 4px", fontSize:"13px"}}>
                                                {highlight(r[f] || "", search)}
                                            </div>
                                        ) : (
                                            <input
                                                value={r[f] || ""}
                                                onChange={e => onChange(idx, f, e.target.value)}
                                                className={
                                                    f === "debit"   && r.debit  ? "td-debit"   :
                                                    f === "credit"  && r.credit ? "td-credit"  :
                                                    f === "balance"             ? "td-balance"  : ""
                                                }
                                            />
                                        )}
                                    </td>
                                ))}
                                <td style={{textAlign:"center"}}>
                                    <button
                                        className="del-btn"
                                        onClick={() => onDelete(idx)}
                                        title="Delete row"
                                    >×</button>
                                </td>
                            </tr>
                        ))}
                        {entries.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{textAlign:"center", padding:"40px", color:"var(--text-dim)"}}>
                                    No transactions match your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td></td>
                            <td colSpan={2} style={{textAlign:"right", fontSize:"10px", textTransform:"uppercase", letterSpacing:"0.08em"}}>Totals</td>
                            <td className="td-debit">R {fmtR(totalDebit)}</td>
                            <td className="td-credit">R {fmtR(totalCredit)}</td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div className="table-footer">
                <button className="add-row-btn" onClick={onAddRow}>+ Add row</button>
            </div>
        </div>
    );
}

function WarningsPanel({ warnings, description }) {
    const [open, setOpen] = useState(true);
    if (!warnings.length) return null;
    return (
        <div className="panel warn">
            <button className="panel-toggle" onClick={() => setOpen(o => !o)}>
                <span><i className="ph ph-warning"></i></span>
                <span>{warnings.length} incomplete row{warnings.length !== 1 ? "s" : ""} skipped</span>
                <span className="ml">{open ? <><i className="ph ph-caret-up"></i> hide</> : <><i className="ph ph-caret-down"></i> show</>}</span>
            </button>
            {open && (
                <div className="panel-body">
                    <p className="panel-desc">{description}</p>
                    {warnings.map((w, i) => (
                        <div key={i} className="warn-line">{w}</div>
                    ))}
                </div>
            )}
        </div>
    );
}

function RawLinesPanel({ lines }) {
    const [open, setOpen] = useState(false);
    if (!lines.length) return null;
    return (
        <div className="panel" style={{marginTop:"16px"}}>
            <button className="panel-toggle" onClick={() => setOpen(o => !o)}>
                <span>{open ? <i className="ph ph-caret-down"></i> : <i className="ph ph-caret-right"></i>}</span>
                <span>Raw PDF lines ({lines.length})</span>
                <span className="ml">expand to diagnose parsing</span>
            </button>
            {open && (
                <div className="panel-body">
                    <pre className="raw-lines">
                        {lines.map((l, i) => `${String(i + 1).padStart(4)} │ ${l}`).join("\n")}
                    </pre>
                </div>
            )}
        </div>
    );
}
