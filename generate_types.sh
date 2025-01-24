#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "Error: .env file not found"
    exit 1
fi

# Check if PROJECT_ID is set
if [ -z "$PROJECT_ID" ]; then
    echo "Error: PROJECT_ID not found in .env file"
    exit 1
fi

# Create types directory if it doesn't exist
mkdir -p ./types

# Generate types using the PROJECT_ID from .env
supabase gen types typescript --project-id "$PROJECT_ID" --schema public > ./types/supabaseTypes.ts

# Format the generated types file with prettier
npx prettier --write ./types/supabaseTypes.ts

echo "Types generated and formatted successfully!"
