const fs = require('fs');

function generateStructurePatch(inputFileName, outputFileName) {
    try {
        if (!fs.existsSync(inputFileName)) {
            console.error(`File not found: ${inputFileName}`);
            return;
        }

        const sqlContent = fs.readFileSync(inputFileName, 'utf8');
        
        // Split by semicolon, but handle potential newlines
        const statements = sqlContent.split(';');
        const patchStatements = [];

        for (let stmt of statements) {
            // 1. Clean the statement: remove comments and trim whitespace
            let cleanStmt = stmt
                .replace(/--.*$/gm, '')      // Remove single line comments
                .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
                .trim();

            if (!cleanStmt) continue;

            // 2. Capture CREATE TABLE
            if (/^CREATE\s+TABLE/i.test(cleanStmt)) {
                // Ensure "IF NOT EXISTS" is present
                let formatted = cleanStmt.replace(/CREATE\s+TABLE/i, 'CREATE TABLE IF NOT EXISTS');
                
                // Remove specific AUTO_INCREMENT starting values (e.g., AUTO_INCREMENT=15)
                // We keep the "AUTO_INCREMENT" keyword but remove the "= number" 
                formatted = formatted.replace(/AUTO_INCREMENT\s*=\s*\d+/gi, '');
                
                patchStatements.push(formatted);
            }

            // 3. Capture ALTER TABLE (Keys and Constraints)
            else if (/^ALTER\s+TABLE/i.test(cleanStmt)) {
                // Filter out statements that ONLY set the next AUTO_INCREMENT value
                // We want to keep Index/Primary Key additions, but not value resets
                if (/\s+AUTO_INCREMENT\s*=\s*\d+/i.test(cleanStmt) && !/ADD|MODIFY|DROP/i.test(cleanStmt)) {
                    continue; 
                }

                // If it's a MODIFY statement that includes an AUTO_INCREMENT reset, clean just the reset
                let formatted = cleanStmt.replace(/,\s*AUTO_INCREMENT\s*=\s*\d+/gi, '');
                formatted = formatted.replace(/AUTO_INCREMENT\s*=\s*\d+/gi, '');

                patchStatements.push(formatted);
            }
        }

        const finalSql = [
            "-- Database Layout Patch",
            "-- Generated on: " + new Date().toISOString(),
            "SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';",
            "SET FOREIGN_KEY_CHECKS = 0;", // Good practice for structural patches
            "",
            patchStatements.join(';\n\n') + ";",
            "",
            "SET FOREIGN_KEY_CHECKS = 1;"
        ].join('\n');

        fs.writeFileSync(outputFileName, finalSql);
        console.log(`Successfully generated: ${outputFileName}`);
        
    } catch (err) {
        console.error("Error processing SQL file:", err.message);
    }
}

module.exports = { generateStructurePatch };