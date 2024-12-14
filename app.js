const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdf = require('pdf-parse');
const { Document, Packer, Paragraph, PageBreak } = require('docx');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Sadece PDF dosyaları yüklenebilir!'));
        }
        cb(null, true);
    }
});

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/convert', upload.single('pdfFile'), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('Lütfen bir PDF dosyası seçin!');
        }

        const dataBuffer = fs.readFileSync(req.file.path);
        
        const data = await pdf(dataBuffer);
        
        const lines = data.text.split('\n');
        
        const pageLength = Math.ceil(lines.length / data.numpages);
        
        const pages = [];
        for (let i = 0; i < data.numpages; i++) {
            const start = i * pageLength;
            const end = start + pageLength;
            const pageText = lines.slice(start, end).join('\n');
            pages.push(pageText);
        }

        const doc = new Document({
            sections: [{
                properties: {},
                children: pages.map((pageText, index) => [
                    new Paragraph({
                        text: Buffer.from(pageText, 'utf-8').toString('utf-8')
                    }),
                    ...(index < pages.length - 1 ? [new Paragraph({
                        children: [new PageBreak()]
                    })] : [])
                ]).flat()
            }]
        });

        const outputDir = path.join(__dirname, 'output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        const outputPath = path.join(outputDir, 'output.docx');

        const buffer = await Packer.toBuffer(doc);
        fs.writeFileSync(outputPath, buffer);

        fs.unlinkSync(req.file.path);

        res.download(outputPath, 'converted.docx', (err) => {
            if (err) {
                console.error('Dosya indirme hatası:', err);
            }
            fs.unlinkSync(outputPath);
        });

    } catch (error) {
        console.error('Hata:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Uygulama http://localhost:${port} adresinde çalışıyor`);
});
