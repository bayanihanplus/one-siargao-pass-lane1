export class AccommodationVoucherEmailPreviewDto {
  voucherId!: string;
  audience!: 'TRAVELER' | 'OPERATOR' | 'ADMIN' | 'SOURCE_PARTNER';
  emailSubject!: string;
  recipientLabel!: string;
  paymentWording!: string;
  qrReadinessWording!: string;
  includesPdfLink!: boolean;
  templateKey!: string;
}
