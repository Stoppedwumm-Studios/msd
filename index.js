const fs = require("fs/promises");
const { generateStructurePatch } = require("./patch.js");
const AdmZip = require("adm-zip"); // Fixed require syntax

async function main() {
    const app = await fetch("https://messdiener.pages.dev/downloads/version.json");
    const appData = await app.json(); // Expected: ["1.0.0.zip", "1.1.0.zip", "latest.zip", ...]

    // 1. Setup Build Directory
    try {
        await fs.rm("./build", { recursive: true, force: true });
    } catch (e) {}
    await fs.mkdir("./build", { recursive: true });

    // 2. Identify the latest version number from the list
    // This finds the highest version string (e.g., "1.2.0") from the array
    const versions = appData
        .map(f => f.match(/(\d+\.\d+\.\d+)/))
        .filter(match => match !== null)
        .map(match => match[0])
        .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

    const highestVersion = versions[0];

    for (const file of appData) {
        console.log(`Processing ${file}...`);
        
        // Download the file
        const res = await fetch("https://messdiener.pages.dev/downloads/" + file);
        const buffer = await res.arrayBuffer();
        await fs.writeFile("./build/" + file, Buffer.from(buffer));
    }
    for (const file of appData) {
        if (!file.endsWith(".zip")) continue;

        let sourceForPatch = file.replace(".zip", "");
        
        // Handle "latest.zip" logic
        if (file.includes("latest")) {
            if (highestVersion) {
                // If this is latest.zip, we use the upgrade.sql from the highest version folder
                sourceForPatch = highestVersion;
                // Also overwrite latest.zip with the actual highest version content if needed
                await fs.copyFile(`./build/${highestVersion}.zip`, `./build/${file}`);
            } else {
                console.warn("Could not determine highest version for latest.zip");
                continue;
            }
        }

        const sqlInput = `./upgrades/${sourceForPatch}/upgrade.sql`;
        const sqlOutput = `./build/patch_${file.replace(".zip", ".sql")}`;

        try {
            // Check if source SQL exists before patching
            await fs.access(sqlInput);
            
            // Generate patch for SQL files
            generateStructurePatch(sqlInput, sqlOutput);

            // Inject the patch into the zip file
            const zip = new AdmZip("./build/" + file);
            zip.addLocalFile(sqlOutput, "patch.sql");
            zip.writeZip("./build/" + file);
            
            console.log(`Successfully patched ${file}`);
        } catch (err) {
            console.error(`Skipping patch for ${file}: Source ${sqlInput} not found.`);
        }
    }
    try {
        await fs.rm("./dist", { recursive: true, force: true });
        await fs.mkdir("./dist", { recursive: true });
    } catch (e) {
        await fs.mkdir("./dist", { recursive: true });
    }

    try {
        const files = await fs.readdir("./build");
        for (const file of files) {
            if (file.endsWith(".zip")) {
                await fs.copyFile(`./build/${file}`, `./dist/${file}`);
                console.log(`Copied ${file} to dist/`);
            }
        }
    } catch (err) {
        console.error("Error copying files to dist:", err.message);
    }
}

main().catch(console.error);