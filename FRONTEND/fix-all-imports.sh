#!/bin/bash

# Comprehensive fix for all remaining @ alias imports

echo "Fixing all @ alias imports across all features..."

# Fix @/features/* imports - convert to relative paths
find src/features -name "*.js" -exec sed -i '' "s|from '@/features/shared/components/utils/PDFGenerator'|from '../../shared/components/utils/PDFGenerator'|g" {} +
find src/features -name "*.js" -exec sed -i '' "s|from '@/features/shared/components/ui/SuccessNotification'|from '../../shared/components/ui/SuccessNotification'|g" {} +
find src/features -name "*.js" -exec sed -i '' "s|from '@/features/shared/components/ui/LoadingSpinner'|from '../../shared/components/ui/LoadingSpinner'|g" {} +

# Fix @/core/* imports - convert to relative paths (3 levels deep from features/[feature]/components)
find src/features -name "*.js" -exec sed -i '' "s|from '@/core/api/config'|from '../../../core/api/config'|g" {} +

# Fix @/assets/* imports - convert to relative paths (3 levels deep from features/[feature]/components)
find src/features -name "*.js" -exec sed -i '' "s|from '@/assets/|from '../../../assets/|g" {} +

echo "All @ alias imports fixed!"
echo "Running build..."
npm run build
