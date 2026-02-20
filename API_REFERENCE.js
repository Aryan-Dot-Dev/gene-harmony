#!/usr/bin/env node

/**
 * Gene Harmony API Quick Reference
 * 
 * This file demonstrates how to use the VCF Upload API
 * from both the frontend and backend perspective
 */

// ============================================================
// FRONTEND: How to Use the API
// ============================================================

import { uploadVcf, getVcfMetadata } from '@/lib/api';

// Example 1: Upload VCF File and Get Analysis
async function analyzeVcf() {
  const vcfFile = document.getElementById('vcf-input').files[0];
  const walletAddress = 'AAAABBBBCCCCDDDDEEEEFFFFGGGGHHHH';
  const drug = 'WARFARIN';
  
  try {
    const result = await uploadVcf(vcfFile, walletAddress, drug);
    
    console.log('Analysis Results:');
    console.log(`Gene: ${result.gene}`);
    console.log(`Diplotype: ${result.diplotype}`);
    console.log(`Phenotype: ${result.phenotype}`);
    console.log(`Risk Level: ${result.riskLevel}`);
    console.log(`Recommendation: ${result.recommendation}`);
    
    // Use blockchain payload for smart contract call
    console.log('Blockchain Payload:', result.blockchainPayload);
  } catch (error) {
    console.error('Analysis failed:', error.message);
  }
}

// Example 2: Get Previous Analysis Results
async function retrievePreviousResults() {
  const walletAddress = 'AAAABBBBCCCCDDDDEEEEFFFFGGGGHHHH';
  const drug = 'WARFARIN';
  
  try {
    const result = await getVcfMetadata(walletAddress, drug);
    console.log('Previous analysis found:', result);
  } catch (error) {
    console.error('No previous results found:', error.message);
  }
}

// Example 3: Upload with JWT Authentication
async function analyzeVcfWithAuth() {
  const vcfFile = document.getElementById('vcf-input').files[0];
  const walletAddress = 'AAAABBBBCCCCDDDDEEEEFFFFGGGGHHHH';
  const drug = 'CLOPIDOGREL';
  const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
  
  try {
    const result = await uploadVcf(vcfFile, walletAddress, drug, jwtToken);
    console.log('Authenticated analysis results:', result);
  } catch (error) {
    console.error('Authentication failed:', error.message);
  }
}

// ============================================================
// BACKEND: API Endpoint Specification
// ============================================================

/**
 * POST /vcf/upload
 * 
 * Accepts a VCF genomics file and performs PGx analysis
 * 
 * Request Format:
 *   Content-Type: multipart/form-data
 *   
 *   Parameters:
 *     - file (File): VCF genomics file (.vcf or .txt)
 *     - wallet (String): Algorand wallet address
 *     - drug (String): Drug name for analysis (e.g., WARFARIN, CODEINE)
 *   
 *   Headers (Optional):
 *     - Authorization: Bearer <JWT_TOKEN>
 * 
 * Response Format (200 OK):
 *   {
 *     "gene": "CYP2C9",
 *     "diplotype": "*1/*2",
 *     "phenotype": "Intermediate Metabolizer",
 *     "riskLevel": "Moderate",
 *     "recommendation": "Reduce dose by 25-50% and monitor INR closely",
 *     "blockchainPayload": {
 *       "patientId": "<wallet_address>",
 *       "drug": "WARFARIN",
 *       "primaryGene": "CYP2C9",
 *       "vcfHash": "<SHA-256 hash of VCF content>",
 *       "reportHash": "<SHA-256 hash of report>",
 *       "guidelineVersion": "1.0.0",
 *       "timestamp": 1708412400,
 *       "appId": 755779679
 *     }
 *   }
 * 
 * Error Responses:
 *   400 Bad Request:
 *     - Invalid VCF file format
 *     - Missing required parameters
 *     - File exceeds size limit
 *   
 *   401 Unauthorized:
 *     - Invalid or expired JWT token
 *   
 *   422 Unprocessable Entity:
 *     - Missing wallet address
 *     - Missing drug name
 *     - Invalid file type
 *   
 *   500 Internal Server Error:
 *     - VCF parsing error
 *     - Database error
 *     - Unexpected server error
 */

// ============================================================
// TESTING WITH CURL
// ============================================================

/**
 * Test API with cURL:
 * 
 * Basic request (no auth):
 *   curl -X POST http://localhost:8081/vcf/upload \
 *     -F "file=@sample.vcf" \
 *     -F "wallet=AAAABBBBCCCCDDDD" \
 *     -F "drug=WARFARIN"
 * 
 * With JWT authentication:
 *   curl -X POST http://localhost:8081/vcf/upload \
 *     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \
 *     -F "file=@sample.vcf" \
 *     -F "wallet=AAAABBBBCCCCDDDD" \
 *     -F "drug=WARFARIN"
 * 
 * With verbose output:
 *   curl -v -X POST http://localhost:8081/vcf/upload \
 *     -F "file=@sample.vcf" \
 *     -F "wallet=AAAABBBBCCCCDDDD" \
 *     -F "drug=WARFARIN"
 */

// ============================================================
// SUPPORTED DRUGS
// ============================================================

const SUPPORTED_DRUGS = [
  'CODEINE',
  'WARFARIN',
  'SIMVASTATIN',
  'CLOPIDOGREL',
  'TAMOXIFEN',
  'ABACAVIR',
  'ALLOPURINOL',
  'CARBAMAZEPINE',
  'FLUOROURACIL',
  'MERCAPTOPURINE',
  'AZATHIOPRINE',
  'TACROLIMUS',
  'IRINOTECAN',
  'CAPECITABINE',
  'SERTRALINE',
  'FLUOXETINE',
  'PAROXETINE',
  'AMITRIPTYLINE',
  'NORTRIPTYLINE',
  'METOPROLOL',
  'ATOMOXETINE',
  'TRAMADOL',
  'OXYCODONE',
  'ONDANSETRON',
  'HALOPERIDOL',
];

// ============================================================
// BACKEND JAVA EXAMPLE
// ============================================================

/**
 * Spring Boot Controller Example:
 * 
 * @RestController
 * @RequestMapping("/vcf")
 * public class VcfController {
 *   
 *   @PostMapping("/upload")
 *   public ResponseEntity<?> upload(
 *       @RequestParam("file") MultipartFile file,
 *       @RequestParam("wallet") String walletAddress,
 *       @RequestParam("drug") String drug,
 *       @RequestHeader(value = "Authorization", required = false) String authHeader
 *   ) {
 *     try {
 *       // Validate inputs
 *       if (file.isEmpty()) {
 *         return ResponseEntity.badRequest().body("File is empty");
 *       }
 *       if (!file.getOriginalFilename().endsWith(".vcf")) {
 *         return ResponseEntity.badRequest().body("Invalid file format");
 *       }
 *       if (walletAddress == null || walletAddress.isBlank()) {
 *         return ResponseEntity.status(422).body("Wallet address required");
 *       }
 *       if (drug == null || drug.isBlank()) {
 *         return ResponseEntity.status(422).body("Drug name required");
 *       }
 *       
 *       // Save temp file
 *       File tempFile = File.createTempFile("vcf-", ".vcf");
 *       file.transferTo(tempFile);
 *       
 *       // Parse VCF
 *       List<VariantDTO> variants = vcfParserService.parse(tempFile);
 *       
 *       // Run PGx pipeline
 *       PgxReport report = pgxPipelineService.runPipeline(
 *           walletAddress, variants, drug
 *       );
 *       
 *       // Create blockchain payload
 *       BlockchainPayload payload = new BlockchainPayload(
 *           walletAddress,
 *           report.getDrug(),
 *           report.getGene(),
 *           report.getVcfHash(),
 *           report.getReportHash(),
 *           "1.0.0",
 *           System.currentTimeMillis() / 1000,
 *           755779679
 *       );
 *       
 *       // Return response
 *       return ResponseEntity.ok(new PgxUploadResponse(
 *           report.getGene(),
 *           report.getDiplotype(),
 *           report.getPhenotype(),
 *           report.getRiskLevel(),
 *           report.getRecommendation(),
 *           payload
 *       ));
 *       
 *     } catch (Exception e) {
 *       return ResponseEntity.status(500)
 *           .body("VCF processing failed: " + e.getMessage());
 *     }
 *   }
 * }
 */

// ============================================================
// ENVIRONMENT VARIABLES
// ============================================================

/**
 * Frontend (.env):
 * 
 * # API Base URL
 * VITE_API_URL=http://localhost:8081
 * 
 * # Optional JWT Token (static)
 * VITE_AUTH_TOKEN=your_jwt_token
 * 
 * # Feature Flags
 * VITE_ENABLE_BLOCKCHAIN=true
 * VITE_DEBUG_MODE=false
 * 
 * Backend (application.properties):
 * 
 * # Multipart Configuration
 * spring.servlet.multipart.max-file-size=10MB
 * spring.servlet.multipart.max-request-size=10MB
 * 
 * # CORS Configuration
 * server.cors.allowed-origins=http://localhost:8080
 * 
 * # Database (example)
 * spring.datasource.url=jdbc:mysql://localhost:3306/pgx_db
 * spring.datasource.username=root
 * spring.datasource.password=password
 */

// ============================================================
// BLOCKCHAIN INTEGRATION
// ============================================================

/**
 * Algorand Smart Contract Integration
 * 
 * The blockchainPayload can be used to invoke Algorand smart contract:
 * 
 * {
 *   "patientId": "AAAABBBBCCCCDDDD...",
 *   "drug": "WARFARIN",
 *   "primaryGene": "CYP2C9",
 *   "vcfHash": "SHA256 hash of VCF file",
 *   "reportHash": "SHA256 hash of generated report",
 *   "guidelineVersion": "1.0.0",
 *   "timestamp": 1708412400,
 *   "appId": 755779679
 * }
 * 
 * Use app ID 755779679 to invoke your smart contract
 * Pass vcfHash and reportHash as proof of immutability
 */

export { uploadVcf, getVcfMetadata };
