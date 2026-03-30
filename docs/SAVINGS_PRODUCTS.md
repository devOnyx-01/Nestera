# Nestera Savings Products Documentation

## Overview

Nestera is a decentralized savings protocol on Stellar Soroban smart contracts. It offers **non-custodial** savings products using USDC, with all logic enforced on-chain. Users maintain full control while benefiting from transparent interest accrual, protocol fees to treasury, and governance upgradability.

**Core Products (3 Main Types):**
- **Flexible Savings (Flexi)**: Instant access, lowest yield.
- **Locked Savings (Lock)**: Fixed-term, higher yield, early withdraw penalty-free but only after maturity.
- **Group Savings**: Collaborative pools for shared goals.

Interest rates are configurable via admin/governance (`rates.rs`), stored in basis points (500 = 5%). Fees (deposit/withdraw/performance) go to treasury. Backend indexes via `savings_products` table (TVL, risk levels, subscriptions).

All products extend TTL on interaction, have reentrancy guards, and pause functionality.

## 1. Flexible Savings (Flexi)

**Description**: Anytime deposit/withdraw with protocol fees. Ideal for emergency funds or short-term parking. Lowest yield due to high liquidity.

**Key Mechanics** (`contracts/src/flexi.rs`):
- **Deposit**: `flexi_deposit(user, amount)` → Net after fee → `DataKey::FlexiBalance(user)`.
- **Withdraw**: `flexi_withdraw(user, amount)` → Check balance → Deduct fee.
- **View**: `get_flexi_balance(user)` → Returns balance.
- **Rate**: `get_flexi_rate()` (admin-set, default ~5%).
- **Fees**: Deposit/Withdraw bps to treasury.
- **Interest**: Accrues continuously via `calculate_flexi_interest(balance, rate, duration_seconds)` (simple interest annualized).
- **Storage**: Separate `FlexiBalance` from total.

**Use Cases**: Daily liquidity needs, testing protocol.

## 2. Locked Savings (Lock)

**Description**: Commit funds for fixed duration (seconds from now). Higher yield. Withdraw only after `maturity_time`. No early penalty (pure time-lock).

**Key Mechanics** (`contracts/src/lock.rs`):
- **Create**: `create_lock_save(user, amount, duration_secs)` → ID, `maturity_time = start + duration`, 5% default rate.
- **Withdraw**: `withdraw_lock_save(user, id)` → Only if `current_time >= maturity_time` & not withdrawn. Yield: `calculate_lock_interest(amount, rate)`.
- **Views**: `get_lock_save(id)` → `LockSaveView` (plan_id, balance, locked_until, etc.); `get_user_ongoing_lock_saves(user)`, `get_user_matured_lock_saves(user)`.
- **Rate**: Tiered `get_lock_rate(duration_days)` (duration-specific APY).
- **Storage**: `DataKey::LockSave(id)`, `UserLockSaves(user)` list.

**Use Cases**: Medium-term savings (e.g., 30-365 days), bonus points for long locks (>threshold secs).

## 3. Group Savings

**Description**: Multi-user pools for collective goals (e.g., community fund). Public/private, fixed/flex contributions, target_amount. Break early (refund).

**Key Mechanics** (`contracts/src/group.rs`):
- **Create**: `create_group_save(creator, title, desc, category, target, contrib_type[0=fixed/1=flex/2=%], contrib_amt, public, start/end_time)` → ID.
- **Join** (public only): `join_group_save(user, group_id)` → Add to members.
- **Contribute**: `contribute_to_group_save(user, id, amount)` → Only members, update `current_amount`.
- **Break/Leave**: `break_group_save(user, id)` → Refund contrib, remove if !completed.
- **Views**: `get_group_save(id)`, `get_member_contribution(id, user)`, `get_group_members(id)`, `get_user_groups(user)`.
- **Completion**: Auto `is_completed=true` when `current_amount >= target_amount`.
- **Rate**: `get_group_rate()`.

**Use Cases**: Church funds, family vacations, DAOs.

*(Goal Savings struct exists but incomplete implementation; off-chain `savings_goals` tracks metadata like 'Buy a Car' linked to subscriptions.)*

## Comparison Table

| Feature              | Flexible (Flexi)                  | Locked (Lock)                     | Group Savings                     |
|----------------------|-----------------------------------|-----------------------------------|-----------------------------------|
| **Liquidity**       | Instant access                    | Locked until maturity (e.g., 30d+) | Flexible until completed/break   |
| **Yield (APY)**     | Lowest (~3-5%, daily compound)   | Higher (tiered 5-10% by duration) | Medium (~5%, shared pool)        |
| **Min Commitment**  | None                              | Fixed duration                    | Per-contrib (min via rules)      |
| **Risk Level**      | LOW (backend enum)                | MEDIUM (time-lock)                | MEDIUM (social/group dynamics)   |
| **Fees**            | Deposit/Withdraw to treasury      | Same + long-lock bonus            | Same + completion events         |
| **Storage**         | `FlexiBalance(user)`              | `LockSave(id)` lists              | `GroupSave(id)` + members/contrib|
| **Multi-User**      | No                                | No                                | Yes (public/private)             |
| **Best For**        | Emergency/liquidity               | Predictable medium-term           | Community/shared goals           |
| **TVL Tracking**    | Aggregated in backend             | Per-lock                          | Per-group                        |

**Tradeoffs**:
- **Flexi**: Max liquidity, min yield.
- **Lock**: Yield vs illiquidity (plan duration).
- **Group**: Social coordination risk vs shared motivation/rewards.

## Real User Scenarios

1. **Sarah (Freelancer, Nigeria)**: Deposits $500 USDC to **Flexi** monthly. Withdraws $200 instantly for bills. Earns ~4.5% APY. Backend tracks via `user-subscription`, sends low-balance alerts.

2. **Ahmed (Teacher, Kenya)**: Locks $1,200 for 90 days in **Lock**. Maturity yields $1,260 (5% APY). `ongoing_lock_saves` view shows progress. Completes → Bonus points.

3. **Village Co-op (Uganda, 20 farmers)**: Creates **Group** 'Tractor Fund' ($5k target, public, fixed $50 contrib). Farmers join/contribute. Hits target → Distribute for purchase. Creator tracks `current_amount/target_amount`.

4. **Mixed**: User subscribes to Flexi (daily), Locks quarterly, joins family Group. Backend `savings_products` versions products (risk/TVL), goals like 'School Fees' link subscriptions.

## Backend Integration

- **Entities**: `SavingsProduct` (id, name, tvlAmount, riskLevel[LOW/MED/HIGH], maxSubscriptions), `UserSubscription` (userId ↔ productId), `SavingsGoal` (metadata), APY snapshots.
- **Migrations**: Capacity/waitlist, versioning, experiments (A/B rates).
- **Views**: RPC throttled, health checks.

**Deployment**: Stellar Testnet (`CONTRACT_ID`). Frontend: NextJS dashboard/savings/. Backend indexes events.

**Extending**: Add Goal.rs, yield strategies.

*Generated from codebase analysis. Last Updated: $(date).*

