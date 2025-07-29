import {
  Table, TableRow, TableCell, TableHead, TableBody, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  CircularProgress
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useState, useEffect } from "react";
import axios from "axios";

interface CrudTableProps {
  model: string;
  fields: string[];
}

interface RecordData {
  _id?: string;
  [key: string]: any;
}

const CrudTable = ({ model, fields }: CrudTableProps) => {
  const [rows, setRows] = useState<RecordData[]>([]);
  const [editing, setEditing] = useState<RecordData | null>(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<RecordData>({});
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/admin/${model}`);
      setRows(res.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [model]);

  const handleSubmit = async () => {
    try {
      if (editing && editing._id) {
        await axios.put(`/api/admin/${model}/${editing._id}`, formData);
      } else {
        await axios.post(`/api/admin/${model}`, formData);
      }
      setOpen(false);
      setFormData({});
      setEditing(null);
      fetchData();
    } catch (error) {
      console.error("Failed to submit data:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`/api/admin/${model}/${id}`);
      fetchData();
    } catch (error) {
      console.error("Failed to delete data:", error);
    }
  };

  const openDialog = (row?: RecordData) => {
    if (row) {
      setFormData({ ...row });
      setEditing(row);
    } else {
      setFormData({});
      setEditing(null);
    }
    setOpen(true);
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => openDialog()}>
        Create New {model}
      </Button>

      {loading ? (
        <CircularProgress sx={{ mt: 2 }} />
      ) : (
        <Table sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              {fields.map((field) => (
                <TableCell key={field}>{field}</TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row._id}>
                {fields.map((field) => (
                  <TableCell key={field}>{row[field]}</TableCell>
                ))}
                <TableCell>
                  <IconButton color="primary" onClick={() => openDialog(row)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(row._id?? "")}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{editing ? "Edit" : "Create"} {model}</DialogTitle>
        <DialogContent>
          {fields.map((field) => (
            <TextField
              key={field}
              label={field}
              fullWidth
              margin="dense"
              value={formData[field] || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, [field]: e.target.value }))
              }
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CrudTable;
