import React, { useState } from "react";
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Button, TextField, Stack, CssBaseline
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#22d3ee" },       // cian
    secondary: { main: "#a78bfa" },     // violeta
    error: { main: "#ef4444" },
    background: { default: "#0b1220", paper: "#111827" }, // dark limpio
    text: { primary: "#e5e7eb", secondary: "#94a3b8" }
  }
});

const inputSX = {
  bgcolor: "#f3f4f6",       // fondo claro para inputs
  borderRadius: 1,
  input: { color: "#111827" },
  "& .MuiInputLabel-root": { color: "#374151" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#cbd5e1" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#94a3b8" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#22d3ee" }
};

const ListaProductos = () => {
  //const API_BASE = "http://localhost:8080/api/v1/aprendiz";
  const API_BASE = "https://inventario-java-production.up.railway.app/api/v1/productos"

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nombre: "", descripcion: "", cantidad: 0, precio: 0.0, categoria: "", fecha_ingreso: "" });
  const [idFiltro, setIdFiltro] = useState("");

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE);
      setData(res.data || []);
    } catch (e) {
      console.error("Error cargando productos:", e);
      setData([]);
    } finally { setLoading(false); }
  };

  const fetchPorId = async () => {
    if (!idFiltro) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/${idFiltro}`);
      setData(res.data ? [res.data] : []);
    } catch { setData([]); } finally { setLoading(false); }
  };

  const crearProducto = async () => {
    try {
      setLoading(true);
      await axios.post(API_BASE, form, { headers: { "Content-Type": "application/json" } });
      setForm({ nombre: "", apellido: "", email: "", telefono: "", direccion: "" });
      await fetchTodos();
    } catch (e) { console.error("Error creando producto:", e); }
    finally { setLoading(false); }
  };

  const eliminarPorId = async () => {
    if (!idFiltro) return;
    try { setLoading(true); await axios.delete(`${API_BASE}/${idFiltro}`); await fetchTodos(); }
    catch (e) { console.error("Error eliminando producto:", e); }
    finally { setLoading(false); }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ mt: 4, px: { xs: 2, md: 4 } }}>
        {/* Barra de acciones */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5" sx={{ flex: 1, fontWeight: 700, color: "text.primary" }}>
            Productos
          </Typography>
          <Button variant="contained" color="primary" onClick={fetchTodos} disabled={loading}>
            {loading ? "Cargando..." : "VER TODOS"}
          </Button>
          <TextField
            size="small" label="ID" value={idFiltro} onChange={(e) => setIdFiltro(e.target.value)}
            sx={{ ...inputSX, width: 140 }}
          />
          <Button variant="contained" color="secondary" onClick={fetchPorId} disabled={loading || !idFiltro}>
            BUSCAR POR ID
          </Button>
          <Button variant="contained" color="error" onClick={eliminarPorId} disabled={loading || !idFiltro}>
            ELIMINAR POR ID
          </Button>
        </Stack>

        {/* Formulario creación */}
        <Paper elevation={4} sx={{ p: 2, mb: 3, border: "1px solid #334155", bgcolor: "background.paper" }}>
          <Typography sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>Crear producto</Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField label="Nombre" value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })} sx={{ ...inputSX, flex: 1 }} />
            <TextField label="Descripción" value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })} sx={{ ...inputSX, flex: 1 }} />
            <TextField label="Cantidad" type="number" value={form.cantidad}
              onChange={(e) => setForm({ ...form, cantidad: parseInt(e.target.value) || 0 })} sx={{ ...inputSX, flex: 1 }} />
            <TextField label="Precio" type="number" step="0.01" value={form.precio}
              onChange={(e) => setForm({ ...form, precio: parseFloat(e.target.value) || 0.0 })} sx={{ ...inputSX, flex: 1 }} />
            <TextField label="Categoría" value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })} sx={{ ...inputSX, flex: 1 }} />
            <TextField label="Fecha Ingreso" type="date" value={form.fecha_ingreso}
              onChange={(e) => setForm({ ...form, fecha_ingreso: e.target.value })} sx={{ ...inputSX, flex: 1 }}
              InputLabelProps={{ shrink: true }} />
            <Button variant="contained" color="primary" onClick={crearProducto} disabled={loading}>
              CREAR
            </Button>
          </Stack>
        </Paper>

        {/* Tabla */}
        <TableContainer component={Paper} elevation={3} sx={{ border: "1px solid #334155", bgcolor: "background.paper" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: "#22d3ee" }}>
                {["ID","Nombre","Descripción","Cantidad","Precio","Categoría","Fecha Ingreso"].map((h) => (
                  <TableCell key={h} sx={{ color: "#0b1220", fontWeight: 700 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, i) => (
                <TableRow
                  key={row.id ?? i}
                  sx={{
                    backgroundColor: i % 2 === 0 ? "#0f172a" : "#111827",
                    "&:hover": { backgroundColor: "#1f2937" }
                  }}
                >
                  <TableCell sx={{ color: "text.primary" }}>{row.id}</TableCell>
                  <TableCell sx={{ color: "text.primary" }}>{row.nombre}</TableCell>
                  <TableCell sx={{ color: "text.primary" }}>{row.descripcion}</TableCell>
                  <TableCell sx={{ color: "text.primary" }}>{row.cantidad}</TableCell>
                  <TableCell sx={{ color: "text.primary" }}>{row.precio}</TableCell>
                  <TableCell sx={{ color: "text.primary" }}>{row.categoria}</TableCell>
                  <TableCell sx={{ color: "text.primary" }}>{row.fecha_ingreso}</TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ color: "text.secondary" }}>
                    Sin registros
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </ThemeProvider>
  );
};

export default ListaProductos;
