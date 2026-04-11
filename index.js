const fs = require("fs/promises");
const { generateStructurePatch } = require("./patch.js");
const AdmZip = require("adm-zip");

async function main() {
    const app = await fetch("https://messdiener.pages.dev/downloads/version.json");
    const appData = await app.json(); 

    // Load the bash template
    const shellTemplate = await fs.readFile("./upgrade_template.sh", "utf-8");

    try {
        await fs.rm("./build", { recursive: true, force: true });
    } catch (e) {}
    await fs.mkdir("./build", { recursive: true });

    const versions = appData
        .map(f => f.match(/(\d+\.\d+\.\d+)/))
        .filter(match => match !== null)
        .map(match => match[0])
        .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

    const highestVersion = versions[0];

    // Download Phase
    for (const file of appData) {
        console.log(`Downloading ${file}...`);
        const res = await fetch("https://messdiener.pages.dev/downloads/" + file);
        const buffer = await res.arrayBuffer();
        await fs.writeFile("./build/" + file, Buffer.from(buffer));
    }

    // Patching & Packaging Phase
    for (const file of appData) {
        if (!file.endsWith(".zip")) continue;

        let sourceForPatch = file.replace(".zip", "");
        
        if (file.includes("latest")) {
            if (highestVersion) {
                sourceForPatch = highestVersion;
                await fs.copyFile(`./build/${highestVersion}.zip`, `./build/${file}`);
            } else {
                continue;
            }
        }

        const sqlInput = `./upgrades/${sourceForPatch}/upgrade.sql`;
        const sqlOutput = `./build/patch_${file.replace(".zip", ".sql")}`;

        try {
            await fs.access(sqlInput);
            generateStructurePatch(sqlInput, sqlOutput);

            // 1. Inject SQL into the internal zip
            const zip = new AdmZip("./build/" + file);
            zip.addLocalFile(sqlOutput, "patch.sql");
            zip.writeZip("./build/" + file);
            
            console.log(`Successfully patched internal ${file}`);

            // 2. Create the Wrapper Zip (VERSION.zip)
            // This contains the zip file and the customized upgrade.sh
            const wrapperZip = new AdmZip();
            
            // Customize shell script for this specific version
            const customShell = shellTemplate.replace("§ZIP§", file);
            wrapperZip.addFile("upgrade.sh", Buffer.from(customShell, "utf-8"), "", 0o755); // executable permissions
            
            // Add the versioned zip itself into the wrapper
            wrapperZip.addLocalFile("./build/" + file);

            // Save the wrapper zip
            const wrapperName = `bundle_${file}`;
            wrapperZip.writeZip("./build/" + wrapperName);

        } catch (err) {
            console.error(`Skipping patch for ${file}: ${err.message}`);
        }
    }

    // Move to Dist
    try {
        await fs.rm("./dist", { recursive: true, force: true });
        await fs.mkdir("./dist", { recursive: true });
        const files = await fs.readdir("./build");
        for (const file of files) {
            // We only move the "bundle_" files to dist to keep it clean
            if (file.startsWith("bundle_") && file.endsWith(".zip")) {
                const finalName = file.replace("bundle_", "");
                await fs.copyFile(`./build/${file}`, `./dist/${finalName}`);
                console.log(`Exported final package: ${finalName}`);
            }
        }
    } catch (err) {
        console.error("Error copying to dist:", err.message);
    }
}

main().catch(console.error);