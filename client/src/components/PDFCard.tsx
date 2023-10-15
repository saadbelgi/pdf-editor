import { Box, Button, Card, Typography } from "@mui/material";
// import { useDroppable, useDraggable, DndContext } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Delete } from "@mui/icons-material";
import { PDFFile } from "./PDFFile";

// this is required for some reason
// @ts-ignore

// read this for DnD: https://blog.logrocket.com/drag-and-drop-react-dnd/#react-beautiful-dnd

type PDFCardProps = {
  file: PDFFile;
  idx: number;
  files: PDFFile[];
  setFiles: React.Dispatch<React.SetStateAction<PDFFile[]>>;
};

export default function PDFCard(props: PDFCardProps) {
  const { file, idx, files, setFiles } = props;

  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: file.id,
  });

  function deleteFile() {
    console.log();
    const newFiles = [...files];
    newFiles.splice(idx, 1);
    setFiles(newFiles);
  }

  // drag and drop

  return (
    <Card
      ref={setNodeRef}
      sx={{
        width: "200px",
        padding: "1px",
        display: "grid",
        placeItems: "center",
        backgroundColor: "#eeeeee",
        transform: CSS.Transform.toString(transform),
        // transition,
        zIndex: 1000,
      }}
      {...attributes}
      {...listeners}
    >
      <Button
        onClick={() => {
          console.log("hello");
          deleteFile();
        }}
        sx={{
          position: "relative",
          top: "0px",
          left: "85px",
          margin: 0,
          padding: 0,
          borderRadius: "60%%",
        }}
      >
        <Delete />
      </Button>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "-20px",
          padding: 0,
        }}
      >
        <Typography
          variant='body2'
          align='center'
          sx={{
            fontSize: "0.8em",
            marginTop: "5px",
          }}
        >
          {file.title.slice(0, -4)}
        </Typography>
        <img
          src={file.thumbnail}
          alt={file.title}
          style={{
            objectFit: "contain",
            height: "220px",
            zIndex: "100",
            // marginInline: "20px",
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
