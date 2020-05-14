/* 
    Internal account component test.
    AUTHOR: Group 10 KTH
    VERSION: 2020-05-08-A
*/

const {login, create, check, addDisplay, getUserDisplays, addDisplaySession, addUserSession, sessionsCleaner} = require("./account");

//Add a user session and checks if the session is valid.
test('Add a user session.', () => {
    const id = "testid";
    const session = addUserSession(id)
    check(session, (data) => {
        expect(data).not.toBe(null);
        expect(data.id).toBe(id);
    }, (e) => {
        expect(e).toBe('To never get here.')
    })
});

/*Adds a session and preforms a simulated cleanup for 5h past session was added
  Tests the session and makes sure it is no longer valid.*/
test('Clean session: remove.', () => {
    const id = "testid";
    const session = addUserSession(id)
    sessionsCleaner(new Date().addHours(5));
    check(session, (data) => {
        expect(data).toBe('To never get here.')
    }, (e) => {
        expect(e).toBe("Session has expired.");
    })
});

/*Adds a session and preforms a simulated cleanup for 30m past session was added
  Tests that the session is still valid.*/
test('Clean session: keep.', () => {
    const id = "testid";
    const session = addUserSession(id)
    sessionsCleaner(new Date().addHours(0.5));
    check(session, (data) => {
        expect(data).not.toBe(null);
        expect(data.id).toBe(id);
    }, (e) => {
        expect(e).toBe('To never get here.')
    })
});