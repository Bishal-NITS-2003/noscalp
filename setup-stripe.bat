@echo off
REM Stripe Payment Gateway - Setup Script (Windows)
REM This script helps you set up the Stripe payment gateway for the Eventick project

echo.
echo 🎫 Eventick - Stripe Payment Gateway Setup
echo ==========================================
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo 📝 Creating .env.local file...
    copy .env.example .env.local
    echo ✅ .env.local created from .env.example
) else (
    echo ℹ️  .env.local already exists
)

echo.
echo 📋 Next Steps:
echo.
echo 1. Get your Stripe test keys:
echo    → Visit: https://dashboard.stripe.com/test/apikeys
echo    → (Sign up at https://dashboard.stripe.com/register if needed)
echo.
echo 2. Edit .env.local and add your keys:
echo    → NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
echo    → STRIPE_SECRET_KEY=sk_test_...
echo.
echo 3. Install dependencies (if not done):
echo    → pnpm install
echo.
echo 4. Start the development server:
echo    → pnpm dev
echo.
echo 5. Test the payment:
echo    → Go to http://localhost:3000
echo    → Select event → Choose seats → Checkout
echo    → Use test card: 4242 4242 4242 4242
echo.
echo 📚 Documentation:
echo    → Quick Start: STRIPE_QUICKSTART.md
echo    → Full Guide: STRIPE_PAYMENT_INTEGRATION.md
echo    → Flow Diagram: STRIPE_PAYMENT_FLOW_DIAGRAM.md
echo.
echo ✨ Happy testing!
echo.
pause
