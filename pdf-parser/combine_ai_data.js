const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '..', 'باقات.txt');
const outputFile = path.join(__dirname, 'ai_extracted_packages.json');

try {
    const rawText = fs.readFileSync(inputFile, 'utf8');
    
    // The user pasted multiple valid JSON arrays but with extra text between them like:
    // ] < قال Gemini
    // [
    // So we need to carefully extract everything that looks like an object inside an array.
    
    let allPackages = [];
    
    // We can use a regex to find all JSON-like structures, or simply split by `[` and `]`.
    // Actually, it might be simpler to just match all `{ "FileName": ... }` objects.
    
    // Regex to match individual package objects
    const packageRegex = /\{\s*"FileName"\s*:\s*"[^"]+".*?(?=\},\s*\{|\}\s*\]|\}\s*$)/gs;
    
    let match;
    let rawObjects = [];
    let currentIndex = 0;
    
    // Manual search for '{' and '}' to parse objects at root level
    let balance = 0;
    let start = -1;
    for(let i=0; i<rawText.length; i++) {
        if(rawText[i] === '{') {
            if(balance === 0) start = i;
            balance++;
        } else if (rawText[i] === '}') {
            balance--;
            if(balance === 0 && start !== -1) {
                let objStr = rawText.substring(start, i+1);
                try {
                    let parsed = JSON.parse(objStr);
                    if(parsed.FileName) {
                        allPackages.push(parsed);
                    }
                } catch(e) {
                    console.error("Failed to parse a segment");
                }
                start = -1;
            }
        }
    }

    // Deduplicate by FileName
    const uniquePackages = [];
    const seenFiles = new Set();
    allPackages.forEach(p => {
        if(!seenFiles.has(p.FileName)) {
            seenFiles.add(p.FileName);
            uniquePackages.push(p);
        }
    });

    console.log(`Found ${uniquePackages.length} valid unique packages from AI.`);
    fs.writeFileSync(outputFile, JSON.stringify(uniquePackages, null, 2), 'utf8');
    console.log(`Saved to ${outputFile}`);
    
} catch (e) {
    console.error("Error:", e);
}
