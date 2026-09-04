import { Routes, Route } from "react-router-dom";

import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Dashboard from "./components/dashboard/Dashboard";
import Payments from "./components/payments/Payments";
import RecentPayments from "./components/dashboard/RecentPayments";
import Customers from "./components/customers/Customers";
import Recovery from "./components/recovery/Recovery";
import Analytics from "./components/analytics/Analytics";
import AIRecovery from "./components/ai-recovery/AIRecovery";

import HowItWorks from "./components/guide/HowItWorks";

import SignIn from "./components/auth/SignIn";
import Signup from "./components/auth/Signup";
import OAuth2Callback from "./components/auth/OAuth2Callback";

function App() {
  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}

      <Route
        path="/signin"
        element={<SignIn />}
      />

      <Route
        path="/login"
        element={<SignIn />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
        path="/oauth2/callback"
        element={<OAuth2Callback />}
      />

      <Route
        path="/how-it-works"
        element={<HowItWorks />}
      />


      {/* ================= PROTECTED ROUTES ================= */}

      <Route element={<ProtectedRoute />}>

        <Route
          path="/"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />

        <Route
          path="/payments"
          element={
            <DashboardLayout>
              <Payments />
            </DashboardLayout>
          }
        />

        <Route
          path="/payments/recent"
          element={
            <DashboardLayout>
              <RecentPayments />
            </DashboardLayout>
          }
        />

        <Route
          path="/customers"
          element={
            <DashboardLayout>
              <Customers />
            </DashboardLayout>
          }
        />

        <Route
          path="/recovery"
          element={
            <DashboardLayout>
              <Recovery />
            </DashboardLayout>
          }
        />

        <Route
          path="/analytics"
          element={
            <DashboardLayout>
              <Analytics />
            </DashboardLayout>
          }
        />

        <Route
          path="/ai-recovery"
          element={
            <DashboardLayout>
              <AIRecovery />
            </DashboardLayout>
          }
        />

      </Route>

    </Routes>
  );
}

export default App;