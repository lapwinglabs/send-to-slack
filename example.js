
var assert = require('assert')

// slack message
assert.ok(process.env.SLACK_URL, `
  Must include SLACK_URL as an env to run this test.

  You can generate one here: https://TEAM_NAME.slack.com/services/new/incoming-webhook
`)

var slack = require('./')(process.env.SLACK_URL)

var send = slack({
  channel: '@mnm'
})

send('hi @mnm!', {
  test: 'value this is another value',
  woohoo: 'value this is another value'
})

