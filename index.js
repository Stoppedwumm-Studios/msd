const fs = require("fs/promises");
const { generateStructurePatch } = require("./patch.js");
const AdmZip = require("adm-zip");

async function main() {
    const app = await fetch("https://messdiener.pages.dev/downloads/version.json");
    const appData = await app.json(); 

    // Load the bash template
    let shellTemplate = "";
    try {
        shellTemplate = await fs.readFile("./upgrade_template.sh", "utf-8");
    } catch (e) {
        console.error("Error: upgrade_template.sh not found in current directory.");
        return;
    }

    // 1. Setup Build Directory
    try {
        await fs.rm("./build", { recursive: true, force: true });
    } catch (e) {}
    await fs.mkdir("./build", { recursive: true });

    // 2. Identify the latest version
    const versions = appData
        .map(f => f.match(/(\d+\.\d+\.\d+)/))
        .filter(match => match !== null)
        .map(match => match[0])
        .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

    const highestVersion = versions[0];

    // 3. Download Files
    for (const file of appData) {
        console.log(`Downloading ${file}...`);
        const res = await fetch("https://messdiener.pages.dev/downloads/" + file);
        const buffer = await res.arrayBuffer();
        await fs.writeFile("./build/" + file, Buffer.from(buffer));
    }

    // 4. Patch and Wrap
    for (const file of appData) {
        if (!file.endsWith(".zip") || file.startsWith("bundle_")) continue;

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
            // Check if SQL patch exists
            await fs.access(sqlInput);
            
            // Generate the patch file
            generateStructurePatch(sqlInput, sqlOutput);

            // Inject the SQL file into the VERSIONED zip
            // IMPORTANT: The "" as second arg ensures it's placed in the root of the zip
            const zip = new AdmZip("./build/" + file);
            zip.addLocalFile(sqlOutput, "", "patch.sql"); 
            zip.writeZip("./build/" + file);
            
            console.log(`Patched ${file} with SQL.`);

            // Create the Outer Wrapper (the file the user actually downloads)
            const wrapperZip = new AdmZip();
            
            // Add the versioned zip into the wrapper
            wrapperZip.addLocalFile("./build/" + file);

            // Create the personalized bash script
            const customShell = shellTemplate.replace("§ZIP§", file);
            wrapperZip.addFile("upgrade.sh", Buffer.from(customShell, "utf-8"), "", 0o755);

            // Save the wrapper
            wrapperZip.writeZip("./build/bundle_" + file);

        } catch (err) {
            console.warn(`Note: No patch generated for ${file} (Source SQL not found).`);
            
            // Still create the bundle even without a patch
            const wrapperZip = new AdmZip();
            wrapperZip.addLocalFile("./build/" + file);
            const customShell = shellTemplate.replace("§ZIP§", file);
            wrapperZip.addFile("upgrade.sh", Buffer.from(customShell, "utf-8"), "", 0o755);
            wrapperZip.writeZip("./build/bundle_" + file);
        }
    }

    // 5. Move bundles to Dist
    try {
        await fs.rm("./dist", { recursive: true, force: true });
        await fs.mkdir("./dist", { recursive: true });
        const files = await fs.readdir("./build");
        for (const file of files) {
            if (file.startsWith("bundle_")) {
                const cleanName = file.replace("bundle_", "");
                await fs.copyFile(`./build/${file}`, `./dist/${cleanName}`);
                console.log(`Created dist/${cleanName}`);
            }
        }
    } catch (err) {
        console.error("Error copying to dist:", err.message);
    }
}

main().catch(console.error);
