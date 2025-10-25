export class PaymentInitiationDTO {
  returnUrl?: string;
  cancellationUrl?: string;

  constructor(data) {
    this.returnUrl = data.returnUrl;
    this.cancellationUrl = data.cancellationUrl;
  }
}

export class PaymentStatusDTO {
  bookingId: string;
  bookingReference: string;
  status: string;
  paymentStatus: string;
  paymentReference?: string;
  totalAmount: number;
  currency: string;
  bookingDate: Date;
  confirmationDate?: Date;

  constructor(data) {
    this.bookingId = data.bookingId;
    this.bookingReference = data.bookingReference;
    this.status = data.status;
    this.paymentStatus = data.paymentStatus;
    this.paymentReference = data.paymentReference;
    this.totalAmount = data.totalAmount;
    this.currency = data.currency;
    this.bookingDate = data.bookingDate;
    this.confirmationDate = data.confirmationDate;
  }
}

export class PaymentCancellationDTO {
  reason?: string;

  constructor(data) {
    this.reason = data.reason;
  }
}

export class HubtelCallbackDTO {
  ResponseCode: string;
  ResponseText: string;
  Data: {
    CheckoutId: string;
    ClientReference: string;
    Amount: number;
    Status: string;
    TransactionId?: string;
    Description?: string;
  };

  constructor(data) {
    this.ResponseCode = data.ResponseCode;
    this.ResponseText = data.ResponseText;
    this.Data = data.Data;
  }
}

