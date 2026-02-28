import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PantryDashboard from './pages/PantryDashboard';
import InventoryList from './pages/InventoryList';
import FridgeScanner from './pages/FridgeScanner';
import RecipesPage from './pages/RecipesPage';
import ProfileAnalytics from './pages/ProfileAnalytics';
import PrivacyPolicy from './pages/PrivacyPolicy';
import PremiumSubscription from './pages/PremiumSubscription';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<PantryDashboard />} />
          <Route path="/inventory" element={<InventoryList />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/scanner" element={<FridgeScanner />} />
          <Route path="/profile" element={<ProfileAnalytics />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/premium" element={<PremiumSubscription />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
