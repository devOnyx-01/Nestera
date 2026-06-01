use crate::events::ProtocolEvent;
use soroban_sdk::{Address, Env};

/// Emits a StakeCreated event.
pub fn emit_stake_created(env: &Env, user: Address, amount: i128, total_staked: i128) {
    env.events().publish(
        (),
        ProtocolEvent::Stake(user, amount, total_staked),
    );
}

/// Emits a StakeWithdrawn event.
pub fn emit_stake_withdrawn(env: &Env, user: Address, amount: i128, total_staked: i128) {
    env.events().publish(
        (),
        ProtocolEvent::Unstake(user, amount, total_staked),
    );
}

/// Emits a StakingRewardsClaimed event.
pub fn emit_staking_rewards_claimed(env: &Env, user: Address, amount: i128) {
    env.events().publish(
        (),
        ProtocolEvent::StakeRewards(user, amount),
    );
}
