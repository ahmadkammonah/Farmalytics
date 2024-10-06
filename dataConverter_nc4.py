import xarray as xr
import json
import numpy as np

# Load the .nc4 file
data = xr.open_dataset("C:\\Users\\user\\Desktop\\Farmalytics\\RawData\\GLDAS_NOAH10_M.A202310.021.nc4.SUB.nc4")

# Extract latitude, longitude, and the data of interest
lat = data['lat'].values
lon = data['lon'].values
variable = data['Qsb_acc'].values  # Replace 'Qsb_acc' with the actual variable name if different

# Create a list of GeoJSON features
features = []

for i in range(len(lat)):
    for j in range(len(lon)):
        value = variable[0, i, j]  # Assuming time is the first dimension
        if np.isnan(value):
            value = None  # Replace NaN with null
        else:
            value = float(value)  # Convert float32 to standard Python float
        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [float(lon[j]), float(lat[i])]
            },
            "properties": {
                "Qsb_acc": value
            }
        }
        features.append(feature)

# Create a GeoJSON FeatureCollection
geojson_data = {
    "type": "FeatureCollection",
    "features": features
}

# Save the GeoJSON to a file
with open("OutputData/output_data.geojson", "w") as f:
    json.dump(geojson_data, f)

print("GeoJSON file created successfully.")
