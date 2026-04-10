package com.iuh.fit.movie_service.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MovieRequest {
    private String title;
    private String description;
    private Integer duration;
    private String posterUrl;
    private Long categoryId;
}
