const fs = require('fs');
const path = require('path');
const PDFParser = require('pdf2json');

const dataDir = 'E:\\Projects\\AlMulhim-Travel\\packages&destinations';
const outputJsonFile = path.join(__dirname, 'extracted_packages_data.json');

async function parseAllPdfs() {
    console.log("🚀 Starting PDF Parsing with pdf2json...");
    const results = [];
    
    // Read all destination folders
    const folders = fs.readdirSync(dataDir).filter(f => fs.statSync(path.join(dataDir, f)).isDirectory());
    
    for (const folder of folders) {
        console.log(`\n📁 Processing Destination: ${folder}`);
        const destPath = path.join(dataDir, folder);
        
        const files = getAllFiles(destPath, '.pdf');
        
        for (const file of files) {
            console.log(`   📄 Reading PDF: ${path.basename(file)}`);
            try {
                let text = await parsePdfAsync(file);
                
                results.push({
                    destinationFolder: folder,
                    pdfFileName: path.basename(file),
                    pdfFilePath: file,
                    extractedTextLength: text.length,
                    rawTextHead: text.substring(0, 500).trim(), 
                });
            } catch (err) {
                console.error(`   ❌ Error reading ${path.basename(file)}:`, err.message || err);
            }
        }
    }
    
    // Save to JSON
    fs.writeFileSync(outputJsonFile, JSON.stringify(results, null, 2));
    console.log(`\n✅ Done! Extracted data saved to ${outputJsonFile}`);
}

function parsePdfAsync(filePath) {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(this, 1); // 1 = returns text only
        
        pdfParser.on("pdfParser_dataError", errData => {
            reject(errData.parserError);
        });
        
        pdfParser.on("pdfParser_dataReady", pdfData => {
            try {
                resolve(pdfParser.getRawTextContent());
            } catch (err) {
                reject(err);
            }
        });
        
        pdfParser.loadPDF(filePath);
    });
}

function getAllFiles(dirPath, ext, arrayOfFiles) {
  let files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, ext, arrayOfFiles);
    } else {
      if (file.toLowerCase().endsWith(ext)) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });
  return arrayOfFiles;
}

parseAllPdfs();
