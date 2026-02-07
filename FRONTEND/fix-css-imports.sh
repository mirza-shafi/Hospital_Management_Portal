#!/bin/bash

# Fix all CSS imports in src directory
echo "Fixing all CSS imports..."

# Find all JS files with './styles/' imports and fix them
find src -name "*.js" -type f -print0 | while IFS= read -r -d '' file; do
    # Replace './styles/' with '@/components/styles/'
    sed -i '' "s|from './styles/|from '@/components/styles/|g" "$file"
    sed -i '' "s|from \"./styles/|from \"@/components/styles/|g" "$file"
    
    # Replace '../styles/' with '@/components/styles/'
    sed -i '' "s|from '../styles/|from '@/components/styles/|g" "$file"
    sed -i '' "s|from \"../styles/|from \"@/components/styles/|g" "$file"
    
    # Replace '../../styles/' with '@/components/styles/'
    sed -i '' "s|from '../../styles/|from '@/components/styles/|g" "$file"
    sed -i '' "s|from \"../../styles/|from \"@/components/styles/|g" "$file"
done

echo "CSS imports fixed!"
echo "Running build..."
npm run build
