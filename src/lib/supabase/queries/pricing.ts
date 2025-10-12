import { type FeatureValue, type Plan } from '$lib/types/pricing';
import { type TypedSupabaseClient } from '$lib/supabase/supabaseClient';

export async function fetchPricingData(supabase: TypedSupabaseClient): Promise<{
  plans: Plan[];
}> {
  try {
    const { data: rawPlans, error: plansError } = await supabase
      .from('plans')
      .select(
        `
        id,
        name,
        display_name,
        description,
        price,
        yearly_price,
        billing_interval,
        lifetime_price,
        plan_features (
          feature_id,
          value,
          feature_definitions (
            name,
            description,
            feature_type
          )
        )
      `
      )
      .eq('is_active', true)
      .order('price', { ascending: true });

    if (plansError) throw plansError;

    console.log('Raw plans data:', rawPlans);
    console.log('Number of plans found:', rawPlans?.length || 0);

    // Transform the raw data into the desired format
    const transformedPlans: Plan[] = rawPlans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      displayName: plan.display_name,
      description: plan.description || '',
      price: plan.price || 0,
      yearlyPrice: plan.yearly_price || 0,
      lifetimePrice: plan.lifetime_price || 0,
      billingInterval: plan.billing_interval,
      features: (plan.plan_features || []).map((feature) => ({
        id: feature.feature_id || '',
        name: feature.feature_definitions?.name || '',
        description: feature.feature_definitions?.description || '',
        featureType: feature.feature_definitions?.feature_type || 'string',
        value: feature.value as FeatureValue,
      })),
    }));

    return {
      plans: transformedPlans,
    };
  } catch (error) {
    console.error('Error fetching pricing data:', error);
    throw error;
  }
}
