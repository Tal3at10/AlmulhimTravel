const fs = require('fs');
const path = require('path');

function processDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Safe replacements for pale texts
            const replacements = [
                { search: /text-slate-500/g, replace: 'text-slate-700 font-medium' },
                { search: /text-gray-500/g, replace: 'text-slate-700 font-medium' },
                { search: /text-slate-400/g, replace: 'text-slate-600 font-medium' },
                { search: /text-white\/50/g, replace: 'text-white/80 font-medium' },
                { search: /text-white\/60/g, replace: 'text-white/90 font-medium' },
                { search: /text-white\/70/g, replace: 'text-white font-medium' }
            ];

            let newContent = content;
            replacements.forEach(r => {
                if(r.search.test(newContent)) {
                    r.search.lastIndex = 0;
                    newContent = newContent.replace(r.search, r.replace);
                    modified = true;
                }
            });

            // Make sure not to duplicate font-weights
            if (modified) {
                newContent = newContent.replace(/font-medium\s+font-medium/g, 'font-medium');
                newContent = newContent.replace(/font-semibold\s+font-medium/g, 'font-semibold');
                newContent = newContent.replace(/font-bold\s+font-medium/g, 'font-bold');
                
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log('Updated: ' + fullPath);
            }
        }
    });
}
processDir('e:/Projects/AlMulhim-Travel/src');
