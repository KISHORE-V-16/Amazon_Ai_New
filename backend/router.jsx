const express = require('express');
const controller = require('./controller.jsx');
const checkout = require('./checkout_router.jsx');
const admin_controller = require('./admin-authorization/admin_controller.jsx');
const router = express.Router();

router.post('/send-code', controller.sendVerificationCode);
router.post('/verify-code', controller.verifyCode);
router.post('/send-email-code',controller.SendEmailcode);
router.post('/verify-email-code',controller.validateEmailcode);
router.get('/verifier',admin_controller.decodeToken);
router.post('/checkout-sessions',checkout.stripe_payment);

module.exports = router;