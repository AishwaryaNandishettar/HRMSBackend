const payslipData = [
  {
    employee: {
      id: "EMP-1023",
      name: "James Wilson",
      role: "Accountant",
      avatar: "https://i.pravatar.cc/40?img=1",
    },
    month: "January 2022",
    earnings: { Basic: 3000, HRA: 1200, Allowance: 800 },
    deductions: { PF: 200, Tax: 150, Insurance: 50 },
    grossPay: 5000,
    netPay: 4600,
  },
  {
    employee: {
      id: "EMP-1024",
      name: "Sarah Johnson",
      role: "HR Manager",
      avatar: "https://i.pravatar.cc/40?img=2",
    },
    month: "January 2022",
    earnings: { Basic: 4000, HRA: 1500, Allowance: 1000 },
    deductions: { PF: 300, Tax: 250, Insurance: 70 },
    grossPay: 6500,
    netPay: 5880,
  },
  {
    employee: {
      id: "EMP-1025",
      name: "Michael Smith",
      role: "Developer",
      avatar: "https://i.pravatar.cc/40?img=3",
    },
    month: "January 2022",
    earnings: { Basic: 4500, HRA: 1800, Allowance: 1200 },
    deductions: { PF: 350, Tax: 300, Insurance: 80 },
    grossPay: 7500,
    netPay: 6770,
  },
  {
    employee: {
      id: "EMP-1026",
      name: "Lisa Green",
      role: "Designer",
      avatar: "https://i.pravatar.cc/40?img=4",
    },
    month: "January 2022",
    earnings: { Basic: 3500, HRA: 1400, Allowance: 900 },
    deductions: { PF: 250, Tax: 200, Insurance: 60 },
    grossPay: 5800,
    netPay: 5290,
  },
  {
    employee: {
      id: "EMP-1027",
      name: "David Miller",
      role: "Team Lead",
      avatar: "https://i.pravatar.cc/40?img=5",
    },
    month: "January 2022",
    earnings: { Basic: 5500, HRA: 2000, Allowance: 1500 },
    deductions: { PF: 400, Tax: 450, Insurance: 100 },
    grossPay: 9000,
    netPay: 8050,
  },
];

export default payslipData;
