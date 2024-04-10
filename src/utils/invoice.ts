import lightningPayReq from "bolt11";

import { INVOICE_PREFIX } from "@/config/default";

export const validateInvoice = (invoice: string) => {
  if (!invoice) {
    return {
      success: false,
      message: "Invoice is required",
    };
  }
  try {
    const decodedInvoice = lightningPayReq.decode(invoice);
    if (!decodedInvoice) {
      return {
        success: false,
        message: "Invalid invoice",
      };
    }
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
      if (!decodedInvoice.prefix?.includes(INVOICE_PREFIX.mainnet)) {
        return {
          success: false,
          message: "Invalid invoice. Please use a mainnet invoice",
        };
      }
    }
    if (decodedInvoice.satoshis === null) {
      return {
        success: false,
        message: "Invoice amount to send must be greater than 0",
      };
    }
    return {
      success: true,
      message: "Invoice is valid",
    };
  } catch (error) {
    console.error("validateInvoice error", error);
    return {
      success: false,
      message: "Invalid invoice",
    };
  }
};
