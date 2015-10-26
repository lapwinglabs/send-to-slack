/**
 * Getting the URL for slack
 *
 * - https://TEAM_NAME.slack.com/services/new/incoming-webhook
 */

/**
 * Module Dependencies
 */

var debug = require('debug')('send-to-slack')
var superagent = require('superagent')
var assign = require('object-assign')
var is_array = Array.isArray

/**
 * Export `Slack`
 */

module.exports = Slack

/**
 * Pass token into slack
 */

function Slack (url) {
  return function slack (options) {
    options = options || {}

    // defaults
    options.username = options.username || 'send-to-slack'
    if (!options.icon_url && !options.icon_emoji) {
      options.icon_emoji = ':bell:'
    }

    return function send (message, fields) {
      var data = assign({}, options)
      data.text = message

      if (fields) {
        if (!data.attachments) data.attachments = []

        if (is_array(fields)) {
          data.attachments = data.attachments.concat(fields)
        } else {
          fields = Object.keys(fields).map(function (title) {
            return {
              title: title,
              value: fields[title],
              short: (fields[title] + '').length < 35
            }
          })

          data.attachments.push({
            fallback: message,
            fields: fields
          })
        }
      }

      debug('sending to slack: %j', data)
      superagent.post(url)
        .type('form')
        .send({ payload: JSON.stringify(data) })
        .end(function (err, res) {
          if (err) debug('could not send to slack: %s', err.stack)
          else debug('sent to slack: %j', data)
        })
    }
  }
}

