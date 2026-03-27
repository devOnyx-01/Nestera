//! Native protocol token metadata and initialization for Nestera (#374).

use crate::errors::SavingsError;
use crate::storage_types::DataKey;
use soroban_sdk::{contracttype, symbol_short, Address, Env, String};

/// Metadata for the Nestera native protocol token.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct TokenMetadata {
    pub name: String,
    pub symbol: String,
    pub decimals: u32,
    pub total_supply: i128,
    pub treasury: Address,
}

/// Initializes the protocol token metadata and assigns total supply to the treasury.
///
/// Can only be called once. Subsequent calls return `ConfigAlreadyInitialized`.
///
/// # Arguments
/// * `env`          - Contract environment
/// * `treasury`     - Address that receives the initial total supply
/// * `total_supply` - Total token supply (in smallest unit, e.g. stroops)
pub fn initialize_token(
    env: &Env,
    treasury: Address,
    total_supply: i128,
) -> Result<(), SavingsError> {
    if env.storage().instance().has(&DataKey::TokenMetadata) {
        return Err(SavingsError::ConfigAlreadyInitialized);
    }

    if total_supply <= 0 {
        return Err(SavingsError::InvalidAmount);
    }

    let metadata = TokenMetadata {
        name: String::from_str(env, "Nestera"),
        symbol: String::from_str(env, "NST"),
        decimals: 7,
        total_supply,
        treasury: treasury.clone(),
    };

    env.storage()
        .instance()
        .set(&DataKey::TokenMetadata, &metadata);

    env.events().publish(
        (symbol_short!("token"), symbol_short!("init"), treasury),
        total_supply,
    );

    Ok(())
}

/// Returns the stored token metadata.
pub fn get_token_metadata(env: &Env) -> Result<TokenMetadata, SavingsError> {
    env.storage()
        .instance()
        .get(&DataKey::TokenMetadata)
        .ok_or(SavingsError::InternalError)
}
