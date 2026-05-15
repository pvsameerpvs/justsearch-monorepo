# Customer Frontend N-Points Agent Guide

> **App**: `apps/customer-frontend`
> **Total N-Points**: 22
> **Type**: Next.js App Router (RSC + Client Components)
> **Domain**: `[restaurant].localhost`

---

## N-Point Directory

### NP-01: `/` — Home Page

**Function name = npont**: `HomePage`
**Name = npont**: Home / Landing

**Components & Functions Under This N-Point:**
| # | File Path | Export Type | Purpose |
|---|---|---|---|
| 1 | `app/page.tsx` | Page Component | Route entry point |
| 2 | `app/layout.tsx` | Layout Component | Root layout wrapper |
| 3 | `components/layout/app-shell.tsx` | Component | Mobile bottom nav + top bar |
| 4 | `components/layout/restaurant-layout-manager.tsx` | Component | Restaurant context provider |
| 5 | `components/layout/restaurant-context.tsx` | Context | Restaurant data context |
| 6 | `components/restaurant/restaurant-home-hero.tsx` | Component | Hero section with logo + banner |
| 7 | `components/restaurant/restaurant-feature-grid.tsx` | Component | Feature cards grid |
| 8 | `components/restaurant/restaurant-feature-card.tsx` | Component | Single feature card |
| 9 | `components/restaurant/restaurant-menu-showcase.tsx` | Component | Menu preview section |
| 10 | `components/restaurant/restaurant-eat-play-showcase.tsx` | Component | Games preview section |
| 11 | `components/restaurant/restaurant-reviews-showcase.tsx` | Component | Reviews preview section |
| 12 | `components/restaurant/restaurant-social-media-showcase.tsx` | Component | Social links preview |
| 13 | `components/restaurant/restaurant-logo-badge.tsx` | Component | Restaurant logo display |
| 14 | `components/restaurant/restaurant-mobile-header.tsx` | Component | Mobile header bar |
| 15 | `components/restaurant/restaurant-mobile-nav.tsx` | Component | Mobile navigation |
| 16 | `components/restaurant/opening-today-card.tsx` | Component | Opening hours card |
| 17 | `lib/restaurant-resolver.ts` | Utility | Subdomain → restaurant resolution |
| 18 | `lib/restaurant-utils.ts` | Utility | Restaurant helper functions |
| 19 | `lib/restaurant-types.ts` | Types | TypeScript definitions |
| 20 | `middleware.ts` | Middleware | Subdomain extraction |

---

### NP-02: `/menu` — Menu Page

**Function name = npont**: `MenuPage`
**Name = npont**: Menu Showcase

**Components & Functions Under This N-Point:**
| # | File Path | Export Type | Purpose |
|---|---|---|---|
| 1 | `app/menu/page.tsx` | Page Component | Menu route entry |
| 2 | `components/restaurant/restaurant-menu-showcase.tsx` | Container | Menu showcase container |
| 3 | `components/restaurant/restaurant-menu-hero.tsx` | Component | Menu hero section |
| 4 | `components/restaurant/restaurant-menu-category-card.tsx` | Component | Category card |
| 5 | `components/restaurant/restaurant-menu-item-card.tsx` | Component | Menu item card |
| 6 | `components/restaurant/menu-item-card-parts.tsx` | Component | Card sub-components |
| 7 | `components/restaurant/menu-sections-list.tsx` | Component | Menu sections list |
| 8 | `components/restaurant/restaurant-menu-subcategory-section.tsx` | Component | Subcategory section |
| 9 | `components/restaurant/category-scroll-list.tsx` | Component | Horizontal category scroll |
| 10 | `components/restaurant/restaurant-menu-navigation.tsx` | Component | Menu navigation tabs |
| 11 | `components/restaurant/use-menu-showcase-state.ts` | Hook | Menu state management |
| 12 | `components/restaurant/view-mode-toggle.tsx` | Component | Grid/list view toggle |
| 13 | `components/restaurant/delivery-badge.tsx` | Component | Delivery availability badge |
| 14 | `components/restaurant/delivery-cart-section.tsx` | Component | Cart section in menu |
| 15 | `components/restaurant/restaurant-delivery-cart-bar.tsx` | Component | Bottom cart bar |
| 16 | `components/restaurant/restaurant-delivery-cart-sheet.tsx` | Component | Cart sheet/drawer |
| 17 | `components/restaurant/fulfillment/use-cart-actions.ts` | Hook | Cart add/remove actions |
| 18 | `components/restaurant/fulfillment/use-fulfillment-state.ts` | Hook | Fulfillment mode state |
| 19 | `components/restaurant/fulfillment/fulfillment-provider.tsx` | Provider | Fulfillment context |
| 20 | `components/restaurant/fulfillment/fulfillment.types.ts` | Types | Fulfillment type defs |
| 21 | `components/restaurant/fulfillment/fulfillment.constants.ts` | Constants | Fulfillment constants |

---

### NP-03: `/menu/checkout` — Checkout Page

**Function name = npont**: `CheckoutPage`
**Name = npont**: Checkout / Cart Review

**Components & Functions Under This N-Point:**
| # | File Path | Export Type | Purpose |
|---|---|---|---|
| 1 | `app/menu/checkout/page.tsx` | Page Component | Checkout route entry |
| 2 | `components/restaurant/restaurant-checkout-screen.tsx` | Container | Checkout screen container |
| 3 | `components/restaurant/checkout/checkout-summary-card.tsx` | Component | Order summary + place order |
| 4 | `components/restaurant/checkout/checkout-address-card.tsx` | Component | Selected address display |
| 5 | `components/restaurant/checkout/checkout-address-card-content.tsx` | Component | Address card content |
| 6 | `components/restaurant/checkout/checkout-empty-state.tsx` | Component | Empty cart state |
| 7 | `components/restaurant/checkout/checkout-sticky-footer.tsx` | Component | Bottom sticky footer |
| 8 | `components/restaurant/checkout/payment-gateway.tsx` | Component | Payment method selector |
| 9 | `components/restaurant/checkout/scratch-card.tsx` | Component | Reward scratch card |
| 10 | `components/restaurant/checkout/reward-manager.tsx` | Component | Reward management |
| 11 | `components/restaurant/checkout/reward-offers.ts` | Utility | Reward offer definitions |
| 12 | `components/restaurant/checkout/reward-storage.ts` | Utility | Reward local storage |
| 13 | `components/restaurant/checkout/reward-types.ts` | Types | Reward type definitions |
| 14 | `components/restaurant/checkout/use-checkout-state.ts` | Hook | Checkout state management |
| 15 | `components/restaurant/checkout/use-checkout-promo.ts` | Hook | Promo code handling |
| 16 | `components/restaurant/checkout/use-voucher-wallet.ts` | Hook | Voucher wallet state |
| 17 | `components/restaurant/fulfillment/use-place-order.ts` | Hook | Place order action |
| 18 | `components/restaurant/use-checkout-gate.ts` | Hook | Checkout validation gate |
| 19 | `lib/loyalty-utils.ts` | Utility | Loyalty calculation helpers |

---

### NP-04: `/menu/checkout/status` — Checkout Status

**Function name = npont**: `CheckoutStatusPage`
**Name = npont**: Checkout Status List

**Components & Functions Under This N-Point:**
| # | File Path | Export Type | Purpose |
|---|---|---|---|
| 1 | `app/menu/checkout/status/page.tsx` | Page Component | Status list route entry |
| 2 | `components/restaurant/checkout/checkout-order-status-list-screen.tsx` | Container | Order status list container |
| 3 | `components/restaurant/checkout/checkout-tracking-card.tsx` | Component | Order tracking card |
| 4 | `components/restaurant/checkout/checkout-order-timeline.tsx` | Component | Order timeline display |
| 5 | `components/restaurant/checkout/multi-order-circular-progress.tsx` | Component | Multi-order progress |
| 6 | `components/restaurant/checkout/checkout-status-constants.ts` | Constants | Status step definitions |
| 7 | `lib/hooks/use-order-status-query.ts` | Hook | Order status React Query |

---

### NP-05: `/menu/checkout/status/[orderId]` — Order Status Detail

**Function name = npont**: `OrderStatusDetailPage`
**Name = npont**: Live Order Tracking

**Components & Functions Under This N-Point:**
| # | File Path | Export Type | Purpose |
|---|---|---|---|
| 1 | `app/menu/checkout/status/[orderId]/page.tsx` | Page Component | Order status detail route |
| 2 | `components/restaurant/checkout/checkout-live-order-status-screen.tsx` | Container | Live status screen |
| 3 | `components/restaurant/checkout/checkout-live-order-status-presenter.tsx` | Presenter | Live status UI |
| 4 | `components/restaurant/checkout/checkout-live-progress-circle.tsx` | Component | Animated progress circle |
| 5 | `components/restaurant/checkout/animated-status-emoji.tsx` | Component | Status emoji animation |
| 6 | `components/restaurant/checkout/active-order-tracker.tsx` | Component | Active order tracker |
| 7 | `components/restaurant/checkout/checkout-live-status-utils.ts` | Utility | Status calculation utils |
| 8 | `components/restaurant/restaurant-delivery-status-badge.tsx` | Component | Delivery status badge |
| 9 | `lib/hooks/use-order-status-query.ts` | Hook | Order status polling (5s) |

---

### NP-06: `/eat-play` — Games Listing

**Function name = npont**: `GamesListingPage`
**Name = npont**: Eat & Play Games List

**Components & Functions Under This N-Point:**
| # | File Path | Export Type | Purpose |
|---|---|---|---|
| 1 | `app/eat-play/page.tsx` | Page Component | Games listing route |
| 2 | `components/restaurant/restaurant-eat-play-showcase.tsx` | Component | Games showcase section |
| 3 | `components/restaurant/restaurant-game-screen.tsx` | Component | Games screen container |
| 4 | `components/restaurant/restaurant-game-preview-card.tsx` | Component | Game preview card |
| 5 | `components/restaurant/games/game-coin-pill.tsx` | Component | Coin reward pill |
| 6 | `components/restaurant/games/game-intro-stage.tsx` | Component | Game intro screen |
| 7 | `components/restaurant/games/game-exit-confirm-dialog.tsx` | Component | Exit confirmation dialog |
| 8 | `components/restaurant/games/local/local-game-registry.tsx` | Registry | Game registration map |
| 9 | `components/restaurant/games/local/local-game-renderer.ts` | Utility | Game renderer dispatcher |
| 10 | `components/restaurant/games/local/local-game-fallback.tsx` | Component | Fallback for unknown games |
| 11 | `components/restaurant/use-user-game-stats.ts` | Hook | User game statistics |

---

### NP-07: `/eat-play/[gameId]` — Game Detail

**Function name = npont**: `GameDetailPage`
**Name = npont**: Game Detail / Preview

**Components & Functions Under This N-Point:**
| # | File Path | Export Type | Purpose |
|---|---|---|---|
| 1 | `app/eat-play/[gameId]/page.tsx` | Page Component | Game detail route |
| 2 | `app/eat-play/[gameId]/_lib/get-game-by-id.ts` | Utility | Get game metadata by ID |
| 3 | `components/restaurant/games/game-intro-stage.tsx` | Component | Game intro/preview stage |
| 4 | `components/restaurant/games/game-player-stage.tsx` | Component | Game player stage wrapper |
| 5 | `components/restaurant/games/game-coin-pill.tsx` | Component | Coin reward indicator |
| 6 | `components/restaurant/games/game-exit-confirm-dialog.tsx` | Component | Exit confirmation |
| 7 | `components/restaurant/games/embedded-game-player.tsx` | Component | Embedded player wrapper |
| 8 | `components/restaurant/games/local/local-game-registry.tsx` | Registry | Game lookup registry |

---

### NP-08: `/eat-play/[gameId]/play` — Game Player

**Function name = npont**: `GamePlayerPage`
**Name = npont**: Active Game Canvas Player

**Components & Functions Under This N-Point:**
| # | File Path | Export Type | Purpose |
|---|---|---|---|
| 1 | `app/eat-play/[gameId]/play/page.tsx` | Page Component | Game play route |
| 2 | `components/restaurant/games/game-player-stage.tsx` | Container | Game stage container |
| 3 | `components/restaurant/games/local/local-game-player.tsx` | Component | Canvas game wrapper |
| 4 | `components/restaurant/games/game-intro-stage.tsx` | Component | Pre-game intro overlay |
| 5 | `components/restaurant/games/game-exit-confirm-dialog.tsx` | Component | Exit confirmation |
| 6 | `components/restaurant/games/game-award.ts` | Types | Game award types |
| 7 | `components/restaurant/games/game-coin-pill.tsx` | Component | Coin display |

**Local Canvas Games (5 games):**
| # | Game ID | Engine Hook | Canvas Art | Game Component | Model |
|---|---|---|---|---|---|
| 8 | `vex-runner` | `use-vex-runner-engine.ts` | `vex-runner-canvas-art.ts` | `vex-runner-game.tsx` | `vex-runner-model.ts` |
| 9 | `hungry-bird-rush` | `use-hungry-bird-rush-engine.ts` | `hungry-bird-rush-canvas-art.ts` | `hungry-bird-rush-game.tsx` | `hungry-bird-rush-model.ts` |
| 10 | `cheese-chase` | `use-cheese-chase-engine.ts` | `cheese-chase-canvas-art.ts` | `cheese-chase-game.tsx` | `cheese-chase-model.ts` |
| 11 | `memory-match` | `use-memory-match-engine.ts` | `memory-match-canvas-art.ts` | `memory-match-game.tsx` | `memory-match-model.ts` |
| 12 | `slice-master` | `use-slice-master-engine.ts` | `slice-master-canvas-art.ts` | `slice-master-game.tsx` | `slice-master-model.ts` |

---

### NP-09: `/eat-play/profile` — Eat & Play Profile

**Function name = npont**: `EatPlayProfilePage`
**Name = npont**: Game Stats & Profile

**Components & Functions Under This N-Point:**
| # | File Path | Export Type | Purpose |
|---|---|---|---|
| 1 | `app/eat-play/profile/page.tsx` | Page Component | E&P profile route |
| 2 | `components/restaurant/games/profile/eat-play-profile-screen.tsx` | Container | E&P profile container |
| 3 | `components/restaurant/games/profile/eat-play-game-stat-card.tsx` | Component | Game stat card |
| 4 | `components/restaurant/games/profile/eat-play-header-wallet-link.tsx` | Component | Wallet link header |
| 5 | `components/restaurant/games/profile/index.ts` | Barrel Export | Profile exports |
| 6 | `components/restaurant/use-user-game-stats.ts` | Hook | Game stats hook |

---

### NP-10: `/profile` — User Profile

**Function name = npont**: `ProfilePage`
**Name = npont**: User Profile Dashboard

**Components & Functions Under This N-Point:**
| # | File Path | Export Type | Purpose |
|---|---|---|---|
| 1 | `app/profile/page.tsx` | Page Component | Profile route entry |
| 2 | `components/restaurant/profile/profile-section-layout.tsx` | Component | Profile layout shell |
| 3 | `components/restaurant/profile/profile-menu-item.tsx` | Component | Profile menu item |
| 4 | `components/restaurant/profile/registration-settings-card.tsx` | Component | Registration settings |
| 5 | `components/restaurant/profile/vip-tier-card.tsx` | Component | VIP tier display |
| 6 | `components/restaurant/profile/use-vip-tier.ts` | Hook | VIP tier logic |
| 7 | `components/restaurant/profile/referral-system.tsx` | Component | Referral system UI |
| 8 | `components/auth/registration-context.tsx` | Context | Auth registration context |
| 9 | `components/auth/registration-modal.tsx` | Component | OTP registration modal |
| 10 | `components/auth/registration-route-guard.tsx` | Component | Route guard for auth |
| 11 | `components/auth/registered-user.ts` | Types | Registered user types |
| 12 | `lib/stores/referral-store.ts` | Zustand Store | Referral state |

---

### NP-11: `/profile/orders` — Order History

**Function name = npont**: `OrderHistoryPage`
**Name = npont**: Past Orders List

**Components & Functions Under This N-Point:**
| # | File Path | Export Type | Purpose |
|---|---|---|---|
| 1 | `app/profile/orders/page.tsx` | Page Component | Orders list route |
| 2 | `components/restaurant/profile/orders/profile-orders-screen.tsx` | Container | Orders screen container |
| 3 | `components/restaurant/profile/orders/profile-order-list-item.tsx` | Component | Order list item |
| 4 | `components/restaurant/profile/orders/profile-order-details-screen.tsx` | Component | Order detail view |
| 5 | `components/restaurant/profile/orders/profile-order-utils.ts` | Utility | Order formatting utils |
| 6 | `components/restaurant/profile/orders/use-profile-orders.ts` | Hook | Orders fetch hook |
| 7 | `components/restaurant/profile/orders/index.ts` | Barrel Export | Orders exports |

---

### NP-12: `/profile/orders/[orderId]` — Order Detail

**Function name = npont**: `OrderDetailPage`
**Name = npont**: Single Order Detail

**Components & Functions Under This N-Point:**
| # | File Path | Export Type | Purpose |
|---|---|---|---|
| 1 | `app/profile/orders/[orderId]/page.tsx` | Page Component | Order detail route |
| 2 | `components/restaurant/profile/orders/profile-order-details-screen.tsx` | Container | Order details container |
| 3 | `components/restaurant/profile/orders/profile-order-list-item.tsx` | Component | Order item display |
| 4 | `components/restaurant/profile/orders/profile-order-utils.ts` | Utility | Order data formatting |
| 5 | `components/restaurant/profile/orders/use-profile-orders.ts` | Hook | Order data hook |
| 6 | `lib/hooks/use-order-status-query.ts` | Hook | Order status query |

---

### NP-13: `/profile/addresses` — Address Book

**Function name = npont**: `AddressBookPage`
**Name = npont**: Saved Addresses

**Components & Functions Under This N-Point:**
| # | File Path | Export Type | Purpose |
|---|---|---|---|
| 1 | `app/profile/addresses/page.tsx` | Page Component | Addresses route |
| 2 | `components/restaurant/profile/sections/profile-address-list.tsx` | Component | Address list display |
| 3 | `components/restaurant/profile/sections/profile-address-card.tsx` | Component | Single address card |
| 4 | `components/restaurant/profile/sections/profile-add-address-form.tsx` | Component | Add address form |
| 5 | `components/restaurant/profile/sections/index.ts` | Barrel Export | Sections exports |
| 6 | `components/restaurant/use-address-book.ts` | Hook | Address book state |
| 7 | `components/restaurant/use-geolocation.ts` | Hook | GPS geolocation |
| 8 | `components/restaurant/checkout/use-address-selector.ts` | Hook | Address selection |
| 9 | `components/restaurant/checkout/checkout-address-selector-sheet.tsx` | Component | Address selector sheet |
| 10 | `components/restaurant/checkout/checkout-address-selector-item.tsx` | Component | Address selector item |
| 11 | `components/restaurant/checkout/checkout-map-address-picker.tsx` | Component | Map address picker |
| 12 | `components/restaurant/checkout/use-here-interactive-map.ts` | Hook | HERE Maps integration |
| 13 | `components/restaurant/checkout/checkout-add-address-form.tsx` | Component | Checkout add address |

---

### NP-14: `/profile/vouchers` — Voucher Wallet

**Function name = npont**: `VoucherWalletPage`
**Name = npont**: Promo Codes & Vouchers

**Components & Functions Under This N-Point:**
| # | File Path | Export Type | Purpose |
|---|---|---|---|
| 1 | `app/profile/vouchers/page.tsx` | Page Component | Vouchers route |
| 2 | `components/restaurant/profile/sections/profile-voucher-wallet.tsx` | Component | Voucher wallet display |
| 3 | `components/restaurant/checkout/use-voucher-wallet.ts` | Hook | Voucher state management |
| 4 | `components/restaurant/checkout/use-checkout-promo.ts` | Hook | Promo code application |

---

### NP-15: `/profile/settings` — Profile Settings

**Function name = npont**: `ProfileSettingsPage`
**Name = npont**: User Settings

**Components & Functions Under This N-Point:**
| # | File Path | Export Type | Purpose |
|---|---|---|---|
| 1 | `app/profile/settings/page.tsx` | Page Component | Settings route |
| 2 | `components/restaurant/profile/registration-settings-card.tsx` | Component | Registration settings |
| 3 | `components/auth/registered-user.ts` | Types | User type definitions |
| 4 | `components/auth/registration-context.tsx` | Context | Registration state |

---

### NP-16: `/profile/points` — Loyalty Points

**Function name = npont**: `LoyaltyPointsPage`
**Name = npont**: Points & Rewards Balance

**Components & Functions Under This N-Point:**
| # | File Path | Export Type | Purpose |
|---|---|---|---|
| 1 | `app/profile/points/page.tsx` | Page Component | Points route |
| 2 | `components/restaurant/profile/vip-tier-card.tsx` | Component | VIP tier card |
| 3 | `components/restaurant/profile/use-vip-tier.ts` | Hook | VIP tier calculation |
| 4 | `components/restaurant/use-loyalty-points.ts` | Hook | Loyalty points state |
| 5 | `lib/loyalty-utils.ts` | Utility | Points calculation |
| 6 | `components/restaurant/checkout/reward-manager.tsx` | Component | Reward manager |
| 7 | `components/restaurant/checkout/scratch-card.tsx` | Component | Scratch card reward |

---

### NP-17: `/profile/how-to-play` — How To Play

**Function name = npont**: `HowToPlayPage`
**Name = npont**: Game Instructions

**Components & Functions Under This N-Point:**
| # | File Path | Export Type | Purpose |
|---|---|---|---|
| 1 | `app/profile/how-to-play/page.tsx` | Page Component | How-to-play route |
| 2 | `components/restaurant/games/game-intro-stage.tsx` | Component | Reusable game intro |

---

### NP-18: `/profile/rewards` — Rewards Page

**Function name = npont**: `RewardsPage`
**Name = npont**: Rewards & Offers

**Components & Functions Under This N-Point:**
| # | File Path | Export Type | Purpose |
|---|---|---|---|
| 1 | `app/profile/rewards/page.tsx` | Page Component | Rewards route |
| 2 | `components/restaurant/checkout/reward-manager.tsx` | Component | Rewards manager |
| 3 | `components/restaurant/checkout/scratch-card.tsx` | Component | Scratch card game |
| 4 | `components/restaurant/checkout/reward-offers.ts` | Utility | Reward definitions |
| 5 | `components/restaurant/checkout/reward-storage.ts` | Utility | Reward persistence |
| 6 | `components/restaurant/checkout/reward-types.ts` | Types | Reward type defs |
| 7 | `lib/stores/referral-store.ts` | Zustand Store | Referral rewards |

---

### NP-19: `/google-reviews` — Google Reviews

**Function name = npont**: `GoogleReviewsPage`
**Name = npont**: Customer Reviews Display

**Components & Functions Under This N-Point:**
| # | File Path | Export Type | Purpose |
|---|---|---|---|
| 1 | `app/google-reviews/page.tsx` | Page Component | Reviews route |
| 2 | `components/restaurant/restaurant-reviews-showcase.tsx` | Component | Reviews showcase |
| 3 | `components/restaurant/restaurant-review-card.tsx` | Component | Single review card |
| 4 | `components/restaurant/restaurant-review-summary-card.tsx` | Component | Review summary |

---

### NP-20: `/social-media` — Social Media Links

**Function name = npont**: `SocialMediaPage`
**Name = npont**: Social Links Display

**Components & Functions Under This N-Point:**
| # | File Path | Export Type | Purpose |
|---|---|---|---|
| 1 | `app/social-media/page.tsx` | Page Component | Social media route |
| 2 | `components/restaurant/restaurant-social-media-showcase.tsx` | Component | Social showcase |
| 3 | `components/restaurant/restaurant-social-link-card.tsx` | Component | Social link card |

---

### NP-21: `/api/auth/otp/request` — OTP Request API

**Function name = npont**: `OtpRequestRoute`
**Name = npont**: OTP Request Proxy

**Components & Functions Under This N-Point:**
| # | File Path | Export Type | Purpose |
|---|---|---|---|
| 1 | `app/api/auth/otp/request/route.ts` | API Route | Proxies to backend `/api/v1/auth/otp/request` |
| 2 | `lib/api-client.ts` | Utility | Fetch wrapper with host header |
| 3 | `lib/server/otp-store.ts` | Server Utility | ⚠️ IN-MEMORY store (to be removed) |

---

### NP-22: `/api/auth/otp/verify` — OTP Verify API

**Function name = npont**: `OtpVerifyRoute`
**Name = npont**: OTP Verify Proxy

**Components & Functions Under This N-Point:**
| # | File Path | Export Type | Purpose |
|---|---|---|---|
| 1 | `app/api/auth/otp/verify/route.ts` | API Route | ⚠️ Currently in-memory, needs backend proxy |
| 2 | `lib/api-client.ts` | Utility | Fetch wrapper |
| 3 | `lib/server/otp-store.ts` | Server Utility | ⚠️ IN-MEMORY OTP verification (replace with backend call) |
| 4 | `components/auth/registration-modal.tsx` | Component | OTP input UI |
| 5 | `components/auth/registration-context.tsx` | Context | Auth state management |

---

## Shared Components (Used Across Multiple N-Points)

| # | File Path | Used By N-Points |
|---|---|---|
| 1 | `components/shared/container.tsx` | All pages |
| 2 | `components/shared/surface.tsx` | All pages |
| 3 | `components/shared/button-link.tsx` | All pages |
| 4 | `components/shared/empty-state.tsx` | NP-03, NP-04, NP-11, NP-13 |
| 5 | `components/shared/index.ts` | All pages |
| 6 | `lib/cn.ts` | All components |
| 7 | `lib/format.ts` | NP-03, NP-05, NP-11, NP-16 |
| 8 | `lib/theme-vars.ts` | NP-01 |
| 9 | `lib/stores/ad-analytics-store.ts` | NP-01, NP-06 |

---

## Summary Table

| N-Point # | Route | Component Count | Hook Count | API Route | Status |
|---|---|---|---|---|---|
| NP-01 | `/` | 15 | 2 | No | ✅ Complete |
| NP-02 | `/menu` | 18 | 4 | No | ✅ Complete |
| NP-03 | `/menu/checkout` | 12 | 5 | No | ✅ Complete |
| NP-04 | `/menu/checkout/status` | 5 | 1 | No | ✅ Complete |
| NP-05 | `/menu/checkout/status/[orderId]` | 6 | 1 | No | ✅ Complete |
| NP-06 | `/eat-play` | 8 | 1 | No | ✅ Complete |
| NP-07 | `/eat-play/[gameId]` | 6 | 0 | No | ✅ Complete |
| NP-08 | `/eat-play/[gameId]/play` | 7 + 5 games | 5 | No | ✅ Complete |
| NP-09 | `/eat-play/profile` | 3 | 1 | No | ✅ Complete |
| NP-10 | `/profile` | 10 | 2 | No | ✅ Complete |
| NP-11 | `/profile/orders` | 5 | 1 | No | ✅ Complete |
| NP-12 | `/profile/orders/[orderId]` | 4 | 2 | No | ✅ Complete |
| NP-13 | `/profile/addresses` | 10 | 4 | No | ✅ Complete |
| NP-14 | `/profile/vouchers` | 2 | 2 | No | ✅ Complete |
| NP-15 | `/profile/settings` | 2 | 0 | No | ✅ Complete |
| NP-16 | `/profile/points` | 5 | 3 | No | ✅ Complete |
| NP-17 | `/profile/how-to-play` | 1 | 0 | No | ✅ Complete |
| NP-18 | `/profile/rewards` | 5 | 0 | No | ✅ Complete |
| NP-19 | `/google-reviews` | 3 | 0 | No | ✅ Complete |
| NP-20 | `/social-media` | 2 | 0 | No | ✅ Complete |
| NP-21 | `/api/auth/otp/request` | 1 | 0 | Yes ✅ | ✅ Complete |
| NP-22 | `/api/auth/otp/verify` | 2 | 0 | Yes 🚨 | ⚠️ Broken — uses in-memory |

---

## Critical Fix Required

**NP-22** (`/api/auth/otp/verify`) must be updated to proxy to the backend instead of using `lib/server/otp-store.ts`. This is the #1 blocker for real user authentication.

**Fix:**
```typescript
// app/api/auth/otp/verify/route.ts
import { apiClient } from '@/lib/api-client';

export async function POST(request: Request) {
  const body = await request.json();
  const response = await apiClient('/auth/otp/verify', {
    method: 'POST',
    body,
  });
  return Response.json(response);
}
```

Then **delete** `lib/server/otp-store.ts`.

---

*Generated for Customer Frontend — 22 N-Points mapped with all functions listed*
