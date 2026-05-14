import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/footer/Footer";
import ScrollToTop from "./utils/ScrollToTop";
import AuthForm from "./components/Auth/AuthForm";
import SignUpPage from "./components/SignUp/SignUpPage";
import AccountPage from "./components/Account/AccountPage";
import AuthContext from "./contexts/AuthContext";
import { useEffect, useState } from "react";
import User from "./types/index";
import NavBar from "./components/navbar/NavBar";
import About from "./components/About/About";
import WishListPage from "./components/WishListPage/WishListPage";
import EditGift from "./components/EditGift/EditGift";
import { PrivacyPolicy } from "./pages/PrivacyPolicy/PrivacyPolicy";
import CreateWishlist from "./pages/CreateWishlist/CreateWishlist";
import CreateGift from "./pages/CreateGift/CreateGift";
import Home from "./pages/Home/Home";
import { getDemoUser } from "./demo/demoStorage";
import SharePage from "./components/SharePage/SharePage";
import NoPageFound from "./components/NoPageFound/NoPageFound";


const App: React.FC = () => {
  const [user, setUser] = useState<User | undefined>(undefined);
  useEffect(() => {
  const demoUser = getDemoUser();
  setUser(demoUser);
}, []);
  return (
    <div className="App">
      <AuthContext.Provider value={{ user, setUser }}>
        <Router>
          <ScrollToTop />
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<AuthForm />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/createWishlist" element={<CreateWishlist />} />           
            <Route path="/wishlist/:id/createGift" element={<CreateGift />} />
            <Route path="/gift/:id/editGift" element={<EditGift />} />
            <Route path="/dashboard" element={<AccountPage />} />
            <Route path="/wishlist/:id" element={<WishListPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/mywishlist/:uuid" element={<SharePage />} />
            <Route path="*" element={<NoPageFound />} />
            
          </Routes>
          <Footer />
        </Router>
      </AuthContext.Provider>
    </div>
  );
};

export default App;