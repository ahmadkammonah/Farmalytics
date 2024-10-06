import rasterio
import json
import numpy as np
from rasterio.features import shapes
from shapely.geometry import shape, mapping

# Load a .tiff file and convert to GeoJSON
def tiff_to_geojson(tiff_path, geojson_output_path):
    with rasterio.open(tiff_path) as src:
        # Read the first band of the raster
        band = src.read(1)
        mask = band != src.nodata

        # Extract shapes from the raster data
        results = (
            {'properties': {'value': v}, 'geometry': s}
            for s, v in shapes(band, mask=mask, transform=src.transform)
        )

        # Convert the extracted shapes to GeoJSON format
        features = []
        for result in results:
            geom = shape(result['geometry'])
            features.append({
                'type': 'Feature',
                'geometry': mapping(geom),
                'properties': result['properties']
            })

        geojson = {
            'type': 'FeatureCollection',
            'features': features
        }

        # Write to GeoJSON file
        with open(geojson_output_path, 'w') as geojson_file:
            json.dump(geojson, geojson_file)

        print(f"GeoJSON file created successfully at: {geojson_output_path}")

# Example usage
tiff_to_geojson('RawData\GLDAS_NOAH025_3H.A20240629.0000.021.nc4.SUB.tif', 'OutputData/output_tiff_data.geojson')