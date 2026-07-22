# Enterprise Promotion Engine - Phase 1: Overall Architecture

## 1. Core Architectural Paradigm
We will build a highly scalable, enterprise-grade Promotion Engine tailored specifically to fit within the existing **MERN (Node.js/Express/MongoDB)** environment. We will achieve "enterprise-grade extensibility" not by forcing a completely new architecture like CQRS or .NET Clean Architecture, but by designing highly modular, well-separated JavaScript utilities that plug perfectly into the current Express flow.

## 2. Where the Code Will Live
We will utilize the existing `backend/src` structure. The complexity of the Promotion Engine will live inside a dedicated `utils` directory to keep controllers perfectly clean and models focused.

- **`models/nurseryModel/coupon.js`**: The Mongoose schema designed to store flexible rules (discount values, thresholds, array inclusions for categories, etc.).
- **`controllers/promotionController.js`**: Handles the HTTP requests. Its only job is to fetch the cart, fetch the coupon from the database, and pass them to the Engine.
- **`utils/promotionEngine/`**: This is the heart of the system. It will be divided into modular files:
  - `index.js`: Exposes the `PromotionService` (a reusable service class/object that any controller can call).
  - `engine.js`: The orchestrator that sequentially passes data through rules and then calculates discounts.
  - `rules/`: A directory containing pure functions for evaluating eligibility (e.g., `minAmount.rule.js`, `newUser.rule.js`).
  - `discounts/`: A directory containing pure functions for calculating the math (e.g., `flat.strategy.js`, `percent.strategy.js`).

## 3. The Execution Pipeline (The Reusable Service)
When a user clicks "Apply Coupon" or proceeds to checkout, any controller can call `PromotionService.applyCoupon(couponCode, cart, user)`.

1. **Database Fetch**: The service fetches the active `Coupon` from MongoDB.
2. **Rule Evaluation (Fail-Fast)**: The engine sequentially passes the data through the functions in `rules/`. 
   - *Fail-Fast:* If any rule fails (e.g., minimum amount not met), the engine immediately stops and returns a failure response.
3. **Discount Calculation**: If all rules pass, the engine uses the strategies in `discounts/` to calculate exactly how much money is taken off the cart.
4. **Service Response**: The service returns `{ success: true, discountAmount, newTotal, freeDelivery }`.

## 4. Addressing Concurrency (Race Conditions)
If a coupon has `1` usage left and two users apply it on the checkout screen, the final verification must happen at Payment/Order Creation.
- In the `createOrder` controller (when the user actually pays), we will wrap the coupon decrement operation in a conditional Mongoose `findOneAndUpdate`.
- If the increment fails, we instantly reject the order creation and inform the user the coupon just expired.

## 5. Abstracting Redis (Future-Proofing)
To adapt the current outdated Redis-KV and make it easily swappable in the future, we will create a `utils/cacheService.js` adapter. Controllers will only ever import `CacheService`, allowing the underlying technology to be swapped seamlessly later.

---
*Please review this Phase 1 document. If approved, we will proceed to Phase 2 (Database Design & Rule Structure) and save it in this docs folder.*
