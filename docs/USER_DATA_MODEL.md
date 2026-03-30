# Nestera User State & Data Model

## Core Structure

**Primary Entry**: `DataKey::User(Address)` → `User { total_balance: i128, savings_count: u32 }`
- Aggregates all user holdings/activity.

## Savings Records Mapping

**User → SavingsPlans**: `DataKey::SavingsPlan(addr, plan_id: u64)` → `SavingsPlan`
```
SavingsPlan {
  plan_id: u64,
  plan_type: PlanType,  // Flexi | Lock(u64) | Goal(Symbol,i128,u32) | Group(u64,bool,u32,i128)
  balance: i128,
  start_time: u64,
  last_deposit/withdraw: u64,
  interest_rate: u32,  // bps
  is_completed/withdrawn: bool
}
```

**Discovery (Lists)**: Vec<u64> plan_ids per type
```
UserLockSaves(addr)     → Vec<u64>  // lock ids
UserGroupSaves(addr)    → Vec<u64>
UserGoalSaves(addr)     → Vec<u64>
UserAutoSaves(addr)     → Vec<u64>
```

**Load Pattern** (Pseudocode):
```rust
fn get_user_plans(env: &Env, user: Address) -> Vec<SavingsPlan> {
  let mut plans = vec![];
  let lock_ids = env.storage().get(&UserLockSaves(user.clone())).unwrap_or(vec![]);
  for id in lock_ids {
    if let Some(plan) = env.storage().get(&SavingsPlan(user.clone(), id)) {
      plans.push(plan);
    }
  }
  // Repeat for group/goal...
  plans
}
```

## Per-Type Details

```
Flexi:
├── FlexiBalance(addr) → i128  // Instant view

Lock (id from UserLockSaves):
├── LockSave(id) → {id, owner, amount, rate, start_time, maturity_time, withdrawn}

Group (id):
├── GroupSave(id) → {id, creator, title/desc/category(String), target/current_amount(i128),
│                    contrib_type(u32)/amt(i128), public(bool), member_count(u32), start/end_time, completed}
├── GroupMembers(id) → Vec<Address>
└── GroupMemberContribution(id, addr) → i128

Rewards (separate module):
└── UserLedger(addr) → UserRewards {total_points/u128, streak/u32, lifetime_deposited/i128,
                                   daily_earned/u128, unclaimed_tokens/i128, ...}
```

## Views & Indexing

**Optimized Queries** (views.rs):
```
get_user_ongoing_lock_saves(addr) → Vec<LockSaveView>  // !withdrawn
get_user_matured_lock_saves(addr) → Vec<LockSaveView>  // matured & !withdrawn
get_flexi_balance(addr) → i128
get_user_rewards(addr) → UserRewards
```

**Strategy**:
- **O(1) Direct**: Balances/plans by key.
- **O(N) Lists**: N~small (user plans <100) → Load ids → Parallel fetch plans.
- **No DB Index**: Soroban key-value. Backend indexes events (`savings_products`, `user-subscription`).
- **TTL**: Auto-extend on access (ttl.rs).

**Backend Complement**:
```
UserSubscription: userId(FK) ↔ productId(FK SavingsProduct)
InterestHistory: subscriptionId, userId, productId, earned...
```

## Extension Guide

1. **New PlanType**: Add enum variant → New list key `UserNewTypeSaves(addr): Vec<u64>`.
2. **New Data**: `DataKey::UserXxx(addr) → Struct`.
3. **View**: Add `get_user_new_plans(addr) → Vec<View>`.
4. **Off-Chain**: Extend entities/migrations.

**Diagram**:
```
User(addr)
├── total_balance, savings_count
├── UserLockSaves → [id1,id2] → LockSave(id1), LockSave(id2)
├── UserGroupSaves → [id3] → GroupSave(id3) + Members/Contribs
├── FlexiBalance
└── Rewards.UserLedger → points/streak
```

*Easy to extend: Add keys/lists. Refs: [SAVINGS_PRODUCTS.md](./SAVINGS_PRODUCTS.md). Updated: $(date).*

