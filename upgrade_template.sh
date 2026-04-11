#!/bin/bash

# Configuration
ZIP_NAME="§ZIP§"
DB_CONTAINER="my_mariadb_server"
DB_USER="your_user"
DB_PASS="your_password"
DB_NAME="msd-app"
TARGET_WWW="./www"

echo "--- Starting Update for $ZIP_NAME ---"

# 1. Check if zip exists
if [ ! -f "$ZIP_NAME" ]; then
    echo "Error: $ZIP_NAME not found!"
    exit 1
fi

# 2. Extract to temp
echo "Extracting files..."
rm -rf ./tmp_update
mkdir -p ./tmp_update
unzip -q -o "$ZIP_NAME" -d ./tmp_update

# 3. Detect Structure and Sync Web Files
# We look for the folder named 'www' inside the extracted content
SOURCE_WWW=$(find ./tmp_update -type d -name "www" | head -n 1)

if [ -d "$SOURCE_WWW" ]; then
    echo "Syncing web files from $SOURCE_WWW to $TARGET_WWW..."
    cp -r "$SOURCE_WWW/." "$TARGET_WWW/"
else
    echo "Warning: Could not find 'www' folder in zip. Copying all files to target..."
    cp -r ./tmp_update/* "$TARGET_WWW/" 2>/dev/null
fi

# 4. Update Database
# We look for patch.sql specifically in the root of the extraction
SQL_FILE="./tmp_update/patch.sql"
if [ -f "$SQL_FILE" ]; then
    echo "Applying database patch..."
    cat "$SQL_FILE" | docker exec -i $DB_CONTAINER mariadb -u$DB_USER -p$DB_PASS $DB_NAME
    if [ $? -eq 0 ]; then
        echo "Database updated successfully."
    else
        echo "Database update FAILED."
    fi
else
    echo "No patch.sql found in the root of the archive, skipping SQL update."
fi

# 5. Cleanup
echo "Cleaning up..."
rm -rf ./tmp_update
# Remove the SQL file from the web directory if it was copied there by accident
rm -f "$TARGET_WWW/patch.sql"

echo "--- Update Finished ---"
