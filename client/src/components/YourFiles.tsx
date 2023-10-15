import {
  Box,
  Checkbox,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  TextField,
  Modal,
  CircularProgress,
  Alert,
  TableContainer,
  TableHead,
  Table,
  TableCell,
  TableRow,
  Paper,
  TableBody,
} from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import DriveFileRenameOutlineRoundedIcon from "@mui/icons-material/DriveFileRenameOutlineRounded";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { constructFileFromLocalFileData } from "get-file-object-from-local-path";

const API_BASE = import.meta.env.VITE_API_BASE;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  backgroundColor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function RenameModal(props: {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
  fileId: number;
  files: SavedFile[];
  setFiles: React.Dispatch<React.SetStateAction<SavedFile[]>>;
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
          label='New name'
          variant='outlined'
          sx={{ flexBasis: "100%", flexGrow: 1 }}
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <Button variant='contained' onClick={() => props.setModalOpen(false)}>
          CANCEL
        </Button>
        <Button
          variant='contained'
          onClick={async () => {
            const res = await (
              await fetch(API_BASE + "renamefile", {
                method: "POST",
                body: JSON.stringify({ fileId: props.fileId, newName: name }),
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
              })
            ).json();
            console.log(res);
            props.setFiles(
              props.files.map((file) =>
                file.id === props.fileId
                  ? { ...file, originalName: name }
                  : file
              )
            );
            props.setModalOpen(false);
          }}
        >
          RENAME
        </Button>
      </Box>
    </Modal>
  );
}

function DeleteModal(props: {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
  deleteTargets: number[];
  files: SavedFile[];
  setFiles: React.Dispatch<React.SetStateAction<SavedFile[]>>;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const set = new Set(props.deleteTargets);
  const newFiles = props.files.filter((file) => set.has(file.id));
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
        <Typography variant='h6' sx={{ width: "100%", textAlign: "center" }}>
          Delete following files?
        </Typography>
        <TableContainer component={Paper}>
          <Table aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>File Name</TableCell>
                <TableCell align='right'>Creation date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {newFiles.map((file) => (
                <TableRow
                  key={file.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component='th' scope='row'>
                    {file.originalName}
                  </TableCell>
                  <TableCell align='right'>
                    {new Date(file.creationTime).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button variant='contained' onClick={() => props.setModalOpen(false)}>
          CANCEL
        </Button>
        <Button
          variant='contained'
          onClick={async () => {
            // Promise.all(
            //   newFiles.map((file) => {
            // fetch(API_BASE + "deletefile", {
            //   credentials: "include",
            //   body: JSON.stringify({ fileId: file.id }),
            //     });
            //   })
            // )
            for (let i = 0; i < newFiles.length; i++) {
              const res = await (
                await fetch(API_BASE + "deletefile", {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ fileId: newFiles[i].id }),
                })
              ).json();
              console.log(res);
            }
            props.setRefetch((val) => !val);
            props.setModalOpen(false);
            // props.setFiles([...actualFiles]);
          }}
        >
          DELETE
        </Button>
      </Box>
    </Modal>
  );
}

type SavedFile = {
  id: number;
  originalName: string;
  creationTime: Date;
};

export default function YourFiles() {
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState([0]);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [files, setFiles] = useState<SavedFile[]>([]);
  const navigate = useNavigate();
  const [deleteTargets, setDeleteTargets] = useState<number[]>([]);
  const [renameTarget, setRenameTarget] = useState(0);
  const [refetch, setRefetch] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await (
        await fetch(API_BASE + "yourfiles", {
          credentials: "include",
        })
      ).json();
      if (res.success) {
        console.log(res);
        res.files.sort(
          (a: SavedFile, b: SavedFile) => a.creationTime > b.creationTime
        );
        setFiles([...res.files]);
      } else {
        navigate("/");
      }
      setLoading(false);
    })();
  }, [refetch]);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress color='secondary' />
      </Box>
    );
  }
  let list;
  if (files.length === 0) {
    list = (
      <>
        <Container
          sx={{
            width: { xs: "90%", md: "75%" },
            // maxWidth: "",
            // backgroundColor: "whitesmoke",
            margin: "auto",
            marginTop: "2em",
            paddingBottom: "1em",
          }}
        >
          <Alert severity='error' sx={{ width: "100%" }}>
            <Typography variant='h6'>
              No files saved yet! Save files in your account to see them here
            </Typography>
          </Alert>
        </Container>
      </>
    );
  } else {
    list = (
      <>
        <Container
          sx={{
            width: { xs: "90%", md: "75%" },
            // maxWidth: "",
            backgroundColor: "whitesmoke",
            margin: "auto",
            marginTop: "2em",
            paddingBottom: "1.5em",
          }}
        >
          <List>
            {files.map((file, idx) => {
              const labelId = `checkbox-list-label-${idx}`;
              return (
                <ListItem
                  key={file.id}
                  secondaryAction={
                    <>
                      <div
                        style={{
                          display: "flex",
                          gap: "1em",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant='body2'>
                          {new Date(file.creationTime).toLocaleString()}
                        </Typography>
                        <Tooltip title='Rename' placement='top'>
                          <IconButton
                            edge='end'
                            onClick={() => {
                              setRenameTarget(file.id);
                              setRenameModalOpen(true);
                            }}
                          >
                            <DriveFileRenameOutlineRoundedIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Donwload' placement='top'>
                          <IconButton
                            edge='end'
                            onClick={async () => {
                              const res = await (
                                await fetch(API_BASE + "downloadfile", {
                                  method: "POST",
                                  body: JSON.stringify({ fileId: file.id }),
                                  credentials: "include",
                                })
                              ).json();
                              if (res.success) {
                                console.log(res.file);
                                // const f: File = constructFileFromLocalFileData(
                                //   res.file
                                // );
                                const f = new File(
                                  res.file.arrayBuffer,
                                  file.originalName + ".pdf",
                                  { type: "application/pdf" }
                                );
                                const url = window.URL.createObjectURL(f);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = file.originalName + ".pdf";
                                document.body.appendChild(a);
                                a.style.display = "none";
                                a.click();
                                a.remove();
                                setTimeout(
                                  () => window.URL.revokeObjectURL(url),
                                  1000
                                );
                              } else {
                                console.log(res);
                              }
                            }}
                          >
                            <DownloadRoundedIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Delete' placement='top'>
                          <IconButton
                            edge='end'
                            onClick={() => {
                              setDeleteTargets([file.id]);
                              setDeleteModalOpen(true);
                            }}
                          >
                            <DeleteRoundedIcon />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </>
                  }
                  disablePadding
                >
                  <ListItemButton
                    role={undefined}
                    onClick={handleToggle(idx)}
                    dense
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge='start'
                        checked={checked.indexOf(idx) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={file.originalName} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "1em",
            }}
          >
            <Button
              variant='contained'
              onClick={() => {
                setDeleteTargets([...checked]);
                setDeleteModalOpen(true);
              }}
            >
              DELETE
            </Button>
            <Button variant='contained'>MERGE</Button>
          </Box>
        </Container>
      </>
    );
  }
  return (
    <Box
      sx={{
        // display: "flex",
        // flexDirection: "column",
        // alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Navbar window={window} />
      <Container sx={{ minHeight: "80vh", width: "100vw" }}>{list}</Container>
      <RenameModal
        modalOpen={renameModalOpen}
        setModalOpen={setRenameModalOpen}
        handleClick={(e) => e.target}
        files={files}
        setFiles={setFiles}
        fileId={renameTarget}
      />
      <DeleteModal
        modalOpen={deleteModalOpen}
        setModalOpen={setDeleteModalOpen}
        handleClick={(e) => e.target}
        deleteTargets={deleteTargets}
        files={files}
        setFiles={setFiles}
        setRefetch={setRefetch}
      />
    </Box>
  );
}
