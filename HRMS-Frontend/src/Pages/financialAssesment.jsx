import React, { useState , useEffect} from "react";
import "./financialAssesment.css";
import { useNavigate } from "react-router-dom";
import { getTrendData, addFinancialData } from "../api/financialApi.js";
import {
LineChart,
Line,
BarChart,
Bar,
PieChart,
Pie,
AreaChart,
Area,
XAxis,
YAxis,
Tooltip,
CartesianGrid,
ResponsiveContainer,
Cell
} from "recharts";

/* =========================
   DATA
========================= */



const budget=[
{name:"Q1",budget:200000,actual:180000},
{name:"Q2",budget:240000,actual:210000},
{name:"Q3",budget:230000,actual:200000},
{name:"Q4",budget:260000,actual:240000}
];

const payroll=[
{m:"Jan",cost:20000},
{m:"Feb",cost:24000},
{m:"Mar",cost:30000},
{m:"Apr",cost:36000},
{m:"May",cost:42000}
];

const cash=[
{m:"Jan",in:5000,out:3500},
{m:"Feb",in:6500,out:4200},
{m:"Mar",in:7200,out:5000},
{m:"Apr",in:8000,out:5600},
{m:"May",in:9000,out:6200}
];

const pnl=[
{name:"Gross Profit",value:45},
{name:"Operating Cost",value:25},
{name:"Taxes",value:20},
{name:"Net Profit",value:10}
];
const approvalData = [
{date:"12 Jan",dept:"Marketing",cat:"Ads",amt:"₹5000",status:"Approved"},
{date:"14 Jan",dept:"IT",cat:"Software",amt:"₹3000",status:"Approved"}
];

const forecastData = [
{year:2027,revenue:"₹3.1 Cr",profit:"₹85 L"},
{year:2028,revenue:"₹4.2 Cr",profit:"₹1.3 Cr"},
{year:2029,revenue:"₹5.6 Cr",profit:"₹2.0 Cr"}
];

const quarterlyCash = [
{q:"Q1",in:"₹60L",out:"₹45L",net:"₹15L"},
{q:"Q2",in:"₹65L",out:"₹48L",net:"₹17L"},
{q:"Q3",in:"₹70L",out:"₹52L",net:"₹18L"},
{q:"Q4",in:"₹75L",out:"₹55L",net:"₹20L"}
];

const workforce = [
{label:"Total Employees",value:"48"},
{label:"Avg Salary",value:"₹9.2 L"},
{label:"Salary Growth",value:"+8%"},
{label:"Employee ROI",value:"3.4x"},
{label:"Payroll %",value:"29%"}
];

const deptProfit = [
{name:"R&D",rev:60,exp:28,profit:32},
{name:"Marketing",rev:40,exp:22,profit:18},
{name:"IT",rev:35,exp:18,profit:17},
{name:"Sales",rev:70,exp:16,profit:54},
{name:"Ops",rev:35,exp:14,profit:21}
];

const monthlyFull = [
{m:"Jan",rev:20,exp:14,profit:6},
{m:"Feb",rev:22,exp:15,profit:7},
{m:"Mar",rev:24,exp:17,profit:7},
{m:"Apr",rev:23,exp:16,profit:7},
{m:"May",rev:25,exp:19,profit:6},
{m:"Jun",rev:26,exp:20,profit:6},
{m:"Jul",rev:28,exp:21,profit:7},
{m:"Aug",rev:27,exp:20,profit:7},
{m:"Sep",rev:29,exp:22,profit:7},
{m:"Oct",rev:30,exp:23,profit:7},
{m:"Nov",rev:32,exp:24,profit:8},
{m:"Dec",rev:34,exp:26,profit:8}
];

const channelData = [
{name:"Product",value:120},
{name:"Engineering",value:80},
{name:"AMC",value:20},
{name:"Consulting",value:10},
{name:"Licensing",value:10}
];

const COLORS=["#2563eb","#f97316","#facc15","#ef4444"];

export default function FinancialAssessment(){
  const [trend, setTrend] = useState([]);
  const totalRevenue = trend.reduce((sum, item) => sum + (item.revenue || 0), 0);
const totalExpense = trend.reduce((sum, item) => sum + (item.expense || 0), 0);
const totalProfit = trend.reduce((sum, item) => sum + (item.profit || 0), 0);
const totalLoss = trend.reduce((sum, item) => sum + (item.loss || 0), 0);
  const addDataToBackend = async () => {
  try {
   const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"];

const newData = {
  month: months[Math.floor(Math.random() * months.length)],
  revenue: Math.floor(Math.random() * 10000) + 5000,
  expense: Math.floor(Math.random() * 5000) + 2000,
  profit: Math.floor(Math.random() * 4000),
  loss: Math.floor(Math.random() * 1000)
};

    await addFinancialData(newData);

    fetchTrend(); // refresh chart
  } catch (err) {
    console.error(err);
  }
};
const navigate = useNavigate();
const [expenses,setExpenses]=useState([]);
const [searchDept, setSearchDept] = useState("");

const [form,setForm]=useState({
date:"",
department:"",
category:"",
amount:""
});
const [activeSection, setActiveSection] = useState(null);
/* =========================
   FORM
========================= */

const handleChange=(e)=>{
setForm({...form,[e.target.name]:e.target.value});
};

const addExpense=()=>{
if(!form.department || !form.amount) return;

const newExpense={
id:Date.now(),
...form
};

setExpenses([...expenses,newExpense]);

setForm({
date:"",
department:"",
category:"",
amount:""
});
};

const deleteExpense=(id)=>{
setExpenses(expenses.filter(e=>e.id!==id));
};
const KpiCard = ({ title, value, className, onClick }) => {
  return (
    <div className={`fa-kpi-card ${className}`} onClick={onClick}>
      <div className="fa-kpi-content">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );
};
/* =========================
   UI
========================= */

const fetchTrend = async () => {
  try {
    const res = await getTrendData();
    setTrend(res.data);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  fetchTrend();

  const interval = setInterval(fetchTrend, 5000); // every 5 sec

  return () => clearInterval(interval);
}, []);
return(

<div className="financial-assessment-page">

<h2 className="fa-title">HRMS Financial Management</h2>

{/* KPI */}
{/* KPI SECTION */}
<div className="fa-kpis">

 <KpiCard
  title="Revenue"
  value={`$${totalRevenue}`}
  className="fa-kpi-revenue"
/>

 <KpiCard
  title="Expenses"
  value={`$${totalExpense}`}
  className="fa-kpi-expense"
/>

 

  <KpiCard
  title="Net Profit"
  value={`$${totalProfit}`}
  className="fa-kpi-profit"
/>


 <KpiCard
  title="Loss"
  value={`$${totalLoss}`}
  className="fa-kpi-loss"
/>

</div>
<button onClick={addDataToBackend}>
  Add Test Data
</button>
{/* CHART GRID */}

<div className="fa-grid">

{/* TREND */}

<div 
  className="fa-card"
  onClick={() => navigate("/financial/revenue-expense")}
  style={{ cursor: "pointer" }}
>

<h4>Revenue / Expense Trend</h4>

<ResponsiveContainer width="100%" height={220}>
<BarChart data={trend}>
<CartesianGrid strokeDasharray="3 3"/>
<XAxis dataKey="month"/>
<YAxis/>
<Tooltip/>

<Bar dataKey="revenue" stroke="#2563eb"/>
<Bar dataKey="expense" stroke="#f97316"/>
<Bar dataKey="profit" stroke="#16a34a"/>
<Bar dataKey="loss" stroke="#ef4444"/>

</BarChart>
</ResponsiveContainer>

</div>

{/* BUDGET */}

<div 
  className="fa-card"
  onClick={() => navigate("/financial/budget")}
  style={{ cursor: "pointer" }}
>

<h4>Budget vs Actual</h4>

<ResponsiveContainer width="100%" height={220}>
<BarChart data={budget}>
<XAxis dataKey="name"/>
<YAxis/>
<Tooltip/>

<Bar dataKey="budget" fill="#2563eb"/>
<Bar dataKey="actual" fill="#f97316"/>

</BarChart>
</ResponsiveContainer>

</div>

{/* PAYROLL */}

<div 
  className="fa-card"
  onClick={() => navigate("/financial/payroll")}
  style={{ cursor: "pointer" }}
>

<h4>Payroll Cost</h4>

<ResponsiveContainer width="100%" height={220}>
<BarChart data={payroll}>
<XAxis dataKey="m"/>
<YAxis/>
<Tooltip/>

<Bar dataKey="cost" fill="#22c55e"/>

</BarChart>
</ResponsiveContainer>

</div>

{/* DEPARTMENT */}

{/* DEPARTMENT */}
<div className="fa-card">

  <h4>Department Spending</h4>

  {/* SEARCH BAR */}
  <div className="fa-search-box">
    <input
      type="text"
      placeholder="Search department..."
      value={searchDept}
      onChange={(e) => setSearchDept(e.target.value)}
    />
  </div>


  {/* FILTERED LIST */}
  <ul className="fa-dept-list">
    {[
      { name: "R&D", value: "$300K" },
      { name: "Marketing", value: "$250K" },
      { name: "IT", value: "$200K" },
      { name: "Sales", value: "$180K" },
      { name: "Operations", value: "$150K" }
    ]
      .filter((dept) =>
        dept.name.toLowerCase().includes(searchDept.toLowerCase())
      )
      .map((dept, index) => (
        <li key={index}>
          {dept.name} <span>{dept.value}</span>
        </li>
      ))}
  </ul>

</div>

{/* PIE */}

{/* PIE - IMPROVED */}
<div className="fa-card fa-pnl-card">

  <h4>Profit Breakdown</h4>

  <div className="fa-pnl-wrapper">

    {/* DONUT CHART */}
    <div className="fa-pnl-chart">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={pnl}
            dataKey="value"
            innerRadius={60}   // 👈 makes it donut
            outerRadius={90}
            paddingAngle={3}
          >
            {pnl.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* CENTER TEXT */}
      <div className="fa-pnl-center">
        <h3>100%</h3>
        <p>Total</p>
      </div>
    </div>

    {/* LEGEND */}
    <div className="fa-pnl-legend">
      {pnl.map((item, index) => (
        <div key={index} className="fa-legend-item">
          <span
            className="fa-legend-dot"
            style={{ background: COLORS[index] }}
          ></span>
          <span>{item.name}</span>
          <b>{item.value}%</b>
        </div>
      ))}
    </div>

  </div>

</div>

{/* CASHFLOW */}
{/* CASHFLOW */}
<div 
  className="fa-card"
  onClick={() => navigate("/financial/cashflow")}
  style={{ cursor: "pointer" }}
>

<h4>Cash Flow</h4>

<ResponsiveContainer width="100%" height={220}>
<AreaChart data={cash}>
<CartesianGrid strokeDasharray="3 3"/>
<XAxis dataKey="m"/>
<YAxis/>
<Tooltip/>

<Area dataKey="in" stroke="#16a34a" fill="#16a34a"/>
<Area dataKey="out" stroke="#ef4444" fill="#ef4444"/>

</AreaChart>
</ResponsiveContainer>

</div>

{/* EXPENSE TRACKER */}


{/* APPROVAL TABLE */}


</div>

</div>



);
}