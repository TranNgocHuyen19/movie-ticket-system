# booking-service

Booking service cho luong dat ve theo Event-Driven Architecture.

## Pham vi service

- Quan ly booking (tao booking, xem danh sach booking)
- Khong xu ly payment truc tiep
- Publish event `BOOKING_CREATED` qua Redis Pub/Sub
- Goi `movie-service` va `user-service` qua FeignClient (khong tao entity/repo/service movie-user trong booking-service)

## API

- `POST /bookings`
- `GET /bookings`

### Tao booking

Request:

```json
{
  "movieId": 1,
  "userId": 1,
  "seats": ["A1", "A2"]
}
```

Sau khi tao booking thanh cong, service publish event:

```json
{
  "eventType": "BOOKING_CREATED",
  "bookingId": "string-id",
  "movieId": 1,
  "movieTitle": "Inception",
  "userId": 1,
  "seats": ["A1", "A2"],
  "createdAt": "2026-04-10T10:00:00"
}
```

## Seed data movie

Khi startup, service se goi sang `movie-service` de tao sample movies voi anh random:

- `https://picsum.photos/300/200?random=101`
- `https://picsum.photos/300/200?random=102`
- `https://picsum.photos/300/200?random=103`

Neu `movie-service` chua chay, seed se bo qua va service van khoi dong binh thuong.

## Chay local

Can co Redis dang chay (`localhost:6379`).

```powershell
cd t:\movie-ticket-system\backend\booking-service
./mvnw.cmd spring-boot:run
```

Neu khong co `mvnw`, dung Maven he thong:

```powershell
cd t:\movie-ticket-system\backend\booking-service
mvn spring-boot:run
```
