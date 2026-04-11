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

                // IMPORTANT: We do NOT add IF NOT EXISTS to PRIMARY KEY (not supported by MariaDB)
                // We only add it to COLUMN, INDEX, UNIQUE KEY, etc.
                if (!/ADD\s+PRIMARY\s+KEY/i.test(formatted)) {
                    formatted = formatted.replace(
                        /ADD\s+(COLUMN|INDEX|CONSTRAINT|UNIQUE\s+KEY|UNIQUE\s+INDEX)\s+(?!IF\s+NOT\s+EXISTS)/gi, 
                        'ADD $1 IF NOT EXISTS '
                    );
                    
                    // Special case for plain "ADD KEY" (but not PRIMARY KEY)
                    formatted = formatted.replace(/ADD\s+KEY\s+(?!IF\s+NOT\s+EXISTS|PRIMARY\s+KEY)/gi, 'ADD KEY IF NOT EXISTS ');
                }

                // Clean up auto-increment resets
                formatted = formatted.replace(/,\s*AUTO_INCREMENT\s*=\s*\d+/gi, '');
                formatted = formatted.replace(/AUTO_INCREMENT\s*=\s*\d+/gi, '');

                patchStatements.push(formatted);
            }
        }

        const finalSql = [
            "-- Database Layout Patch (Idempotent)",
            "-- Generated: " + new Date().toISOString(),
            "SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0;", // Suppress "Table already exists" warnings
            "SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';",
            "SET FOREIGN_KEY_CHECKS = 0;", 
            "",
            patchStatements.join(';\n\n') + ";",
            "",
            "SET FOREIGN_KEY_CHECKS = 1;",
            "SET SQL_NOTES=@OLD_SQL_NOTES;"
        ].join('\n');

        fs.writeFileSync(outputFileName, finalSql);
        console.log(`Successfully generated idempotent patch: ${outputFileName}`);
        
    } catch (err) {
        console.error("Error processing SQL file:", err.message);
    }
}

module.exports = { generateStructurePatch };
