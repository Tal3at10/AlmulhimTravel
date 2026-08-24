# API Services Documentation

## Overview
This directory contains all API service functions organized by domain.

## Structure

```
src/
├── config/
│   └── api.config.js          # API endpoints configuration
├── lib/
│   └── axios.js               # Axios instance with interceptors
├── services/
│   └── api.service.js         # All API service functions
├── contexts/
│   └── AuthContext.jsx        # Authentication context
└── hooks/
    ├── useFetch.js            # Auto-fetch hook
    └── useApi.js              # Manual API call hook
```

## Usage Examples

### 1. Using useFetch (Auto-fetch on mount)

```jsx
import { useFetch } from '../hooks/useFetch';
import apiService from '../services/api.service';

function PackagesPage() {
  const { data, loading, error, refetch } = useFetch(
    () => apiService.packages.getFeatured(10),
    [] // dependencies
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data?.map(pkg => <PackageCard key={pkg.id} package={pkg} />)}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### 2. Using useApi (Manual trigger)

```jsx
import { useApi } from '../hooks/useApi';
import apiService from '../services/api.service';

function SearchForm() {
  const { data, loading, error, execute } = useApi(apiService.hotels.search);

  const handleSearch = async (params) => {
    const result = await execute(params);
    if (result.success) {
      console.log('Hotels:', result.data);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSearch({ destination: 'London', checkIn: '2025-02-15' });
    }}>
      {/* form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}
```

### 3. Using Auth Context

```jsx
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const { login, loading, isAuthenticated } = useAuth();

  const handleLogin = async (credentials) => {
    const result = await login(credentials);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin({ email, password });
    }}>
      {/* form fields */}
    </form>
  );
}
```

## API Response Structure

All API responses follow the `ApiResponse<T>` structure from backend:

```typescript
{
  success: boolean,
  data: T | null,
  message: string | null,
  errors: ErrorDetails[] | null
}
```

## Error Handling

Errors are handled automatically by axios interceptors:
- 400: Validation errors (toast shown)
- 401: Unauthorized (redirect to login)
- 403: Forbidden (toast shown)
- 404: Not found (toast shown)
- 500: Server error (toast shown)

## Environment Variables

Create `.env` file in root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=30000
```

## Available Services

### Auth
- `auth.register(data)`
- `auth.login(data)`
- `auth.logout()`
- `auth.forgotPassword(email)`
- `auth.resetPassword(data)`

### Users
- `users.getProfile()`
- `users.updateProfile(data)`
- `users.changePassword(data)`
- `users.getFavorites()`
- `users.addFavorite(type, id)`
- `users.removeFavorite(id)`

### Packages
- `packages.getFeatured(limit)`
- `packages.getAll(params)`
- `packages.getById(id)`

### Destinations
- `destinations.getAll()`
- `destinations.getBySlug(slug)`
- `destinations.getVideos(id)`

### Hotels
- `hotels.search(params)`
- `hotels.getById(id)`
- `hotels.getRooms(id, params)`
- `hotels.getPopularDestinations()`

### Flights
- `flights.search(params)`
- `flights.getById(id)`
- `flights.getPopularAirports()`

### Bookings
- `bookings.createHotel(data)`
- `bookings.createFlight(data)`
- `bookings.createPackage(data)`
- `bookings.lookup(reference, email)`
- `bookings.getMyBookings()`
- `bookings.cancel(id)`

### CMS
- `cms.getHeroSlides()`
- `cms.getTestimonials()`
- `cms.getPartners()`
- `cms.getBoardMembers()`
- `cms.getSetting(key)`
- `cms.getCustomerVideos(destination)`
