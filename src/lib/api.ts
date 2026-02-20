/**
 * API utility for making requests to the PGx backend
 * 
 * The backend should be running on http://localhost:8081 by default
 * or at https://spring-boot-algorand.onrender.com for production
 * 
 * You can configure this via the VITE_API_URL environment variable
 * 
 * IMPORTANT: Backend must have CORS headers configured to accept requests
 * from the frontend origin. See SETUP_GUIDE.md for backend configuration.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

export interface VcfUploadRequest {
  file: File;
  wallet: string;
  drug: string;
}

export interface BlockchainPayload {
  patientId: string;
  drug: string;
  primaryGene: string;
  vcfHash: string;
  reportHash: string;
  guidelineVersion: string;
  timestamp: number;
  appId: number;
}

export interface VcfUploadResponse {
  gene: string;
  diplotype: string;
  phenotype: string;
  riskLevel: string;
  recommendation: string;
  blockchainPayload: BlockchainPayload;
}

/**
 * Upload VCF file and get PGx analysis results
 * @param file VCF genomics file
 * @param wallet Algorand wallet address
 * @param drug Drug name for analysis
 * @param authToken Optional JWT bearer token
 */
export async function uploadVcf(
  file: File,
  wallet: string,
  drug: string,
  authToken?: string
): Promise<VcfUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('wallet', wallet);
  formData.append('drug', drug);

  const headers: HeadersInit = {};
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}/vcf/upload`, {
    method: 'POST',
    body: formData,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
    const errorMessage = errorData.message || `Error: ${response.status}`;
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Get VCF analysis metadata from database
 * @param wallet Algorand wallet address
 * @param drug Drug name
 * @param authToken Optional JWT bearer token
 */
export async function getVcfMetadata(
  wallet: string,
  drug: string,
  authToken?: string
): Promise<VcfUploadResponse> {
  const headers: HeadersInit = {};
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const params = new URLSearchParams({ patientId: wallet, drug });
  const response = await fetch(`${API_BASE_URL}/vcf/metadata?${params}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
    const errorMessage = errorData.message || `Error: ${response.status}`;
    throw new Error(errorMessage);
  }

  return response.json();
}
