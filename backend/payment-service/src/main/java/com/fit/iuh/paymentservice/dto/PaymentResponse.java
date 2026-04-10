package com.fit.iuh.paymentservice.dto;

public class PaymentResponse {
    private String bookingId;
    private Boolean success;
    private String message;

    public PaymentResponse() {
    }

    public PaymentResponse(String bookingId, Boolean success, String message) {
        this.bookingId = bookingId;
        this.success = success;
        this.message = message;
    }

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
