# LoopChat

LoopChat is a responsive real-time messaging application supporting direct and group conversations using REST APIs and Socket.io.

It includes a marketing landing page, client-side authentication, direct and group chat flows, and real-time message updates.

---

## Live Demo

```text
Landing Page: [(https://loop-chat-beta.vercel.app](https://loop-chat-beta.vercel.app)
Chat Application: [https://loop-chat-beta.vercel.app](https://loop-chat-beta.vercel.app/chat)
```

When hosted in one deployment, `/` is the landing page and `/login` starts the application flow.

---

## Features

- Phone + name login/register flow
- JWT-based authentication
- User search by name or phone
- Direct conversation creation
- Conversation list
- Message history
- Real-time messaging using Socket.io
- Optimistic message sending
- Smart auto-scroll
- Group conversation creation
- Group messaging
- Add/remove group members
- Promote group admins
- Rename groups
- Leave groups
- Real-time group updates
- Loading, empty, and error states
- Responsive desktop/mobile chat experience
- Marketing landing page

---

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- Socket.io Client
- Lucide React
- Deployment platform: [Add deployment platform]

The project intentionally avoids unnecessary state-management libraries. React state, effects, and refs are used to keep the implementation simple and easy to explain.

---

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

```bash
git clone <repository-url>
cd <project-folder>
npm install
```

### Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=https://frontend-task-chatapp.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://frontend-task-chatapp.onrender.com
```

### Run Development Server

```bash
npm run dev
```

Local development runs at:

```text
http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

---

## Application Routes

```text
/       Landing page
/login  Login/register
/chat   Authenticated chat application
```

---

## API Documentation

See [docs/API.md](docs/API.md).

The API documentation was created after manually inspecting the provided live API responses and Socket.io events.

---

# Part 3 - Thought Process

## 1. Architecture and Technical Choices

I used Next.js with TypeScript for the frontend. I kept the architecture intentionally simple because this was a time-limited frontend assignment.

Axios is used for REST requests because a reusable Axios instance made Bearer-token handling straightforward. I used React `useState`, `useEffect`, and `useRef` instead of Redux, Zustand, or TanStack Query because the application state was manageable without another abstraction.

Socket.io Client is used for real-time messaging because the provided backend exposes Socket.io events. REST is used for initial and persistent data such as authentication, conversations, message history, and group actions. Socket.io is used for real-time events such as new messages and conversation updates.

The trade-off is that local state made the implementation faster to build and easier to understand, while a larger production application could benefit from a dedicated server-state or global-state solution.

## 2. Message Architecture

Message history is initially loaded through REST. The API returns history newest-first, so the frontend reverses a copied array and displays messages oldest-to-newest with the newest message at the bottom.

Real-time `message:new` events are appended directly into local React state instead of refetching the full message history. Own sent messages use optimistic UI so the sender sees the message immediately. Temporary optimistic messages are reconciled with the server message to prevent duplicates.

Conversation sidebar refreshes happen silently in the background. This avoids visible loading flashes and makes real-time messaging feel immediate.

## 3. Smart Auto-Scroll

Opening a conversation scrolls to the latest message. If the user is near the bottom, new messages automatically scroll into view.

If the user has scrolled upward to read older messages, the application does not force them back down. A new-message control lets the user return to the latest messages. This was implemented because it was an explicit assignment requirement and improves chat usability.

## 4. Group Conversations

Direct and group messages reuse the same message system. Group-specific APIs are used only for group creation and member/admin management.

Admin controls are displayed only when the current user ID exists in the group's `admins` array. The `conversation:updated` Socket.io event is used to update group information in real time.

## 5. Landing Page Design

The landing page uses a modern communication/SaaS visual direction. The design focuses on showing the product itself rather than using stock photography.

The hero and product preview immediately communicate what LoopChat does. Feature sections focus on real implemented behavior: real-time messaging, direct chats, groups, and smart auto-scroll. The page is responsive and intentionally avoids generic sections such as fake testimonials, pricing, or fake customer logos.

## 6. API Issues and Observations

### Conversation response inconsistency

`GET /conversations` returned an empty raw array when there were no conversations, while a populated response used a `{ data: [...] }` wrapper.

The frontend service normalizes both forms into a plain conversation array.

### Empty messages

The backend accepted and stored an empty message during testing even though the assignment requires empty messages not to be sendable.

The frontend blocks empty and whitespace-only messages before sending.

### Message shape inconsistency

REST message responses use:

```text
_id
createdAt as ISO string
```

Socket.io `message:new` responses use:

```text
id
createdAt as numeric timestamp
```

The frontend normalizes both formats into a shared internal message structure.

### Message ordering

Message history was returned newest-first, so the frontend reverses a copied array for normal chronological chat display.

### Search observation

A partial phone search such as `016` returned an empty result during testing.

This documents only the observed behavior from that test and does not claim that partial phone search is universally unsupported.

## 7. AI Usage

AI tools were used during development for planning implementation steps, generating initial boilerplate, helping structure components and services, reviewing implementation ideas, debugging real-time messaging and loading-state issues, and drafting documentation.

Manual work included inspecting and testing the API with Postman, verifying request and response shapes, testing Socket.io with small Node scripts and multiple users, testing application flows in the browser, reviewing AI-generated code, and correcting behavior when implementation details were wrong.

AI output was not accepted blindly; the implementation was tested and adjusted when behavior did not match the assignment requirements.

## 8. Challenges and Fixes

The most meaningful implementation challenge was that real-time messages initially caused the message history and conversation list to visibly reload.

The final approach appends real-time messages directly to state, reloads message history only when the actual selected conversation changes, and refreshes sidebar conversations silently in the background. A ref is used where needed so Socket.io listeners can access the currently selected conversation without stale state.

Optimistic messages were also added so the sender sees their own message immediately.

## 9. What I Would Improve With More Time

- Older-message pagination or infinite history loading using the API's `hasMore`
- Stronger automated testing
- More robust optimistic-message delivery states such as sent, failed, and retry
- Accessibility testing
- Additional UI polish
- Improved error recovery
- Potentially using a server-state library if the application grew significantly

---

## Testing

Verified while preparing this README:

- `npm run lint` passes
- `npm run build` passes
- `/` renders the landing page
- `/login` serves the login/register route
- `/chat` serves the authenticated chat application route

The following implemented flows should be checked with real browser sessions before final submission:

- Login/logout flow
- Direct conversation flow
- Real-time direct messages
- Group creation
- Group messaging
- Group management
- Real-time updates
- Smart auto-scroll behavior
- Responsive chat UI

No automated end-to-end test suite is included.

---

## Project Structure

```text
src/
├── app/
│   ├── chat/
│   ├── login/
│   └── page.tsx
├── lib/
├── services/
└── types/

docs/
└── API.md
```
