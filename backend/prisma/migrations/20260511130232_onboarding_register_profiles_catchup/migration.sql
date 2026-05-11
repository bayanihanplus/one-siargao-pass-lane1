-- CreateEnum
CREATE TYPE "OspParticipantType" AS ENUM ('VISITOR_TOURIST', 'LOCAL_RESIDENT', 'LONG_TERM_RESIDENT', 'SIARGAO_WORKER', 'BUSINESS_OPERATOR', 'TRANSPORT_PROVIDER', 'EVENT_PARTICIPANT', 'DESTINATION_AUTHORITY_USER', 'LGU_GOVERNMENT_USER');

-- CreateEnum
CREATE TYPE "OspQrRegistrationPurpose" AS ENUM ('TRAVEL_TO_SIARGAO', 'TRIP_READINESS', 'OSP_PASS_OR_QR_ACCESS', 'ACCOMMODATION_CHECK_IN', 'RENTAL_OR_SERVICE_ACCESS', 'TOUR_OR_ACTIVITY_CHECK_IN', 'PASSPORT_TRAILS_PARTICIPATION', 'PAYMENT_OR_RECEIPT_REFERENCE', 'FAMILY_OR_VISITOR_SPONSOR', 'PAY_FOR_FAMILY_OR_VISITOR', 'EVENT_ENTRY', 'WEDDING_OR_PRIVATE_EVENT', 'LOCAL_ACTIVITY_PARTICIPATION', 'BUSINESS_OR_OPERATOR_REFERENCE', 'WORK_OR_STAFF_ACCESS', 'RESTAURANT_OR_MERCHANT_PARTICIPATION', 'HEALTH_WELLNESS_SERVICE_ACCESS', 'EMERGENCY_ADVISORY_ACCESS', 'COMMUNITY_PROGRAM', 'COMMUNITY_EVENT', 'BARANGAY_EVENT', 'DESTINATION_EVENT', 'LGU_EVENT', 'PUBLIC_SERVICE_ACCESS', 'GOVERNMENT_OR_LGU_ACCESS', 'OTHER');

-- CreateEnum
CREATE TYPE "OspQrSubjectRelation" AS ENUM ('SELF', 'FAMILY_MEMBER', 'SENIOR_COMPANION', 'CHILD_MINOR', 'ASSISTED_GUEST', 'GROUP_PARTICIPANT');

-- CreateEnum
CREATE TYPE "OspResidentType" AS ENUM ('SIARGAO_BORN_LOCAL', 'FILIPINO_RELOCATED_TO_SIARGAO', 'FOREIGN_LONG_TERM_RESIDENT', 'DIGITAL_NOMAD_BASED_IN_SIARGAO', 'WORKER_BASED_IN_SIARGAO', 'STUDENT', 'SEASONAL_RESIDENT', 'RETURNING_FAMILY_CONNECTION', 'OTHER');

-- CreateEnum
CREATE TYPE "OspTravelerType" AS ENUM ('DOMESTIC_TOURIST', 'FOREIGN_TOURIST', 'BALIKBAYAN_RETURNING_FILIPINO', 'LOCAL_RESIDENT', 'LONG_STAY_VISITOR', 'DIGITAL_NOMAD', 'BUSINESS_TRAVELER', 'EVENT_GUEST', 'FAMILY_VISITOR', 'OTHER');

-- CreateEnum
CREATE TYPE "OspVisitPurpose" AS ENUM ('LEISURE_VACATION', 'SURFING', 'ISLAND_HOPPING', 'NATURE_LAGOONS_BEACHES', 'FOOD_CULTURE', 'PASSPORT_TRAILS', 'EVENT_FESTIVAL', 'WEDDING', 'WORKATION_DIGITAL_NOMAD', 'BUSINESS', 'VISITING_FAMILY_FRIENDS', 'WELLNESS', 'COMMUNITY_ACTIVITY', 'OTHER');

-- CreateEnum
CREATE TYPE "OspTravelPartyType" AS ENUM ('SOLO', 'COUPLE', 'FAMILY_WITH_CHILDREN', 'FRIENDS_GROUP', 'CORPORATE_GROUP', 'SCHOOL_OR_ORG_GROUP', 'TOUR_GROUP', 'WEDDING_GROUP', 'EVENT_GROUP', 'OTHER');

-- CreateEnum
CREATE TYPE "OspPartySizeRange" AS ENUM ('ONE', 'TWO', 'THREE_TO_FIVE', 'SIX_TO_TEN', 'ELEVEN_TO_TWENTY', 'TWENTY_ONE_PLUS');

-- CreateEnum
CREATE TYPE "OspAgeBracket" AS ENUM ('UNDER_18', 'AGE_18_24', 'AGE_25_34', 'AGE_35_44', 'AGE_45_54', 'AGE_55_64', 'AGE_65_PLUS', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "OspSiargaoBase" AS ENUM ('GENERAL_LUNA', 'DAPA', 'DEL_CARMEN', 'SAN_ISIDRO', 'BURGOS', 'PILAR', 'SANTA_MONICA', 'SAN_BENITO', 'SOCORRO', 'NOT_SURE_YET', 'OTHER');

-- CreateEnum
CREATE TYPE "OspAccommodationType" AS ENUM ('HOTEL_RESORT', 'HOSTEL', 'HOMESTAY_GUESTHOUSE', 'VACATION_RENTAL', 'LONG_TERM_RENTAL', 'STAYING_WITH_FAMILY_OR_FRIENDS', 'STAFF_HOUSING', 'NOT_BOOKED_YET', 'PREFER_NOT_TO_SAY', 'OTHER');

-- CreateEnum
CREATE TYPE "OspEventType" AS ENUM ('TRAVELER_EVENT', 'TOURISM_EVENT', 'PASSPORT_TRAIL_EVENT', 'SURF_EVENT', 'SPORTS_EVENT', 'FESTIVAL', 'WEDDING', 'PRIVATE_EVENT', 'BUSINESS_EVENT', 'SCHOOL_OR_ORG_EVENT', 'COMMUNITY_EVENT', 'LOCAL_COMMUNITY_EVENT', 'BARANGAY_EVENT', 'DESTINATION_EVENT', 'LGU_EVENT', 'PUBLIC_SERVICE_EVENT', 'GOVERNMENT_EVENT', 'OTHER');

-- CreateEnum
CREATE TYPE "OspEventParticipantRole" AS ENUM ('GUEST', 'VISITOR_ATTENDEE', 'LOCAL_ATTENDEE', 'ORGANIZER', 'STAFF', 'VENDOR', 'SECURITY', 'MEDIA', 'PERFORMER', 'VIP', 'BUSINESS_REPRESENTATIVE', 'COMMUNITY_STAFF', 'BARANGAY_STAFF', 'DESTINATION_AUTHORITY_STAFF', 'LGU_STAFF', 'OTHER');

-- CreateEnum
CREATE TYPE "OspVenueType" AS ENUM ('ACCOMMODATION', 'MOTORBIKE_RENTAL', 'CAR_RENTAL', 'SURFBOARD_RENTAL', 'TOUR_OPERATOR', 'RESTAURANT', 'HEALTH_WELLNESS', 'EVENT_VENUE', 'TRANSPORT_PROVIDER', 'LGU_CHECKPOINT', 'OTHER');

-- CreateEnum
CREATE TYPE "OspKycCheckInPurpose" AS ENUM ('ACCOMMODATION_CHECK_IN', 'RENTAL_RELEASE', 'TOUR_CHECK_IN', 'EVENT_ENTRY', 'PAYMENT_CONFIRMATION', 'SERVICE_VERIFICATION', 'INCIDENT_SUPPORT', 'OFFICIAL_DESTINATION_CHECK', 'LGU_COMPLIANCE_CHECK');

-- CreateEnum
CREATE TYPE "OspDataSharingScope" AS ENUM ('BASIC_IDENTITY_ONLY', 'BASIC_IDENTITY_AND_TRIP', 'BASIC_IDENTITY_AND_CONTACT', 'BOOKING_AND_PAYMENT_REFERENCE', 'EMERGENCY_ONLY', 'FULL_KYC_WITH_CONSENT');

-- CreateEnum
CREATE TYPE "OspConsentType" AS ENUM ('PRIVACY_CONSENT', 'RULES_ACKNOWLEDGEMENT', 'DATA_USE_PURPOSE_ACKNOWLEDGEMENT', 'KYC_CHECK_IN_CONSENT', 'EVENT_PARTICIPATION_CONSENT');

-- CreateEnum
CREATE TYPE "OspConsentStatus" AS ENUM ('ACCEPTED', 'WITHDRAWN', 'EXPIRED');

-- CreateEnum
CREATE TYPE "OspParticipationStatus" AS ENUM ('PENDING', 'ACTIVE', 'APPROVED', 'REJECTED', 'SUSPENDED', 'CANCELLED', 'CHECKED_IN');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'SUPER_ADMIN';

-- CreateTable
CREATE TABLE "ParticipantProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "participantType" "OspParticipantType" NOT NULL,
    "qrRegistrationPurpose" "OspQrRegistrationPurpose" NOT NULL,
    "qrSubjectRelation" "OspQrSubjectRelation" NOT NULL DEFAULT 'SELF',
    "primarySiargaoBase" "OspSiargaoBase",
    "municipality" TEXT,
    "barangay" TEXT,
    "nationalityCode" TEXT,
    "countryOfResidence" TEXT,
    "ageBracket" "OspAgeBracket",
    "travelerType" "OspTravelerType",
    "accommodationType" "OspAccommodationType",
    "visitPurpose" "OspVisitPurpose",
    "travelPartyType" "OspTravelPartyType",
    "partySizeRange" "OspPartySizeRange",
    "arrivalDate" TIMESTAMP(3),
    "departureDate" TIMESTAMP(3),
    "accountContextStatus" "OspParticipationStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParticipantProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResidentProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "residentType" "OspResidentType" NOT NULL,
    "municipality" TEXT,
    "barangay" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResidentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "consentType" "OspConsentType" NOT NULL,
    "status" "OspConsentStatus" NOT NULL DEFAULT 'ACCEPTED',
    "version" TEXT NOT NULL DEFAULT 'v1',
    "source" TEXT NOT NULL DEFAULT 'ONBOARDING',
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "withdrawnAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RulesAcknowledgement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "acknowledgementKey" TEXT NOT NULL,
    "status" "OspConsentStatus" NOT NULL DEFAULT 'ACCEPTED',
    "version" TEXT NOT NULL DEFAULT 'v1',
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RulesAcknowledgement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OspEvent" (
    "id" TEXT NOT NULL,
    "eventType" "OspEventType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "municipality" TEXT,
    "barangay" TEXT,
    "venueName" TEXT,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "organizerName" TEXT,
    "organizerUserId" TEXT,
    "status" "OspParticipationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OspEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OspEventParticipation" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT,
    "guestFullName" TEXT,
    "participantRole" "OspEventParticipantRole" NOT NULL DEFAULT 'GUEST',
    "status" "OspParticipationStatus" NOT NULL DEFAULT 'PENDING',
    "qrCredentialId" TEXT,
    "checkedInAt" TIMESTAMP(3),
    "sponsorUserId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OspEventParticipation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KycCheckInEvent" (
    "id" TEXT NOT NULL,
    "subjectUserId" TEXT,
    "scannedQrToken" TEXT,
    "venueOperatorId" TEXT,
    "venueType" "OspVenueType" NOT NULL,
    "purpose" "OspKycCheckInPurpose" NOT NULL,
    "dataSharingScope" "OspDataSharingScope" NOT NULL DEFAULT 'BASIC_IDENTITY_ONLY',
    "verificationStatus" "OspParticipationStatus" NOT NULL DEFAULT 'PENDING',
    "consentAccepted" BOOLEAN NOT NULL DEFAULT false,
    "checkedInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkedByUserId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KycCheckInEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantProfile_userId_key" ON "ParticipantProfile"("userId");

-- CreateIndex
CREATE INDEX "ParticipantProfile_participantType_idx" ON "ParticipantProfile"("participantType");

-- CreateIndex
CREATE INDEX "ParticipantProfile_qrRegistrationPurpose_idx" ON "ParticipantProfile"("qrRegistrationPurpose");

-- CreateIndex
CREATE INDEX "ParticipantProfile_primarySiargaoBase_idx" ON "ParticipantProfile"("primarySiargaoBase");

-- CreateIndex
CREATE INDEX "ParticipantProfile_accountContextStatus_idx" ON "ParticipantProfile"("accountContextStatus");

-- CreateIndex
CREATE UNIQUE INDEX "ResidentProfile_userId_key" ON "ResidentProfile"("userId");

-- CreateIndex
CREATE INDEX "ResidentProfile_residentType_idx" ON "ResidentProfile"("residentType");

-- CreateIndex
CREATE INDEX "ResidentProfile_municipality_idx" ON "ResidentProfile"("municipality");

-- CreateIndex
CREATE INDEX "ConsentRecord_userId_consentType_idx" ON "ConsentRecord"("userId", "consentType");

-- CreateIndex
CREATE INDEX "ConsentRecord_status_idx" ON "ConsentRecord"("status");

-- CreateIndex
CREATE INDEX "RulesAcknowledgement_userId_acknowledgementKey_idx" ON "RulesAcknowledgement"("userId", "acknowledgementKey");

-- CreateIndex
CREATE INDEX "RulesAcknowledgement_status_idx" ON "RulesAcknowledgement"("status");

-- CreateIndex
CREATE INDEX "OspEvent_eventType_idx" ON "OspEvent"("eventType");

-- CreateIndex
CREATE INDEX "OspEvent_municipality_idx" ON "OspEvent"("municipality");

-- CreateIndex
CREATE INDEX "OspEvent_status_idx" ON "OspEvent"("status");

-- CreateIndex
CREATE INDEX "OspEvent_startsAt_idx" ON "OspEvent"("startsAt");

-- CreateIndex
CREATE INDEX "OspEventParticipation_eventId_idx" ON "OspEventParticipation"("eventId");

-- CreateIndex
CREATE INDEX "OspEventParticipation_userId_idx" ON "OspEventParticipation"("userId");

-- CreateIndex
CREATE INDEX "OspEventParticipation_participantRole_idx" ON "OspEventParticipation"("participantRole");

-- CreateIndex
CREATE INDEX "OspEventParticipation_status_idx" ON "OspEventParticipation"("status");

-- CreateIndex
CREATE INDEX "KycCheckInEvent_subjectUserId_idx" ON "KycCheckInEvent"("subjectUserId");

-- CreateIndex
CREATE INDEX "KycCheckInEvent_venueOperatorId_idx" ON "KycCheckInEvent"("venueOperatorId");

-- CreateIndex
CREATE INDEX "KycCheckInEvent_venueType_idx" ON "KycCheckInEvent"("venueType");

-- CreateIndex
CREATE INDEX "KycCheckInEvent_purpose_idx" ON "KycCheckInEvent"("purpose");

-- CreateIndex
CREATE INDEX "KycCheckInEvent_verificationStatus_idx" ON "KycCheckInEvent"("verificationStatus");

-- CreateIndex
CREATE INDEX "KycCheckInEvent_checkedInAt_idx" ON "KycCheckInEvent"("checkedInAt");

-- AddForeignKey
ALTER TABLE "ParticipantProfile" ADD CONSTRAINT "ParticipantProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResidentProfile" ADD CONSTRAINT "ResidentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentRecord" ADD CONSTRAINT "ConsentRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RulesAcknowledgement" ADD CONSTRAINT "RulesAcknowledgement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OspEventParticipation" ADD CONSTRAINT "OspEventParticipation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "OspEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OspEventParticipation" ADD CONSTRAINT "OspEventParticipation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KycCheckInEvent" ADD CONSTRAINT "KycCheckInEvent_subjectUserId_fkey" FOREIGN KEY ("subjectUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

