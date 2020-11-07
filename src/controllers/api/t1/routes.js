/*
 *       .                             .o8                     oooo
 *    .o8                             "888                     `888
 *  .o888oo oooo d8b oooo  oooo   .oooo888   .ooooo.   .oooo.o  888  oooo
 *    888   `888""8P `888  `888  d88' `888  d88' `88b d88(  "8  888 .8P'
 *    888    888      888   888  888   888  888ooo888 `"Y88b.   888888.
 *    888 .  888      888   888  888   888  888    .o o.  )88b  888 `88b.
 *    "888" d888b     `V88V"V8P' `Y8bod88P" `Y8bod8P' 8""888P' o888o o888o
 *  ========================================================================
 *  Author:     Chris Brame
 *  Updated:    2/18/19 5:59 PM
 *  Copyright (c) 2014-2019. All rights reserved.
 */

var packagejson = require('../../../../package')

module.exports = function (middleware, router, controllers) {
  // ShortenVars
  var apiT1 = middleware.api
  var apiCtrl = controllers.api.t1

  router.get('/api/t1/tickets/types', apiCtrl.tickets.getTypes)
  router.get('/api/t1/tickets/user/:user', apiCtrl.tickets.getUserTickets)
  router.get('/api/t1/tickets/user/:user/search', apiCtrl.tickets.search)
  router.get('/api/t1/tickets/:uid', apiCtrl.tickets.single)
}
