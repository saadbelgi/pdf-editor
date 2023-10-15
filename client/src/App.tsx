import { CssBaseline, createTheme } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import { ThemeProvider } from "@emotion/react";
import { Outlet, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import MergeForm from "./components/MergeForm";
import MergeEditor from "./components/MergeEditor";
import SplitForm from "./components/SplitForm";
import SplitEditor from "./components/SplitEditor";
import YourFiles from './components/YourFIles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#c62828",
    },
    secondary: deepOrange,
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path='/' element={<Outlet />}>
          <Route
            index
            element={<Navbar window={window} />}
          />
          <Route path='login' element={<LoginForm />} />
          <Route path='signup' element={<SignupForm />} />
          <Route path='merge' element={<Outlet />}>
            <Route index element={<MergeForm />} />
            <Route path='edit' element={<MergeEditor />} />
          </Route>
          <Route path='split' element={<Outlet />}>
            <Route index element={<SplitForm />} />
            <Route path='edit' element={<SplitEditor />} />
          </Route>
          <Route path='yourfiles' element={<Outlet />}>
            <Route index element={<YourFiles />} />
          </Route>
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
