const fs = require('fs');

function generateStructurePatch(inputFileName, outputFileName) {
    try {
        if (!fs.existsSync(inputFileName)) {
            console.error(`File not found: ${inputFileName}`);
            return;
        }

        const sqlContent = fs.readFileSync(inputFileName, 'utf8');
        
        const statements = sqlContent.split(';');
        const patchStatements = [];

        for (let stmt of statements) {
            let cleanStmt = stmt
                .replace(/--.*$/gm, '')      
                .replace(/\/\*[\s\S]*?\*\//g, '') 
                .trim();

            if (!cleanStmt) continue;

            // 1. Handle CREATE TABLE
            if (/^CREATE\s+TABLE/i.test(cleanStmt)) {
                let formatted = cleanStmt.replace(/CREATE\s+TABLE/i, 'CREATE TABLE IF NOT EXISTS');
                formatted = formatted.replace(/AUTO_INCREMENT\s*=\s*\d+/gi, '');
                patchStatements.push(formatted);
            }

            // 2. Handle ALTER TABLE (The problematic part)
            else if (/^ALTER\s+TABLE/i.test(cleanStmt)) {
                // Remove auto-increment resets
                if (/\s+AUTO_INCREMENT\s*=\s*\d+/i.test(cleanStmt) && !/ADD|MODIFY|DROP/i.test(cleanStmt)) {
                    continue; 
                }

                let formatted = cleanStmt.replace(/,\s*AUTO_INCREMENT\s*=\s*\d+/gi, '');
                formatted = formatted.replace(/AUTO_INCREMENT\s*=\s*\d+/gi, '');

                /**
                 * IDEMPOTENT ALTER TABLE (MariaDB 10.5+)
                 * We inject "IF NOT EXISTS" after ADD for:
                 * COLUMN, INDEX, KEY, UNIQUE KEY, UNIQUE INDEX, CONSTRAINT
                 */
                formatted = formatted.replace(
                    /ADD\s+(COLUMN|INDEX|KEY|UNIQUE\s+KEY|UNIQUE\s+INDEX|CONSTRAINT)\s+(?!IF\s+NOT\s+EXISTS)/gi, 
                    'ADD $1 IF NOT EXISTS '
                );

                patchStatements.push(formatted);
            }
        }

        const finalSql = [
            "-- Database Layout Patch (Idempotent)",
            "-- Generated on: " + new Date().toISOString(),
            "SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';",
            "SET FOREIGN_KEY_CHECKS = 0;", 
            "",
            patchStatements.join(';\n\n') + ";",
            "",
            "SET FOREIGN_KEY_CHECKS = 1;"
        ].join('\n');

        fs.writeFileSync(outputFileName, finalSql);
        console.log(`Successfully generated idempotent patch: ${outputFileName}`);
        
    } catch (err) {
        console.error("Error processing SQL file:", err.message);
    }
}

module.exports = { generateStructurePatch };
