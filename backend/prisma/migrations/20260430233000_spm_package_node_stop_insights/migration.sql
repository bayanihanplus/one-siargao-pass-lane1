-- Add curated stop insight fields for SPM DIY Trail Builder.
-- These fields make "Why this stop?" backend-supported at the package-node level.

ALTER TABLE "spm_trail_package_nodes"
ADD COLUMN "supportRequirement" TEXT,
ADD COLUMN "routeRoleExplanation" TEXT,
ADD COLUMN "fulfillmentExplanation" TEXT,
ADD COLUMN "paymentImpactExplanation" TEXT,
ADD COLUMN "confirmationRequirement" TEXT;

CREATE INDEX "spm_trail_package_nodes_supportRequirement_idx"
ON "spm_trail_package_nodes"("supportRequirement");
