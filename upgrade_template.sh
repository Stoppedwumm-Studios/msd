#!/bin/bash

# Configuration
ZIP_NAME="§ZIP§"
DB_CONTAINER="my_mariadb_server"
DB_USER="your_user"
DB_PASS="your_password"
DB_NAME="msd-app"
WEB_DIR="./www"

echo "--- Starting Update for $ZIP_NAME ---"

# 1. Check if the zip file exists
if [ ! -f "$ZIP_NAME" ]; then
    echo "Error: $ZIP_NAME not found!"
    exit 1
fi

# 2. Extract files to a temporary directory
echo "Extracting files..."
mkdir -p ./tmp_update
unzip -o "$ZIP_NAME" -d ./tmp_update

# 3. Update Web Directory
echo "Syncing files to $WEB_DIR..."
# We use cp -r. -o in unzip already handled overwriting.
# We exclude the patch.sql from the web directory for security.
cp -r ./tmp_update/* "$WEB_DIR/"
rm -f "$WEB_DIR/patch.sql"

# 4. Update Database
if [ -f "./tmp_update/patch.sql" ]; then
    echo "Applying database patch..."
    # We pipe the SQL file into the docker container
    cat ./tmp_update/patch.sql | docker exec -i $DB_CONTAINER mariadb -u$DB_USER -p$DB_PASS $DB_NAME
    if [ $? -eq 0 ]; then
        echo "Database updated successfully."
    else
        echo "Database update FAILED."
    fi
else
    echo "No database patch found, skipping SQL update."
fi

# 5. Cleanup
rm -rf ./tmp_update
echo "--- Update Finished ---"