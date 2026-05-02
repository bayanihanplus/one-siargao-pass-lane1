import {
  AccommodationActionDto,
  AccommodationSupportPathDto,
} from '../accommodation-ui-common.dto';

export class TravelerAccommodationRequestUiDto {
  stayTitle!: string;
  dateRangePickerConfig!: {
    minDate?: string;
    maxDate?: string;
    disabledDates?: string[];
  };
  paxSelectorConfig!: {
    minPax: number;
    maxPax?: number;
    label: string;
  };
  roomTypeSelectorConfig?: {
    required: boolean;
    label: string;
  };
  requestMode!: 'REQUEST_TO_CONFIRM' | 'PAY_TO_HOLD' | 'INQUIRY_ONLY' | 'INSTANT_BOOK_READY';
  paymentModeExplanation!: string;
  confirmationExpectation!: string;
  operatorResponseExpectation!: string;
  supportPath!: AccommodationSupportPathDto;
  nextStepCopy!: string;
  submitAction!: AccommodationActionDto;
  disabledReason?: string;
}
