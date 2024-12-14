const fs = require('fs');
const pdf = require('pdf-parse');
const { Document, Packer, Paragraph, PageBreak } = require('docx');

const inputPath = 'L.-S.-Vygotsky-Düşünce-ve-Dil-Kaynak-Yayınları-1985.pdf';
const outputPath = 'output.docx';

async function convertPDFToWord() {
    try {
        const dataBuffer = fs.readFileSync(inputPath, { encoding: null });
        
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

        const children = [];
        
        pages.forEach((pageText, index) => {
            children.push(new Paragraph({
                text: Buffer.from(pageText, 'utf-8').toString('utf-8')
            }));
            
            if (index < pages.length - 1) {
                children.push(new Paragraph({
                    children: [new PageBreak()]
                }));
            }
        });

        const doc = new Document({
            sections: [{
                properties: {},
                children: children
            }]
        });

        const buffer = await Packer.toBuffer(doc);
        fs.writeFileSync(outputPath, buffer, { encoding: null });
        
        console.log('Dönüşüm tamamlandı! output.docx dosyası oluşturuldu.');
        console.log(`Toplam ${pages.length} sayfa dönüştürüldü.`);
    } catch (error) {
        console.error('Hata:', error);
    }
}

convertPDFToWord();
