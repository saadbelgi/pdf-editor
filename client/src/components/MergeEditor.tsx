import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, ChangeEvent } from "react";
import Navbar from "./Navbar";
import { PDFDocument } from "pdf-lib";
import {
  Container,
  Button,
  CircularProgress,
  Box,
  Modal,
  TextField,
} from "@mui/material";
import { getDocument } from "pdfjs-dist";
import * as PDFJS from "pdfjs-dist";
import PDFCard from "./PDFCard";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
// @ts-ignore
import Pdfjsworker from "pdfjs-dist/build/pdf.worker.js"; // this is required for some reason
import { PDFFile } from "./PDFFile"; // my custom pdf file type definition

PDFJS.GlobalWorkerOptions.workerSrc = Pdfjsworker;
const API_BASE = import.meta.env.VITE_API_BASE;

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

async function generatePDFFileObject(file: File, id: number): Promise<PDFFile> {
  const ab = await file.arrayBuffer();

  // converting raw file to PDFDocument object of PDF-LIB.JS library
  const pdflibDocument = await PDFDocument.load(ab);

  // generating thumbnail url using PDFJS library
  const fp = await (await getDocument(ab).promise).getPage(1);
  const viewport = fp.getViewport({ scale: 1 });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  await fp.render({ canvasContext: context, viewport: viewport }).promise;
  const thumbnailUrl = canvas.toDataURL("image/jpeg");

  return {
    file: pdflibDocument,
    title: file.name,
    thumbnail: thumbnailUrl,
    id: id, // used for dnd
  };
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function DownloadSaveModal(props: {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  merge: (action: "download" | "save", name?: string) => Promise<void>;
}) {
  const [name, setName] = useState("");
  return (
    <Modal open={props.modalOpen} onClose={() => props.setModalOpen(false)}>
      <Box
        sx={{
          ...style,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1em",
        }}
      >
        <TextField
          label='Name of file'
          variant='outlined'
          sx={{ flexBasis: "100%", flexGrow: 1 }}
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <Button
          variant='contained'
          onClick={async () => {
            props.setModalOpen(false);
            await props.merge("download", name !== "" ? name : undefined);
          }}
        >
          DOWNLOAD
        </Button>
        <Button
          variant='contained'
          onClick={async () => {
            props.setModalOpen(false);
            await props.merge("save", name !== "" ? name : undefined);
          }}
        >
          SAVE
        </Button>
      </Box>
    </Modal>
  );
}

export default function Merge() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  useEffect(() => {
    if (
      location.state.files !== undefined &&
      Array.isArray(location.state.files) &&
      location.state.files.length > 0 &&
      location.state.files[0] instanceof File
    ) {
      (async () => {
        const files: File[] = [...location.state.files];
        const docs: PDFFile[] = [];
        for (let i = 0; i < files.length; i++) {
          const temp = await generatePDFFileObject(files[i], i + 1);
          // id = idx + 1 because the id given to the useSortable hook cannot be 0, and therefore the ids of the list should begin at 1.
          docs.push(temp);
        }
        setFiles([...docs]);
        setIsLoading(false);
      })();
    } else {
      navigate("/");
    }
  }, []);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over === null) return;
    if (active.id !== over.id) {
      setFiles(() => {
        const oldIndex = files.findIndex(
          (file) => file.id === Number(active.id)
        );
        const newIndex = files.findIndex((file) => file.id === Number(over.id));
        return arrayMove(files, oldIndex, newIndex);
      });
    }
  }

  async function addFile(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;
    setIsLoading(true);
    const origin = files.length;
    const newFiles = [...files];
    const inputFiles = Array.from(event.target.files);
    for (let i = 0; i < inputFiles.length; i++) {
      location.state.files.push(inputFiles[i]);
      const id = origin + i + 1;
      const temp = await generatePDFFileObject(inputFiles[i], id);
      newFiles.push(temp);
    }
    setFiles(newFiles);
    setIsLoading(false);
  }

  async function merge(action: "download" | "save", name?: string) {
    if (files.length === 0) {
      navigate("/merge");
    } else {
      const newDoc = await PDFDocument.create();
      // newDoc.removePage(0);
      for (let j = 0; j < files.length; j++) {
        const copiedPages = await newDoc.copyPages(
          files[j].file,
          files[j].file.getPageIndices()
        );
        for (let i = 0; i < copiedPages.length; i++) {
          newDoc.addPage(copiedPages[i]);
        }
      }
      const ab = await newDoc.save();
      if (action === "download") {
        downloadBlob(ab, !name ? "merged" : name, "application/pdf");
      } else if (action === "save") {
        const file = new File([ab], (!name ? "merged" : name) + ".pdf", {
          type: "application/pdf",
          lastModified: new Date().getTime(),
        });
        const formData = new FormData();
        formData.append("file", file);
        const res = await (
          await fetch(API_BASE + "savefile", {
            method: "POST",
            body: formData,
            credentials: "include",
            headers: { "Access-Control-Allow-Origin": API_BASE },
          })
        ).json();
        console.log(res);
      }
    }
  }

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
      <Container sx={{ display: "grid", placeItems: "center", flexGrow: 1 }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
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
            <SortableContext
              items={files.map((file) => file.id)}
              // strategy={verticalListSortingStrategy}
            >
              {files.map((file, idx) => {
                return (
                  <PDFCard
                    file={file}
                    idx={idx}
                    key={idx}
                    files={files}
                    setFiles={setFiles}
                  />
                );
              })}
            </SortableContext>
          </Container>
        </DndContext>

        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            marginBottom: "20px",
            gap: "3%",
          }}
        >
          <Button variant='contained' onClick={() => setModalOpen(true)}>
            MERGE
          </Button>

          <Button component='label'>
            <AddCircleIcon
              onClick={() => console.log("hello")}
              sx={{ fontSize: "3em" }}
            />
            <input
              type='file'
              hidden
              multiple
              accept='application/pdf'
              onChange={addFile}
            />
          </Button>
        </Container>
        <DownloadSaveModal
          modalOpen={modalOpen}
          merge={merge}
          setModalOpen={setModalOpen}
        />
      </Container>
    );
  }
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Navbar window={window} styles={{ flexGrow: 0 }} />
        {body}
      </Box>
    </>
  );
}
