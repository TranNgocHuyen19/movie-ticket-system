package com.fit.iuh.userservice.common;

import java.util.Map;

public record ApiError(
        int status,
        String code,
        String message,
        String path,
        Map<String, String> fieldErrors
) {
}
