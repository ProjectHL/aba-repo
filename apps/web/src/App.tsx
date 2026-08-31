import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { AuthProvider } from "@/auth/auth-provider"
import { LoginPage } from "@/auth/login-page"
import { RegistrationPage } from "@/auth/registration-page"
import { PasswordRecoveryPage } from "@/auth/password-recovery-page"
import { ResetPasswordPage } from "@/auth/reset-password-page"
import { ProtectedRoute, PublicOnlyRoute } from "@/auth/route-guards"
import { AppShell } from "@/components/app-shell"
import { EnvironmentBanner } from "@/components/environment-banner"
import { NotFoundPage } from "@/components/not-found-page"
import { ClientsPage } from "@/features/clients/clients-page"
import { ClientDetailPage } from "@/features/clients/client-detail-page"
import { NewClientPage } from "@/features/clients/new-client-page"
import { ReportsPage } from "@/features/reports/reports-page"
import { AssessmentRepositoryProvider } from "@/features/clinical/assessment-repository-context"
import { supabaseAssessmentRepository } from "@/features/clinical/supabase-assessment-repository"
import { ClinicalPlansRepositoryProvider } from "@/features/clinical/clinical-plans-repository-context"
import { supabaseClinicalPlansRepository } from "@/features/clinical/supabase-clinical-plans-repository"
import { ClinicalSessionRepositoryProvider } from "@/features/clinical/clinical-session-repository-context"
import { supabaseClinicalSessionRepository } from "@/features/clinical/supabase-clinical-session-repository"
import { ClinicalReportRepositoryProvider } from "@/features/reports/clinical-report-repository-context"
import { supabaseClinicalReportRepository } from "@/features/reports/supabase-clinical-report-repository"
import { ClientsRepositoryProvider } from "@/features/clients/clients-repository"
import { supabaseClientsRepository } from "@/features/clients/supabase-clients-repository"
import { supabaseAuthService } from "@/lib/supabase/auth-service"
import { FrontendDraftProvider } from "@/features/clinical/forms/frontend-draft-context"
import { StudentRecordRepositoryProvider } from "@/features/clinical/student-record/student-record-repository-context"
import { supabaseStudentRecordRepository } from "@/features/clinical/student-record/supabase-student-record-repository"

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistrationPage />} />
        <Route path="/recuperar-acceso" element={<PasswordRecoveryPage />} />
      </Route>
      <Route path="/recuperar-contrasena" element={<ResetPasswordPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route index element={<Navigate replace to="/clientes" />} />
          <Route path="/clientes" element={<ClientsPage />} />
          <Route path="/clientes/nuevo" element={<NewClientPage />} />
          <Route path="/clientes/:id" element={<ClientDetailPage />} />
          <Route path="/informes" element={<ReportsPage />} />
          <Route
            path="/informes/evaluacion"
            element={<ReportsPage mode="evaluation" />}
          />
          <Route
            path="/informes/completo"
            element={<ReportsPage mode="complete" />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider service={supabaseAuthService}>
        <StudentRecordRepositoryProvider repository={supabaseStudentRecordRepository}>
          <FrontendDraftProvider>
          <ClientsRepositoryProvider repository={supabaseClientsRepository}>
          <AssessmentRepositoryProvider
            repository={supabaseAssessmentRepository}
          >
            <ClinicalPlansRepositoryProvider
              repository={supabaseClinicalPlansRepository}
            >
              <ClinicalSessionRepositoryProvider
                repository={supabaseClinicalSessionRepository}
              >
                <ClinicalReportRepositoryProvider
                  repository={supabaseClinicalReportRepository}
                >
                  <EnvironmentBanner />
                  <AppRoutes />
                </ClinicalReportRepositoryProvider>
              </ClinicalSessionRepositoryProvider>
            </ClinicalPlansRepositoryProvider>
          </AssessmentRepositoryProvider>
          </ClientsRepositoryProvider>
          </FrontendDraftProvider>
        </StudentRecordRepositoryProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
