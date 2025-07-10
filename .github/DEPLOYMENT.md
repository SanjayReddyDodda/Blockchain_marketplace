# Blockchain Marketplace Deployment Configuration

## Environment Variables

### Required Variables
# Set these in your GitHub repository settings under Settings > Secrets and variables > Actions

# CONTRACT_ADDRESS - The Ethereum contract address for the marketplace
# Example: CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
# Default: 0x0a82432b3e404d62360849b619fA347803dAaa5e (current hardcoded value)

### Optional Variables
# NETWORK_ID - Ethereum network ID (1 for mainnet, 11155111 for Sepolia testnet)
# WEB3_PROVIDER_URL - Custom Web3 provider URL (if not using MetaMask default)

## Deployment Targets

### GitHub Pages (Primary)
- Automatically deploys on pushes to main/master branch
- URL: https://{username}.github.io/{repository-name}
- Serves static files directly
- No server-side processing required

### Google App Engine (Alternative)
- Use existing app.yaml configuration
- Manual deployment via: `gcloud app deploy`
- Requires Google Cloud project setup

## Build Process

### Validation Steps
1. HTML validation using html5validator
2. CSS validation using css-validator-cli
3. JavaScript syntax check using Node.js
4. File structure verification

### Build Output
- Creates `build/` directory with optimized files
- Replaces environment variables in JavaScript
- Copies all necessary static assets

## Testing

### Automated Tests
- HTTP status check (200 OK)
- Content verification (HTML title, essential elements)
- Response time validation

### Manual Testing Checklist
- [ ] MetaMask connection works
- [ ] Contract interaction functions
- [ ] Item listing functionality
- [ ] Item purchasing functionality
- [ ] Transaction hash display
- [ ] Responsive design on mobile devices