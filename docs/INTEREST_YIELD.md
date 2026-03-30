# Nestera Interest & Yield Mechanism

## Overview

Nestera provides **two reward layers**:
1. **Interest (Yield)**: Deterministic on-chain accrual per product (no external dependencies).
2. **Rewards Points**: Gamified points for activity → Claimable tokens (anti-farming protected).

**No External Yield Generation**: Pure math-based (rates.rs). Optional strategy routing (`strategy/`) for external DeFi. Backend snapshots APY/history.

## 1. Interest Calculation (Yield)

**Rates**: Admin/gov-set in bps (500=5%). Stored `FlexiRate`, `LockRate(duration_days)`, etc.

### Flexi Save
```
interest = (balance * rate_bps * duration_secs) / (10000 * 365 * 24 * 3600)
```
- Annualized simple interest.
- Continuous (call anytime).

**Pseudocode** (`rates.rs`):
```rust
pub fn calculate_flexi_interest(balance: i128, rate: i128, duration_seconds: u64) -> i128 {
    let numerator = balance * rate * (duration_seconds as i128);
    let denominator = 10000i128 * 31536000;  // secs/year
    numerator / denominator
}
```

### Lock Save
```
yield = (principal * rate_bps) / 10000
```
- Flat at maturity (duration-tiered rate).

**Pseudocode**:
```rust
pub fn calculate_lock_interest(amount: i128, rate: i128) -> i128 {
    (amount * rate) / 10000
}
```

**Backend**: `InterestHistory` (daily calc per subscription: principal, rate, earned). `ProductApySnapshot` for UI.

## 2. Rewards Points System

**Config** (`RewardsConfig`):
- `points_per_token`: 10 (base multiplier).
- `streak_bonus_bps`: 2000 (20% after 3 deposits).
- `long_lock_bonus_bps`, `goal_completion_bonus`: 500 fixed.
- Anti-farming: `min_deposit`, cooldown_secs, `max_daily_points`.

### Award Logic (`award_deposit_points`)
1. Check enabled/min_deposit/cooldown/daily_cap.
2. Update streak (7d window, reset >7d).
3. Base: `points = amount * points_per_token`.
4. Streak bonus (≥3): `bonus = base * streak_bonus_bps / 10000`.
5. Cap to daily remaining.
6. `total_points += points`. Events: `PointsAwarded`, `BonusAwarded`.

**Streak**:
```
if elapsed <= 7d: streak +=1 else: streak=1
Bonus if streak >=3
```

**Bonuses**:
- Long lock (>180d): `base * long_lock_bonus_bps / 10000`.
- Goal complete: Fixed 500.

**Storage**: `UserRewards` (total_points, streak, daily_earned, unclaimed_tokens).

### Claim (`claim_rewards`)
- Transfer `unclaimed_tokens` from contract (zero before xfer).
- Or `convert_points_to_tokens(points, tokens_per_point)` → Add to unclaimed.

**Pseudocode**:
```rust
fn claim_rewards(env, user, contract_addr) -> i128 {
    let rewards = get_user_rewards(user);
    if rewards.unclaimed_tokens == 0 { Err(Insufficient) }
    let amt = rewards.unclaimed_tokens;
    rewards.unclaimed_tokens = 0;
    token.transfer(contract_addr, user, amt);
    Ok(amt)
}
```

**Anti-Farming**:
- Min deposit, action cooldown, daily points cap.
- Streak window (7d), max multiplier.

## 3. Distribution Logic

- **Interest**: Accrues on-chain, realized at withdraw (`final_amount = principal + interest`).
- **Points**: Auto-awarded on deposit/lock/goal. Claim anytime (`claim_rewards`).
- **Events**: `PointsAwarded(user, points)`, `BonusAwarded(user, bonus, reason)`, `RewardsClaimed`.
- **Treasury**: Fees from deposit/withdraw/harvest → Ops/rewards pool.
- **Staking** (separate): `reward_per_share` model (time-proportional).

**External Strategies** (Optional, `strategy/`):
- `strategy_deposit`, `strategy_withdraw`, `strategy_harvest` → Yield to `StrategyYield`, fee split (performance_fee to treasury, rest users).

## Formulas Summary

| Mechanism | Formula | Trigger |
|-----------|---------|---------|
| Flexi Interest | `(bal * rate * secs) / (10000 * year_secs)` | Anytime |
| Lock Yield | `(principal * rate) / 10000` | Maturity withdraw |
| Base Points | `amount * points_per_token` | Deposit |
| Streak Bonus | `base * bps / 10000` (streak≥3) | Deposit |
| Claim | Direct token xfer | User call |

**Backend Logging**: Daily `InterestHistory` per subscription. APY snapshots for charts.

*See [SAVINGS_PRODUCTS.md](./SAVINGS_PRODUCTS.md). Updated: $(date).*

