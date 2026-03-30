# Nestera Early Withdrawal Policies

## Overview

Nestera handles early withdrawals via **product-specific rules**. Contracts emphasize **prevention** (blocks/time-locks), backend adds **penalties** for locked products.

**Funds Destination**: Fees/penalties → Protocol treasury (`FeeRecipient`).

**Key Distinction**:
- **Contracts**: On-chain logic (no penalty for Flexi/Lock early block; full refund Group).
- **Backend**: Off-chain requests → 5% penalty for FIXED/locked early.

## Per-Product Rules

### 1. Flexible (Flexi)
- **On-Chain**: No lock → Always allowed. Only `WithdrawalFeeBps` (~1-2%) deducted.
- **Backend**: No penalty (`SavingsProductType.FLEXIBLE`).
- **Calc**: None beyond fee.
- **Example**: Withdraw $100 → $98.50 net (2% fee).

### 2. Locked (Lock)
- **On-Chain** (`lock.rs`): `withdraw_lock_save` → `Err(SavingsError::TooEarly)` if pre-`maturity_time`.
  - Post-maturity: Full principal + yield, no penalty.
- **Backend** (`savings.service.ts`): For FIXED/locked:
  ```
  penalty = (amount * 500) / 10000  // 5% fixed bps
  net = amount - penalty
  ```
  - Skip if `endDate <= now` (matured).
- **Example**: $1,000 early from 90d lock → Penalty $50 → Net $950 to user ($50 treasury?).

**Pseudocode** (backend):
```typescript
const EARLY_WITHDRAWAL_PENALTY_BPS = 500;
if (product.type === 'FLEXIBLE' || isMatured) return 0;
return (amount * 500) / 10000;
```

### 3. Group Savings
- **On-Chain** (`group.rs`): `break_group_save` → **Full refund** of `get_member_contribution` if !`is_completed`.
  - Removes user, updates `current_amount -= contrib`.
  - No penalty (social incentive only).
- **Backend**: N/A (group via contract direct?).
- **Example**: Contrib $200 → Full $200 refund pre-target.

### 4. Goal (Partial)
- **On-Chain** (tests): `EarlyBreakFeeBps` (admin-set `set_early_break_fee_bps(bps)`).
  - Tests: 5% ($150 on $3k), 1.25% ($41.66→41 on $3,333), rounds down.
  - Fee to treasury.
- **Usage**: `test_goal_early_withdrawal_with_penalty` implies applied on break.
- **Example**: 5% bps → $500 early → $25 penalty → $475 net.

## All Scenarios Summary

| Product | On-Chain | Backend Penalty | Calc | Funds To | Example ($1000 early) |
|---------|----------|-----------------|------|----------|-----------------------|
| **Flexi** | Allowed (fee only) | 0% | N/A | Treasury (fee) | $1000 - 2% fee = $980 |
| **Lock** | BLOCKED pre-maturity | 5% | bps=500 | Treasury | BLOCK / $950 net |
| **Group** | Full refund | N/A | 0% | None | $1000 full |
| **Goal** | Fee applied | ? | `EarlyBreakFeeBps` | Treasury | $950 net (5%) |

**Notes**:
- Contracts prevent most earlies (no penalty calc needed).
- Backend layer for UX (requests with penalty preview).
- Notifications: 'Early penalty of X applied'.
- Tests confirm rounding down.

**Extending**: Use `EarlyBreakFeeBps` in more products.

*Links: [SAVINGS_PRODUCTS.md](./SAVINGS_PRODUCTS.md), [INTEREST_YIELD.md](./INTEREST_YIELD.md). Updated: $(date).*

