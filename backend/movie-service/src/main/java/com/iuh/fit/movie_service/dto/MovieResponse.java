package com.iuh.fit.movie_service.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MovieResponse {
    private Long id;
    private String title;
    private String description;
    private Integer duration;
    private String posterUrl;
    private Long categoryId;
    private String categoryName;
}
