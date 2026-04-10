# Customer Frontend Subdomain UI

This note explains how the customer frontend should work for restaurant-specific public pages such as:

- `restaurantname.justsearchrestorant.com`
- `restaurantname.justsearchrestorant.com/menu`
- `restaurantname.justsearchrestorant.com/eat-play`
- `restaurantname.justsearchrestorant.com/google-reviews`
- `restaurantname.justsearchrestorant.com/social-media`
- `restaurantname.justsearchrestorant.com/party-booking`

## 1. Recommended tenant strategy

For production, use the subdomain as the main tenant key.

Example:

- `mosaic-table.justsearchrestorant.com`
- `spice-garden.justsearchrestorant.com`

This means:

- the restaurant is resolved from the incoming `Host` header
- the frontend does **not** need a public `app/[slug]` route for normal customer traffic
- the same page files are reused for every restaurant
- only the restaurant data changes

## 2. Do we need slug-based pages?

For production customer traffic: **No**

If the link already comes as:

- `[restaurantname].justsearchrestorant.com`

then the restaurant identity is already in the subdomain.

The page routes should stay standard:

- `/`
- `/menu`
- `/eat-play`
- `/google-reviews`
- `/social-media`
- `/party-booking`

So the final URLs become:

- `mosaic-table.justsearchrestorant.com/menu`
- `mosaic-table.justsearchrestorant.com/google-reviews`

## 3. When slug is still useful

A slug is still useful for:

- local development
- preview mode
- admin-side restaurant preview tools
- test fixtures before backend tenant resolution is connected

That is why this frontend keeps a fallback slug-based mock resolver in code.

Recommended use:

- production customer routing: subdomain
- local/dev fallback: slug

## 4. Current frontend approach

The customer frontend now uses a shared restaurant resolver that:

1. reads the request host
2. extracts the subdomain
3. loads restaurant data from mock data for now
4. falls back to a default slug in local development

When backend integration is ready, replace the mock lookup with:

- `GET /api/v1/restaurant/current`

The backend should remain the source of truth for tenant resolution.

## 5. Homepage structure

The home page is intentionally simple and uses only:

- restaurant logo area
- Food Menu card
- Eat, Play card
- Google Review card
- Social Media Links card
- Party Booking Feature card

This keeps the public landing page focused and makes the design reusable across restaurants.

## 6. Data that should change per restaurant

Each restaurant can change:

- logo
- name
- category
- city and contact info
- menu categories and dishes
- game list
- Google review summary
- social media handles
- party packages
- theme colors

The page design stays shared.

## 7. Routes to keep shared

Keep one shared page implementation for:

- `app/page.tsx`
- `app/menu/page.tsx`
- `app/eat-play/page.tsx`
- `app/google-reviews/page.tsx`
- `app/social-media/page.tsx`
- `app/party-booking/page.tsx`

Do not create one separate page file per restaurant.

The restaurant data should decide what appears inside each page.
