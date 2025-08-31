
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../components/auth/Login";
import Logout from "../components/auth/Logout";
import Register from "../components/auth/Register";
import RCFooter from "../components/base/RCFooter";
import NotFound from "../components/NotFound";
import ForgotPassword from "../components/auth/ForgotPassword";
import CreatePassword from "../components/auth/CreatePassword";
import MainWrapper from '../src/layouts/MainWrapper'; 
import RCHeader from "../components/base/RCHeader";
import QuoteViewer from "../components/QuoteViewer";
import Coverage from "../components/Coverage";
import QuoteResult from "../components/QuoteResult";
import UserInfoForm from "../components/UserInfoForm";
import QuoteCalculator from "../components/QuoteCalculator";
import HomePage from "../components/HomePage";
import SearchQuote from "../components/SearchQuote";
import AboutService from "../components/About";


const App = () => {

  return (
    <BrowserRouter>
 {/* // Wrap everything in the 'MainWrapper' component. */}
      
      <RCHeader/>
      <MainWrapper>
      <Routes>

        {/* Auth Routes */}

        <Route path="/login" element={<Login />}></Route>
        <Route path="/logout" element={<Logout />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/create-new-password" element={<CreatePassword />}></Route>
        <Route path="/register" element={<Register />}></Route>
        {/* Renderiza InvoiceCalculator solo en la ruta raíz */}

        <Route path="/quote-calculator" element={<QuoteCalculator />} />

        {/*   Home Route */}
        <Route path="/" element={<HomePage />}> </Route>

        {/* Start info form before the calculator */}
        <Route path="/user-info-form" element={<UserInfoForm />}> </Route>
        {/* Unique ID quote Rute with user info  */}
        <Route path="/quote-calculator/:quoteId" element={<QuoteCalculator />} />
        <Route path='*' element={<NotFound />} />

      {/* Quote Searcher by QuoteID*/}

       


        {/* <Route path="/results" element={<QuoteResult/>}> </Route> */}
        <Route path="/results/:quoteId" element={<QuoteResult />} />
        
        {/* Header Pages */}
        <Route path="/savedqtes" element={<QuoteViewer />}> </Route>
        <Route path="/coverage" element={<Coverage />}> </Route>
        <Route path="/quote-searcher" element={<SearchQuote />} />
        <Route path="/about-service" element={<AboutService />} />


        </Routes>
        </MainWrapper>
      <RCFooter/>
      </BrowserRouter>
    

  );
};

export default App;
