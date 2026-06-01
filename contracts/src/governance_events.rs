use crate::events::ProtocolEvent;
use soroban_sdk::{Address, Env};

pub fn emit_proposal_created(env: &Env, proposal_id: u64, creator: Address, _description: soroban_sdk::String) {
    env.events().publish(
        (),
        ProtocolEvent::GovCreated(proposal_id, creator),
    );
}

pub fn emit_vote_cast(env: &Env, proposal_id: u64, voter: Address, vote_type: u32, weight: u128) {
    env.events().publish(
        (),
        ProtocolEvent::GovVoted(proposal_id, voter, vote_type, weight as i128),
    );
}

pub fn emit_proposal_queued(env: &Env, proposal_id: u64, queued_at: u64) {
    env.events().publish(
        (),
        ProtocolEvent::GovQueued(proposal_id, queued_at),
    );
}

pub fn emit_proposal_executed(env: &Env, proposal_id: u64, executed_at: u64) {
    env.events().publish(
        (),
        ProtocolEvent::GovExecuted(proposal_id, executed_at),
    );
}

pub fn emit_proposal_canceled(env: &Env, proposal_id: u64, canceled_at: u64) {
    env.events().publish(
        (),
        ProtocolEvent::GovCanceled(proposal_id, canceled_at),
    );
}
