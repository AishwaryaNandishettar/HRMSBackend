import React, { useState, useEffect, useRef } from "react";
import PayrollRow from "./PayrollRow";
import payslipData from "../../Data/PaySlipData";
import "./Payroll.css";

const PayrollTable = ({ data, onViewPayslip, onProfileView , onEditPayroll, onDownloadPayslip,onProcessPayroll,onStatusChange}) => {
   /* =========================
     FILTER STATES
  ========================= */

  const [activeFilter, setActiveFilter] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [filters, setFilters] = useState({});
  const [selectedValues, setSelectedValues] = useState({});

  const popupRef = useRef();
   /* =========================
     CLOSE FILTER POPUP
  ========================= */

  useEffect(() => {
    const handleClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setActiveFilter(null);
      }
    };
     document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  /* =========================
     TABLE COLUMNS
  ========================= */

  const columns = [
    { key: "employeeName", label: "Employee Name" },
    { key: "employeeId", label: "Employee ID" },
    { key: "department", label: "Department" },
    { key: "gross", label: "Gross Pay" },
    { key: "deductions", label: "Deductions" },
    { key: "net", label: "Net Pay" },
    { key: "status", label: "Status" },
    { key: "payrollMonth", label: "Payroll Month" },
    { key: "initiatedDate", label: "Initiated Date" },
    { key: "payrollStatus", label: "Payroll Status" },
  ];

  /* =========================
     UNIQUE VALUES
  ========================= */

  const getUnique = (key) => {
    return [
      ...new Set(
        data.map((item) => {
          switch (key) {
            case "employeeName":
  return (
    item.empName ||
    item.fullName ||
    item.employeeName ||
    item.name ||
    "-"
  );

            case "employeeId":
              return item.employeeId || item.empId || item.empCode || "-";

            case "department":
              return item.department || "-";

            case "gross":
              return item.gross || item.grossPay || item.salary || 0;

            case "deductions":
              return (
                (item.tax || 0) +
                (item.pf || 0) +
                (item.insurance || 0)
              );

            case "net":
              return item.net || item.netPay || 0;

            case "status":
              return item.status || "-";

            case "payrollMonth":
              return item.payrollMonth || item.month || "-";

            case "initiatedDate":
              return item.initiatedDate || "-";

            case "payrollStatus":
              return item.payrollStatus || "-";

            default:
              return "-";
          }
        })
      ),
    ];
  };

  /* =========================
     FILTERED DATA
  ========================= */

  const filteredData = data.filter((item) => {
    return Object.keys(filters).every((key) => {
      if (!filters[key]) return true;

      let value = "";

      switch (key) {
       case "employeeName":
  value =
    item.empName ||
    item.fullName ||
    item.employeeName ||
    item.name ||
    "-";
  break;

        case "employeeId":
          value = item.employeeId || item.empId || item.empCode || "-";
          break;

        case "department":
          value = item.department || "-";
          break;

        case "gross":
          value = item.gross || item.grossPay || item.salary || 0;
          break;

        case "deductions":
          value =
            (item.tax || 0) +
            (item.pf || 0) +
            (item.insurance || 0);
          break;

        case "net":
          value = item.net || item.netPay || 0;
          break;

        case "status":
          value = item.status || "-";
          break;

        case "payrollMonth":
          value = item.payrollMonth || item.month || "-";
          break;

        case "initiatedDate":
          value = item.initiatedDate || "-";
          break;

        case "payrollStatus":
          value = item.payrollStatus || "-";
          break;

        default:
          value = "";
      }

     if (String(filters[key]).includes(",")) {
  return filters[key]
    .split(",")
    .some(v => String(value) === v);
}

return String(value) === String(filters[key]);
    });
  });

  /* =========================
     FILTER SUGGESTIONS
  ========================= */

  const suggestions =
    activeFilter &&
    getUnique(activeFilter).filter((v) =>
      String(v).toLowerCase().includes(filterText.toLowerCase())
    );

  // ✅ GRAND TOTAL CALCULATION (based on table data only)
const totalGross = data.reduce(
  (sum, emp) => sum + (emp.gross || emp.grossPay || emp.salary || 0),
  0
);

const totalDeductions = data.reduce(
  (sum, emp) =>
    sum + ((emp.tax || 0) + (emp.pf || 0) + (emp.insurance || 0)),
  0
);

const totalNet = data.reduce(
  (sum, emp) => sum + (emp.net || emp.netPay || 0),
  0
);
 return (
    <div className="payroll-table-wrapper">
      <table className="payroll-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>
                <div className="payroll-header-filter">
                  <span>{col.label}</span>

                  <span
                    className="payroll-filter-icon"
                    onClick={() =>
                      setActiveFilter(
                        activeFilter === col.key ? null : col.key
                      )
                    }
                  >
                    ⏷
                  </span>
                </div>

                {activeFilter === col.key && (
                  <div
                    ref={popupRef}
                    className="payroll-filter-popup"
                  >
                    <input
                      type="text"
                      placeholder="Search..."
                      value={filterText}
                      onChange={(e) => setFilterText(e.target.value)}
                      className="payroll-filter-input"
                    />

                   <div className="payroll-filter-list">

  <div className="payroll-filter-item">
   <input
  type="checkbox"
  checked={
    (selectedValues[col.key] || []).length ===
    suggestions.length
  }
  onChange={(e) => {
    if (e.target.checked) {
      setSelectedValues(prev => ({
        ...prev,
        [col.key]: suggestions,
      }));
    } else {
      setSelectedValues(prev => ({
        ...prev,
        [col.key]: [],
      }));
    }
  }}
/>
    <span>(Select All)</span>
  </div>
{suggestions.map((s, index) => (
  <div
    key={index}
    className="payroll-filter-item"
  >
    <input
      type="checkbox"
      checked={
        selectedValues[col.key]?.includes(s) || false
      }
      onChange={(e) => {
        let updated = selectedValues[col.key] || [];

        if (e.target.checked) {
          updated = [...updated, s];
        } else {
          updated = updated.filter(v => v !== s);
        }

        setSelectedValues(prev => ({
          ...prev,
          [col.key]: updated,
        }));
      }}
    />

    <span>{s}</span>
  </div>
))}

  <div className="payroll-filter-actions">
    <button
      className="payroll-ok-btn"
    onClick={() => {
  setFilters(prev => ({
    ...prev,
    [col.key]:
      (selectedValues[col.key] || []).join(","),
  }));

  setActiveFilter(null);
}}
    >
      OK
    </button>

    <button
      className="payroll-cancel-btn"
      onClick={() => {
        setActiveFilter(null);
        setFilterText("");
      }}
    >
      Cancel
    </button>
  </div>

</div>
                  </div>
                )}
              </th>
            ))}

            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {!filteredData || filteredData.length === 0 ? (
            <tr>
              <td colSpan="11" className="empty-row">
                No payroll records found
              </td>
            </tr>
          ) : (
            <>
              {filteredData.map((record) => (
                <PayrollRow
                  key={
                    record.employeeId ||
                    record.empId ||
                    record.empCode
                  }
                  record={record}
                  onViewPayslip={onViewPayslip}
                  onProfileView={onProfileView}
                  onEditPayroll={onEditPayroll}
                  onDownloadPayslip={onDownloadPayslip}
                  onProcessPayroll={onProcessPayroll}
                  onStatusChange={onStatusChange}
                />
              ))}

              {/* GRAND TOTAL ROW */}

              {(() => {
                const tdStyle = {
                  background:
                    "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
                  padding: "14px 12px",
                  color: "#ffffff",
                  fontWeight: "700",
                  fontSize: "14px",
                  borderTop: "3px solid #1d4ed8",
                };

                return (
                  <tr>
                    <td
                      style={{
                        ...tdStyle,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      💰 Grand Total
                    </td>

                    <td style={tdStyle}></td>
                    <td style={tdStyle}></td>

                    <td style={tdStyle}>
                      ₹ {totalGross.toLocaleString("en-IN")}
                    </td>

                    <td
                      style={{
                        ...tdStyle,
                        color: "#fca5a5",
                      }}
                    >
                      ₹ {totalDeductions.toLocaleString("en-IN")}
                    </td>

                    <td
                      style={{
                        ...tdStyle,
                        color: "#86efac",
                      }}
                    >
                      ₹ {totalNet.toLocaleString("en-IN")}
                    </td>

                    <td style={tdStyle}></td>
                    <td style={tdStyle}></td>
                    <td style={tdStyle}></td>
                    <td style={tdStyle}></td>
                    <td style={tdStyle}></td>
                  </tr>
                );
              })()}
            </>
          )}
        </tbody>
      </table>

      <div className="table-footer">
        Showing <strong>{filteredData.length}</strong> records
      </div>
    </div>
  );
};

export default PayrollTable;
