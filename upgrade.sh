ZIP_NAME="§ZIPNAME§"

if [ -f "$ZIP_NAME" ]; then
    echo "Extracting $ZIP_NAME..."
    unzip -o "$ZIP_NAME" -d .
else
    echo "Error: $ZIP_NAME not found!"
    exit 1
fi

echo "Running database upgrade..."
docker exec -i my_mariadb_server mariadb -u root -p root msd-app < upgrades/§VERSION§/upgrade.sql