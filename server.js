/**
 * QR-SNAP - Backend Principal
 * Desarrollado con Node.js y Express
 */

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer'); // Para subir imágenes
const QRCode = require('qrcode'); // Para generar QR
const fs = require('fs'); // Sistema de archivos
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Para IDs únicos

const app = express();

// --- CONFIGURACIÓN ---

// Configurar puerto para Render o local
const PORT = process.env.PORT || 3000;

// Motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Archivos estáticos (CSS, Imágenes subidas)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para procesar formularios
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de almacenamiento de imágenes (Multer)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './public/uploads';
        // Crear carpeta si no existe
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Nombre único: timestamp + extensión original
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Archivo JSON para persistencia de datos
const DB_FILE = 'pages.json';

// Función auxiliar para leer datos
const getPages = () => {
    if (!fs.existsSync(DB_FILE)) return [];
    const data = fs.readFileSync(DB_FILE);
    return JSON.parse(data);
};

// Función auxiliar para guardar datos
const savePage = (pageData) => {
    const pages = getPages();
    pages.push(pageData);
    fs.writeFileSync(DB_FILE, JSON.stringify(pages, null, 2));
};

// --- RUTAS ---

// 1. Página Principal
app.get('/', (req, res) => {
    res.render('index', { title: 'Inicio - QR Snap' });
});

// 2. Formulario de Creación
app.get('/create', (req, res) => {
    res.render('create', { title: 'Crear Página - QR Snap' });
});

// 3. Procesar Creación (POST)
app.post('/create', upload.single('image'), async (req, res) => {
    try {
        const { title, author, message, theme } = req.body;
        const id = uuidv4(); // Generar ID único

        // Objeto de la nueva página
        const newPage = {
            id,
            title,
            author,
            message,
            theme, // color seleccionado
            image: req.file ? `/uploads/${req.file.filename}` : null,
            views: 0, // Contador de visitas
            createdAt: new Date()
        };

        // Guardar en JSON
        savePage(newPage);

        // Generar QR (como Data URL en base64 para no guardar archivo físico)
        // La URL apunta a la ruta dinámica de la aplicación
        const protocol = req.protocol;
        const host = req.get('host');
        const pageUrl = `${protocol}://${host}/page/${id}`;
        
        const qrCodeImage = await QRCode.toDataURL(pageUrl);

        // Renderizar vista de éxito
        res.render('result', { 
            title: '¡Página Creada!', 
            pageUrl, 
            qrCodeImage,
            id 
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al generar la página.');
    }
});

// 4. Visualizar Mini Página (Dinámica)
app.get('/page/:id', (req, res) => {
    const pages = getPages();
    const page = pages.find(p => p.id === req.params.id);

    if (!page) {
        return res.status(404).render('index', { title: 'Página no encontrada' });
    }

    // Incrementar contador de visitas (Extra)
    page.views = (page.views || 0) + 1;
    // Actualizar JSON (esto es ineficiente en producción real pero cumple requisitos académicos)
    const newPages = pages.map(p => p.id === req.params.id ? page : p);
    fs.writeFileSync(DB_FILE, JSON.stringify(newPages, null, 2));

    res.render('page', { page });
});

// --- INICIAR SERVIDOR ---
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});