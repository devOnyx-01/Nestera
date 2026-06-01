//! Event definitions and helpers for the rewards module.
use soroban_sdk::{Address, Env, Symbol};
use crate::events::ProtocolEvent;

/// Emits a PointsAwarded event.
pub fn emit_points_awarded(env: &Env, user: Address, amount: u128) {
    env.events().publish(
        (),
        ProtocolEvent::PointsAwarded(user, amount),
    );
}

/// Emits a BonusAwarded event.
pub fn emit_bonus_awarded(env: &Env, user: Address, amount: u128, bonus_type: Symbol) {
    env.events().publish(
        (),
        ProtocolEvent::BonusAwarded(user, amount, bonus_type),
    );
}

/// Emits a PointsRedeemed event.
pub fn emit_points_redeemed(env: &Env, user: Address, amount: u128) {
    env.events().publish(
        (),
        ProtocolEvent::PointsRedeemed(user, amount),
    );
}

/// Emits a RewardsClaimed event.
pub fn emit_rewards_claimed(env: &Env, user: Address, amount: i128) {
    env.events().publish(
        (),
        ProtocolEvent::RewardsClaimed(user, amount),
    );
}

/// Emits a StreakUpdated event.
pub fn emit_streak_updated(env: &Env, user: Address, streak: u32) {
    env.events().publish(
        (),
        ProtocolEvent::StreakUpdated(user, streak),
    );
}
