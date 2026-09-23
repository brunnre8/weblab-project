### Aug 31:

17:00 - 22:00

Research about Oauth / OIDC , CSRF protection, session / cookie handling

### Sep 04:

15:00 - 16:00

Typescript setup of backend

### Sep 05:

08:00 - 15:30

setup sqlite DB / models / interfaces for the store / credential check functions

### Sep 06:
10:00 - 20:40

implement user and todo stores / todo controller, service and corresponding tests / server integration test

### Detailed log
`git shortlog --group=format:%as --format="%aD %s" --date=format:%R`

2026-08-31 (6):
      Mon, 31 Aug 2026 12:39:19 +0200 scaffold
      Mon, 31 Aug 2026 12:55:00 +0200 rename
      Mon, 31 Aug 2026 14:51:19 +0200 first draft design and overview
      Mon, 31 Aug 2026 16:15:33 +0200 design: login / logout
      Mon, 31 Aug 2026 16:33:59 +0200 design: tech stack
      Mon, 31 Aug 2026 21:56:28 +0200 worklog day1

2026-09-01 (2):
      Tue, 1 Sep 2026 06:17:38 +0200 design: deactivate user
      Tue, 1 Sep 2026 16:07:56 +0200 move frontend

2026-09-02 (15):
      Wed, 2 Sep 2026 07:17:35 +0200 GH workflow
      Wed, 2 Sep 2026 07:26:39 +0200 move eslint config
      Wed, 2 Sep 2026 07:36:21 +0200 workflow: fix cd
      Wed, 2 Sep 2026 07:44:54 +0200 @!%$$
      Wed, 2 Sep 2026 08:07:35 +0200 workflow: cd must be before node
      Wed, 2 Sep 2026 08:12:22 +0200 yaml is a wonderful format
      Wed, 2 Sep 2026 08:15:47 +0200 run steps are independent
      Wed, 2 Sep 2026 08:22:49 +0200 debug workflow
      Wed, 2 Sep 2026 08:41:33 +0200 specify master branch
      Wed, 2 Sep 2026 08:54:25 +0200 design: fix angular name
      Wed, 2 Sep 2026 09:36:37 +0200 jiti is a dev dependency
      Wed, 2 Sep 2026 13:58:07 +0200 TS: enable strict
      Wed, 2 Sep 2026 14:34:55 +0200 rip out temporal
      Wed, 2 Sep 2026 15:22:08 +0200 rip out dummy component
      Wed, 2 Sep 2026 22:02:37 +0200 update workflow

2026-09-03 (2):
      Thu, 3 Sep 2026 13:27:37 +0200 server boilerplate
      Thu, 3 Sep 2026 14:07:09 +0200 change dest dir

2026-09-04 (3):
      Fri, 4 Sep 2026 11:20:56 +0200 eslint config
      Fri, 4 Sep 2026 11:21:02 +0200 zod / test deps
      Fri, 4 Sep 2026 15:33:59 +0200 convert to module with native node support

2026-09-05 (14):
      Sat, 5 Sep 2026 08:23:30 +0200 user models
      Sat, 5 Sep 2026 08:23:39 +0200 auth mw and scaffold
      Sat, 5 Sep 2026 11:31:22 +0200 introduce sqlite store
      Sat, 5 Sep 2026 11:58:29 +0200 typo
      Sat, 5 Sep 2026 11:58:48 +0200 user store
      Sat, 5 Sep 2026 14:03:02 +0200 add userCreds
      Sat, 5 Sep 2026 14:03:24 +0200 rename owner
      Sat, 5 Sep 2026 14:04:45 +0200 formatting
      Sat, 5 Sep 2026 14:06:25 +0200 creds: expose the user id
      Sat, 5 Sep 2026 14:11:30 +0200 replace magic constants
      Sat, 5 Sep 2026 14:13:09 +0200 we aren't in go
      Sat, 5 Sep 2026 15:07:54 +0200 docstring
      Sat, 5 Sep 2026 15:19:24 +0200 userStore: add cheap way to test for users
      Sat, 5 Sep 2026 15:25:22 +0200 fix build

2026-09-06 (36):
      Sun, 6 Sep 2026 10:56:17 +0200 sqliteStore: implement userstore (mostly)
      Sun, 6 Sep 2026 11:47:59 +0200 TS: stricter optional handling
      Sun, 6 Sep 2026 11:58:36 +0200 sqliteStore: test email collision
      Sun, 6 Sep 2026 11:59:05 +0200 server: auto enter admin user
      Sun, 6 Sep 2026 12:05:37 +0200 test: explain assertion
      Sun, 6 Sep 2026 12:11:20 +0200 migration log is too noisy, remove
      Sun, 6 Sep 2026 12:12:03 +0200 rm stray console.log
      Sun, 6 Sep 2026 12:13:47 +0200 remove dummy test file
      Sun, 6 Sep 2026 12:16:16 +0200 whitespace
      Sun, 6 Sep 2026 12:43:49 +0200 todo store implementation
      Sun, 6 Sep 2026 12:46:15 +0200 one import style
      Sun, 6 Sep 2026 12:48:52 +0200 sqlite: add test for invalid owner
      Sun, 6 Sep 2026 13:28:15 +0200 sqlite spec: close db
      Sun, 6 Sep 2026 13:36:22 +0200 userCreds spec
      Sun, 6 Sep 2026 13:55:27 +0200 todoStore: we need to limit list by owner
      Sun, 6 Sep 2026 15:08:37 +0200 rename mw folder
      Sun, 6 Sep 2026 15:40:09 +0200 errors middleware
      Sun, 6 Sep 2026 16:37:33 +0200 todo: add controller and implement patch
      Sun, 6 Sep 2026 17:28:47 +0200 comment
      Sun, 6 Sep 2026 17:39:34 +0200 todo: allow deletion
      Sun, 6 Sep 2026 17:44:12 +0200 app: wire up todo router
      Sun, 6 Sep 2026 17:49:04 +0200 clean imports
      Sun, 6 Sep 2026 17:50:26 +0200 fix expected mountpoint
      Sun, 6 Sep 2026 18:31:00 +0200 fix error messages
      Sun, 6 Sep 2026 18:32:43 +0200 todoService: happy path tests
      Sun, 6 Sep 2026 18:43:44 +0200 todo service: fix getTodo
      Sun, 6 Sep 2026 18:49:50 +0200 add admin test
      Sun, 6 Sep 2026 19:01:30 +0200 todo service: permission checks
      Sun, 6 Sep 2026 19:03:39 +0200 todo service: test that enoent works
      Sun, 6 Sep 2026 19:13:20 +0200 fix request payload
      Sun, 6 Sep 2026 19:18:35 +0200 server: extract express config to function
      Sun, 6 Sep 2026 20:17:55 +0200 supertest types
      Sun, 6 Sep 2026 20:18:11 +0200 todo controller: add test and fix the bugs ;)
      Sun, 6 Sep 2026 20:22:09 +0200 test name
      Sun, 6 Sep 2026 20:32:34 +0200 extract createExpressApp function
      Sun, 6 Sep 2026 20:41:56 +0200 worklog

2026-09-07 (2):
      Mon, 7 Sep 2026 08:06:43 +0200 user input validation
      Mon, 7 Sep 2026 08:54:41 +0200 sqlite: userCreds insertion / retrieval

2026-09-12 (15):
      Sat, 12 Sep 2026 08:53:06 +0200 add csrf mw
      Sat, 12 Sep 2026 12:38:51 +0200 update usercreds
      Sat, 12 Sep 2026 12:40:46 +0200 actually use local rather than global
      Sat, 12 Sep 2026 12:43:15 +0200 only run migrations that are missing
      Sat, 12 Sep 2026 13:29:49 +0200 user and creds insertion need to be atomic
      Sat, 12 Sep 2026 14:22:48 +0200 user service
      Sat, 12 Sep 2026 15:23:55 +0200 user service: bad input tests and handling
      Sat, 12 Sep 2026 16:49:56 +0200 use new var
      Sat, 12 Sep 2026 16:51:52 +0200 rm dead imports
      Sat, 12 Sep 2026 17:23:01 +0200 user store: wrap constraint error on insert
      Sat, 12 Sep 2026 17:33:35 +0200 conflict error mw
      Sat, 12 Sep 2026 17:33:49 +0200 user service: throw ErrConflict
      Sat, 12 Sep 2026 17:46:50 +0200 sqlite: ErrConstraint on update with duped email
      Sat, 12 Sep 2026 18:04:20 +0200 user service: update
      Sat, 12 Sep 2026 18:22:34 +0200 user store: delete

2026-09-13 (12):
      Sun, 13 Sep 2026 09:03:34 +0200 user service: wrap errors in mw types
      Sun, 13 Sep 2026 09:08:58 +0200 todo controller: fix naming
      Sun, 13 Sep 2026 09:39:50 +0200 user controller
      Sun, 13 Sep 2026 09:51:02 +0200 delete unused conditional
      Sun, 13 Sep 2026 10:16:52 +0200 express error handler need to be registered last
      Sun, 13 Sep 2026 10:19:48 +0200 mw: admin only
      Sun, 13 Sep 2026 10:20:02 +0200 user controller
      Sun, 13 Sep 2026 10:49:53 +0200 todo service: properly return 404s
      Sun, 13 Sep 2026 10:51:30 +0200 server: 404 tests for users
      Sun, 13 Sep 2026 10:52:42 +0200 todo
      Sun, 13 Sep 2026 11:22:57 +0200 wire up csrf middleware
      Sun, 13 Sep 2026 18:11:13 +0200 mustString tests

2026-09-15 (6):
      Tue, 15 Sep 2026 13:59:04 +0200 sqlite authtokenstore
      Tue, 15 Sep 2026 14:48:41 +0200 cookie-parser
      Tue, 15 Sep 2026 14:49:01 +0200 auth service and partial controller
      Tue, 15 Sep 2026 14:52:29 +0200 logout
      Tue, 15 Sep 2026 14:59:04 +0200 wire up auth controller
      Tue, 15 Sep 2026 15:01:50 +0200 logout: clearcookie

2026-09-16 (1):
      Wed, 16 Sep 2026 07:43:55 +0200 fix build

2026-09-18 (17):
      Fri, 18 Sep 2026 08:08:52 +0200 move csrf mw to server
      Fri, 18 Sep 2026 08:26:31 +0200 redirect after login/logout
      Fri, 18 Sep 2026 08:36:14 +0200 export cookie name to const
      Fri, 18 Sep 2026 10:03:00 +0200 wire up login
      Fri, 18 Sep 2026 10:17:29 +0200 give admin a password
      Fri, 18 Sep 2026 10:37:19 +0200 auth mw: 401 user rather than redirect
      Fri, 18 Sep 2026 12:53:01 +0200 log errors in middleware
      Fri, 18 Sep 2026 12:54:13 +0200 auth controller: send 401 on bad credentials
      Fri, 18 Sep 2026 12:55:42 +0200 sqlite: auth tokens can't be unique
      Fri, 18 Sep 2026 14:56:15 +0200 angular proxy conf
      Fri, 18 Sep 2026 14:56:23 +0200 change title
      Fri, 18 Sep 2026 14:56:34 +0200 app: make app root a flex container
      Fri, 18 Sep 2026 14:57:07 +0200 login wip
      Fri, 18 Sep 2026 15:00:12 +0200 breakpoints should be vars
      Fri, 18 Sep 2026 15:02:02 +0200 css: var(--max-width-form)
      Fri, 18 Sep 2026 15:51:11 +0200 validate input for login
      Fri, 18 Sep 2026 15:53:06 +0200 email validation

2026-09-19 (19):
      Sat, 19 Sep 2026 12:17:28 +0200 frontend: move model
      Sat, 19 Sep 2026 12:17:41 +0200 frontend zod
      Sat, 19 Sep 2026 12:18:23 +0200 fe: todo service
      Sat, 19 Sep 2026 12:18:48 +0200 router: inject component inputs
      Sat, 19 Sep 2026 12:19:12 +0200 fix import
      Sat, 19 Sep 2026 12:23:46 +0200 dropme: add dummy route for list
      Sat, 19 Sep 2026 13:43:14 +0200 fe: move todoview
      Sat, 19 Sep 2026 13:43:33 +0200 fe: router input binding for tests
      Sat, 19 Sep 2026 13:44:51 +0200 fixup! fe: move todoview
      Sat, 19 Sep 2026 14:27:18 +0200 todo view: ellipsize text
      Sat, 19 Sep 2026 14:54:02 +0200 make todo list widget
      Sat, 19 Sep 2026 14:54:11 +0200 additional dummy data
      Sat, 19 Sep 2026 15:38:58 +0200 fe: wire up todo list
      Sat, 19 Sep 2026 17:45:53 +0200 backend: add dummy todos
      Sat, 19 Sep 2026 17:49:03 +0200 fe: validate input for todos
      Sat, 19 Sep 2026 17:58:04 +0200 remove dummy route
      Sat, 19 Sep 2026 17:58:14 +0200 remove debug leftovers
      Sat, 19 Sep 2026 17:58:27 +0200 fix test
      Sat, 19 Sep 2026 18:26:26 +0200 disabled unused csrf double submit cookie mw

2026-09-20 (23):
      Sun, 20 Sep 2026 10:01:51 +0200 send 403 rather than 404
      Sun, 20 Sep 2026 10:06:00 +0200 authcontroller: signal that login is disallowed by admin
      Sun, 20 Sep 2026 12:30:33 +0200 fe: redirect on auth failure
      Sun, 20 Sep 2026 14:27:28 +0200 full screen todo
      Sun, 20 Sep 2026 16:17:18 +0200 delete implemented
      Sun, 20 Sep 2026 16:55:39 +0200 use rxjs helper rather than manually doing it
      Sun, 20 Sep 2026 17:08:02 +0200 rm stray console.log
      Sun, 20 Sep 2026 17:57:32 +0200 backend: expose GET /todos/:id
      Sun, 20 Sep 2026 18:09:22 +0200 fe: always get the todo from the server if expanded
      Sun, 20 Sep 2026 19:35:13 +0200 server: await dummy insert
      Sun, 20 Sep 2026 19:40:02 +0200 rm unused import
      Sun, 20 Sep 2026 19:40:10 +0200 backend: better TodoInput validation
      Sun, 20 Sep 2026 19:41:43 +0200 fe: wire up edit route
      Sun, 20 Sep 2026 20:17:07 +0200 fe: implement todo edit
      Sun, 20 Sep 2026 20:27:16 +0200 fe: navigate back on cancel
      Sun, 20 Sep 2026 20:31:39 +0200 unused import
      Sun, 20 Sep 2026 20:45:33 +0200 fe: dynamically size todo form input
      Sun, 20 Sep 2026 21:04:54 +0200 fe: submit must clear the history state
      Sun, 20 Sep 2026 21:24:05 +0200 todo grid: add "add todo" button
      Sun, 20 Sep 2026 21:32:17 +0200 add dummy router to tests
      Sun, 20 Sep 2026 22:00:21 +0200 push FAB to the bottom where it belongs
      Sun, 20 Sep 2026 23:34:13 +0200 fix test
      Sun, 20 Sep 2026 23:57:50 +0200 show focus indicator on grid

2026-09-21 (4):
      Mon, 21 Sep 2026 18:48:04 +0200 new todo
      Mon, 21 Sep 2026 18:51:13 +0200 ensure user can click title if none exists
      Mon, 21 Sep 2026 20:03:40 +0200 mw: split user addition from policy
      Mon, 21 Sep 2026 20:14:57 +0200 be: /auth/self

2026-09-22 (9):
      Tue, 22 Sep 2026 13:29:55 +0200 backend: send user after login
      Tue, 22 Sep 2026 13:30:57 +0200 fe: track identity of self
      Tue, 22 Sep 2026 13:32:04 +0200 navbar: show users link
      Tue, 22 Sep 2026 13:53:11 +0200 theme material as god intended
      Tue, 22 Sep 2026 14:09:58 +0200 css: revert partially
      Tue, 22 Sep 2026 14:23:16 +0200 be: logout shouldn't redirect
      Tue, 22 Sep 2026 14:23:56 +0200 fe: logout functionality
      Tue, 22 Sep 2026 14:27:23 +0200 move logout to login feature
      Tue, 22 Sep 2026 14:31:32 +0200 remove feature folder indirection

2026-09-23 (24):
      Wed, 23 Sep 2026 10:30:48 +0200 basic user list mock
      Wed, 23 Sep 2026 10:56:16 +0200 try to fit user table on the screen
      Wed, 23 Sep 2026 14:14:50 +0200 eslint: shut up
      Wed, 23 Sep 2026 14:23:21 +0200 user edit dialog
      Wed, 23 Sep 2026 14:23:27 +0200 user list component
      Wed, 23 Sep 2026 14:44:11 +0200 deleting the last admin is no good...
      Wed, 23 Sep 2026 15:07:43 +0200 move text out of user table
      Wed, 23 Sep 2026 17:04:06 +0200 login: show errors
      Wed, 23 Sep 2026 17:31:39 +0200 fix column name
      Wed, 23 Sep 2026 17:32:04 +0200 server: use persistent store
      Wed, 23 Sep 2026 17:32:14 +0200 login: dismiss snackbar on success
      Wed, 23 Sep 2026 17:33:53 +0200 new user
      Wed, 23 Sep 2026 17:41:27 +0200 fix message
      Wed, 23 Sep 2026 17:48:01 +0200 login: write message for disabled log in attempt
      Wed, 23 Sep 2026 17:48:24 +0200 user service, we get a user back, might as well expose it
      Wed, 23 Sep 2026 18:25:34 +0200 user removal
      Wed, 23 Sep 2026 18:46:47 +0200 user-list: guard against disable too
      Wed, 23 Sep 2026 18:47:09 +0200 sqlite: fix insert signature for todos
      Wed, 23 Sep 2026 18:48:53 +0200 populate initial admin
      Wed, 23 Sep 2026 19:29:59 +0200 fe: dialog tests need a funny harness
      Wed, 23 Sep 2026 20:01:54 +0200 move delete user action to edit modal
      Wed, 23 Sep 2026 20:20:41 +0200 server: allow db location / secure setup via env vars
      Wed, 23 Sep 2026 22:00:03 +0200 lighthouse problems
      Wed, 23 Sep 2026 22:00:55 +0200 add caddyfile for local runs
