import {
  InputAdornment,
  IconButton,
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link as Mlink,
  Grid,
  Box,
  Typography,
  Container,
  Alert,
  AlertTitle,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LockOutlined as LockOutlinedIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useState, MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const API_BASE = import.meta.env.VITE_API_BASE;

type ErrorProps = {
  message: string;
};

type SignupFormData = {
  email: string;
  password: string;
};

function Error({ message }: ErrorProps) {
  return (
    <Alert severity='error'>
      <AlertTitle>Error</AlertTitle>
      {message}
    </Alert>
  );
}

export default function SignupForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data: SignupFormData) => {
    const response = await fetch(API_BASE + "signup", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();
    if (res.success) {
      Cookies.set("token", res.token, { path: "/" });
      // localStorage.setItem("user", res.token);
      navigate("/");
    } else {
      setErrorMessage(res.message);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
  };

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign Up
        </Typography>
        <Box
          component='form'
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          <Controller
            name='email'
            control={control}
            rules={{
              required: { value: true, message: "Required" },
              pattern: {
                value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                message: "Invalid email",
              },
              maxLength: { value: 254, message: "Invalid email" },
            }}
            render={({ field }) => (
              <TextField
                margin='normal'
                required
                fullWidth
                id='email'
                label='Email Address'
                // name='email'
                autoComplete='email'
                autoFocus
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                {...field}
              />
            )}
          />
          <Controller
            name='password'
            control={control}
            rules={{
              required: { value: true, message: "Required" },
              minLength: {
                value: 8,
                message: "Password must be atleast 8 characters long",
              },
              maxLength: {
                value: 30,
                message: "Password must be atmost 30 characters long",
              },
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@~`!@#$%^&*()-=_+[\]\\{}|;':",./<>?])[A-Za-z\d@~`!@#$%^&*()-=_+[\]\\{}|;':",./<>?]+$/,
                message:
                  "Password must contain atleast one uppercase character, one lowercase character, one digit and one special character",
              },
            }}
            render={({ field }) => (
              <TextField
                margin='normal'
                required
                fullWidth
                // name='password'
                label='Password'
                type={showPassword ? "text" : "password"}
                id='password'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge='end'
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                autoComplete='current-password'
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                {...field}
              />
            )}
          />
          {errorMessage && <Error message={errorMessage} />}
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>

          <Grid container sx={{ placeContent: "center" }}>
            <Grid item>
              <Mlink variant='body2' component='span'>
                <Link to='/login'>{"Have an account already? Login"}</Link>
              </Mlink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
