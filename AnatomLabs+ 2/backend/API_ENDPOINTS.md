# API Endpoints Documentation

## Base URL
`http://localhost:3001/api`

## Authentication Routes (`/api/auth`)

### Register
- **POST** `/api/auth/register`
- **Body**: `{ email, password, name, age?, gender?, weight?, height?, activityLevel?, goal? }`
- **Response**: `{ message, user, token }`

### Login
- **POST** `/api/auth/login`
- **Body**: `{ email, password }`
- **Response**: `{ message, user, token }`

## User Routes (`/api/users`) - Requires Auth

### Get All Users
- **GET** `/api/users`
- **Headers**: `Authorization: Bearer <token>`

### Get User by ID
- **GET** `/api/users/:id`
- **Headers**: `Authorization: Bearer <token>`

### Update User
- **PUT** `/api/users/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ name?, age?, gender?, weight?, height?, activityLevel?, goal? }`

## Body Parts Routes (`/api/body-parts`)

### Get All Body Parts
- **GET** `/api/body-parts`
- **Query Params**: `category?, search?`

### Get Body Part by ID
- **GET** `/api/body-parts/:id`

## Exercise Routes (`/api/exercises`)

### Get All Exercises
- **GET** `/api/exercises`
- **Query Params**: `category?, difficulty?, equipment?, bodyPart?, search?`

### Get Exercise by ID
- **GET** `/api/exercises/:id`

## Workout Routes (`/api/workouts`) - Requires Auth

### Generate Workout Plan
- **POST** `/api/workouts/generate`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ goal, experienceLevel, daysPerWeek, sport? }`
- **Example Body**:
```json
{
  "goal": "muscle_gain",
  "experienceLevel": "intermediate",
  "daysPerWeek": 4,
  "sport": null
}
```

### Get User's Workout Plans
- **GET** `/api/workouts/plans`
- **Headers**: `Authorization: Bearer <token>`

### Get Workout Plan by ID
- **GET** `/api/workouts/plans/:id`
- **Headers**: `Authorization: Bearer <token>`

### Delete Workout Plan
- **DELETE** `/api/workouts/plans/:id`
- **Headers**: `Authorization: Bearer <token>`

## Nutrition Routes (`/api/nutrition`)

### Calculate Nutrition Targets
- **POST** `/api/nutrition/calculate`
- **Headers**: `Authorization: Bearer <token>`
- **Note**: User profile must be complete (age, gender, weight, height, activityLevel, goal)

### Log Food
- **POST** `/api/nutrition/log`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ foodId, servings, mealType?, date? }`

### Get Nutrition Logs
- **GET** `/api/nutrition/logs`
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `startDate?, endDate?`

### Get Nutrition Summary
- **GET** `/api/nutrition/summary`
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `startDate, endDate` (both required)

### Get All Foods
- **GET** `/api/nutrition/foods`
- **Query Params**: `search?, category?`

## Activity Routes (`/api/activity`) - Requires Auth

### Log Activity
- **POST** `/api/activity/log`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ activityType, duration, intensity?, caloriesBurned?, steps?, date?, notes? }`

### Get Activity Logs
- **GET** `/api/activity/logs`
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `startDate?, endDate?, activityType?`

### Get Activity Stats
- **GET** `/api/activity/stats`
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `startDate, endDate` (both required)

### Delete Activity Log
- **DELETE** `/api/activity/logs/:id`
- **Headers**: `Authorization: Bearer <token>`

## Reports Routes (`/api/reports`) - Requires Auth

### Generate Injury Risk Report
- **POST** `/api/reports/injury-risk`
- **Headers**: `Authorization: Bearer <token>`

### Log Muscle Usage
- **POST** `/api/reports/muscle-usage`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ muscleId, muscleName, intensity, workoutFrequency? }`

### Get All Reports
- **GET** `/api/reports`
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `type?`

### Get Report by ID
- **GET** `/api/reports/:id`
- **Headers**: `Authorization: Bearer <token>`

## Example Usage

### 1. Register a User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "age": 25,
    "gender": "male",
    "weight": 75,
    "height": 180,
    "activityLevel": "moderate",
    "goal": "muscle_gain"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Generate Workout Plan
```bash
curl -X POST http://localhost:3001/api/workouts/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "goal": "muscle_gain",
    "experienceLevel": "intermediate",
    "daysPerWeek": 4
  }'
```

### 4. Calculate Nutrition Targets
```bash
curl -X POST http://localhost:3001/api/nutrition/calculate \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Error Responses

All endpoints return standard error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (e.g., user already exists)
- `500` - Internal Server Error
