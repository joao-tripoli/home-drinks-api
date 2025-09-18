export interface HealthResponseDTO {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
}

export interface ApiInfoResponseDTO {
  message: string;
  version: string;
  status: string;
  environment: string;
}
