import { Injectable } from '@nestjs/common';

const OFFICIAL_SAFETY_BROADCAST_ALLOWED_ROLES = [
  'SUPER_ADMIN',
  'LGU_ADMIN',
];

const SIARGAO_MUNICIPALITIES = [
  { code: 'BURGOS', name: 'Burgos' },
  { code: 'DAPA', name: 'Dapa' },
  { code: 'DEL_CARMEN', name: 'Del Carmen' },
  { code: 'GENERAL_LUNA', name: 'General Luna' },
  { code: 'PILAR', name: 'Pilar' },
  { code: 'SAN_BENITO', name: 'San Benito' },
  { code: 'SAN_ISIDRO', name: 'San Isidro' },
  { code: 'SANTA_MONICA', name: 'Santa Monica' },
  { code: 'SOCORRO', name: 'Socorro' },
];

const BROADCAST_CATEGORIES = [
  'WEATHER_ADVISORY',
  'SEA_TRAVEL_ADVISORY',
  'PORT_OR_FERRY_ADVISORY',
  'ROAD_ACCESS_ADVISORY',
  'PUBLIC_SAFETY_ALERT',
  'HEALTH_ADVISORY',
  'EVENT_CROWD_ADVISORY',
  'ENVIRONMENTAL_ADVISORY',
  'MUNICIPAL_NOTICE',
  'GENERAL_ANNOUNCEMENT',
];

const BROADCAST_SEVERITIES = [
  'INFO',
  'ADVISORY',
  'WARNING',
  'URGENT',
  'CRITICAL',
];

const BROADCAST_STATES = [
  'DRAFT',
  'PENDING_APPROVAL',
  'APPROVED',
  'SCHEDULED',
  'SENT',
  'PARTIALLY_SENT',
  'FAILED',
  'CANCELLED',
  'EXPIRED',
];

const TARGET_SCOPES = [
  'ALL_SIARGAO_TRAVELERS',
  'CURRENTLY_IN_SIARGAO',
  'BY_MUNICIPALITY',
  'BY_ROUTE_OR_PORT',
  'BY_TRIP_DATE_RANGE',
  'BY_TRAIL_OR_ACTIVITY_AREA',
  'BY_OPERATOR_MANIFEST_GROUP_LATER',
];

const DELIVERY_CHANNELS = [
  { code: 'IN_APP_NOTIFICATION', phase: 'PHASE_1' },
  { code: 'TRAVELER_ALERT_INBOX', phase: 'PHASE_1' },
  { code: 'PUSH_NOTIFICATION', phase: 'LATER' },
  { code: 'SMS_BLAST', phase: 'LATER' },
  { code: 'EMAIL', phase: 'OPTIONAL_LATER' },
  { code: 'ADMIN_LGU_BROADCAST_LOG', phase: 'PHASE_1_MANDATORY' },
];

function getRole(user: any) {
  return user?.primaryRole || user?.role || 'UNKNOWN';
}

function isAllowedOfficialSafetyBroadcastRole(user: any) {
  return OFFICIAL_SAFETY_BROADCAST_ALLOWED_ROLES.includes(getRole(user));
}

@Injectable()
export class OfficialSafetyBroadcastsService {
  private buildAccess(user: any) {
    const role = getRole(user);

    return {
      allowed: isAllowedOfficialSafetyBroadcastRole(user),
      role,
      allowedRoles: OFFICIAL_SAFETY_BROADCAST_ALLOWED_ROLES,
      doctrine:
        'Official Safety Broadcast console is restricted to Super Admin and LGU Admin only.',
    };
  }

  getDoctrine(user: any) {
    const access = this.buildAccess(user);

    return {
      ok: true,
      source: 'OFFICIAL_SAFETY_BROADCAST_DOCTRINE_READ_ONLY',
      access,
      productName: 'Official Safety Broadcast',
      productBoundary:
        'Official Safety Broadcast is an authority-led public safety communication system. It is not emergency dispatch, rescue command, or responder assignment.',
      phaseChannels: DELIVERY_CHANNELS,
      categories: BROADCAST_CATEGORIES,
      severities: BROADCAST_SEVERITIES,
      states: BROADCAST_STATES,
      targetScopes: TARGET_SCOPES,
      municipalities: SIARGAO_MUNICIPALITIES,
      accessControl: {
        consoleAllowedOnlyFor: OFFICIAL_SAFETY_BROADCAST_ALLOWED_ROLES,
        forbiddenFor: [
          'TRAVELER',
          'OPERATOR',
          'OTA',
          'STANDARD_STAFF',
          'UNAUTHENTICATED_USER',
        ],
      },
      governanceRules: [
        'No SMS blast until SMS provider integration exists.',
        'No push blast until device token and push provider integration exists.',
        'No traveler-visible broadcast unless state is APPROVED, SCHEDULED, SENT, or otherwise published by approved authority.',
        'Draft, pending approval, failed internal attempts, and cancelled broadcasts must remain internal.',
        'CRITICAL severity requires stronger approval and audit trace.',
        'Every broadcast must preserve creator, approver, content, target scope, channels, and delivery attempt logs.',
      ],
      kuyaTalaRules: [
        'Kuya Tala™ may explain official broadcasts visible to the traveler.',
        'Kuya Tala™ must not create, approve, send, cancel, or override broadcasts.',
        'Kuya Tala™ must not claim SMS, push, or email was sent unless delivery logs prove it.',
        'Kuya Tala™ must not override LGU instructions or downplay urgent advisories.',
      ],
    };
  }

  getMunicipalities(user: any) {
    return {
      ok: true,
      source: 'OFFICIAL_SAFETY_BROADCAST_MUNICIPALITY_REGISTRY',
      access: this.buildAccess(user),
      municipalities: SIARGAO_MUNICIPALITIES,
    };
  }

  getSpineAudit(user: any) {
    return {
      ok: true,
      source: 'OFFICIAL_SAFETY_BROADCAST_SPINE_AUDIT',
      access: this.buildAccess(user),
      currentBuildState: 'DOCTRINE_AND_BACKEND_SPINE_PLACEHOLDER_ONLY',
      backendSpineRequiredLater: [
        'OfficialSafetyBroadcast',
        'OfficialSafetyBroadcastRevision',
        'OfficialSafetyBroadcastApproval',
        'OfficialSafetyBroadcastTarget',
        'OfficialSafetyBroadcastDeliveryAttempt',
        'TravelerAlertInboxItem',
        'BroadcastRecipientSnapshot',
        'BroadcastAuditLog',
      ],
      futureDeliveryAdapters: [
        'InAppNotificationAdapter',
        'PushNotificationAdapter',
        'SmsBroadcastAdapter',
        'EmailBroadcastAdapter',
      ],
      minimumAuditFields: [
        'created_by',
        'created_at',
        'approved_by',
        'approved_at',
        'sent_by',
        'sent_at',
        'cancelled_by',
        'cancelled_at',
        'broadcast_title',
        'broadcast_body',
        'severity',
        'category',
        'target_scope',
        'target_municipalities',
        'channels_requested',
        'channels_attempted',
        'recipient_count_estimate',
        'delivery_attempt_count',
        'failure_count',
        'expiry_time',
        'revision_history',
      ],
      hardStopBeforeLiveSend: [
        'No live SMS without provider keys, consent policy, opt-out/critical-alert policy, and delivery logs.',
        'No push without device token registry and delivery receipt logging.',
        'No LGU broadcast console without role-gated create/approve/send controls.',
        'No traveler alert inbox without published-broadcast filtering.',
      ],
    };
  }
}
