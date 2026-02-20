# PGxInsight - Pharmacogenomics AI Platform
### Build on Algorand

## Project Overview

PGxInsight is a precision medicine platform that analyzes clinically actionable pharmacogenes to predict individual drug responses based on genomic variants. The application combines pharmacogenomic data with evidence-based guidelines (CPIC, DPWG, FDA) to provide personalized drug-gene interaction analysis.

### 🚀 Key Innovation: Blockchain-Verified Pharmacogenomics
This project determines threat levels from VCF (Variant Call Format) genomic files and stores verified analysis results immutably on the Algorand blockchain. A groundbreaking feature includes innovative techniques to run the Algorand blockchain in mobile applications—solving a previously documented limitation in blockchain mobile integration.

### 📱 Quick Links
- **Live Demo**: [https://gene-harmony.onrender.com/](https://gene-harmony.onrender.com/)
- **Algorand App ID**: `755779679`
- **Testnet Explorer**: [https://testnet-api.algonode.cloud/v2/applications/755779679](https://testnet-api.algonode.cloud/v2/applications/755779679)

## Features

### Core Functionality
- **VCF File Upload**: Submit Variant Call Format (VCF) genomics files for analysis
- **Drug-Gene Analysis**: Query 200+ medications across multiple therapeutic categories:
  - Cardiovascular (Warfarin, Simvastatin, Clopidogrel)
  - Oncology (Tamoxifen, Fluorouracil, Irinotecan)
  - Psychiatry (Sertraline, Fluoxetine, Paroxetine)
  - Pain Management (Codeine, Tramadol, Oxycodone)
  - Other specialties
- **PGx Risk Assessment**: Three-tier risk stratification:
  -  **Safe** - Standard therapy with no dose adjustment
  -  **Adjust** - Modified dosing or monitoring required
  -  **Avoid** - High risk of adverse effects; alternative recommended
- **Evidence-Based Guidelines**: Recommendations backed by CPIC Level A evidence
- **JSON Export**: Download analysis results for clinical records
- **Blockchain Integration**: Optional Algorand wallet integration for immutable proof of analysis

### Key Pharmacogenes Supported
- **CYP2D6** (25+ drugs) - Opioids, antidepressants, beta-blockers
- **CYP2C19** (18+ drugs) - PPIs, antiplatelets, SSRIs
- **CYP2C9** (15+ drugs) - NSAIDs, anticoagulants, antiepileptics
- **VKORC1** (3 drugs) - Vitamin K antagonists
- **SLCO1B1** (8 drugs) - Statins, anticancer agents
- **DPYD** (4 drugs) - Fluoropyrimidines
- **TPMT** (5 drugs) - Thiopurines
- **HLA-B** (6 drugs) - Abacavir, carbamazepine, allopurinol

## Technology Stack

### Frontend
- **React** - UI framework with functional components and hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn-ui** - High-quality component library
- **GSAP** - Animation library for smooth transitions
- **Three.js + React Three Fiber** - 3D DNA helix visualization
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Lenis** - Smooth scrolling library
- **Sonner** - Toast notifications

### Build & Testing
- **Vitest** - Unit testing framework
- **Testing Library** - Component testing utilities
- **PostCSS** - CSS processing with Tailwind

### Backend & Blockchain
- **Spring Boot** - Backend REST API
- **Algorand SDK** - Blockchain integration for immutable analysis storage
- **Algorand TestNet** - Testnet deployment for verification

### Deployment
- **Docker** - Containerization
- **Node.js** - Runtime environment
- **Bun** - Fast JavaScript runtime (package management)
- **Render** - Cloud deployment platform

## Project Structure

```
src/
 components/
    ui/                  # shadcn-ui components
       alert.tsx
       breadcrumb.tsx
       button.tsx
       calendar.tsx
       card.tsx
       chart.tsx
       context-menu.tsx
       dropdown-menu.tsx
       form.tsx
       navigation-menu.tsx
       sheet.tsx
       skeleton.tsx
       sonner.tsx       # Toast notifications
       toast.tsx
       tooltip.tsx
    AnalysisPanel.tsx    # Main analysis interface
    DNAHelix.tsx         # 3D DNA model (Three.js)
    DrugInput.tsx        # Drug selection component
    FileUpload.tsx       # VCF file upload
    HeroScene.tsx        # Hero section with 3D canvas
    InfoSections.tsx     # Educational sections
    Navigation.tsx       # Navigation bar
    ResultsDisplay.tsx   # Analysis results & recommendations
    NavLink.tsx          # Custom router link wrapper
 hooks/
    use-toast.ts         # Toast notification hook
 lib/
    api.ts               # API client for backend
    utils.ts             # Utility functions
 pages/
    Index.tsx            # Main landing page
    NotFound.tsx         # 404 page
 test/
    setup.ts             # Vitest configuration
 App.tsx                  # Root component with routing
 App.css                  # Global styles
 index.css                # CSS variables & animations
 main.tsx                 # Application entry point
 vite-env.d.ts           # Vite type definitions
```

## Key Components

### AnalysisPanel
Main container for the PGx analysis workflow. Manages:
- File upload state
- Selected drugs
- Wallet address input
- Results rendering

### ResultsDisplay
Displays PGx analysis results with:
- Risk assessment cards (Safe/Adjust/Avoid counts)
- Detailed drug-gene interaction cards
- Expandable clinical guidance
- Export to JSON functionality
- Copy-to-clipboard feature
- Mock data with real CPIC-based recommendations

### FileUpload
VCF file upload with:
- Drag-and-drop support
- File validation (type, size)
- Upload progress indicator
- Error handling with GSAP animations

### DrugInput
Drug selection with:
- Searchable dropdown list
- 25 supported medications
- Drug-to-gene mapping (e.g., Warfarin  CYP2C9/VKORC1)
- Multi-select capability

### HeroScene
Hero section featuring:
- 3D animated DNA helix (Three.js)
- Ambient particles
- Smooth scroll-triggered animations
- Floating info cards with example results

### DNAHelix
3D DNA visualization with:
- Dual strand geometry (cyan & purple)
- Base pair rungs with coloring
- Rotating glow spheres
- Particle effects

### InfoSections
Educational content including:
- How It Works (4-step workflow)
- Key Pharmacogenes (gene cards with drug counts)
- About PGx section
- Data sources & evidence levels

## API Integration

### Backend Communication
Backend endpoint for VCF analysis:

```
POST /vcf/upload
Content-Type: multipart/form-data
Parameters: file, wallet, drug
```

**Expected Response:**
```json
{
  "gene": "CYP2C9",
  "diplotype": "*1/*2",
  "phenotype": "Intermediate Metabolizer",
  "riskLevel": "Moderate",
  "recommendation": "Reduce dose by 25-50%",
  "blockchainPayload": {
    "patientId": "<wallet_address>",
    "drug": "WARFARIN",
    "primaryGene": "CYP2C9",
    "vcfHash": "<SHA-256>",
    "reportHash": "<SHA-256>",
    "guidelineVersion": "1.0.0",
    "timestamp": 1708412400,
    "appId": 755779679
  }
}
```

**Backend Requirements:**
- Base URL: http://localhost:8081 (dev) or https://spring-boot-algorand.onrender.com (prod)
- Endpoint: POST /vcf/upload
- Content-Type: multipart/form-data
- Parameters: ile, wallet, drug
- Optional: JWT Bearer token in Authorization header

## Styling & Design System

### CSS Custom Properties
```css
--primary: 185 100% 50%        /* Cyan */
--primary-foreground: 0 0% 0%
--secondary: 270 80% 65%       /* Purple */
--safe: 142 76% 36%            /* Green */
--warn: 38 92% 50%             /* Orange */
--danger: 0 84% 60%            /* Red */
--background: 222 84% 5%       /* Dark */
--foreground: 210 40% 96%      /* Light */
--border: 217 33% 17%
--muted: 217 33% 17%
```

### Gradient Effects
- g-gradient-hero - Primary to purple gradient
- g-gradient-glow - Cyan radial glow
- glow-border - Animated border glow
- Shimmer animations for data visualization

### Key Animation Classes
- nimate-float - Floating motion (6s)
- nimate-glow-pulse - Opacity pulsing (2s)
- nimate-shimmer - Shimmer effect (2s)
- scan-line - Scanning line for data visualization

## Getting Started

### Prerequisites
- **Node.js** 18+ (with npm or bun)
- **Bun** (optional, for faster package management and scripts)
- **VCF format genomics file** for testing
- **Algorand Wallet** (optional, for blockchain features)
  - TestNet wallet from [Algorand Testnet Dispenser](https://testnet-api.algonode.cloud/faucet)
  - Or use Pera Wallet for mobile testing

### Installation & Setup

#### Step 1: Clone and Install
```bash
# Clone repository
git clone <YOUR_GIT_URL>
cd gene-harmony

# Install dependencies (choose one)
npm install
# OR for faster installation using Bun:
bun install
```

#### Step 2: Configure Environment
Create a `.env` file in the project root:

```env
# API Configuration
VITE_API_URL=http://localhost:8081
VITE_AUTH_TOKEN=optional_jwt_token

# Blockchain Configuration
VITE_ALGORAND_NETWORK=testnet
VITE_ALGORAND_APP_ID=755779679

# Feature Flags
VITE_ENABLE_BLOCKCHAIN=true
VITE_DEBUG_MODE=false
```

#### Step 3: Start Development Server
```bash
# Using npm
npm run dev

# OR using bun
bun run dev
```

Application runs at `http://localhost:8080`
Backend API expected at `http://localhost:8081`

### Environment Variables Reference

All available environment variables:

```env
# Frontend API Configuration
VITE_API_URL=http://localhost:8081              # Backend URL
VITE_AUTH_TOKEN=optional_jwt_token             # JWT for authentication

# Algorand Blockchain Settings
VITE_ALGORAND_NETWORK=testnet                  # Network: testnet, mainnet
VITE_ALGORAND_APP_ID=755779679                 # Smart contract app ID
VITE_ALGORAND_INDEXER=https://testnet-algorand.api.purestake.io/idx2  # Indexer URL

# Feature Toggles
VITE_ENABLE_BLOCKCHAIN=true                    # Enable blockchain storage
VITE_DEBUG_MODE=false                          # Enable debug logging
VITE_MOCK_DATA=false                           # Use mock results for testing
```

### Build & Deployment

```bash
# Production build
npm run build
# or
bun run build

# Preview production build
npm run preview

# Docker deployment
docker build -t pgx-insight .
docker run -p 5173:5173 pgx-insight
```

## Testing

### Unit & Component Tests
```bash
# Run all tests
npm run test
# OR with Bun
bun run test

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage
```

### Manual Testing Checklist
- [ ] VCF file upload with valid file
- [ ] VCF file validation (reject invalid formats)
- [ ] Drug selection and multi-select
- [ ] Wallet address input validation
- [ ] Analysis request and response handling
- [ ] Results display and expansion
- [ ] JSON export functionality
- [ ] Blockchain submission (with valid wallet)
- [ ] Mobile responsive layout
- [ ] 3D DNA helix animation
- [ ] Error messages and recovery
- [ ] Toast notifications

### Testing with Algorand TestNet
```bash
# 1. Get TestNet Algos
# Visit: https://testnet-api.algonode.cloud/faucet

# 2. Configure testnet endpoint
VITE_ALGORAND_NETWORK=testnet
VITE_ALGORAND_APP_ID=755779679

# 3. Use Pera Wallet for TestNet
# - Download from perawallet.app
# - Select TestNet
# - Create or import wallet
# - Use dispenser for test Algos

# 4. Upload sample VCF and verify blockchain submission
```

## Usage Guide

### Complete Workflow: From VCF Upload to Blockchain Storage

#### Step 1: Prepare Your Genomic Data
- Obtain a **VCF (Variant Call Format) file** from genomic testing
- Supports both `.vcf` and `.txt` formats
- Maximum file size: **5MB**
- Expected fields: CHROM, POS, ID, REF, ALT, QUAL, FILTER, INFO, FORMAT, GENOTYPE

#### Step 2: Launch the Application
- Open [https://gene-harmony.onrender.com/](https://gene-harmony.onrender.com/) or local instance
- Review the hero section with 3D DNA visualization
- Browse supported pharmacogenes and medications

#### Step 3: Upload VCF File
1. Drag-and-drop your VCF file onto the upload area, OR
2. Click to browse and select your file
3. Real-time validation provides feedback on file integrity
4. Progress indicator shows upload status

#### Step 4: Select Medications
1. Click the **Drug Input** dropdown
2. Search or scroll through 200+ supported medications
3. Select single or multiple drugs for analysis
4. Appears as removable chips below the input

**Supported Drug Categories:**
- **Cardiovascular**: Warfarin, Simvastatin, Clopidogrel, Metoprolol
- **Psychiatric**: Sertraline, Fluoxetine, Paroxetine, Venlafaxine
- **Oncology**: Tamoxifen, Fluorouracil, Irinotecan
- **Pain Management**: Codeine, Tramadol, Oxycodone
- **Other**: Phenytoin, Methotrexate, Abacavir, and more

#### Step 5: Enter Algorand Wallet (Optional but Recommended)
1. Paste your Algorand wallet address in the "Wallet Address" field
2. For TestNet: Get a wallet from [Pera Wallet](https://perawallet.app/) or [Algorand TestNet Dispenser](https://testnet-api.algonode.cloud/faucet)
3. Enabling wallet triggers blockchain immutability for your results

#### Step 6: Run Analysis
1. Click **"Run PGx Analysis"** button
2. Application sends VCF + selected drugs to backend
3. Backend performs:
   - Variant annotation against pharmacogene databases
   - Phenotype prediction (Ultra-Rapid/Rapid/Normal/Intermediate/Poor metabolizer)
   - Risk assessment using CPIC guidelines
   - Blockchain payload generation (if wallet provided)
4. Results return within seconds

#### Step 7: Review Risk Assessment
Results display in three sections:

**Risk Summary Cards** (Top):
- 🟢 **Safe** Count - Drugs with standard dosing
- 🟡 **Adjust** Count - Drugs requiring modified therapy
- 🔴 **Avoid** Count - High-risk drugs to avoid

**Detailed Drug-Gene Cards**:
- Drug name and primary gene(s)
- User's diplotype and phenotype (e.g., CYP2D6 *4/*4 = Poor Metabolizer)
- Risk level with color coding
- CPIC evidence level (A/B/C)
- Clinical recommendation
- Expandable guidance section

**Clinical Recommendations**:
- Dose adjustments (e.g., "Reduce dose 25-50%")
- Alternative medications
- Monitoring requirements
- Rationale based on metabolism pathway

#### Step 8: Export & Share Results

**JSON Export**:
1. Click **"Export Results"** button
2. Downloads analysis as `pgx-results.json`
3. Compatible with EHR systems and clinical records
4. Includes blockchain transaction details if applicable

**Copy to Clipboard**:
1. Click **"Copy Results"** button
2. Formatted text copies to clipboard
3. Can paste into emails, notes, or clinical systems

#### Step 9: Blockchain Verification (If Wallet Provided)
- Results automatically submitted to Algorand TestNet
- Transaction ID provided in results
- Verify on [Testnet Explorer](https://testnet-api.algonode.cloud/v2/applications/755779679)
- Creates immutable proof of analysis
- Stores:
  - VCF file hash (SHA-256)
  - Analysis report hash
  - Timestamp
  - Patient wallet (anonymized)
  - CPIC guideline version

### Example Scenario: Warfarin Analysis

**Input:**
- VCF File: patient_genome.vcf
- Drug: Warfarin
- Wallet: ALGORAND_WALLET_ADDRESS

**Processing:**
- Backend detects: CYP2C9 *1/*3 + VKORC1 variants
- Predicts: Intermediate metabolizer for CYP2C9
- Risk assessment: ADJUST (moderate dosing required)

**Output:**
```
Drug: WARFARIN
Primary Gene: CYP2C9
Diplotype: *1/*3
Phenotype: Intermediate Metabolizer
Risk Level: Adjust
Recommendation: Reduce dose by 25-50%, monitor INR closely
Evidence: CPIC Level A
```

**Blockchain Record:**
- Immutable entry on Algorand TestNet (App: 755779679)
- Transaction verifiable on [explorer](https://testnet-api.algonode.cloud/v2/applications/755779679)
- Timestamp: [Exact analysis time]
- Patient ID: [Wallet address]

### Tips for Best Results
- **File Quality**: Use VCF files from certified labs (Invitae, Tempus, Color Genomics)
- **Medication List**: Include all current medications for comprehensive analysis
- **Wallet Backup**: Keep Algorand wallet recovery seed in secure location
- **Clinical Review**: Always discuss results with your healthcare provider
- **Blockchain Verification**: Check explorer to confirm immutable storage
- **Mobile Usage**: Use Pera Wallet on iOS/Android for mobile blockchain integration

## Mock Data Examples

The application includes realistic CPIC-based mock results:

- **CODEINE** (CYP2D6 *4/*4)  Danger: Avoid (poor metabolizer  no conversion to morphine)
- **WARFARIN** (CYP2C9/*1/*3 + VKORC1)  Warn: Reduce dose 25-50% (slow clearance)
- **SIMVASTATIN** (SLCO1B1 *5)  Warn: Max 20mg/day (myopathy risk)
- **TAMOXIFEN** (CYP2D6 *4/*4)  Danger: Avoid (reduced efficacy for breast cancer)
- **CLOPIDOGREL** (CYP2C19 *1/*1)  Safe: Standard therapy (normal metabolism)

## Database & Knowledge Sources

The platform integrates with:
- **CPIC** (Clinical Pharmacogenetics Implementation Consortium) - Level A-C guidelines
- **PharmGKB** - Curated pharmacogenomic data
- **FDA PGx Table** - Drug labeling information
- **DPWG Guidelines** - Dutch Pharmacogenetics Working Group recommendations

## Blockchain Integration - Technical Details

### Overview
With wallet address provided, analysis results are paired with blockchain payload for:
- **Immutable proof of analysis** - Permanent record on Algorand TestNet
- **Smart contract integration** - App ID: `755779679`
- **Data integrity** - VCF and report hashing (SHA-256)
- **Timestamp verification** - Exact analysis time recorded

### Algorand App Details
- **App ID**: 755779679 (TestNet)
- **Network**: Algorand TestNet
- **Verification**: [https://testnet-api.algonode.cloud/v2/applications/755779679](https://testnet-api.algonode.cloud/v2/applications/755779679)
- **Contract Type**: Stateful smart contract for data storage

### Blockchain Payload Structure
```json
{
  "patientId": "<wallet_address>",
  "drug": "WARFARIN",
  "primaryGene": "CYP2C9",
  "vcfHash": "<SHA-256_hash>",
  "reportHash": "<SHA-256_hash>",
  "phenotype": "Intermediate Metabolizer",
  "riskLevel": "Moderate",
  "guidelineVersion": "1.0.0",
  "timestamp": 1708412400,
  "appId": 755779679
}
```

### Mobile Blockchain Integration (Innovation)
**Breakthrough Achievement**: Successfully implemented Algorand blockchain operations in mobile applications through:
- Custom lightweight Algorand SDK wrapper for React Native
- Optimized transaction signing for mobile devices
- Adaptive network selection (TestNet/MainNet)
- Cached state to reduce API calls
- Offline transaction queuing with automatic retry
- Biometric wallet security integration

This solves the previously documented Algorand mobile limitation by enabling full blockchain capability without requiring traditional desktop connections.

## File Validation

VCF files accepted with constraints:
- **Formats**: .vcf or .txt
- **Maximum Size**: 5MB
- **Expected Fields**: CHROM, POS, ID, REF, ALT, QUAL, FILTER, INFO, FORMAT, GENOTYPE

## Error Handling

- Invalid file format  Immediate feedback with error message
- Missing parameters  Button disabled with helpful text
- API failures  Graceful error display with retry option
- Network errors  Toast notification with details

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management for modals
- Color contrast compliance (WCAG AA)
- Screen reader friendly

## Performance Optimizations

- Code splitting via React lazy loading
- Memoized animations with GSAP
- Optimized Three.js rendering (dpr settings)
- CSS animations for better performance
- Efficient state management with React Query
- Debounced scroll handlers

## Security & Privacy

### Data Protection
- **No persistent storage** of VCF files on servers (processed and discarded)
- **No patient identification** in blockchain records (wallet-anonymized)
- **Encrypted transmission** via HTTPS/TLS
- **Optional blockchain** - user controls immutability choice
- **HIPAA-compatible** workflow (integrable with healthcare systems)

### Blockchain Privacy
- Patient wallet address is pseudonymous (not personally identifiable)
- VCF data never uploaded to blockchain (only SHA-256 hash)
- Analysis report never uploaded to blockchain (only SHA-256 hash)
- Immutability proves analysis was performed, not the raw data

## Disclaimer

⚠️ **For Research and Educational Use Only**

This application is not a substitute for clinical pharmacogenomic testing. Results should be discussed with healthcare providers. Not intended for clinical decision-making without professional interpretation.

**Blockchain Use Disclaimer**: Blockchain records provide proof of analysis but should not be used as legal medical records. Always maintain official records through licensed healthcare providers.

**TestNet-Only**: Current deployment uses Algorand TestNet. MainNet deployment available with proper regulatory approval.

## Related Resources

- [CPIC Guidelines](https://cpicpgx.org)
- [PharmGKB Database](https://pharmgkb.org)
- [FDA Pharmacogenomics](https://www.fda.gov/drugs/science-and-research-drugs/pharmacogenomics)
- [VCF Format Specification](https://samtools.github.io/hts-specs/VCFv4.2.pdf)
- [Algorand Developer Docs](https://developer.algorand.org)

## License & Attribution

 2025 - PGxInsight  
Built with React, TypeScript, Tailwind CSS, and Three.js

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| "VCF file rejected" | Ensure file is valid VCF format with required fields: CHROM, POS, REF, ALT |
| "Backend connection failed" | Start backend at http://localhost:8081 or configure VITE_API_URL |
| "Wallet address invalid" | Use format: 58-character Algorand address (base32 encoded) |
| "Blockchain submission failed" | Check wallet has minimum balance (0.1 ALGO), using TestNet Dispenser |
| "3D animation not rendering" | Verify WebGL support in browser, try Chrome/Firefox latest |
| "CORS errors" | See [CORS_FIX_GUIDE.md](CORS_FIX_GUIDE.md) for backend configuration |

### Logs & Debugging
```bash
# Enable debug mode
VITE_DEBUG_MODE=true npm run dev

# Browser console
# Open DevTools (F12) → Console tab
# Check for error messages and API responses

# Check backend logs
# Spring Boot logs should show VCF processing details
```

## Support & Documentation

**Quick Reference**:
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Development environment setup
- [VCF_INTEGRATION.md](VCF_INTEGRATION.md) - VCF file format details
- [CORS_FIX_GUIDE.md](CORS_FIX_GUIDE.md) - CORS configuration for backend
- [API_REFERENCE.js](API_REFERENCE.js) - API endpoint documentation

**External Resources**:
- [CPIC Guidelines](https://cpicpgx.org) - Clinical recommendations
- [PharmGKB Database](https://pharmgkb.org) - Gene-drug interactions
- [Algorand Documentation](https://developer.algorand.org) - Blockchain details
- [VCF Format Spec](https://samtools.github.io/hts-specs/VCFv4.2.pdf) - File format

---

**Project Support**: For issues, feature requests, or contributions, please open an issue on the repository.

**Live Demo**: [https://gene-harmony.onrender.com/](https://gene-harmony.onrender.com/)

**Team Members**
- Aryan Sharma (Blockchain Developer)
- Kavyansh Singh (Full Stack Developer)
