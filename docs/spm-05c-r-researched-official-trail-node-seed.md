# SPM-05C-R — Researched Official Trail Node Seed

## Purpose

This lane implements the researched node seed based on:

- SPM-R1 — Siargao Geography + Tour Sites Research Doctrine
- SPM-R2 — Node Classification Matrix

This lane replaces the previous shallow SPM-05C attempt.

## Scope Included

This lane seeds only nodes classified as:

- SEED_NOW_APPROVED
- SEED_NOW_PENDING_REVIEW
- CHECKPOINT_ONLY
- PACKAGE_ONLY

## Scope Excluded

This lane does not seed public/active nodes for:

- CANDIDATE_RESEARCH_REQUIRED
- REJECT_OR_DEFER

The following confirmed refinement subjects remain research candidates unless separately validated later:

- Giwan Surf Area
- Union Surf Area
- Secret Spot Surf Area
- Little Hawaii
- Hawaiian Hills
- Secret Mountain Viewpoint
- Socorro / Bucas Grande Cluster
- Hagukan Cave
- Magkukuob Cave
- Tiktikan Lake / Cove
- Del Carmen Mangrove Corridor
- Approved Restaurant Node
- Local Market / Food Culture Node
- Kakanin / Island Delicacies Node

## Hard Rules

- No frontend UI changes.
- No checkout.
- No Operator Dashboard price input UI.
- No OTA / partner API.
- No new trail families.
- No separate QR table.
- No random restaurant stamp nodes.
- No casual DIY classification for Socorro / Bucas Grande.
- No public activation for surf candidates without surf validation.
- No public activation for Little Hawaii / Hawaiian Hills without exact location and access validation.

## Expected Follow-Up

After this seed runs, rerun the SPM-05B package catalog seed to relink packages to newly available nodes.

The next lane after commit should be:

SPM-05D — Relink + Catalog Read Contract Audit
