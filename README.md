# LoopChat

LoopChat is a responsive real-time messaging frontend built for a take-home assignment. It combines a product landing page with phone-and-name authentication, direct and group conversations, REST-based history, and Socket.io delivery through a provided external API.

## Links

- Landing page: [https://loop-chat-beta.vercel.app](https://loop-chat-beta.vercel.app)
- Chat application: [https://loop-chat-beta.vercel.app/chat](https://loop-chat-beta.vercel.app/chat)
- Repository: [https://github.com/miazi2003/LoopChat](https://github.com/miazi2003/LoopChat)
- API documentation: [docs/API.md](docs/API.md)

The links above returned HTTP 200 during the final repository audit on August 22, 2026. Authenticated and two-user realtime flows still require normal browser QA when evaluating a deployment.

## Features

- Phone and name login/register flow
- Bearer JWT authentication for REST and Socket.io
- User search by name or phone
- Direct conversation creation
- Group creation and group messaging
- Group rename, add member, remove member, promote admin, and leave actions
- REST message history normalized into a shared message shape
- Realtime `message:new` and `conversation:updated` handling
- Optimistic message sending with Socket acknowledgement and reconciliation
- Immediate sidebar preview/order updates
- Session-only unread badges for inactive conversations
- Smart auto-scroll with a new-message indicator when reading older messages
- Branded initial, search, and action loading states
- Empty and error states
- Responsive landing, login, chat, and group dialogs
- Reduced-motion-aware landing animations and smooth section navigation

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Axios
- Socket.io Client
- Lucide React
- shadcn/ui primitives backed by Base UI
- Sonner
- Motion (`motion/react`)
- Vercel deployment

The project intentionally avoids Redux, Zustand, TanStack Query, React Hook Form, and similar abstractions. The current scope is manageable with local React state, effects, refs, typed services, and focused reusable components.

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

```bash
git clone https://github.com/miazi2003/LoopChat.git
cd LoopChat
npm install
```

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=https://frontend-task-chatapp.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://frontend-task-chatapp.onrender.com
```

These are public service URLs, not secrets. Never place JWTs or private credentials in `NEXT_PUBLIC_*` variables.

Start development:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production validation:

```bash
npm run lint
npx tsc --noEmit
npm run build
npm start
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Product landing page |
| `/login` | Login or automatic registration |
| `/chat` | Client-protected messaging application |

## Architecture

```text
UI routes and components
        |
        v
typed service functions
        |
        +----> shared Axios instance ----> provided REST API
        |
        +----> Socket.io helper ---------> provided Socket server
```

- `src/app` owns route composition and page-level state.
- `src/components/chat` contains presentation and chat interaction surfaces.
- `src/components/groups` contains group management dialogs and member actions.
- `src/components/landing` contains the product landing page.
- `src/components/shared` contains reusable loading and reveal primitives.
- `src/services` contains REST calls; components do not call Axios directly.
- `src/lib` contains the shared Axios instance and Socket factory.
- `src/types` defines the internal user, conversation, and message contracts.
- `src/utils` handles formatting, API error extraction, and message normalization/reconciliation.

`src/app/chat/page.tsx` is the page-level state owner. This is deliberately explicit for a take-home-sized application: conversation, message, group-action, unread, and scroll state remain easy to trace in one place, while rendering is split into focused components. A larger product would likely extract domain hooks or introduce server-state caching.

## Authentication Approach

`POST /auth/login` accepts a name and phone number. The provided API logs in an existing phone or creates a new user for a unique phone. The returned JWT is stored under `localStorage.token`.

The shared Axios request interceptor reads that token and adds:

```http
Authorization: Bearer <token>
```

The Socket helper sends the same JWT as:

```ts
auth: { token }
```

LocalStorage is an assignment trade-off, not a claim of stronger security. This is a frontend-only project using a provided bearer-token API, and there is no application backend available to issue an HttpOnly session cookie. In a production architecture, an HttpOnly cookie and backend-for-frontend could reduce JavaScript token exposure, depending on the API and CSRF model.

## Message and Realtime Approach

Message history is loaded through REST. The API returns messages newest-first with `_id` and ISO timestamps. `getMessages()` copies, reverses, and maps that data into the internal `Message` type.

Socket `message:new` events use `id` and numeric timestamps. They are normalized before entering state. Active-conversation events append or reconcile directly without refetching message history. The sidebar preview is updated locally immediately, then the conversation list is silently refetched for server reconciliation.

Sending follows this flow:

```text
trim input
  -> append temporary message
  -> clear composer and update sidebar locally
  -> emit message:send with a 10-second acknowledgement timeout
  -> reconcile message:new against the temporary message
  -> remove/restore on failure
```

The optimistic matcher uses conversation, sender, text, and a short timestamp window because the provided Socket contract does not accept or return a client correlation ID. That is intentionally simple; a production protocol should echo a client-generated id for exact reconciliation.

## Smart Auto-Scroll

The message list is the real internal scroll container (`flex-1 min-h-0 overflow-y-auto`). Opening a conversation sets a conversation-specific post-render trigger and scrolls after two animation frames so the rendered history is measured correctly.

For realtime messages, the code computes the distance from the bottom. When the user is within roughly 100 pixels, the next render scrolls down. When the user is reading older messages, their position is preserved and a `New messages` control appears instead.

## Initial Loading vs Background Refresh

Visible loaders are reserved for initial auth, empty conversation/message loads, searches, and explicit group actions. Socket-driven conversation refreshes call the existing loader with `showLoading = false`, so current content remains visible. `message:new` never reloads active history.

## Group Permissions

Admin controls are shown only when the current user id appears in the group's `admins` array. This is a UX decision, not a security boundary. The provided backend remains responsible for authorizing rename, add, remove, and promotion requests; backend errors are shown through Sonner.

## Unread Count Limitation

The provided API does not expose `unreadCount`, `lastReadAt`, or read-receipt state. LoopChat therefore keeps unread counts in client session state only. Counts reset after a page refresh and are not presented as authoritative server data.

# Part 3: Thought Process

## Technical Decisions and Trade-offs

1. **Local React state instead of a global store:** The app has one main chat state owner and a small route surface. This keeps data flow explicit. A larger multi-route product could justify a store or server-state library.
2. **REST plus Socket.io:** REST provides initial/persistent state; Socket.io provides low-latency events. Silent REST reconciliation protects against local sidebar drift.
3. **Optimistic sending:** It improves perceived speed but requires temporary identity, failure recovery, and server-event reconciliation.
4. **LocalStorage JWT:** It fits the provided frontend-only bearer API and Socket handshake, but an HttpOnly cookie/BFF would be preferable in many production systems.
5. **Refs for listener-sensitive state:** The Socket listener reads selected conversation, current user, and near-bottom status from refs to avoid stale closures without reconnecting on every render.
6. **Message normalization:** One internal type prevents REST `_id`/ISO timestamps and Socket `id`/numeric timestamps from leaking throughout UI components.
7. **Frontend permission hiding:** It creates a clear group UI, while backend authorization remains the actual security enforcement.
8. **Motion only on the landing page:** Small transform/opacity reveals improve presentation without introducing animation into the scroll-sensitive chat application.

## Landing Page Design

The landing page uses a green messaging identity, people-focused visual assets, and an actual LoopChat product screenshot. The hero communicates direct chat, groups, and realtime delivery in the first viewport. The feature accordion, experience band, and final CTA avoid unsupported pricing, testimonials, or platform claims.

Animations are deliberately short, run once, and use transform/opacity. Section navigation uses real anchor links plus reduced-motion-aware smooth scrolling. The layout collapses naturally for mobile, while large product imagery is served through `next/image`.

## API Issues Observed

- Empty and populated `GET /conversations` responses used different wrapper shapes. The conversation service normalizes both to an array.
- Direct-conversation creation and list responses represent participants differently.
- Message history was observed newest-first; the service reverses a copy.
- REST messages use `_id` and ISO dates; Socket messages use `id` and numeric timestamps.
- The backend accepted an empty REST message; the UI blocks empty and whitespace-only text.
- A partial phone query such as `016` returned no result in one observed test.
- An invalid REST message conversation returned `null`; its status was not recorded.

See [docs/API.md](docs/API.md) for verified payloads, responses, and Socket events.

## AI Usage

AI tools were used as a development assistant for tasks such as boilerplate generation, UI direction exploration, debugging suggestions, documentation drafting, and reviewing potential edge cases.

The core application logic, API integration, realtime Socket.io flow, message handling, group functionality, state management decisions, and overall implementation were developed and integrated by me. I also manually inspected the provided API, verified response shapes, tested application flows in the browser, reviewed generated suggestions, and adjusted or rejected them whenever they did not match the actual API behavior or project requirements.

AI was mainly used to speed up repetitive work and provide a second perspective during debugging and review, rather than as a replacement for understanding or implementing the application.

## Challenges and Lessons

- Realtime events originally triggered visible history loading; direct state append plus silent sidebar refresh removed the flash.
- A stale selected-conversation closure stopped active realtime delivery; a ref lets the single listener read the current id.
- The message panel originally grew with content; viewport height, `min-h-0`, and one internal scroll container restored smart scrolling.
- Conversation-open scrolling ran too early; a conversation-specific trigger and two animation frames wait for rendered history.
- Sidebar previews lagged; local preview/reorder now happens before silent REST reconciliation.
- Optimistic echoes could duplicate messages; temporary messages are matched and replaced by server events.
- Rapid conversation switching could apply stale history; effect cleanup guards now ignore obsolete responses.

## Future Improvements

- Automated unit, integration, and two-browser end-to-end tests
- Older-message pagination using the API's `hasMore` field once request parameters are verified
- HttpOnly cookie/BFF authentication where architecture permits
- Explicit Socket connection/reconnection status and retry UX
- Server-backed unread/read state if the API adds it
- Client correlation ids and richer sent/failed/retry message states
- Accessibility testing with screen readers and automated tooling
- Error monitoring and performance telemetry
- Domain hooks or server-state caching if the product grows beyond one chat route

## Validation

The final audit runs:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

There is currently no automated test suite. Core realtime, group, responsive, and auto-scroll flows were verified manually during development.

## Project Structure

```text
src/
|-- app/
|   |-- chat/page.tsx
|   |-- login/page.tsx
|   |-- globals.css
|   |-- layout.tsx
|   `-- page.tsx
|-- components/
|   |-- chat/
|   |-- groups/
|   |-- landing/
|   |-- shared/
|   `-- ui/
|-- lib/
|-- services/
|-- types/
`-- utils/

docs/
`-- API.md
```
