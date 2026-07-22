# Enterprise Promotion Engine - Phase 4: API Design & Admin Integration

With the database schema and Rule Engine pipeline clearly designed, we must now define the exact API surfaces that will expose this power to your React frontend. This phase details the REST endpoints, the request payloads, and how the Admin UI (`Coupon.jsx`) and Checkout UI will interact with the backend.

## 1. Store / Checkout API (The Consumer)

When a customer is on the cart or checkout page and enters a code (e.g., "SUMMER50"), the frontend needs to evaluate the cart and update the total in real-time.

### Endpoint: `POST /api/v2/store/coupons/apply`

**Request Payload:**
```json
{
    "couponCode": "SUMMER50",
    "cartItems": [
        { "product": "60d5ecb8b343d1354", "category": "indoor", "quantity": 2, "price": 400 },
        { "product": "60d5ecb8b343d2212", "category": "outdoor", "quantity": 1, "price": 100 }
    ]
}
```
*(Note: In a highly secure system, we may just accept the `cartId` and reconstruct the items on the backend to prevent price tampering. We will use the backend cart state during implementation.)*

**Response (Success):**
```json
{
    "status": true,
    "message": "Coupon applied successfully!",
    "data": {
        "discountAmount": 100,
        "freeDelivery": true,
        "newTotal": 800
    }
}
```

**Response (Rule Failure - Fail Fast):**
```json
{
    "status": false,
    "message": "This coupon requires a minimum applicable order amount of ₹1000."
}
```

## 2. Admin API (The Creator)

Your `Coupon.jsx` admin interface needs to perform CRUD operations on the `Coupon` schema. 

### Endpoint: `POST /api/v2/admin/coupons`
This route receives the complex form data from the React Modal and maps it perfectly to our newly designed normalized schema.

**Mapping Strategy from Frontend `Coupon.jsx` State to Backend Schema:**
- `couponName` ➔ `code`
- `description` ➔ `description`
- `discount` ➔ `discount.value` (Type: Percentage)
- `maxDiscountInCost` ➔ `discount.maxDiscountAmount`
- `numberOfCoupon` ➔ `usage.maxUsageCount` (Set to null if Unlimited)
- `minAmount` ➔ `rules.minOrderAmount`
- `redeemBefore` ➔ `rules.validUntil`
- `categories` (dropdown) ➔ `applicability.type` ('All', 'Categories', 'Products')
- `subCategories` ➔ `applicability.categories` or `applicability.products` array
- `freeDelivery` ➔ `rules.freeDelivery`
- `singleCouponPerUser` ➔ `rules.singleUsePerUser`
- `newUser` ➔ `rules.isNewUserOnly`

### Endpoint: `GET /api/v2/admin/coupons`
Returns the list of all coupons for the Admin Data Table.
We will project the data so the frontend can easily display Tags for active/expired status based on the `rules.validUntil` date and `status` enum.

### Endpoint: `PATCH /api/v2/admin/coupons/:id/status`
Allows admins to manually disable a coupon early before its expiration date.

## 3. Conflict Resolution Strategy (Handling Multiple Coupons)

In the future, you may want to allow users to apply multiple coupons (e.g., a "Free Shipping" coupon + a "10% Off" coupon).

**The Architecture:**
Instead of modifying the `apply-coupon` controller, we will introduce a `ConflictResolver` inside the `PromotionService`. 
When multiple codes are submitted, the `ConflictResolver` analyzes their stackability. 
*For the MVP Phase, we will strictly enforce a "Single Best Coupon Policy"* (only one coupon can be applied per order). Any subsequent coupon application will replace the previous one if it yields a better discount.

## 4. Execution Plan (Moving to Code)

With Phases 1, 2, 3, and 4 completely defined, the architectural planning is complete. The next action is to translate these documents into executable Node.js code.

The execution order will be:
1. Create `backend/src/model/nurseryModel/coupon.js`.
2. Build the `backend/src/utils/promotionEngine/` directory and populate the rules/discounts utilities.
3. Build the Admin Controllers & Routes to support `Coupon.jsx`.
4. Build the Store Controllers to support cart evaluation.

---
*Please review Phase 4. If you approve of the API mappings and the final plan, we are ready to officially end the planning phase and begin the active coding execution!*
