import React, { useEffect, useMemo, useState } from "react";

const starterStudents = [
  {
    id: 1,
    name: "Aarav Singh",
    rollNo: "ST101",
    department: "Computer Science",
    year: "1st Year",
    marks: 88,
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Sharma",
    rollNo: "ST102",
    department: "Electronics",
    year: "2nd Year",
    marks: 76,
    status: "Active",
  },
  {
    id: 3,
    name: "Rohan Das",
    rollNo: "ST103",
    department: "Mechanical",
    year: "3rd Year",
    marks: 64,
    status: "Inactive",
  },
];

const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const statusOptions = ["All", "Active", "Inactive"];

function StudentManagementV2() {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("student-management-v2");
    return saved ? JSON.parse(saved) : starterStudents;
  });
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    rollNo: "",
    department: "",
    year: "1st Year",
    marks: "",
    status: "Active",
  });

  useEffect(() => {
    localStorage.setItem("student-management-v2", JSON.stringify(students));
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchText.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchText.toLowerCase()) ||
        student.department.toLowerCase().includes(searchText.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || student.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchText, statusFilter, students]);

  const stats = useMemo(() => {
    const activeCount = students.filter(
      (student) => student.status === "Active"
    ).length;
    const averageMarks = students.length
      ? Math.round(
          students.reduce((sum, student) => sum + student.marks, 0) /
            students.length
        )
      : 0;

    return {
      total: students.length,
      active: activeCount,
      inactive: students.length - activeCount,
      averageMarks,
    };
  }, [students]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setForm({
      name: "",
      rollNo: "",
      department: "",
      year: "1st Year",
      marks: "",
      status: "Active",
    });
    setEditingId(null);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const cleanedName = form.name.trim();
    const cleanedRollNo = form.rollNo.trim();
    const cleanedDepartment = form.department.trim();
    const marksValue = Number(form.marks);

    if (
      !cleanedName ||
      !cleanedRollNo ||
      !cleanedDepartment ||
      Number.isNaN(marksValue)
    ) {
      return;
    }

    if (editingId) {
      setStudents((currentStudents) =>
        currentStudents.map((student) =>
          student.id === editingId
            ? {
                ...student,
                name: cleanedName,
                rollNo: cleanedRollNo,
                department: cleanedDepartment,
                year: form.year,
                marks: marksValue,
                status: form.status,
              }
            : student
        )
      );
    } else {
      setStudents((currentStudents) => [
        {
          id: Date.now(),
          name: cleanedName,
          rollNo: cleanedRollNo,
          department: cleanedDepartment,
          year: form.year,
          marks: marksValue,
          status: form.status,
        },
        ...currentStudents,
      ]);
    }

    resetForm();
  }

  function handleEdit(student) {
    setEditingId(student.id);
    setForm({
      name: student.name,
      rollNo: student.rollNo,
      department: student.department,
      year: student.year,
      marks: String(student.marks),
      status: student.status,
    });
  }

  function handleDelete(id) {
    setStudents((currentStudents) =>
      currentStudents.filter((student) => student.id !== id)
    );
    if (editingId === id) {
      resetForm();
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.shell}>
        <div style={styles.hero}>
          <div>
            <p style={styles.eyebrow}>Student Management v2</p>
            <h1 style={styles.title}>Simple React Student Dashboard</h1>
            <p style={styles.subtitle}>
              A lightweight website version of a student management system with
              add, edit, delete, search, filter, and local save.
            </p>
          </div>
          <div style={styles.heroBadge}>React + localStorage</div>
        </div>

        <div style={styles.statsGrid}>
          <StatCard label="Total Students" value={stats.total} />
          <StatCard label="Active" value={stats.active} />
          <StatCard label="Inactive" value={stats.inactive} />
          <StatCard label="Average Marks" value={stats.averageMarks} />
        </div>

        <div style={styles.mainGrid}>
          <section style={styles.panel}>
            <div style={styles.panelHead}>
              <h2 style={styles.panelTitle}>
                {editingId ? "Edit Student" : "Add Student"}
              </h2>
              {editingId ? (
                <button onClick={resetForm} style={styles.softButton} type="button">
                  Cancel Edit
                </button>
              ) : null}
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                name="name"
                onChange={handleChange}
                placeholder="Student name"
                style={styles.input}
                type="text"
                value={form.name}
              />
              <input
                name="rollNo"
                onChange={handleChange}
                placeholder="Roll number"
                style={styles.input}
                type="text"
                value={form.rollNo}
              />
              <input
                name="department"
                onChange={handleChange}
                placeholder="Department"
                style={styles.input}
                type="text"
                value={form.department}
              />
              <select
                name="year"
                onChange={handleChange}
                style={styles.input}
                value={form.year}
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <input
                min="0"
                max="100"
                name="marks"
                onChange={handleChange}
                placeholder="Marks"
                style={styles.input}
                type="number"
                value={form.marks}
              />
              <select
                name="status"
                onChange={handleChange}
                style={styles.input}
                value={form.status}
              >
                {statusOptions
                  .filter((status) => status !== "All")
                  .map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
              </select>

              <button style={styles.primaryButton} type="submit">
                {editingId ? "Update Student" : "Add Student"}
              </button>
            </form>
          </section>

          <section style={styles.panel}>
            <div style={styles.panelHead}>
              <h2 style={styles.panelTitle}>Student Records</h2>
            </div>

            <div style={styles.toolbar}>
              <input
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search by name, roll no, or department"
                style={styles.searchInput}
                type="text"
                value={searchText}
              />
              <select
                onChange={(event) => setStatusFilter(event.target.value)}
                style={styles.filterSelect}
                value={statusFilter}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.recordList}>
              {filteredStudents.length === 0 ? (
                <div style={styles.emptyBox}>No students match the current filter.</div>
              ) : (
                filteredStudents.map((student) => (
                  <article key={student.id} style={styles.studentCard}>
                    <div style={styles.studentTopRow}>
                      <div>
                        <h3 style={styles.studentName}>{student.name}</h3>
                        <p style={styles.studentMeta}>
                          {student.rollNo} • {student.department}
                        </p>
                      </div>
                      <span
                        style={{
                          ...styles.statusPill,
                          ...(student.status === "Active"
                            ? styles.activePill
                            : styles.inactivePill),
                        }}
                      >
                        {student.status}
                      </span>
                    </div>

                    <div style={styles.studentDetails}>
                      <span>{student.year}</span>
                      <span>Marks: {student.marks}</span>
                    </div>

                    <div style={styles.cardActions}>
                      <button
                        onClick={() => handleEdit(student)}
                        style={styles.softButton}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        style={styles.deleteButton}
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={styles.statCard}>
      <span style={styles.statLabel}>{label}</span>
      <strong style={styles.statValue}>{value}</strong>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "28px",
    background:
      "radial-gradient(circle at top, #fef3c7 0%, #fff7ed 35%, #f8fafc 100%)",
    fontFamily: "Segoe UI, sans-serif",
    color: "#172554",
  },
  shell: {
    width: "min(1180px, 100%)",
    margin: "0 auto",
  },
  hero: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  eyebrow: {
    margin: 0,
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#b45309",
  },
  title: {
    margin: "10px 0 8px",
    fontSize: "2.3rem",
    color: "#172554",
  },
  subtitle: {
    margin: 0,
    maxWidth: "760px",
    color: "#475569",
    lineHeight: 1.6,
  },
  heroBadge: {
    padding: "12px 16px",
    borderRadius: "999px",
    background: "#fff7ed",
    border: "1px solid #fdba74",
    color: "#9a3412",
    fontWeight: 700,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
    marginBottom: "18px",
  },
  statCard: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "18px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
  },
  statLabel: {
    display: "block",
    color: "#64748b",
    fontSize: "0.92rem",
    marginBottom: "8px",
  },
  statValue: {
    fontSize: "1.9rem",
    color: "#0f172a",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(300px, 380px) minmax(0, 1fr)",
    gap: "18px",
  },
  panel: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "20px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.07)",
  },
  panelHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  panelTitle: {
    margin: 0,
    fontSize: "1.15rem",
  },
  form: {
    display: "grid",
    gap: "12px",
  },
  input: {
    padding: "12px 14px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    fontSize: "1rem",
    outline: "none",
  },
  primaryButton: {
    border: 0,
    borderRadius: "14px",
    padding: "13px 16px",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#ffffff",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  softButton: {
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    padding: "10px 14px",
    background: "#f8fafc",
    color: "#0f172a",
    cursor: "pointer",
  },
  deleteButton: {
    border: 0,
    borderRadius: "12px",
    padding: "10px 14px",
    background: "#fee2e2",
    color: "#b91c1c",
    cursor: "pointer",
  },
  toolbar: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 160px",
    gap: "12px",
    marginBottom: "16px",
  },
  searchInput: {
    padding: "12px 14px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    fontSize: "1rem",
  },
  filterSelect: {
    padding: "12px 14px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    fontSize: "1rem",
    background: "#ffffff",
  },
  recordList: {
    display: "grid",
    gap: "12px",
  },
  studentCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "16px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
  },
  studentTopRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "flex-start",
    marginBottom: "10px",
  },
  studentName: {
    margin: "0 0 6px",
    fontSize: "1.05rem",
    color: "#0f172a",
  },
  studentMeta: {
    margin: 0,
    color: "#64748b",
  },
  statusPill: {
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "0.85rem",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  activePill: {
    background: "#dcfce7",
    color: "#166534",
  },
  inactivePill: {
    background: "#fee2e2",
    color: "#b91c1c",
  },
  studentDetails: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    color: "#334155",
    marginBottom: "12px",
  },
  cardActions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  emptyBox: {
    border: "1px dashed #cbd5e1",
    borderRadius: "18px",
    padding: "20px",
    textAlign: "center",
    color: "#64748b",
    background: "#f8fafc",
  },
};

export default StudentManagementV2;
