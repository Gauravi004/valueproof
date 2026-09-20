import subprocess
import sys


steps = [
    "scripts/calculate_distances.py",
    "scripts/create_location_features.py",
    "scripts/create_location_signals.py",
    "scripts/create_locality_snapshot.py",
    "scripts/create_location_api.py"
]


print("===================================")
print("P4 LOCATION INTELLIGENCE PIPELINE")
print("===================================")


for step in steps:

    print("\nRunning:", step)

    result = subprocess.run(
        [sys.executable, step]
    )

    if result.returncode != 0:
        print("\nPipeline stopped.")
        print("Failed step:", step)
        sys.exit(result.returncode)


print("\n===================================")
print("P4 PIPELINE COMPLETED SUCCESSFULLY")
print("===================================")
print("\nOutput:")
print("output/location_api.json")