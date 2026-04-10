package com.iuh.fit.movie_service.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CategoryRequest {
    private String name;
    private String description;
}
