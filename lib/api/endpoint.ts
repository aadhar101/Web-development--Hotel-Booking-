
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api/v1";

export const AUTH_ENDPOINTS = {
  LOGIN:           `${API_BASE_URL}/auth/login`,
  REGISTER:        `${API_BASE_URL}/auth/register`,
  LOGOUT:          `${API_BASE_URL}/auth/logout`,
  REFRESH_TOKEN:   `${API_BASE_URL}/auth/refresh-token`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD:  `${API_BASE_URL}/auth/reset-password`,
  CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
  ME:              `${API_BASE_URL}/auth/me`,
} as const;

export const HOTEL_ENDPOINTS = {
  LIST:            `${API_BASE_URL}/hotels`,
  FEATURED:        `${API_BASE_URL}/hotels/featured`,
  DETAIL:          (id: string) => `${API_BASE_URL}/hotels/${id}`,
  ROOMS:           (hotelId: string) => `${API_BASE_URL}/hotels/${hotelId}/rooms`,
  AVAILABLE_ROOMS: (hotelId: string) => `${API_BASE_URL}/hotels/${hotelId}/rooms/available`,
  CREATE:          `${API_BASE_URL}/hotels`,
  UPDATE:          (id: string) => `${API_BASE_URL}/hotels/${id}`,
  DELETE:          (id: string) => `${API_BASE_URL}/hotels/${id}`,
  CREATE_ROOM:     (hotelId: string) => `${API_BASE_URL}/hotels/${hotelId}/rooms`,
  UPDATE_ROOM:     (hotelId: string, roomId: string) => `${API_BASE_URL}/hotels/${hotelId}/rooms/${roomId}`,
  DELETE_ROOM:     (hotelId: string, roomId: string) => `${API_BASE_URL}/hotels/${hotelId}/rooms/${roomId}`,
} as const;

export const BOOKING_ENDPOINTS = {
  CREATE:        `${API_BASE_URL}/bookings`,
  MY_BOOKINGS:   `${API_BASE_URL}/bookings/my`,
  ALL:           `${API_BASE_URL}/bookings`,
  STATS:         `${API_BASE_URL}/bookings/admin/stats`,
  DETAIL:        (id: string) => `${API_BASE_URL}/bookings/${id}`,
  BY_REFERENCE:  (ref: string) => `${API_BASE_URL}/bookings/reference/${ref}`,
  CANCEL:        (id: string) => `${API_BASE_URL}/bookings/${id}/cancel`,
  UPDATE_STATUS: (id: string) => `${API_BASE_URL}/bookings/${id}/status`,
  PAYMENT:       (id: string) => `${API_BASE_URL}/bookings/${id}/payment`,
} as const;

export const USER_ENDPOINTS = {
  PROFILE:       `${API_BASE_URL}/users/profile`,
  ALL:           `${API_BASE_URL}/users`,
  DETAIL:        (id: string) => `${API_BASE_URL}/users/${id}`,
  TOGGLE_STATUS: (id: string) => `${API_BASE_URL}/users/${id}/toggle-status`,
  UPDATE_ROLE:   (id: string) => `${API_BASE_URL}/users/${id}/role`,
  DELETE:        (id: string) => `${API_BASE_URL}/users/${id}`,
} as const;

export const ADMIN_ENDPOINTS = {
  DASHBOARD: `${API_BASE_URL}/admin/dashboard`,
  STATS:     `${API_BASE_URL}/admin/stats`,
} as const;

export const REVIEW_ENDPOINTS = {
  CREATE:   `${API_BASE_URL}/reviews`,
  HOTEL:    (hotelId: string) => `${API_BASE_URL}/reviews/hotel/${hotelId}`,
  ALL:      `${API_BASE_URL}/reviews`,
  APPROVE:  (id: string) => `${API_BASE_URL}/reviews/${id}/approve`,
  RESPOND:  (id: string) => `${API_BASE_URL}/reviews/${id}/respond`,
  DELETE:   (id: string) => `${API_BASE_URL}/reviews/${id}`,
} as const;

export const AMENITY_ENDPOINTS = {
  LIST:   `${API_BASE_URL}/amenities`,
  CREATE: `${API_BASE_URL}/amenities`,
  UPDATE: (id: string) => `${API_BASE_URL}/amenities/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/amenities/${id}`,
} as const;
