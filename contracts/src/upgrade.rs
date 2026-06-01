use crate::storage_types::DataKey;
use soroban_sdk::{Address, Env};

pub fn upgrade(env: &Env, new_wasm_hash: soroban_sdk::BytesN<32>) -> Result<(), crate::errors::SavingsError> {
    let admin: Address = env.storage().instance().get(&DataKey::Admin).ok_or(crate::errors::SavingsError::Unauthorized)?;
    admin.require_auth();

    // Check for time-lock if implemented
    if let Some(scheduled_hash) = env.storage().instance().get::<DataKey, soroban_sdk::BytesN<32>>(&DataKey::UpgradeScheduled) {
        if scheduled_hash != new_wasm_hash {
             return Err(crate::errors::SavingsError::Unauthorized);
        }
        
        let scheduled_at: u64 = env.storage().instance().get(&DataKey::UpgradeScheduledAt).unwrap_or(0);
        let config = crate::config::get_config(env)?;
        if env.ledger().timestamp() < scheduled_at + config.upgrade_delay {
            return Err(crate::errors::SavingsError::TooEarly);
        }
    } else {
        // If no time-lock, we might want to enforce one or allow admin if it's not enabled
    }

    env.deployer().update_current_contract_wasm(new_wasm_hash);
    
    // Clear scheduled upgrade
    env.storage().instance().remove(&DataKey::UpgradeScheduled);
    env.storage().instance().remove(&DataKey::UpgradeScheduledAt);
    
    Ok(())
}

pub fn schedule_upgrade(env: &Env, admin: Address, new_wasm_hash: soroban_sdk::BytesN<32>) -> Result<(), crate::errors::SavingsError> {
    admin.require_auth();
    let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).ok_or(crate::errors::SavingsError::Unauthorized)?;
    if admin != stored_admin {
        return Err(crate::errors::SavingsError::Unauthorized);
    }

    env.storage().instance().set(&DataKey::UpgradeScheduled, &new_wasm_hash);
    env.storage().instance().set(&DataKey::UpgradeScheduledAt, &env.ledger().timestamp());
    
    Ok(())
}
