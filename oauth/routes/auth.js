const express = require('express')
const passport = require('passport')
const router = express.Router()

// @desc  Authenticate with Google
// @route GET /auth/google
router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}))

// @desc  Google auth callback
// @route GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/'
}), (request, response) => {
  response.redirect('/dashboard')
})

// @desc    Logout user
// @route   /auth/logout
router.get('/logout', (request, response) => {
  request.logout(err => {
    if(err) {
      return next(err)
    }
    response.redirect('/')
  })
})

module.exports = router
