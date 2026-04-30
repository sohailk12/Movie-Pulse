# Fix 401 API Authentication Error - Plan

## Plan:
1. Modify App.jsx to use API key as query parameter instead of Bearer token authentication
2. This is the standard TMDB method and more reliable

## Changes:
- Remove Bearer token authentication from headers
- Add API key as query parameter to the endpoint URL
- Update API_OPTIONS to simple GET without Authorization header
