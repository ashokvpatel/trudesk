/*
 *       .                             .o8                     oooo
 *    .o8                             "888                     `888
 *  .o888oo oooo d8b oooo  oooo   .oooo888   .ooooo.   .oooo.o  888  oooo
 *    888   `888""8P `888  `888  d88' `888  d88' `88b d88(  "8  888 .8P'
 *    888    888      888   888  888   888  888ooo888 `"Y88b.   888888.
 *    888 .  888      888   888  888   888  888    .o o.  )88b  888 `88b.
 *    "888" d888b     `V88V"V8P' `Y8bod88P" `Y8bod8P' 8""888P' o888o o888o
 *  ========================================================================
 *  Author:     Ashok Patel
 *  Updated:    11/06/20 08:43 PM
 *  Copyright (c) 2014-2019. All rights reserved.
 */

var _ = require('lodash')
var async = require('async')
var winston = require('winston')
var apiUtils = require('../apiUtils')
var Ticket = require('../../../models/ticket')
var Group = require('../../../models/group')
var Department = require('../../../models/department')

var ticketsT1 = {}

ticketsT1.getTypes = function (req, res) {
  async.parallel(
    {
      types: function (callback) {
        var ticketType = require('../../../models/tickettype')
        ticketType.getTypes(function (err, types) {
          if (err) return res.status(400).json({ success: false, error: 'Invalid Post Data' })

          callback(null, types)
        })
      },
      tags: function (callback) {
        var tagSchema = require('../../../models/tag')
        tagSchema.getTags(function (err, tags) {
          if (err) return res.status(400).json({ success: false, error: err })

          _.each(tags, function (item) {
            item.__v = undefined
          })

          callback(null, { success: true, tags: tags })
        })
      }
    },
    function (err, results) {
      return res.json(results)
    }
  )
}

ticketsT1.getUserTickets = function (req, res) {
  var userId = req.params.user
  var limit = req.query.limit ? parseInt(req.query.limit) : 10
  var page = req.params.page ? parseInt(req.params.page) : 0
  if (userId === 0) return res.status(200).json({ success: false, error: 'Please Select User.' })
  if (_.isUndefined(userId)) return res.status(400).json({ success: false, error: 'Invalid User Id.' })

  var ticketModel = require('../../../models/ticket')
  ticketModel.getTicketsByRequesterWithLimit(userId, limit, page, function (err, tickets) {
    if (err) return res.status(400).json(err)
    return res.json(tickets)
  })
}

ticketsT1.search = function (req, res) {
  var userId = req.params.user
  var searchString = req.query.search

  var ticketModel = require('../../../models/ticket')

  ticketModel.getUserTicketsWithSearchString(userId, searchString, function (err, results) {
    if (err) return res.status(400).json({ success: false, error: 'Error - ' + err.message })

    return res.json({
      success: true,
      error: null,
      count: _.size(results),
      totalCount: _.size(results),
      tickets: results
    })
  })
}

ticketsT1.single = function (req, res) {
  var uid = req.params.uid
  if (_.isUndefined(uid)) return res.status(200).json({ success: false, error: 'Invalid Ticket' })

  var ticketModel = require('../../../models/ticket')

  ticketModel.getTicketByUid(uid, function (err, ticket) {
    if (err) return res.send(err)

    if (_.isUndefined(ticket) || _.isNull(ticket)) {
      return res.status(200).json({ success: false, error: 'Invalid Ticket' })
    }

    ticket = _.clone(ticket._doc)
    // if (!permissions.canThis(req.user.role, 'tickets:notes')) {
    //   delete ticket.notes
    // }

    return res.json({ success: true, ticket: ticket })
  })
}

module.exports = ticketsT1
