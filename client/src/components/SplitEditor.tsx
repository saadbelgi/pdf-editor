import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDocument } from "pdfjs-dist";
import * as PDFJS from "pdfjs-dist";
import {
  Box,
  CircularProgress,
  Container,
  Button,
  Card,
  Typography,
} from "@mui/material";
import Navbar from "./Navbar";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

// this is required for some reason
// @ts-ignore
import Pdfjsworker from "pdfjs-dist/build/pdf.worker.js";
import { PDFDocument } from "pdf-lib";
PDFJS.GlobalWorkerOptions.workerSrc = Pdfjsworker;

async function generateImages(file: File): Promise<string[]> {
  const ab = await file.arrayBuffer();

  // converting raw file to PDFDocument object of PDF-LIB.JS library
  const doc = await getDocument(ab).promise;
  const urls = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const fp = await doc.getPage(i);
    const viewport = fp.getViewport({ scale: 1 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await fp.render({ canvasContext: context, viewport: viewport }).promise;
    urls.push(canvas.toDataURL("image/jpeg"));
  }
  return urls;
}

type PageCardProps = {
  url: string;
  idx: number;
  selectedPages: Set<number>;
  setSelectedPages: React.Dispatch<React.SetStateAction<Set<number>>>;
};

function PageCard({
  url,
  idx,
  selectedPages,
  setSelectedPages,
}: PageCardProps) {
  function handleClick() {
    const cloned = new Set(selectedPages);
    if (selectedPages.has(idx + 1)) {
      cloned.delete(idx + 1);
    } else {
      cloned.add(idx + 1);
    }
    console.log(idx);
    console.log(cloned);
    setSelectedPages(cloned);
  }

  return (
    <Card
      sx={{
        width: "175px",
        padding: "1px",
        display: "grid",
        placeItems: "center",
        backgroundColor: selectedPages.has(idx + 1) ? "#b1f3b1" : "#eeeeee",
      }}
    >
      <Box
        component='button'
        onClick={handleClick}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={url}
          style={{
            objectFit: "contain",
            height: "220px",
            zIndex: "100",
          }}
        />
        <Box
          sx={{
            backgroundColor: "#ff8a65",
            width: "15%",
            aspectRatio: "1",
            borderRadius: "50%",
            marginBottom: "5px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography align='center' sx={{ fontSize: "0.8em" }}>
            {idx + 1}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}

const downloadBlob = (data: Uint8Array, fileName: string, mimeType: string) => {
  const blob = new Blob([data], {
    type: mimeType,
  });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.style.display = "none";
  a.click();
  a.remove();

  setTimeout(() => window.URL.revokeObjectURL(url), 1000);
};

export default function SplitEditor() {
  const navigate = useNavigate();
  const location = useLocation();
  const [file, setFile] = useState<File>();
  const [urls, setUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState("1");
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [pdfDocument, setPdfDocument] = useState<PDFDocument>();

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  async function extractPages() {
    for (const idx of selectedPages) {
      const newDoc = await PDFDocument.create();
      if (!pdfDocument) return;
      const copiedPages = await newDoc.copyPages(pdfDocument, [idx]);
      newDoc.addPage(copiedPages[0]);
      const ab = await newDoc.save();
      downloadBlob(ab, file?.name.slice(0, -4) + `_${idx + 1}`+'.pdf', "application/pdf");
    }
  }

  if (!file) {
    if (!location.state.file) {
      navigate("/");
    } else {
      setFile(location.state.file);
      console.log(file);
    }
  }
  useEffect(() => {
    (async () => {
      setUrls(await generateImages(file as File));
      console.log("hello");
      setPdfDocument(
        await PDFDocument.load((await file?.arrayBuffer()) as ArrayBuffer)
      );
      setIsLoading(false);
    })();
  }, []);

  let body;
  if (isLoading) {
    body = (
      <Box
        sx={{
          width: "100%",
          flexGrow: 1,
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress color='secondary' />
      </Box>
    );
  } else {
    body = (
      <>
        <Container
          sx={{
            flex: 1,
            flexBasis: '',
            backgroundColor: 'yellow',
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "row",
            border: "1px solid red",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Container
            sx={{
              flexGrow: 1,
              flexBasis: "0",
              border: "1px solid red",
              alignSelf: "stretch",
              padding: 0,
              margin: 0,
            }}
          >
            <Container
              sx={{
                marginTop: "30px",
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              {urls.map((url, idx) => {
                return (
                  <PageCard
                    url={url}
                    idx={idx}
                    setSelectedPages={setSelectedPages}
                    selectedPages={selectedPages}
                  />
                );
              })}
            </Container>
          </Container>
          <Container
            sx={{
              flexGrow: 0,
              flexBasis: "35vw",
              // border: "1px solid red",
              alignSelf: "stretch",
              padding: 0,
              margin: 0,
              backgroundColor: 'whitesmoke'
            }}
          >
            <Box
              sx={{
                width: "100%",
                typography: "body1",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TabContext value={tab}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={handleChange}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Tab
                      label='Split by range'
                      value='1'
                      sx={{ flexGrow: 1 }}
                    />
                    <Tab label='Extract pages' value='2' sx={{ flexGrow: 1 }} />
                  </TabList>
                </Box>
                <TabPanel value='1'></TabPanel>
                <TabPanel value='2'></TabPanel>
              </TabContext>
              <Button
                variant='contained'
                sx={{ width: "75%" }}
                onClick={extractPages}
              >
                SPLIT
              </Button>
            </Box>
          </Container>
        </Container>
      </>
    );
  }
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "stretch",
          minHeight: "100vh",
          backgroundColor: 'green',
          padding: 0
        }}
      >
        <Navbar window={window} styles={{ flexGrow: 0 }} />
        {body}
      </Box>
    </>
  );
}
