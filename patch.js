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

            // 2. Handle ALTER TABLE
            else if (/^ALTER\s+TABLE/i.test(cleanStmt)) {
                // Skip plain AUTO_INCREMENT resets
                if (/\s+AUTO_INCREMENT\s*=\s*\d+/i.test(cleanStmt) && !/ADD|MODIFY|DROP/i.test(cleanStmt)) {
                    continue; 
                }

                let formatted = cleanStmt;

                // Handle PRIMARY KEY specially (MariaDB 10.5+ syntax)
                // Converts: ADD PRIMARY KEY (`id`) -> ADD CONSTRAINT IF NOT EXISTS PRIMARY KEY (`id`)
                if (/ADD\s+PRIMARY\s+KEY/i.test(formatted)) {
                    formatted = formatted.replace(/ADD\s+PRIMARY\s+KEY/i, 'ADD CONSTRAINT IF NOT EXISTS PRIMARY KEY');
                } 
                else {
                    // Handle regular COLUMNS, INDEXES, and UNIQUE KEYS
                    // Inject IF NOT EXISTS after ADD
                    formatted = formatted.replace(
                        /ADD\s+(COLUMN|INDEX|KEY|UNIQUE\s+KEY|UNIQUE\s+INDEX|CONSTRAINT)\s+(?!IF\s+NOT\s+EXISTS)/gi, 
                        'ADD $1 IF NOT EXISTS '
                    );
                }

                // Clean up any remaining auto-increment resets in complex ALTERS
                formatted = formatted.replace(/,\s*AUTO_INCREMENT\s*=\s*\d+/gi, '');
                formatted = formatted.replace(/AUTO_INCREMENT\s*=\s*\d+/gi, '');

                patchStatements.push(formatted);
            }
        }

        const finalSql = [
            "-- Database Layout Patch (Idempotent)",
            "-- Generated: " + new Date().toISOString(),
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
