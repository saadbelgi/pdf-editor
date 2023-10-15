import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ChangeEvent } from "react";
import Navbar from "./Navbar";

export default function MergeForm() {
  const navigate = useNavigate();

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;
    navigate("/split/edit", { state: { file: event.target.files[0] } });
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "100%",
          padding: "0px",
          minHeight: "100vh",
        }}
      >
        <Navbar window={window} styles={{ position: "fixed" }} />
        <Container
          maxWidth='md'
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            placeItems: "center",
            gap: "1.25em",
            flexGrow: "1",
          }}
        >
          <Typography variant='h3' align='center'>
            Split PDF file
          </Typography>
          <Typography variant='h5' align='center'>
            Separate one page or a whole set for easy conversion into
            independent PDF files.
          </Typography>
          <Button
            variant='contained'
            component='label'
            sx={{
              width: "30%",
              height: "5em",
              minWidth: "170px",
              minHeight: "65px",
              borderRadius: "10px",
            }}
          >
            <Typography variant='h5' align='center'>
              Select file
            </Typography>
            <input
              type='file'
              hidden
              accept='application/pdf'
              onChange={onFileChange}
            />
          </Button>
        </Container>
      </div>
    </>
  );
}
