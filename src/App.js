import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";

import { useState, useEffect } from "react";
import Premium from "./Premium";
import "./App.css";

const API = "http://localhost:3001";

function Layout({ children, loggedIn, logout }) {
  return (
    <div className="app">
      <header className="header">

        <Link to="/home" className="logo">
          PENNY <span>&</span> CO.
        </Link>

        <nav>
          <Link to="/home">HOME</Link>
          <Link to="/tracker">TRACKER</Link>
          <Link to="/about">ABOUT</Link>
          <Link to="/premium">PREMIUM</Link>

          {loggedIn ? (
            <button className="nav-button" onClick={logout}>
              LOGOUT
            </button>
          ) : (
            <Link to="/login">LOGIN</Link>
          )}
        </nav>

      </header>

      {children}

      <footer className="footer">
        <span>© 2026 PENNY & CO.</span>
        <span>MONEY / LIFESTYLE / YOU</span>
      </footer>
    </div>
  );
}


/* =========================
   HOME
========================= */

function Home() {
  return (
    <section className="hero">

      <div className="hero-small">
        PERSONAL FINANCE / 2026
      </div>

      <h1>
        Know where
        <br />
        your <em>money</em> goes.
      </h1>

      <p>
        A simple expense tracker for keeping your everyday
        spending organised.
      </p>

      <Link to="/tracker" className="hero-button">
        START TRACKING
      </Link>

    </section>
  );
}


/* =========================
   TRACKER
========================= */

function Tracker({ user }) {

  const [expenses, setExpenses] = useState([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const userId =
    user?._id ||
    user?.id ||
    user?.userId;


  /* LOAD EXPENSES */

  const loadExpenses = async () => {

    if (!userId) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    try {

      const response = await fetch(
        `${API}/expenses/${userId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not load expenses."
        );
      }

      const list = Array.isArray(data)
        ? data
        : data.expenses || [];

      setExpenses(list);

    } catch (error) {

      console.error(error);

      alert(
        "Could not load expenses. Make sure your MongoDB backend is running."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    loadExpenses();
  }, [userId]);


  /* ADD EXPENSE */

  const addExpense = async (e) => {

    e.preventDefault();

    if (!userId) {
      alert("Please sign in before adding expenses.");
      return;
    }

    if (
      !title.trim() ||
      Number(amount) <= 0 ||
      !date
    ) {
      alert(
        "Please enter an expense name, amount and date."
      );
      return;
    }

    setBusy(true);

    try {

      const response = await fetch(
        `${API}/expenses`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            title: title.trim(),
            amount: Number(amount),
            date: date,
            userId: userId
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not save expense."
        );
      }

      await loadExpenses();

      setTitle("");
      setAmount("");

      setDate(
        new Date().toISOString().slice(0, 10)
      );

    } catch (error) {

      console.error(error);

      alert(
        error.message ||
        "Could not save expense."
      );

    } finally {

      setBusy(false);

    }
  };


  /* DELETE EXPENSE */

  const deleteExpense = async (id) => {

    try {

      const response = await fetch(
        `${API}/expenses/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error(
          "Could not delete expense."
        );
      }

      await loadExpenses();

    } catch (error) {

      console.error(error);

      alert(
        "Could not delete expense."
      );

    }
  };


  /* TOTAL */

  const total = expenses.reduce(
    (sum, expense) =>
      sum + Number(expense.amount || 0),
    0
  );


  /* MONTH */

  const now = new Date();

  const monthly = expenses.filter(
    (expense) => {

      const d = new Date(expense.date);

      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );

    }
  );


  const monthlySpend = monthly.reduce(
    (sum, expense) =>
      sum + Number(expense.amount || 0),
    0
  );


  /* WEEK */

  const weekStart = new Date(now);

  weekStart.setDate(
    now.getDate() - now.getDay()
  );

  weekStart.setHours(0, 0, 0, 0);

  const weekly = expenses.filter(
    (expense) =>
      new Date(expense.date) >= weekStart
  );


  return (
    <section className="tracker">

      <div className="tracker-heading">

        <div>

          <span>
            01 / TRACKER
          </span>

          <h2>
            Your spending.
          </h2>

        </div>

        <div className="total">

          <small>
            TOTAL SPENT
          </small>

          <strong>
            ₹{total.toFixed(2)}
          </strong>

        </div>

      </div>


      {!userId && (
        <p>
          Please{" "}
          <Link to="/login">
            sign in
          </Link>{" "}
          to view and save your expenses.
        </p>
      )}


      <div className="stats">

        <div className="stat">

          <span>
            TOTAL EXPENSES
          </span>

          <strong>
            {expenses.length}
          </strong>

          <p>
            All recorded expenses
          </p>

        </div>


        <div className="stat">

          <span>
            WEEKLY EXPENSES
          </span>

          <strong>
            {weekly.length}
          </strong>

          <p>
            Expenses this week
          </p>

        </div>


        <div className="stat">

          <span>
            MONTHLY EXPENSES
          </span>

          <strong>
            {monthly.length}
          </strong>

          <p>
            Expenses this month
          </p>

        </div>


        <div className="stat highlight">

          <span>
            MONTHLY SPEND
          </span>

          <strong>
            ₹{monthlySpend.toFixed(2)}
          </strong>

          <p>
            Spent this month
          </p>

        </div>

      </div>


      <div className="expense-form">

        <h3>
          ADD AN EXPENSE
        </h3>

        <form onSubmit={addExpense}>

          <input
            type="text"
            placeholder="What did you spend on?"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />


          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Amount"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
          />


          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
          />


          <button
            type="submit"
            disabled={
              busy || !userId
            }
          >
            {busy
              ? "SAVING..."
              : "ADD EXPENSE"}
          </button>

        </form>

      </div>


      <div className="expense-list">

        <div className="list-header">

          <span>
            EXPENSE
          </span>

          <span>
            DATE
          </span>

          <span>
            AMOUNT
          </span>

        </div>


        {loading ? (

          <div className="empty">
            Loading expenses...
          </div>

        ) : expenses.length === 0 ? (

          <div className="empty">

            No expenses yet.
            <br />
            Add your first one above.

          </div>

        ) : (

          expenses
            .slice()
            .reverse()
            .map((expense) => (

              <div
                className="expense-item"
                key={
                  expense._id ||
                  expense.id
                }
              >

                <span>
                  {expense.title}
                </span>


                <span className="expense-date">
                  {expense.date}
                </span>


                <div className="expense-right">

                  <strong>
                    ₹
                    {Number(
                      expense.amount
                    ).toFixed(2)}
                  </strong>

                  <button
                    type="button"
                    onClick={() =>
                      deleteExpense(
                        expense._id ||
                        expense.id
                      )
                    }
                  >
                    ×
                  </button>

                </div>

              </div>

            ))

        )}

      </div>

    </section>
  );
}


/* =========================
   ABOUT
========================= */

function About() {

  return (
    <section className="about">

      <span>
        02 / ABOUT
      </span>

      <h2>
        Spend with
        <br />
        <em>intention.</em>
      </h2>

      <p>
        Penny & Co. helps you understand your
        spending and organise your everyday finances.
      </p>

    </section>
  );
}


/* =========================
   LOGIN
========================= */

function Login({ onLogin }) {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);


  const handleLogin = async (e) => {

    e.preventDefault();

    if (!email || !password) {

      alert(
        "Please fill in all the fields."
      );

      return;
    }

    setBusy(true);

    try {

      const response = await fetch(
        `${API}/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Incorrect email or password."
        );

      }


      const result =
        data.user || data;


      const user = {
        ...result,

        _id:
          result._id ||
          result.id ||
          data.userId,

        name:
          result.name ||
          data.name,

        email:
          result.email ||
          email
      };


      if (!user._id) {

        throw new Error(
          "Login succeeded but the user ID was not returned by the backend."
        );

      }


      localStorage.setItem(
        "pennyUser",
        JSON.stringify(user)
      );


      onLogin(user);

      alert(
        "Sign in successful!"
      );

      navigate("/home");

    } catch (error) {

      console.error(error);

      alert(
        error.message ||
        "Unable to sign in."
      );

    } finally {

      setBusy(false);

    }
  };


  return (
    <section className="auth-page">

      <div className="auth-box">

        <p className="auth-eyebrow">
          WELCOME BACK
        </p>

        <h2>
          Sign in.
        </h2>

        <p className="auth-description">
          Continue managing your money
          with intention.
        </p>


        <form onSubmit={handleLogin}>

          <div className="auth-input">

            <label>
              Email address
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>


          <div className="auth-input">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              required
            />

          </div>


          <button
            type="submit"
            disabled={busy}
          >
            {busy
              ? "SIGNING IN..."
              : "SIGN IN"}
          </button>

        </form>


        <div className="auth-switch">

          <span>
            Don't have an account?
          </span>

          <Link to="/signup">
            SIGN UP
          </Link>

        </div>

      </div>

    </section>
  );
}


/* =========================
   SIGN UP
========================= */

function Signup() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [busy, setBusy] = useState(false);


  const handleSignup = async (e) => {

    e.preventDefault();

    if (
      !name.trim() ||
      !email ||
      !password ||
      !confirmPassword
    ) {

      alert(
        "Please fill in all the fields."
      );

      return;
    }


    if (
      password !== confirmPassword
    ) {

      alert(
        "Passwords do not match."
      );

      return;
    }


    setBusy(true);


    try {

      const response = await fetch(
        `${API}/signup`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            name: name.trim(),
            email,
            password
          })
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Registration failed."
        );

      }


      alert(
        data.message ||
        "Registration successful!"
      );


      navigate("/login");

    } catch (error) {

      console.error(error);

      alert(
        error.message ||
        "Unable to register."
      );

    } finally {

      setBusy(false);

    }
  };


  return (
    <section className="auth-page">

      <div className="auth-box">

        <p className="auth-eyebrow">
          JOIN PENNY & CO.
        </p>

        <h2>
          Create an account.
        </h2>

        <p className="auth-description">
          Start keeping track of every penny.
        </p>


        <form onSubmit={handleSignup}>

          <div className="auth-input">

            <label>
              Full name
            </label>

            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />

          </div>


          <div className="auth-input">

            <label>
              Email address
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>


          <div className="auth-input">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              required
            />

          </div>


          <div className="auth-input">

            <label>
              Confirm password
            </label>

            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              required
            />

          </div>


          <button
            type="submit"
            disabled={busy}
          >
            {busy
              ? "REGISTERING..."
              : "CREATE ACCOUNT"}
          </button>

        </form>


        <div className="auth-switch">

          <span>
            Already have an account?
          </span>

          <Link to="/login">
            SIGN IN
          </Link>

        </div>

      </div>

    </section>
  );
}


/* =========================
   PREMIUM SUCCESS
========================= */

function PremiumSuccess() {

  return (
    <section
      className="about"
      style={{
        padding: "100px 8%"
      }}
    >

      <span>
        PENNY & CO. / PREMIUM
      </span>

      <h2>
        Payment
        <br />
        <em>successful.</em>
      </h2>

      <p>
        Welcome to Penny & Co. Premium.
      </p>

      <Link
        to="/home"
        className="hero-button"
      >
        BACK TO HOME
      </Link>

    </section>
  );
}


/* =========================
   MAIN APP
========================= */

function App() {

  const [user, setUser] = useState(() => {

    try {

      const saved =
        JSON.parse(
          localStorage.getItem(
            "pennyUser"
          )
        );

      return saved &&
        typeof saved === "object"
        ? saved
        : null;

    } catch {

      return null;

    }

  });


  const logout = () => {

    localStorage.removeItem(
      "pennyUser"
    );

    setUser(null);

  };


  return (
    <BrowserRouter>

      <Layout
        loggedIn={Boolean(user)}
        logout={logout}
      >

        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/home"
            element={<Home />}
          />

          <Route
            path="/tracker"
            element={
              <Tracker user={user} />
            }
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/login"
            element={
              <Login
                onLogin={setUser}
              />
            }
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/premium"
            element={<Premium />}
          />

          <Route
            path="/premium-success"
            element={
              <PremiumSuccess />
            }
          />

          <Route
            path="*"
            element={<Home />}
          />

        </Routes>

      </Layout>

    </BrowserRouter>
  );
}

export default App;