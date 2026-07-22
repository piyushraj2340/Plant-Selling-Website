# Secure Opaque Refresh Token Architecture (Phase 5)

## Objective
To replace the current JWT-based refresh token mechanism with a highly secure, Redis-backed opaque token system. This includes proper token rotation, replay attack detection, and stateful session invalidation without bloating the MongoDB database.

## Architecture & Benefits
1. **Opaque Tokens**: Instead of JWTs (which expose data and rely on secret keys for validation), we will use cryptographically secure random hex strings (e.g., `crypto.randomBytes(64)`). These are meaningless to attackers and cannot be decoded.
2. **Stateful Redis Storage**: All refresh tokens will live exclusively in Redis. MongoDB's `tokens` array will be deprecated and removed, vastly reducing database write-loads on every login and refresh.
3. **Token Families & Rotation**: Every new login establishes a "Token Family" (a unique UUID). Every time a token is refreshed, a new token is generated within the same family, and the old token is marked as `revoked`.
4. **Replay Attack Detection**: If an attacker intercepts an old, already-used refresh token and tries to use it, the system will see its state is `revoked`. This triggers a massive security tripwire: it instantly invalidates the entire "Token Family," terminating the attacker's (and unfortunately the victim's) session entirely to secure the account.

## Implementation Steps

### 1. Update `utils/redisService.js`
We need to ensure our Redis service can store objects easily and manage token expiration.
- Add utility functions to handle setting keys with an expiry (7 days for refresh tokens).

### 2. Update `model/userModel/user.js`
- **Deprecate MongoDB Storage**: Remove the `tokens` array from the `userSchema`.
- **Refactor `generateAuthToken`**: 
  - It will now generate an Access Token (JWT, 15m) and an Opaque Refresh Token (crypto hex).
  - It will generate a new `familyId` (UUID).
  - It will store `refreshToken:${token}` -> `{ userId, familyId, revoked: false }` in Redis.
  - Returns both tokens to the controller.

### 3. Update `controllers/authController.js`
- **Login (`signIn`, `signUp`)**: Relies on the newly refactored `generateAuthToken`.
- **Refresh Token Endpoint (`refreshToken`)**:
  - Lookup the presented token in Redis (`refreshToken:${presentedToken}`).
  - **Does not exist?** -> Deny (Expired or completely invalid).
  - **Exists but `revoked: true`?** -> **REPLAY ATTACK!** The system fetches the `familyId` and marks a master key `familyBlacklist:${familyId}` in Redis to `true`. It denies the request.
  - **Exists, `revoked: false`, but `familyBlacklist:${familyId}` is true?** -> Deny (The family was compromised).
  - **Valid?** -> 
    1. Mark the presented token as `revoked: true` in Redis (so it can't be used again).
    2. Generate a new opaque token (RT2) tied to the same `familyId`.
    3. Save RT2 in Redis as `revoked: false`.
    4. Generate a new Access Token.
    5. Return RT2 and Access Token to the client.

### 4. Logout Endpoint (`logout`)
- The user provides their current refresh token.
- We mark it as `revoked: true` and optionally blacklist the `familyId` to proactively kill the session cluster.

## Security Advantages
- Absolute control over session termination (unlike stateless JWTs).
- Instant detection of stolen refresh tokens.
- No DB bloat (MongoDB arrays no longer grow indefinitely on multiple logins).
- Reduced CPU overhead (no JWT signature verification for refresh tokens, just a fast O(1) Redis lookup).
