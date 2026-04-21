    import { useState, useEffect } from "react";
    //import { getSkillsByEmployee, addSkill, updateManagerRating } from "../api/skillApi";
    import styles from "./Profile.module.css";
    import { fetchMyProfile } from "../api/profileApi";
    import { useContext } from "react";
    import { AuthContext } from "../Context/Authcontext";
    import { getAllEmployees } from "../api/employeeApi";
    import { updateJobDetails } from "../api/profileApi";

    export default function ProfileView() {
      const { user } = useContext(AuthContext);
      const [status, setStatus] = useState("Available");
      const [view, setView] = useState("overview");
      const [showIncrementLetter, setShowIncrementLetter] = useState(false);
      const [selectedEmployee, setSelectedEmployee] = useState(null);
      const [allEmployees, setAllEmployees] = useState([]);
      const [showEditModal, setShowEditModal] = useState(false);
      const [showJobModal, setShowJobModal] = useState(false);

      const [profileImage, setProfileImage] = useState(
  localStorage.getItem("profileImage") || ""
);
  const [jobEdit, setJobEdit] = useState(() => {
  const saved = localStorage.getItem("jobEdit");
  return saved
    ? JSON.parse(saved)
    : {
        designation: "",
        department: "",
        joiningDate: "",
        totalExp: "",
        currentExp: "",
        employmentType: "Full-Time",
        location: "Bangalore",
        manager: "",
        hr: "",
        pf: "",
        uan: "",
        esic: ""
      };
});
      

      /* ================= EXIT MODULE STATE ================= */

      const [exitStage, setExitStage] = useState("form");
      // form → manager → hr → checklist → completed

      
      const [exitData, setExitData] = useState({
  reason: "",
  notice: "60 Days",
  lwd: "",
  manager: [],   // ✅ now array
  cc: [],        // ✅ now array
  remarks: ""
});
const [searchTo, setSearchTo] = useState("");
const [searchCc, setSearchCc] = useState("");
const users = [
  { id: 1, name: "Aishwarya Nandishettar", email: "Aishwarya@company.com" },
  { id: 2, name: "Prakash", email: "Aishmanager@omoi.com" }
  
];
    const [skills, setSkills] = useState([]);
    const [profileData, setProfileData] = useState(null);
    
const Chip = ({ user, onRemove }) => (
  <span className={styles.chip}>
    {user.name}
    <button onClick={onRemove}>×</button>
  </span>
);



    const role = (localStorage.getItem("role") || "").toUpperCase(); 
    console.log("role:", role);

    useEffect(() => {
    if (role === "ADMIN") {
      getAllEmployees()
        .then((res) => {
        setAllEmployees(
    Array.isArray(res)
      ? res
      : Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res?.content)
      ? res.content
      : []
  );
        })
        .catch((err) => console.error(err));
    }
  }, [role]);
    const empId = localStorage.getItem("empId");
    console.log("empId from localStorage:", empId);
      
      const [checklist, setChecklist] = useState({
        laptop: false,
        idCard: false,
        documents: false,
        knowledgeTransfer: false,
      });

      const [newSkill, setNewSkill] = useState({
      name: "",
      level: "Beginner"
    });
      /* ✅ SAFE API CALL */
    useEffect(() => {
      setSkills([
        {
          id: 1,
          name: "React",
          level: "Advanced",
          employeeRating: 4,
          managerRating: 3,
        },
        {
          id: 2,
          name: "JavaScript",
          level: "Advanced",
          employeeRating: 5,
          managerRating: 4,
        },
        {
          id: 3,
          name: "Java",
          level: "Intermediate",
          employeeRating: 3,
          managerRating: 3,
        },
      ]);
    }, []);

              
        useEffect(() => {
  const load = async () => {
    const data = await fetchMyProfile();
    console.log("PROFILE API RESPONSE:", data);
    setProfileData(data);

    // ✅ ADD THIS LINE HERE
    if (data?.employeeId) {
      localStorage.setItem("empId", data.employeeId);
    }
  };

  load();
}, []);
      const employee = {
  name: user?.name || profileData?.name || "N/A",
  role: user?.role || profileData?.role || "N/A",

 id:
  profileData?.employeeId ??
  user?.employeeId ??
  empId ??
  "N/A",

  phone: profileData?.phone || "N/A",
  email: user?.email || profileData?.email || "N/A",

  dob: profileData?.dob || "",
  fatherName: profileData?.fatherName || "",
  motherName: profileData?.motherName || "",

  bloodGroup: profileData?.bloodGroup || "",
  permanentAddress: profileData?.permanentAddress || "",
  currentAddress: profileData?.currentAddress || "",

  city: profileData?.city || "",
  taluk: profileData?.taluk || "",
  district: profileData?.district || "",
  state: profileData?.state || "",
  pincode: profileData?.pincode || "",

  department: profileData?.department || "N/A",
  designation: profileData?.designation || "N/A",
  joiningDate: profileData?.joiningDate || "N/A",
  totalExp: profileData?.totalExp || "N/A",
  currentExp: profileData?.currentExp || "N/A",
};

  useEffect(() => {
    const saved = localStorage.getItem("jobEdit");
    if (employee && profileData) {
      setJobEdit({
        designation: employee.designation,
        department: employee.department,
        joiningDate: employee.joiningDate,
        totalExp: employee.totalExp,
        currentExp: employee.currentExp,
        employmentType: "Full-Time",
        location: "Bangalore",
        manager: profileData?.managerName || "",
        hr: profileData?.hrName || ""
      });
    }
  }, []); // ✅ only runs once

    const refreshProfile = async () => {
    const data = await fetchMyProfile();
    setProfileData(data);
  };

    const reporting = [
    {
      name: profileData?.managerName || "Padmanabh",
      role: "Engineering Manager"
    },
    {
      name: profileData?.hrName || "Shambuling Madivalar",
      role: "HR Business Partner"
    }
  ];



    const downloadPDF = (emp) => {
    const content = `
      Increment Letter

      Employee: ${emp?.name || employee.name}
      Date: 01 January 2025

      Congratulations! Your salary has been revised.

      Regards,
      HR Team
    `;

    const blob = new Blob([content], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${emp?.name || employee.name}_Increment_Letter.pdf`;
    link.click();
  };

 const [personalEdit, setPersonalEdit] = useState(() => {
  const saved = localStorage.getItem("personalEdit");
  return saved ? JSON.parse(saved) : employee;
});
  const states = ["Karnataka"];
  const districts = {
    Karnataka: ["Haveri", "Dharwad"]
  };

  const taluks = {
    Haveri: ["Hangal", "Ranebennur"],
    Dharwad: ["Hubli", "Dharwad"]
  };

  const cities = {
    Hangal: ["Hangal"],
    Hubli: ["Hubli"]
  };

const bgvRecords = JSON.parse(localStorage.getItem("bgv_records")) || [];

const currentBGV = bgvRecords.find(
  (b) => b.employeeId === employee.id || b.employeeId === employee.employeeId
);

console.log("BGV Records:", bgvRecords);
console.log("Current BGV:", currentBGV);

const documents = [
  { name: "Resume.pdf" },
  { name: "Aadhaar.pdf" },
  { name: "Offer_Letter.pdf" }
];

const getDesignation = () => {
  if (role === "ADMIN") return "HR Manager / CEO";
  if (role === "MANAGER") return "Engineering Manager";
  return "Software Developer";
};
      return (
        <div className={styles.profilePage}>
          <div className={styles.profileContainer}>
            
            {/* ================= LEFT PANEL ================= */}
            <div className={styles.profileLeft}>
              <div className={styles.profileCard}>
             <div className={styles.imageWrapper}>
  <img
    src={profileImage || "https://randomuser.me/api/portraits/men/32.jpg"}
    alt="profile"
    className={styles.profileImage}
  />

  {/* Hidden file input */}
  <input
    id="profileUpload"
    type="file"
    accept="image/*"
    style={{ display: "none" }}
    onChange={(e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
        localStorage.setItem("profileImage", reader.result);
      };
      reader.readAsDataURL(file);
    }}
  />

  {/* Edit button */}
  <label htmlFor="profileUpload" className={styles.editImageBtn}>
    ✎ Edit
  </label>
</div>

                <h3>{employee.name}</h3>
                <p className={styles.role}>{employee.role}</p>
                <p className={styles.role}>{getDesignation()}</p>

               

                <div className={styles.infoList}>
                  <p><strong>Employee ID</strong> {employee.id}</p>
                  <p>{employee.phone}</p>
                  <p>{employee.email}</p>
                  <p>{employee.location}</p>
                </div>

              

                <div className={styles.quickLinks}>
                  <p onClick={() => setView("overview")}>Overview</p>
                  <p onClick={() => setView("compensation")}>Compensation</p>
                  <p onClick={() => setView("exit")}>Exit Management</p>
                    <p onClick={() => setView("skills")}>Skill Matrix</p> {/* NEW */}
                </div>
              </div>
            </div>

            {/* ================= RIGHT PANEL ================= */}
            <div className={styles.profileRight}>
              
              {/* HEADER */}
              <div className={styles.profileHeader}>
                <div>
                 
                </div>

                <select
                  className={styles.statusSelectLarge}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option>Available</option>
                  <option>Active</option>
                  <option>Offline</option>
                  <option>Do Not Disturb</option>
                </select>
              </div>

              {/* ================= OVERVIEW ================= */}
              {view === "overview" && (
                <div className={styles.profileGrid}>

                <div className={styles.profileSectionCard}>
    <div className={styles.sectionHeader}>
      <h3>Personal Information</h3>
      <button
        className={styles.editBtn}
        onClick={() => setShowEditModal(true)}
      >
        Edit
      </button>
    </div>

    <div className={styles.infoGrid}>
      <p><strong>Name:</strong> {personalEdit.name}</p>
      <p><strong>DOB:</strong> {personalEdit.dob}</p>
      <p><strong>Email:</strong> {personalEdit.email}</p>
      <p><strong>Phone:</strong> {personalEdit.phone}</p>
      <p><strong>Father:</strong> {personalEdit.fatherName}</p>
      <p><strong>Mother:</strong> {personalEdit.motherName}</p>
      <p><strong>Blood Group:</strong> {personalEdit.bloodGroup}</p>
      <p><strong>State:</strong> {personalEdit.state}</p>
      <p><strong>District:</strong> {personalEdit.district}</p>
      <p><strong>Taluk:</strong> {personalEdit.taluk}</p>
      <p><strong>City:</strong> {personalEdit.city}</p>
    </div>
    {showEditModal && (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Edit Personal Information</h3>

        <div className={styles.formGrid}>

          <input
            placeholder="Name"
            value={personalEdit.name}
            onChange={(e)=>setPersonalEdit({...personalEdit, name:e.target.value})}
          />

          <input
            type="date"
            value={personalEdit.dob}
            onChange={(e)=>setPersonalEdit({...personalEdit, dob:e.target.value})}
          />

          <input
            placeholder="Email"
            value={personalEdit.email}
            onChange={(e)=>setPersonalEdit({...personalEdit, email:e.target.value})}
          />

          <input
            placeholder="Phone"
            value={personalEdit.phone}
            onChange={(e)=>setPersonalEdit({...personalEdit, phone:e.target.value})}
          />

          <input
            placeholder="Father Name"
            value={personalEdit.fatherName}
            onChange={(e)=>setPersonalEdit({...personalEdit, fatherName:e.target.value})}
          />

          <input
            placeholder="Mother Name"
            value={personalEdit.motherName}
            onChange={(e)=>setPersonalEdit({...personalEdit, motherName:e.target.value})}
          />

        <input
    placeholder="Blood Group"
    value={personalEdit.bloodGroup}
    onChange={(e)=>setPersonalEdit({...personalEdit, bloodGroup:e.target.value})}
  />

        <input
    placeholder="State"
    value={personalEdit.state}
    onChange={(e)=>setPersonalEdit({...personalEdit, state:e.target.value})}
  />

        <input
    placeholder="District"
    value={personalEdit.district}
    onChange={(e)=>setPersonalEdit({...personalEdit, district:e.target.value})}
  />


          
  <input
    placeholder="Taluk"
    value={personalEdit.taluk}
    onChange={(e)=>setPersonalEdit({...personalEdit, taluk:e.target.value})}
  />

        <input
    placeholder="City"
    value={personalEdit.city}
    onChange={(e)=>setPersonalEdit({...personalEdit, city:e.target.value})}
  />

        </div>

        <div className={styles.modalActions}>
          <button
            className={styles.saveBtn}
            onClick={() => {
  localStorage.setItem("personalEdit", JSON.stringify(personalEdit)); // ✅ SAVE
  setShowEditModal(false);
}}
          >
            Save
          </button>

          <button
            className={styles.cancelBtn}
           onClick={() => {
  localStorage.setItem("personalEdit", JSON.stringify(personalEdit)); // ✅ SAVE
  setShowEditModal(false);
}}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )}
  {showJobModal && (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Edit Job Details</h3>

        <div className={styles.formGrid}>

          <input
            placeholder="Designation"
            value={jobEdit.designation}
            onChange={(e)=>setJobEdit({...jobEdit, designation:e.target.value})}
          />

          <input
            placeholder="Department"
            value={jobEdit.department}
            onChange={(e)=>setJobEdit({...jobEdit, department:e.target.value})}
          />

          <input
            placeholder="PF (Provident Fund)"
            value={jobEdit.pf}
            onChange={(e)=>setJobEdit({...jobEdit, pf:e.target.value})}
          />

          <input
            placeholder="UAN (Universal Account Number)"
            value={jobEdit.uan}
            onChange={(e)=>setJobEdit({...jobEdit, uan:e.target.value})}
          />

          <input
            placeholder="ESIC (Employees' State Insurance)"
            value={jobEdit.esic}
            onChange={(e)=>setJobEdit({...jobEdit, esic:e.target.value})}
          />

          <input
            type="date"
            value={jobEdit.joiningDate}
            onChange={(e)=>setJobEdit({...jobEdit, joiningDate:e.target.value})}
          />

          <input
            placeholder="Total Experience"
            value={jobEdit.totalExp}
            onChange={(e)=>setJobEdit({...jobEdit, totalExp:e.target.value})}
          />

          <input
            placeholder="Current Experience"
            value={jobEdit.currentExp}
            onChange={(e)=>setJobEdit({...jobEdit, currentExp:e.target.value})}
          />

          <input
            placeholder="Employment Type"
            value={jobEdit.employmentType}
            onChange={(e)=>setJobEdit({...jobEdit, employmentType:e.target.value})}
          />

          <input
            placeholder="Work Location"
            value={jobEdit.location}
            onChange={(e)=>setJobEdit({...jobEdit, location:e.target.value})}
          />

          <input
            placeholder="Manager"
            value={jobEdit.manager}
            onChange={(e)=>setJobEdit({...jobEdit, manager:e.target.value})}
          />

          <input
            placeholder="HR Partner"
            value={jobEdit.hr}
            onChange={(e)=>setJobEdit({...jobEdit, hr:e.target.value})}
          />

        </div>

        <div className={styles.modalActions}>
          <button
    className={styles.saveBtn}
    onClick={async () => {
      try {
        const response = await updateJobDetails(jobEdit);
        
        // Update local state with the response data
        setJobEdit({
          ...response,
          joiningDate: response.joiningDate || jobEdit.joiningDate,
          totalExp: response.totalExp || jobEdit.totalExp,
          currentExp: response.currentExp || jobEdit.currentExp,
          employmentType: response.employmentType || jobEdit.employmentType,
          location: response.location || jobEdit.location,
          manager: response.manager || jobEdit.manager,
          hr: response.hr || jobEdit.hr
        });
        
        localStorage.setItem("jobEdit", JSON.stringify(response)); // ✅ SAVE
        await refreshProfile();

        alert("Job details updated successfully ✅");

        setShowJobModal(false);
      } catch (err) {
        console.error(err);
        alert("Failed to update job details ❌");
      }
    }}
  >
    Save
  </button>

          <button
            className={styles.cancelBtn}
            onClick={() => setShowJobModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )}
  </div>

  <div className={styles.profileSectionCard}>
    <div className={styles.sectionHeader}>
      <h3>Job Details</h3>
      <button
        className={styles.editBtn}
        onClick={() => setShowJobModal(true)}
      >
        Edit
      </button>
    </div>

    <div className={styles.infoGrid}>
      <p><strong>Designation:</strong> {jobEdit.designation}</p>
      <p><strong>Department:</strong> {jobEdit.department}</p>
      <p><strong>PF:</strong> {jobEdit.pf || "N/A"}</p>
      <p><strong>UAN:</strong> {jobEdit.uan || "N/A"}</p>
      <p><strong>ESIC:</strong> {jobEdit.esic || "N/A"}</p>
      <p><strong>Date of Joining:</strong> {jobEdit.joiningDate}</p>
      <p><strong>Total Experience:</strong> {jobEdit.totalExp}</p>
      <p><strong>Current Experience:</strong> {jobEdit.currentExp}</p>
      <p><strong>Employment Type:</strong> {jobEdit.employmentType}</p>
      <p><strong>Work Location:</strong> {jobEdit.location}</p>
      <p><strong>Manager:</strong> {jobEdit.manager}</p>
      <p><strong>HR Partner:</strong> {jobEdit.hr}</p>
    </div>

    <button
      className={styles.resignBtn}
      onClick={() => setView("exit")}
    >
      Submit Resignation
    </button>
  </div>

                  <div className={styles.profileSectionCard}>
                    <h3>Reporting Structure</h3>
                    {reporting.map((r, i) => (
                      <div key={i} className={styles.reportRow}>
                        <div className={styles.avatar}></div>
                        <div>
                          <p className={styles.reportName}>{r.name}</p>
                          <span>{r.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.profileSectionCard}>
                    <h3>Documents</h3>
                    {documents.map((doc, i) => (
  <div key={i} className={styles.docRow}>
    <div>
      <p className={styles.docName}>{doc.name}</p>
      <span className={styles.docDate}>Uploaded</span>
    </div>

    <button
      className={styles.downloadBtn}
      onClick={() => {
        const link = document.createElement("a");
        link.href = "#";
        link.download = doc.name;
        link.click();
      }}
    >
      Download
    </button>
  </div>
))}
                  </div>

                </div>
              )}

              {/* ================= COMPENSATION ================= */}
              {view === "compensation" && (
                <div className={styles.profileSectionCard}>
                  <h3>Compensation Details</h3>
                    
                  
                  <p><strong>Variable Pay:</strong> ₹1,20,000 / year</p>
                  <p><strong>Bonus (Last Year):</strong> ₹50,000</p>

                  <h4 style={{ marginTop: "20px" }}>
                    Previous Year Appraisal
                  </h4>

                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Year</th>
                        <th>Rating</th>
                        <th>Hike</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>2024</td>
                        <td>Exceeds Expectations</td>
                        <td>18%</td>
                        <td>Outstanding performance</td>
                      </tr>
                      <tr>
                        <td>2023</td>
                        <td>Meets Expectations</td>
                        <td>12%</td>
                        <td>Consistent performer</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Increment Letter */}
                  <h4 style={{ marginTop: "24px" }}>
                    Increment Letter
                  </h4>

                  <div className={styles.docRow}>
                    <div>
                      <p className={styles.docName}>Increment_Letter_2025.pdf</p>
                      <span className={styles.docDate}>Issued on: 01 Jan 2025</span>
                    </div>


                    <div>
                      <button
                        className={styles.downloadBtn}
                        onClick={() => setShowIncrementLetter(true)}
                      >
                        View
                      </button>

                      <button
                        className={styles.downloadBtn}
                        style={{ marginLeft: "8px" }}
                        onClick={() => downloadPDF(employee)}
                      >
                        Download
                      </button>
                    </div>
                  </div>

                 {showIncrementLetter && selectedEmployee && (
  <div className={styles.incrementPreview}>
    
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <h2>💼 Salary Revision Letter</h2>
      <p style={{ color: "#888" }}>Human Resources Department</p>
      <hr />
    </div>

    <p><strong>Date:</strong> 01 January 2025</p>

    <p>
      Dear <strong>{selectedEmployee.name}</strong>,
    </p>

    <p>
      We are pleased to inform you that based on your performance,
      your compensation has been revised as follows:
    </p>

    <div style={{ marginTop: "15px", lineHeight: "1.8" }}>
      <p><strong>Employee ID:</strong> {selectedEmployee.employeeId || selectedEmployee.id}</p>
      <p><strong>Department:</strong> {selectedEmployee.department}</p>
      <p><strong>Designation:</strong> {selectedEmployee.designation}</p>

      <hr />

      <p><strong>Previous CTC:</strong> ₹{selectedEmployee.ctc || "N/A"}</p>
      <p><strong>Hike Percentage:</strong> {selectedEmployee.hikePercent || "0"}%</p>
      <p><strong>Hike Value:</strong> ₹{selectedEmployee.hikeValue || "0"}</p>

      <hr />

      <p>
        <strong>Revised CTC:</strong>{" "}
        ₹
        {selectedEmployee.ctc && selectedEmployee.hikeValue
          ? Number(selectedEmployee.ctc) + Number(selectedEmployee.hikeValue)
          : "N/A"}
      </p>
    </div>

    <p style={{ marginTop: "20px" }}>
      This revision reflects your contribution and performance in the organization.
    </p>

    <p>
      Regards,<br />
      <strong>Human Resources Team</strong>
    </p>

    <button
      className={styles.closePreviewBtn}
      onClick={() => {
        setShowIncrementLetter(false);
        setSelectedEmployee(null);
      }}
    >
      Close
    </button>
  </div>
)}

                  {role === "ADMIN" && (
    <>
      <h4 style={{ marginTop: "20px" }}>Employee Compensation Tracking</h4>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Emp ID</th>
            <th>Employee Name</th>
            <th>DOB</th>
            <th>DOJ</th>
            <th>Tenure</th>
              {/* NEW COLUMNS */}
          <th>CTC</th>
          <th>Hike Value</th>
          <th>Hike %</th>
          <th>Hike Year</th>
            <th>Designation</th>
            <th>Department</th>
            <th>Increment Letter</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
  {Array.isArray(allEmployees) &&
  allEmployees.map((emp, i) => (
      <tr key={i}>
       <td>{emp.employeeId || emp.id}</td>
       
        <td>
  {emp.name || emp.employeeName || emp.fullName }
</td>
        <td>{emp.dob}</td>
        <td>{emp.joiningDate}</td>
        <td>{emp.tenure}</td>
       
         {/* NEW VALUES (adjust field names if backend differs) */}
              <td>{emp.ctc || "-"}</td>
              <td>{emp.hikeValue || "-"}</td>
              <td>{emp.hikePercent || "-"}</td>
              <td>{emp.hikeYear || "-"}</td>
        <td>{emp.designation}</td>
        <td>{emp.department}</td>

        <td>{emp.incrementLetter || "Available"}</td>

       <td>
  <div className={styles.actionGroup}>
    <button
      className={styles.viewBtn}
      onClick={() => {
        setShowIncrementLetter(true);
        setSelectedEmployee(emp);
      }}
    >
      👁 View
    </button>

    <button
      className={styles.downloadBtn}
      onClick={() => downloadPDF(emp)}
    >
      ⬇ Download
    </button>
  </div>
</td>
      </tr>
    ))}
  </tbody>
      </table>
    </>
  )}
                </div>
              )}

              

              {/* ================= EXIT MANAGEMENT ================= */}
              {view === "exit" && (
                <div className={styles.profileSectionCard}>
                  <h3>Exit Management</h3>



                  {/* FORM */}
                  {exitStage === "form" && (
                    <form
                      className={styles.exitForm}
                      onSubmit={(e) => {
                        e.preventDefault();
                        setExitStage("manager");
                      }}
                    >
                      <label>Reason for Resignation</label>
                      <textarea
                        className={styles.input}
                        required
                        value={exitData.reason}
                        onChange={(e) =>
                          setExitData({ ...exitData, reason: e.target.value })
                        }
                      />

                      <label>Remarks</label>
    <textarea
      className={styles.input}
      placeholder="Additional comments (optional)"
      value={exitData.remarks || ""}
      onChange={(e) =>
        setExitData({ ...exitData, remarks: e.target.value })
      }
    />
   <label>TO (Reporting Manager)</label>

<div className={styles.inputBox}>
  
  {/* chips */}
  <div className={styles.chipContainer}>
    {exitData.manager.map((u, idx) => (
      <Chip
        key={idx}
        user={u}
        onRemove={() => {
          const updated = exitData.manager.filter((_, i) => i !== idx);
          setExitData({ ...exitData, manager: updated });
        }}
      />
    ))}
  </div>

  {/* input */}
  <input
    type="text"
    className={styles.input}
    placeholder="Add recipients..."
    value={searchTo}
    onChange={(e) => setSearchTo(e.target.value)}
  />

  {/* dropdown */}
  {searchTo && (
    <div className={styles.suggestionBox}>
      {users
        .filter(u =>
          u.name.toLowerCase().includes(searchTo.toLowerCase())
        )
        .map(u => (
          <div
            key={u.id}
            className={styles.suggestionItem}
            onClick={() => {
              if (!exitData.manager.find(x => x.id === u.id)) {
                setExitData({
                  ...exitData,
                  manager: [...exitData.manager, u]
                });
              }
              setSearchTo("");
            }}
          >
            {u.name} ({u.email})
          </div>
        ))}
    </div>
  )}
</div>
<label>CC (Copy Manager)</label>

<div className={styles.inputBox}>
  
  <div className={styles.chipContainer}>
    {exitData.cc.map((u, idx) => (
      <Chip
        key={idx}
        user={u}
        onRemove={() => {
          const updated = exitData.cc.filter((_, i) => i !== idx);
          setExitData({ ...exitData, cc: updated });
        }}
      />
    ))}
  </div>

  <input
    type="text"
    className={styles.input}
    placeholder="Add CC recipients..."
    value={searchCc}
    onChange={(e) => setSearchCc(e.target.value)}
  />

  {searchCc && (
    <div className={styles.suggestionBox}>
      {users
        .filter(u =>
          u.name.toLowerCase().includes(searchCc.toLowerCase())
        )
        .map(u => (
          <div
            key={u.id}
            className={styles.suggestionItem}
            onClick={() => {
              if (!exitData.cc.find(x => x.id === u.id)) {
                setExitData({
                  ...exitData,
                  cc: [...exitData.cc, u]
                });
              }
              setSearchCc("");
            }}
          >
            {u.name} ({u.email})
          </div>
        ))}
    </div>
  )}
</div>
                      <label>Notice Period</label>
                      <select
                        className={styles.input}
                        value={exitData.notice}
                        onChange={(e) =>
                          setExitData({ ...exitData, notice: e.target.value })
                        }
                      >
                        <option>30 Days</option>
                        <option>60 Days</option>
                        <option>90 Days</option>
                      </select>

                      <label>Last Working Day</label>
                      <input
                        type="date"
                        className={styles.input}
                        required
                        value={exitData.lwd}
                        onChange={(e) =>
                          setExitData({ ...exitData, lwd: e.target.value })
                        }
                      />

                      <div className={styles.noticeBox}>
                        ⚠️ Request will go to your manager for approval
                      </div>

                      <button className={styles.submitBtn}>
                        Submit Resignation
                      </button>
                    </form>
                  )}

                  {/* MANAGER */}
                  {exitStage === "manager" && (
                    <div className={styles.exitStatusBox}>
                      <p><strong>Status:</strong> Pending Manager Approval</p>

                      <button
                        className={styles.downloadBtn}
                        onClick={() => setExitStage("hr")}
                      >
                        Simulate Manager Approval
                      </button>
                    </div>
                  )}

                  {/* HR */}
                  {exitStage === "hr" && (
                    <div className={styles.exitStatusBox}>
                      <p><strong>Status:</strong> Pending HR Approval</p>

                      <button
                        className={styles.downloadBtn}
                        onClick={() => setExitStage("checklist")}
                      >
                        Simulate HR Approval
                      </button>
                    </div>
                  )}

              {/* ===== RESIGNATION TRACKING TABLE ===== */}
    <div className={styles.profileSectionCard} style={{ marginTop: "20px" }}>
      <h3>Resignation Tracking</h3>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Emp ID</th>
            <th>Name</th>
            <th>Dept</th>
            <th>Manager</th>
            <th>DOJ</th>
          <th>Tenure</th>
          <th>Year</th>
          
            <th>Reason</th>
            <th>Date</th>
            <th>Status</th>
            <th>Remarks</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>{employee.id}</td>
            <td>{employee.name}</td>
            <td>{employee.department}</td>
          <td>{profileData?.managerName || "-"}</td>
            <td>{employee.joiningDate}</td>
          <td>{employee.currentExp || "-"}</td>
          <td>2025</td>
            <td>{exitData.reason || "-"}</td>
            <td>{exitData.lwd || "-"}</td>

            <td>
              <span className={styles.statusPending}>
                {exitStage === "form" && "Draft"}
                {exitStage === "manager" && "Manager Approval"}
                {exitStage === "hr" && "HR Approval"}
                {exitStage === "checklist" && "Clearance"}
                {exitStage === "completed" && "Completed"}
              </span>
            </td>

            <td>{exitData.remarks || "-"}</td>

            <td>
              <button className={styles.actionBtn}>View</button>
              <button className={styles.actionBtnOutline}>Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
                  {/* CHECKLIST */}
                  {exitStage === "checklist" && (
                    <div>
                      <h4>Exit Clearance Checklist</h4>

                      <div className={styles.exitForm}>
                        <label>
                          <input
                            type="checkbox"
                            checked={checklist.laptop}
                            onChange={() =>
                              setChecklist({
                                ...checklist,
                                laptop: !checklist.laptop,
                              })
                            }
                          />
                          Laptop Returned
                        </label>

                        <label>
                          <input
                            type="checkbox"
                            checked={checklist.idCard}
                            onChange={() =>
                              setChecklist({
                                ...checklist,
                                idCard: !checklist.idCard,
                              })
                            }
                          />
                          ID Card Returned
                        </label>

                        <label>
                          <input
                            type="checkbox"
                            checked={checklist.documents}
                            onChange={() =>
                              setChecklist({
                                ...checklist,
                                documents: !checklist.documents,
                              })
                            }
                          />
                          Documents Submitted
                        </label>

                        <label>
                          <input
                            type="checkbox"
                            checked={checklist.knowledgeTransfer}
                            onChange={() =>
                              setChecklist({
                                ...checklist,
                                knowledgeTransfer: !checklist.knowledgeTransfer,
                              })
                            }
                          />
                          Knowledge Transfer Completed
                        </label>

                        <button
                          className={styles.submitBtn}
                          onClick={() => setExitStage("completed")}
                        >
                          Submit Clearance
                        </button>
                      </div>
                    </div>
                  )}

                  {/* COMPLETED */}
                  {exitStage === "completed" && (
                    <div className={styles.exitStatusBox}>
                      <p><strong>Status:</strong> Exit Completed</p>
                      <p>Full & Final Settlement in progress.</p>

                      <button className={styles.downloadBtn}>
                        Download Relieving Letter
                      </button>

                      <button
                        className={styles.downloadBtn}
                        style={{ marginLeft: "8px" }}
                      >
                        Download Experience Letter
                      </button>
                    </div>
                  )}
                </div>
              )}


    {/* ================= SKILL MATRIX ================= */}
    {view === "skills" && (role === "EMPLOYEE" || role === "MANAGER") && (
      <div className={styles.profileSectionCard}>
        <h3>Skill Matrix</h3>

        {/* ✅ ADD SKILL FORM (REPLACES PROMPT) */}
        {role === "EMPLOYEE" && (
          <div style={{ marginBottom: "20px" }}>
            <h4>Add New Skill</h4>

            <input
              type="text"
              placeholder="Skill Name"
              className={styles.input}
              value={newSkill.name}
              onChange={(e) =>
                setNewSkill({ ...newSkill, name: e.target.value })
              }
            />

            <select
              className={styles.input}
              value={newSkill.level}
              onChange={(e) =>
                setNewSkill({ ...newSkill, level: e.target.value })
              }
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Expert</option>
            </select>

            <button
              className={styles.submitBtn}
              style={{ marginTop: "10px" }}
              onClick={() => {
                if (!newSkill.name) {
                  alert("Enter skill name");
                  return;
                }

                const newEntry = {
          id: Date.now(),
          name: newSkill.name,
          level: newSkill.level,
          employeeRating: 0,
          managerRating: 0
        };

        setSkills((prev) => [...prev, newEntry]);

        setNewSkill({
          name: "",
          level: "Beginner"
        });
      }}
    >
      Add Skill
    </button>
          </div>
        )}

        {/* ✅ TABLE VIEW */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Skill</th>
              <th>Level</th>
              <th>Employee Rating</th>
              {role !== "EMPLOYEE" && <th>Manager Rating</th>}
            </tr>
          </thead>

          <tbody>
            {(skills || []).map((skill, index) => (
              <tr key={skill.id || index}>
                <td>{skill.name}</td>

                {/* LEVEL */}
                <td>
                  <select
                    value={skill.level || "Beginner"}
                  disabled={role !== "EMPLOYEE"}
                    onChange={(e) => {
                      const updated = [...skills];
                      updated[index].level = e.target.value;
                      setSkills(updated);
                    }}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>Expert</option>
                  </select>
                </td>

                {/* EMPLOYEE RATING */}
                <td>
                  {[1,2,3,4,5].map((star) => (
                    <span
                      key={star}
                      style={{
                        color: star <= (skill.employeeRating || 0) ? "gold" : "#ccc",
                        cursor: role === "EMPLOYEE" ? "pointer" : "default"
                      }}
                      onClick={() => {
                        if (role === "EMPLOYEE") {
                          const updated = [...skills];
                          updated[index].employeeRating = star;
                          setSkills(updated);
                        }
                      }}
                    >
                      ★
                    </span>
                  ))}
                </td>

                {/* MANAGER RATING */}
              {role !== "EMPLOYEE" && (
                  <td>
                    {[1,2,3,4,5].map((star) => (
                      <span
                        key={star}
                        style={{
                          color: star <= (skill.managerRating || 0) ? "green" : "#ccc",
                          cursor: "pointer"
                        }}
                      onClick={() => {
      const updated = [...skills];
      updated[index].managerRating = star;
      setSkills(updated);
    }}
                      >
                        ★
                      </span>
                    ))}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

            </div>
          </div>
        </div>
      );
    }