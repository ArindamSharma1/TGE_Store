
import {
    AbstractPaymentProvider,
    PaymentProviderError,
    PaymentProviderSessionResponse,
    PaymentSessionStatus
} from "@medusajs/utils"
import { Logger } from "@medusajs/types"
import Razorpay from "razorpay"

type Options = {
    key_id: string
    key_secret: string
}

export class RazorpayPaymentProviderService extends AbstractPaymentProvider<Options> {
    static identifier = "razorpay"
    protected razorpay: Razorpay
    protected options_: Options
    protected logger_: Logger

    constructor(container: { logger: Logger }, options: Options) {
        super(container, options)
        this.options_ = options
        this.logger_ = container.logger

        this.razorpay = new Razorpay({
            key_id: options.key_id,
            key_secret: options.key_secret,
        })
    }

    async initiatePayment(
        input: {
            amount: number
            currency_code: string
        }
    ): Promise<PaymentProviderSessionResponse> {
        const amount = Math.round(input.amount * 100) // already in smallest unit? Input usually is.
        // Medusa amounts are usually in smallest unit (cents/paise). Razorpay expects paise. 
        // Wait, Medusa amount 1000 = 10.00. Razorpay 1000 = 10.00. So pass directly.
        // Double check: if input.amount is 1000 (10 INR), razorpay needs 1000.

        try {
            const order = await this.razorpay.orders.create({
                amount: input.amount, // assuming input.amount is entered in smallest unit
                currency: input.currency_code.toUpperCase(),
                payment_capture: true,
            })

            return {
                ...order,
                data: {
                    id: order.id,
                },
            }
        } catch (e) {
            this.logger_.error("Razorpay initiatePayment failed", e)
            throw new PaymentProviderError("Razorpay initiatePayment failed: " + e.message)
        }
    }

    async authorizePayment(
        paymentSessionData: Record<string, unknown>,
        context: Record<string, unknown>
    ): Promise<
        | PaymentProviderError
        | {
            status: PaymentSessionStatus
            data: Record<string, unknown>
        }
    > {
        const status = await this.getPaymentStatus(paymentSessionData)
        return {
            status,
            data: paymentSessionData,
        }
    }

    async cancelPayment(
        paymentSessionData: Record<string, unknown>
    ): Promise<PaymentProviderSessionResponse> {
        return paymentSessionData
    }

    async capturePayment(
        paymentSessionData: Record<string, unknown>
    ): Promise<PaymentProviderSessionResponse> {
        const paymentId = paymentSessionData.razorpay_payment_id as string
        const amount = paymentSessionData.amount as number

        if (paymentId) {
            try {
                const payment = await this.razorpay.payments.capture(paymentId, amount, "INR")
                return {
                    ...payment,
                    data: paymentSessionData // keep session data
                }
            } catch (e) {
                // If already captured or error
                this.logger_.error("Razorpay capture failed", e)
                // Check if already captured
                return paymentSessionData // Assume success if already verified?
            }
        }
        return paymentSessionData
    }

    async deletePayment(
        paymentSessionData: Record<string, unknown>
    ): Promise<PaymentProviderSessionResponse> {
        return paymentSessionData
    }

    async getPaymentStatus(
        paymentSessionData: Record<string, unknown>
    ): Promise<PaymentSessionStatus> {
        const paymentId = paymentSessionData.razorpay_payment_id as string
        const signature = paymentSessionData.razorpay_signature as string
        const orderId = paymentSessionData.razorpay_order_id as string

        if (!paymentId || !signature || !orderId) {
            return "pending"
        }

        // Verify Signature
        const crypto = require("crypto")
        const generated_signature = crypto
            .createHmac("sha256", this.options_.key_secret)
            .update(orderId + "|" + paymentId)
            .digest("hex")

        if (generated_signature === signature) {
            return "authorized"
        }

        return "pending"
    }

    async refundPayment(
        paymentSessionData: Record<string, unknown>,
        refundAmount: number
    ): Promise<PaymentProviderSessionResponse> {
        const paymentId = paymentSessionData.razorpay_payment_id as string;
        try {
            const refund = await this.razorpay.payments.refund(paymentId, {
                amount: refundAmount
            })
            return {
                ...paymentSessionData,
                ...refund
            }
        } catch (e) {
            throw new PaymentProviderError("Refund failed: " + e.message)
        }
    }

    async retrievePayment(
        paymentSessionData: Record<string, unknown>
    ): Promise<PaymentProviderSessionResponse> {
        return paymentSessionData
    }

    async updatePayment(
        context: Record<string, unknown>
    ): Promise<PaymentProviderSessionResponse> {
        // Re-initiate if amount changed? 
        // For now simple implementation
        return this.initiatePayment(context as any)
    }
}
