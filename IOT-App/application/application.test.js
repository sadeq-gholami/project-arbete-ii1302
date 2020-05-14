var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");
var appen  = require('./application.js');
var org = "cl3hm5";
var apiKey = "a-cl3hm5-kuvpyv8zmp";
var apiToken = "DjhvwofU*M6BtvJXL8";

describe('Emitt testing', () => {
  it('should emit a test_event', function(done){
    let app = new appen(org, apiKey, apiToken);
    app.on('test_event', function(){
      done();
    });
    // execute some code which should trigger 'some_event' on app
    app.emit('test_event');
  });
});

describe('Test fetch request', () => {
  let mock = new MockAdapter(axios);
  let app = new appen(org, apiKey, apiToken);
  it('fetch and test response', async() => {
      const url = 'https://iot-display.herokuapp.com/display/get/5e8c8382c5c0f600242851f4'
      const data = { response: {data: {
        display: {
          id: '5e8c8382c5c0f600242851f4',
          name: 'test',
          message: {text: "II-1302"}
        }
      },
    }};
    mock.onGet(url).reply(200, data);

    return app
      .retrieveMessage(url)
      .then(res => expect(res).toEqual(data));
  });
});
