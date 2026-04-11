#!/bin/bash

# Configuration
ZIP_NAME="§ZIP§"
DB_CONTAINER="my_mariadb_server"
DB_USER="your_user"
DB_PASS="your_password"
DB_NAME="msd-app"
TARGET_WWW="./www"

echo "--- Starting Update for $ZIP_NAME ---"

if [ ! -f "$ZIP_NAME" ]; then
    echo "Error: $ZIP_NAME not found!"
    exit 1
fi

echo "Extracting files..."
rm -rf ./tmp_update
mkdir -p ./tmp_update
unzip -q -o "$ZIP_NAME" -d ./tmp_update

SOURCE_WWW=$(find ./tmp_update -type d -name "www" | head -n 1)
if [ -d "$SOURCE_WWW" ]; then
    echo "Syncing web files..."
    cp -r "$SOURCE_WWW/." "$TARGET_WWW/"
fi

SQL_FILE="./tmp_update/patch.sql"
if [ -f "$SQL_FILE" ]; then
    echo "Applying database patch (errors regarding existing Primary Keys are expected and ignored)..."
    # -f is critical here to continue past the Primary Key error
    cat "$SQL_FILE" | docker exec -i $DB_CONTAINER mariadb -u$DB_USER -p$DB_PASS $DB_NAME -f
    echo "Database update process finished."
else
    echo "No patch.sql found."
fi

echo "Cleaning up..."
rm -rf ./tmp_update
rm -rf "$TARGET_WWW/patch.sql"

echo "--- Update Finished ---"
