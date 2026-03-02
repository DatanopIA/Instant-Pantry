import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PantryDashboard from './pages/PantryDashboard';
import InventoryList from './pages/InventoryList';
import FridgeScanner from './pages/FridgeScanner';
import RecipesPage from './pages/RecipesPage';
import ProfileAnalytics from './pages/ProfileAnalytics';
import PrivacyPolicy from './pages/PrivacyPolicy';
import PremiumSubscription from './pages/PremiumSubscription';
import AccountSettings from './pages/AccountSettings';
import LandingPage from './pages/LandingPage';
import Layout from './components/Layout';

import { useEffect, useState } from 'react';
import { supabase } from './utils/supabase';

function App() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show a blank/loading state while session is being checked
  if (session === undefined) return null;

  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/landing" element={<LandingPage />} />

        {/* Control Principal */}
        <Route path="/*" element={
          session ? (
            <Layout>
              <Routes>
                <Route path="/" element={<PantryDashboard />} />
                <Route path="/inventory" element={<InventoryList />} />
                <Route path="/recipes" element={<RecipesPage />} />
                <Route path="/scanner" element={<FridgeScanner />} />
                <Route path="/profile" element={<ProfileAnalytics />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/premium" element={<PremiumSubscription />} />
                <Route path="/settings/account" element={<AccountSettings />} />
              </Routes>
            </Layout>
          ) : (
            <Routes>
              {/* Si no hay sesión, cualquier ruta principal lleva a la Landing Page temporalmente */}
              <Route path="/*" element={<LandingPage />} />
            </Routes>
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;
