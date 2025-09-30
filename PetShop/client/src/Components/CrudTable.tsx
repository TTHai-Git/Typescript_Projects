import {
  Table, TableRow, TableCell, TableHead, TableBody, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  CircularProgress,  Select, MenuItem, InputLabel, FormControl,
  Stack,
  Typography,
  TableContainer,
  Paper,
} from "@mui/material";
import { Edit, Delete, ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { useState, useEffect } from "react";
import axios from "axios";

import { adminEndpoints, authApi, endpoints } from "../Config/APIs";
import { useSearchParams } from "react-router-dom";
import { set } from "date-fns";
import formatDate from "../Convert/formatDate ";
import { useNotification } from "../Context/Notification";
import { useTranslation } from "react-i18next";



interface CrudTableProps {
  model: string;
  fields: string[];
  createFields?: string[];
  updateFields?: string[];
  readOnlyFields?: string[];
  searchableFields?: string[];
  sortableFields?: string[];
  productType?: string// Add as needed
}

interface RecordData {
  _id?: string;
  [key: string]: any;
}






const CrudTable = ({ model, fields, createFields, updateFields, searchableFields = [], sortableFields = [], }: CrudTableProps) => {
  const {t} = useTranslation()

  const nestedFieldConfig: {
  [model: string]: {
    [field: string]: string; // field = "category", value = "name" (nested key)
  };
} = {
  products: {
    category: "_id",
    brand: "_id",
    vendor: "_id",
    breed: "_id",
  },
  comments: {
    user: "_id",
    product: "_id",
  },
  commentDetails: {
    comment: "_id",
  },
  favorites: {
    user: "_id",
    product: "_id"
  },
  orders: {
    user: "_id",
    product: "_id"
  },
  orderDetails: {
    order: "_id",
    product: "_id",
  },
  payments: {
    order: "_id",
  },
  shipments: {
    order: "_id",
  },
  users: {
    role: "_id",
  }
  // add more models as needed
};

const productTypes = [t("food"), t("clothes"), t("dog"), t("accessory")];

const childModelFields: Record<string, string[]> = {
  food: [t("ingredients"), t("expirationDate"), t("recommendedFor")],
  clothes: [t("size"), t("material"), t("color"), t("season")],
  accessory: [t("dimensions"), t("material"), t("usage")],
  dog: [t("size"), t("age"), t("color"), t("weight"), t("height"), t("breed")],
};


  const [rows, setRows] = useState<RecordData[]>([]);
  const [editing, setEditing] = useState<RecordData | null>(null);
  const isEditing = Boolean(editing);
  const baseFields = isEditing
  ? updateFields ?? fields
  : createFields ?? fields;
  const [formData, setFormData] = useState<RecordData>({});
  const productType = formData.type || ""; // use "type" from formData
  const childFields = childModelFields[productType] || [];
  const formFields = [...baseFields, ...childFields];
  const [open, setOpen] = useState(false);  
  const [loading, setLoading] = useState(false);
  const [foreignOptions, setForeignOptions] = useState<{
  [field: string]: { _id: string; name?: string; [key: string]: any }[];}>({});
  const [pages, setPages] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<string>("contains"); // default type
  const [searchField, setSearchField] = useState<string>("name"); // default search field
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { showNotification } = useNotification()


  const fetchData = async () => {
  try {
    setLoading(true);
    const query = new URLSearchParams();

    query.append("page", currentPage.toString());
    query.append("perPage", "5"); // or make it dynamic
    if (searchTerm) query.append("search", searchTerm);
    if (searchType) query.append("searchType", searchType);
    if (searchField) query.append("searchField", searchField);
    if (sortBy) query.append("sortField", sortBy);
    if (sortOrder) query.append("sortOrder", sortOrder);

    if (Object.keys(filters).length > 0) {
      query.append("filters", JSON.stringify(filters));
    }

    const res = await authApi.get(`${adminEndpoints.readAll(model)}?${query.toString()}`);

    setRows(res.data.docs || []);
    setTotal(res.data.total || 0);
    setPages(res.data.pages || 1);
  } catch (error) {
    console.error("Failed to fetch data:", error);
  } finally {
    setLoading(false);
  }
};


    const fetchForeignOptions = async () => {
    const config = nestedFieldConfig[model];
    if (!config) return;

    const options: typeof foreignOptions = {};

    for (const [field, nestedKey] of Object.entries(config)) {
      try {
        const plural =
          field.endsWith("y") ? field.slice(0, -1) + "ies" : field + "s";

        const res = await authApi.get(adminEndpoints.loadDataForComboboxInForm(plural));
        options[field] = res.data;
      } catch (error) {
        console.error(`Failed to fetch ${field} options:`, error);
      }
    }

    setForeignOptions(options);
  };

  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    const sf = searchParams.get("sortField");
    if (sf) setSortBy(sf);
    const so = searchParams.get("sortOrder") as "asc" | "desc";
    if (so === "asc" || so === "desc") setSortOrder(so);
    const st = searchParams.get("searchType");
    if (st) setSearchType(st);
    const sfld = searchParams.get("searchField");
    if (sfld) setSearchField(sfld);
    // const f = searchParams.get("filters");
    // if (f) setFilters(JSON.parse(f));
    fetchData();
    fetchForeignOptions();
  }, [model, searchParams.toString()]);

  const handleSubmit = async () => {
    try {
      if (editing && editing._id) {
        // console.log("formData", formData)
        const res =  await authApi.put(adminEndpoints.updateOne(model,editing._id), formData);
        if (res.status === 200) {
          showNotification(t(`${res.data.message}`), "success")
        }
        else {
          showNotification(t("Update item failed"), "error")
        }
      } else {
        console.log("formData", formData)
        if (model === "products" || model === "users" || model === "brands") {
            const data = new FormData();
            data.append("file", formData.imageUrl || formData.logoUrl || formData.avatar );
            data.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET || "");
            data.append("cloud_name", process.env.REACT_APP_CLOUD_NAME || "");
            data.append("folder", process.env.REACT_APP_FOLDER_CLOUD || "")

            const res_1 = await axios.post(
            `${endpoints['uploadAvatarToCloudinary'](
              process.env.REACT_APP_BASE_CLOUD_URL, 
              process.env.REACT_APP_CLOUD_NAME,
              process.env.REACT_APP_DIR_CLOUD
            )}`,
            data
          );
          if (model === "products") {
            formData.imageUrl = res_1.data.secure_url;
          }
          if (model === "users") {
            formData.avatar = res_1.data.secure_url;
          }
          if (model === "brands") {
            formData.logURL = res_1.data.secure_url;
          }
        }
        const res = await authApi.post(adminEndpoints.createOne(model), formData);
        if (res.status === 201) {
          showNotification(t(`${res.data.message}`), "success")
        }
        else {
          showNotification(t("Create item failed"), "error")
        }
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
    // console.log("handleDelete", id)
    if (!window.confirm(t("Are you sure you want to delete this item?"))) return;
    try {
      // await axios.delete(`/api/admin/${model}/${id}`);
      const res = await authApi.delete(adminEndpoints.deleteOne(model,id))
      console.log("res", res)
      if (res.status === 204) {
        showNotification(t("Item was deleted successfully"), "success")
      }
      else {
        showNotification(t("Item wasn't deleted successfully"), "error")
      }
      fetchData();
    } catch (error) {
      console.error("Failed to delete data:", error);
    }
  };

  const handleClearFilters = (setSearchParams: (params: URLSearchParams) => void) => {
    // Reset local states
    setSearchTerm("");
    setSearchType("contains");
    setSearchField("name");
    setSortBy("");
    setSortOrder("asc");
    setFilters({});

    // Reset URL params
    const params = new URLSearchParams();
    params.set("page", "1");
    setSearchParams(params);
  };


  const handleApplyFilters = (setSearchParams: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams();
    params.set("page", "1");

    // Add search and sort
    if (searchTerm) params.set("search", searchTerm);
    if (searchType) params.set("searchType", searchType);
    if (searchField) params.set("searchField", searchField);
    if (sortBy) params.set("sortField", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);

    // Add filters
    if (Object.keys(filters).length > 0) {
      params.set("filters", JSON.stringify(filters));
    }

    setSearchParams(params);  
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

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= pages) {
      const params: any = { page: newPage.toString() };
      setSearchParams(params);
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => openDialog()}>
        {t("Create New")} {model}
      </Button>
      <Stack direction="row" spacing={2} alignItems="center" mt={2}>
          <TextField
            label={t("Search")}
            variant="outlined"
            value={searchTerm}
            onChange={(e) => {
              const val = e.target.value;
              setSearchTerm(val);
              setSearchParams((prev) => {
                const np = new URLSearchParams(prev.toString());
                np.set("search", val);
                np.set("page", "1");
                return np;
              });
            }}
          />

            <FormControl style={{ minWidth: 140 }}>
              <InputLabel>{t("Search Type")}</InputLabel>
              <Select
                value={searchType}
                label={t("Search Type")}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchType(val);
                  setSearchParams((prev) => {
                    const np = new URLSearchParams(prev.toString());
                    np.set("searchType", val);
                    np.set("page", "1");
                    return np;
                  });
                }}
              >
                <MenuItem value="contains">{t("Contains")}</MenuItem>
                <MenuItem value="exact">{t("Exact")}</MenuItem>
                <MenuItem value="startsWith">{t("Starts With")}</MenuItem>
                <MenuItem value="endsWith">{t("Ends With")}</MenuItem>
              </Select>
            </FormControl>

            <FormControl style={{ minWidth: 140 }}>
              <InputLabel id="search-field-label">{t("Search by")}</InputLabel>
              <Select
                labelId="search-field-label"
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                label={t("Search by")}
              >
                {searchableFields.map((field) => (
                  <MenuItem value={field} key={field}>
                    {t(`${field}`)}
                  </MenuItem>
                ))}
                
                {/* Add more fields if needed */}
              </Select>
            </FormControl>


            <FormControl>
              <InputLabel>{t("Sort By")}</InputLabel>
              <Select
                value={sortBy}
                label={t("Sort By")}
                onChange={(e) => {
                  const f = e.target.value;
                  if (sortableFields.includes(f)) {
                    setSortBy(f);
                    setSearchParams((prev) => {
                      const np = new URLSearchParams(prev.toString());
                      np.set("sortField", f);
                      np.set("sortOrder", sortOrder);
                      np.set("page", "1");
                      return np;
                    });
                  }
                }}
                style={{ minWidth: 140 }}
              >
                {sortableFields.map((f) => (
                  <MenuItem value={f} key={f}>
                    {t(`${f}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <IconButton
              onClick={() => {
                if (!sortBy || !sortableFields.includes(sortBy)) return;
                const newOrder = sortOrder === "asc" ? "desc" : "asc";
                setSortOrder(newOrder);
                setSearchParams((prev) => {
                  const np = new URLSearchParams(prev.toString());
                  np.set("sortField", sortBy);
                  np.set("sortOrder", newOrder);
                  np.set("page", "1");
                  return np;
                });
              }}
            >
              {sortOrder === "asc" ? <ArrowUpward /> : <ArrowDownward />}
            </IconButton>
             <Button variant="contained" color="info" onClick={() => handleClearFilters(setSearchParams)}>
                {t("Clear Filters")}
              </Button>
              <Button variant="contained" color="success" onClick={() => handleApplyFilters(setSearchParams)}>
                {t("Apply Filters")}
              </Button>
          </Stack>

      {loading ? (
        <CircularProgress sx={{ mt: 2 }} />
      ) : (
        <TableContainer
            component={Paper}
            sx={{
              maxHeight: 500,
              overflowX: "auto",
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Table stickyHeader sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  {fields.map((field) => (
                    <TableCell
                      key={field}
                    
                      sx={{
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        cursor: sortableFields.includes(field) ? "pointer" : "default",
                        userSelect: "none",
                        '&:hover': {
                          backgroundColor: sortableFields.includes(field) ? "#ececec" : "inherit",
                        }
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <span>{t(`${field}`)}</span>
                        {sortableFields.includes(field) && (
                          sortBy === field ? (
                            sortOrder === "asc" ? "🔼" : "🔽"
                          ) : (
                            "↕️"
                          )
                        )}
                      </Stack>
                    </TableCell>
                  ))}
                  <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>{t("Actions")}</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row._id}
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: '#fafafa',
                      }
                    }}
                  >
                    {fields.map((field) => {
                      const nestedKey = nestedFieldConfig[model]?.[field];
                      const value = nestedKey && typeof row[field] === "object"
                        ? row[field]?.[nestedKey]
                        : row[field];

                      return (
                        <TableCell key={field} sx={{ whiteSpace: "nowrap", verticalAlign: "middle" }}>
                          {["imageUrl", "avatar", "logoUrl", "url"].includes(field) ? (
                            value ? (
                              <img
                                src={value}
                                alt="preview"
                                style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
                                // onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                              />
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                {t("No Image")}
                              </Typography>
                            )
                          ) : ["status", "isVerified", "isFavorite"].includes(field) ? (
                            <Typography variant="body2" color={value ? "success.main" : "error.main"}>
                              {value ? t("Active") : t("Inactive")}
                            </Typography>
                          ) : ["createdAt", "updatedAt"].includes(field) ? (
                            <Typography variant="body2">
                              {value ? formatDate(value) : "—"}
                            </Typography>
                          ) : (
                            <Typography variant="body2">{t(`${value}`)}</Typography>
                          )}
                        </TableCell>
                      );
                    })}

                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Stack direction="row" spacing={1}>
                        <IconButton color="primary" onClick={() => openDialog(row)} size="small" title="Edit">
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(row._id ?? "")} size="small" title="Delete">
                          <Delete fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
</TableContainer>
      )}
      {/* Pagination */}
      <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
        <Button onClick={() => changePage(1)} disabled={currentPage === 1}>{t("First")}</Button>
        <Button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>{t("Previous")}</Button>
        <Typography variant="body1">{t("Page")} {currentPage} {t("of")} {pages}</Typography>
        <Button onClick={() => changePage(currentPage + 1)} disabled={currentPage === pages}>{t("Next")}</Button>
        <Button onClick={() => changePage(pages)} disabled={currentPage === pages}>{t("Last")}</Button>
      </Stack>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{editing ? "Edit" : "Create"} {model}</DialogTitle>
        <DialogContent>
          {model === "products" &&(
            <FormControl fullWidth margin="dense">
              <InputLabel id="type-label">{t("Product Type")}</InputLabel>
                <Select
                  labelId="type-label"
                  value={formData.type || ""}
                  label={t("Product Type")}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      type: e.target.value,
                      // Optionally reset child fields when type changes
                      ...Object.fromEntries(
                        Object.values(childModelFields).flat().map((f) => [f, ""])
                      ),
                    }))
                  }
                >
                  {productTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {t(`${type.charAt(0).toUpperCase() + type.slice(1)}`)}
                    </MenuItem>
                  ))}
                </Select>
          </FormControl>
          )}
          {formFields.map((field) => {
          if (field === "type") return null
          const isForeignKey = nestedFieldConfig[model]?.[field];
          const options = foreignOptions[field];
          const isImageField = ["avatar", "logoURL", "imageUrl"].includes(field);

          if (isForeignKey && options) {
            return (
              <FormControl fullWidth margin="dense" key={field}>
                <InputLabel id={`${field}-label`}>{field}</InputLabel>
                <Select
                  labelId={`${field}-label`}
                  value={formData[field] || ""}
                  label={t(`${field}`)}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
                  }
                >
                  <MenuItem value="">
                    <em>{t("None")}</em>
                  </MenuItem>
                  {options.map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                      {t(`${option.name || option._id}`)}
                      {/* {option.name || option._id} */}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          }
          if (isImageField) {
            return (
              <FormControl fullWidth margin="dense" key={field}>
                <Button variant="contained" component="label">
                  {t("Upload")} {t(`${field}`)}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Optional: preview image
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData((prev) => ({ ...prev, [field]: reader.result }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </Button>

                {formData[field] && (
                  <img
                    src={formData[field]}
                    alt="Preview"
                    style={{ marginTop: 10, maxHeight: 100 }}
                  />
                )}
              </FormControl>
            );
          }
          return (
            <TextField
              key={field}
              label={t(`${field}`)}
              fullWidth
              margin="dense"
              value={formData[field] || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, [field]: e.target.value }))
              }
            />
          );
        })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>{t("Cancel")}</Button>
          <Button variant="contained" onClick={handleSubmit}>{t("Save")}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CrudTable;
