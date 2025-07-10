#!/bin/bash

# Deployment validation script for Blockchain Marketplace
# This script validates that all required files are present and properly formatted

echo "🚀 Validating Blockchain Marketplace deployment..."

# Check required files
REQUIRED_FILES=("index.html" "app.js" "styles.css")
MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -ne 0 ]; then
    echo "❌ Missing required files: ${MISSING_FILES[*]}"
    exit 1
fi

echo "✅ All required files present"

# Validate HTML
if command -v html5validator &> /dev/null; then
    echo "🔍 Validating HTML..."
    html5validator --root . --match "*.html" --log ERROR
    if [ $? -eq 0 ]; then
        echo "✅ HTML validation passed"
    else
        echo "⚠️  HTML validation found issues"
    fi
else
    echo "⚠️  html5validator not found, skipping HTML validation"
fi

# Check JavaScript syntax
echo "🔍 Checking JavaScript syntax..."
node -c app.js
if [ $? -eq 0 ]; then
    echo "✅ JavaScript syntax check passed"
else
    echo "❌ JavaScript syntax errors found"
    exit 1
fi

# Check for Web3 integration
echo "🔍 Checking Web3 integration..."
if grep -q "Web3" app.js; then
    echo "✅ Web3 integration found"
else
    echo "❌ Web3 integration not found"
    exit 1
fi

# Check for contract configuration
if grep -q "contractAddress" app.js; then
    echo "✅ Contract address configuration found"
else
    echo "❌ Contract address configuration not found"
    exit 1
fi

# Check CSS file
if [ -s "styles.css" ]; then
    echo "✅ CSS file is present and not empty"
else
    echo "❌ CSS file is missing or empty"
    exit 1
fi

echo ""
echo "🎉 Deployment validation completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "   📄 HTML file: $(wc -l < index.html) lines"
echo "   📜 JavaScript file: $(wc -l < app.js) lines" 
echo "   🎨 CSS file: $(wc -l < styles.css) lines"
echo ""
echo "🌐 Ready for deployment to:"
echo "   • GitHub Pages"
echo "   • Netlify"
echo "   • Vercel"
echo "   • Google App Engine"