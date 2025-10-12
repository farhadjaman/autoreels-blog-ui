export interface FeatureValue {
    limit?: number;
    enabled?: boolean;
    duration?: string;
    quality?: string;
    level?: string;
    [key: string]: unknown;
  }
  
  export interface Feature {
    id: string;
    name: string;
    description: string;
    featureType: 'numeric' | 'boolean' | 'string' | 'object';
    value: FeatureValue;
  }
  
  export interface FeatureUsage {
    id: string;
    slug: string;
    limit: {
      value: unknown;
      type: string;
    };
    used: number;
    remaining: number | null;
  }
  
  export interface PaymentGateway {
    id: string;
    name: string;
    displayName: string;
    config: unknown;
    isActive: boolean;
  }
  
  export interface PaymentGatewayProduct {
    gatewayId: string;
    gatewayName: string;
    gatewayDisplayName: string;
    gatewayProductId: string;
    gatewayPriceId: string;
    gatewayYearlyPriceId: string;
    gatewayLifetimePriceId: string;
  }
  
  export const BillingOptions = {
    MONTHLY: 'monthly',
    YEARLY: 'yearly',
    LIFETIME: 'lifetime',
  } as const;
  
  export type BillingType = (typeof BillingOptions)[keyof typeof BillingOptions];
  
  export interface Plan {
    id: string;
    name: string;
    displayName: string;
    description: string;
    price: number;
    yearlyPrice: number;
    lifetimePrice: number;
    billingInterval: BillingType;
    features: Feature[];
  }
  
  export interface Subscription {
    id: string;
    planId: string;
    teamId: string;
    currentPeriodEnd: string;
    status: string;
  }
  
  export interface TeamUsageResponse {
    features: Record<string, FeatureUsage>;
    subscription: Subscription;
  }
  
  export interface FeatureDefinition {
    id: string;
    name: string;
  }
  
  export interface FeatureUsageLog {
    feature_id: string;
    usage_data: {
      usage_count: number;
    };
  }
  