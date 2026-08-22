# Chat API Documentation

## API Overview

This API supports:

- Authentication
- User search
- Direct conversations
- Group conversations
- Message history
- Sending messages
- Real-time messaging through Socket.io
- Group update events

REST API base URL:

```text
https://frontend-task-chatapp.onrender.com/api
```

Socket.io server URL:

```text
https://frontend-task-chatapp.onrender.com
```

Health endpoint:

```text
https://frontend-task-chatapp.onrender.com/health
```

Important: the Socket.io connection uses the server root URL and must not use the `/api` REST prefix.

## Authentication

Protected REST endpoints require:

```http
Authorization: Bearer <token>
```

Socket.io authentication uses the same JWT:

```js
const socket = io("https://frontend-task-chatapp.onrender.com", {
  auth: {
    token
  }
});
```

## Auth

### POST `/auth/login`

Logs in an existing user or automatically registers a new user when the phone number does not already exist.

Authentication required: No

#### Request Body

```json
{
  "phone": "+8801608072719",
  "name": "Yeasin Miazi"
}
```

#### Verified Success Response

```json
{
  "token": "JWT_TOKEN",
  "user": {
    "_id": "6a88950ce5d6aac97523f0a7",
    "name": "Yeasin Miazi",
    "phone": "+8801608072719",
    "createdAt": "2026-08-21T18:12:28.513Z"
  }
}
```

#### Notes

- There is no separate signup endpoint.
- A new phone number creates a user automatically.
- An existing phone number logs in the existing user.
- The returned JWT must be sent with protected REST requests.
- The same JWT is used for the Socket.io handshake.

### GET `/auth/me`

Returns the currently authenticated user.

Authentication required: Yes

#### Verified Success Status

```text
200 OK
```

#### Verified Success Response

```json
{
  "_id": "6a88950ce5d6aac97523f0a7",
  "name": "Yeasin Miazi",
  "phone": "+8801608072719",
  "createdAt": "2026-08-21T18:12:28.513Z"
}
```

#### Missing Token

Verified status:

```text
400 Bad Request
```

Response:

```json
{
  "error": {
    "message": "No token provided",
    "code": "NO_TOKEN"
  }
}
```

#### Invalid Token

Verified status:

```text
401 Unauthorized
```

Response:

```json
{
  "error": {
    "message": "Invalid token",
    "code": "INVALID_TOKEN"
  }
}
```

## Users

### GET `/users/search`

Searches users by name or phone number.

Authentication required: Yes

#### Query Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `q` | string | Yes | Search term containing a user's name or phone number |

Example:

```http
GET /users/search?q=Yeasin
```

#### Verified Successful Search Response

```json
[
  {
    "_id": "6a88950ce5d6aac97523f0a7",
    "name": "Yeasin Miazi",
    "phone": "+8801608072719"
  }
]
```

#### Verified No-Match Response

```json
[]
```

#### Observed Behavior

A partial phone search such as:

```text
016
```

returned:

```json
[]
```

during testing. This documents only the observed test result, not a general rule for all partial phone searches.

## Conversations

### GET `/conversations`

Returns the authenticated user's conversations.

Authentication required: Yes

#### Verified Response When No Conversations Existed

```json
[]
```

#### Verified Response When Conversations Existed

```json
{
  "data": [
    {
      "_id": "6a8897fde5d6aac9752404c9",
      "type": "direct",
      "lastMessage": {},
      "updatedAt": "2026-08-21T18:25:01.475Z",
      "participant": {
        "_id": "6a88239de5d6aac97521e231",
        "name": "Test User",
        "phone": "+8801700000001"
      }
    }
  ]
}
```

#### Observed Behavior

There is a response-shape inconsistency:

- An empty conversation result was observed as a raw array:

```json
[]
```

- A non-empty conversation result was observed inside:

```json
{
  "data": []
}
```

This is documented as an observed API inconsistency.

### POST `/conversations`

Starts a direct conversation with another user.

Authentication required: Yes

#### Request Body

```json
{
  "userId": "665f0c2a9b1e4a0012ab34cd"
}
```

#### Verified Response Example

```json
{
  "_id": "6a8897fde5d6aac9752404c9",
  "participants": [
    "6a88950ce5d6aac97523f0a7",
    "6a88239de5d6aac97521e231"
  ],
  "createdAt": "2026-08-21T18:25:01.475Z"
}
```

#### Observed Behavior

The direct-conversation creation response uses a `participants` array containing user IDs.

The conversation-list response instead exposes the other direct-chat user through a populated `participant` object.

### GET `/conversations/{id}/messages`

Returns message history for a conversation.

Authentication required: Yes

#### Path Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | Yes | Conversation ID |

#### Verified Empty Response

```json
{
  "messages": [],
  "hasMore": false
}
```

#### Verified Response With Messages

```json
{
  "messages": [
    {
      "_id": "6a8898fee5d6aac975240d6b",
      "conversation": "6a8897fde5d6aac9752404c9",
      "sender": "6a88950ce5d6aac97523f0a7",
      "text": "",
      "createdAt": "2026-08-21T18:29:18.590Z"
    },
    {
      "_id": "6a8898f1e5d6aac975240ce8",
      "conversation": "6a8897fde5d6aac9752404c9",
      "sender": "6a88950ce5d6aac97523f0a7",
      "text": "Hello Test User!",
      "createdAt": "2026-08-21T18:29:05.508Z"
    }
  ],
  "hasMore": false
}
```

#### Observed Behavior

Messages were returned newest-first. For example:

- `18:29:18` appeared before
- `18:29:05`

The frontend can reverse the retrieved message list for conventional chat display, where older messages appear above and the latest message appears at the bottom.

The response includes `hasMore`, which indicates whether additional message history is available. Pagination request parameters were not verified.

## Messages

### POST `/messages`

Sends a message to a conversation through REST.

Authentication required: Yes

#### Request Body

```json
{
  "conversationId": "string",
  "text": "Hello!"
}
```

#### Verified Success Response

```json
{
  "_id": "6a8898f1e5d6aac975240ce8",
  "conversation": "6a8897fde5d6aac9752404c9",
  "sender": "6a88950ce5d6aac97523f0a7",
  "text": "Hello Test User!",
  "createdAt": "2026-08-21T18:29:05.508Z"
}
```

#### Empty Message Behavior

The following request was tested:

```json
{
  "conversationId": "6a8897fde5d6aac9752404c9",
  "text": ""
}
```

The backend accepted and stored the empty message.

Verified response:

```json
{
  "_id": "6a8898fee5d6aac975240d6b",
  "conversation": "6a8897fde5d6aac9752404c9",
  "sender": "6a88950ce5d6aac97523f0a7",
  "text": "",
  "createdAt": "2026-08-21T18:29:18.590Z"
}
```

#### Important API Issue

The assignment requires empty messages not to be sendable, but the backend accepted an empty message during testing.

The frontend implementation will therefore prevent empty or whitespace-only messages before sending, for example by validating the trimmed message text.

#### Invalid Conversation

An invalid conversation test returned:

```json
null
```

The corresponding HTTP status code was not recorded.

## Groups

A group conversation contains three or more members.

The group creator becomes an admin automatically.

Only admins are intended to:

- Add participants
- Remove other participants
- Promote participants to admins
- Rename groups

Any member can leave a group.

### POST `/conversations/group`

Creates a group conversation.

Authentication required: Yes

#### Request Body

```json
{
  "name": "Project Team",
  "participantIds": [
    "string"
  ]
}
```

#### Verified Response Structure

```json
{
  "_id": "6a889b42e5d6aac975241f77",
  "type": "group",
  "name": "Project Team Test",
  "createdBy": "6a88950ce5d6aac97523f0a7",
  "admins": [
    "6a88950ce5d6aac97523f0a7"
  ],
  "participants": [
    {
      "_id": "6a88950ce5d6aac97523f0a7",
      "name": "Yeasin Miazi",
      "phone": "+8801608072719"
    },
    {
      "_id": "6a88239de5d6aac97521e231",
      "name": "Test User",
      "phone": "+8801700000001"
    },
    {
      "_id": "6a889aace5d6aac975241a7d",
      "name": "Test User 2",
      "phone": "+8801710000001"
    }
  ],
  "createdAt": "2026-08-21T18:38:58.122Z",
  "updatedAt": "2026-08-21T18:38:58.122Z"
}
```

#### Observed Behavior

- The creator is automatically included in `participants`.
- The creator is automatically included in `admins`.
- `admins` contains user IDs.
- `participants` contains populated user objects.

### POST `/conversations/{id}/participants`

Adds one or more participants to a group.

Authentication required: Yes

Admin required: Yes

#### Path Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | Yes | Group conversation ID |

#### Request Body

```json
{
  "userIds": [
    "string"
  ]
}
```

#### Observed Successful Behavior

An admin adding a participant returned the full updated group object.

The newly added user appeared inside the group's `participants` array.

The group's `updatedAt` value changed.

#### Verified Non-Admin Error

```json
{
  "error": {
    "message": "Only admins can add participants",
    "code": "FORBIDDEN"
  }
}
```

The corresponding HTTP status code was not recorded.

### DELETE `/conversations/{id}/participants/{userId}`

Removes a participant or allows a member to leave a group.

Authentication required: Yes

#### Path Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | Yes | Group conversation ID |
| `userId` | string | Yes | User ID to remove |

#### Observed Behavior

Admin removing another participant:

- The participant was removed successfully.
- The API returned the full updated group object.
- `updatedAt` changed.

A normal member removing their own user ID:

- Successfully removed themselves from the group.
- This confirmed the leave-group behavior.
- The API returned the full updated group object.

### POST `/conversations/{id}/admins`

Promotes a participant to group admin.

Authentication required: Yes

Admin required: Yes

#### Path Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | Yes | Group conversation ID |

#### Request Body

```json
{
  "userId": "string"
}
```

#### Observed Behavior

After promoting a participant:

- Their user ID was added to the `admins` array.
- Existing admins remained in the array.
- The API returned the full updated group object.
- `updatedAt` changed.

Example admin array after promotion:

```json
[
  "6a88950ce5d6aac97523f0a7",
  "6a88239de5d6aac97521e231"
]
```

### PATCH `/conversations/{id}`

Renames a group.

Authentication required: Yes

Admin required: Yes

#### Path Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | Yes | Group conversation ID |

#### Request Body

```json
{
  "name": "Renamed Team"
}
```

#### Observed Successful Behavior

After renaming:

- `name` changed.
- The API returned the full updated group object.
- `updatedAt` changed.

#### Verified Non-Admin Error

```json
{
  "error": {
    "message": "Only admins can rename the group",
    "code": "FORBIDDEN"
  }
}
```

The corresponding HTTP status code was not recorded.

## Socket.io

Socket.io is used for real-time communication.

Connection URL:

```text
https://frontend-task-chatapp.onrender.com
```

Do not use the following URL for the Socket.io connection:

```text
https://frontend-task-chatapp.onrender.com/api
```

### Connection Example

```js
const socket = io("https://frontend-task-chatapp.onrender.com", {
  auth: {
    token
  }
});
```

A valid JWT connection was successfully verified.

### Client to Server: `message:send`

Sends a new message through Socket.io.

#### Payload

```json
{
  "conversationId": "6a8897fde5d6aac9752404c9",
  "text": "Hello from socket test"
}
```

#### Verified Acknowledgement

```json
{
  "ok": true
}
```

### Server to Client: `message:new`

Emitted when a new message arrives for the connected user.

Real-time delivery was successfully verified between two authenticated users.

#### Verified Payload

```json
{
  "id": "6a89086ee5d6aac975261d00",
  "conversation": "6a8897fde5d6aac9752404c9",
  "sender": "6a88950ce5d6aac97523f0a7",
  "text": "Hello from socket test",
  "createdAt": 1787365486108
}
```

#### Important Response Difference

REST messages use:

```text
_id
```

while the Socket.io `message:new` payload uses:

```text
id
```

REST message timestamps were observed as ISO strings:

```text
2026-08-21T18:29:05.508Z
```

Socket.io message timestamps were observed as numeric timestamps:

```text
1787365486108
```

Therefore REST messages and Socket.io messages do not have identical response shapes.

The frontend should normalize both formats into one internal message format.

### Server to Client: `conversation:updated`

Emitted when a group conversation changes.

A group rename was tested while another group member was connected through Socket.io.

The connected member received the update automatically.

#### Verified Payload

```json
{
  "_id": "6a889b42e5d6aac975241f77",
  "type": "group",
  "name": "Renamed Team again",
  "createdBy": "6a88950ce5d6aac97523f0a7",
  "admins": [
    "6a88950ce5d6aac97523f0a7",
    "6a88239de5d6aac97521e231"
  ],
  "participants": [
    {
      "_id": "6a88950ce5d6aac97523f0a7",
      "name": "Yeasin Miazi",
      "phone": "+8801608072719"
    },
    {
      "_id": "6a88239de5d6aac97521e231",
      "name": "Test User",
      "phone": "+8801700000001"
    },
    {
      "_id": "6a889bc0e5d6aac97524240e",
      "name": "Test User 3",
      "phone": "+8801720000001"
    }
  ]
}
```

#### Observed Behavior

The event delivered the updated group automatically without requiring a page refresh.

## System

### GET `/health`

Unlike the other REST endpoints, this endpoint was verified at the server root:

```text
https://frontend-task-chatapp.onrender.com/health
```

Do not document it as:

```text
/api/health
```

Authentication required: No

#### Verified Response

```json
{
  "status": "ok"
}
```

## Observed API Notes

1. Empty and non-empty `GET /conversations` results used different response wrapper shapes during testing.
2. Direct-conversation creation and conversation-list responses represent participants differently.
3. Message history is returned newest-first.
4. REST messages and Socket.io messages have different shapes: REST uses `_id`, Socket.io uses `id`, REST uses an ISO date string for `createdAt`, and Socket.io uses a numeric timestamp.
5. The backend accepted an empty message even though the assignment requires empty messages not to be sendable. The frontend will therefore validate trimmed message text before sending.
6. An invalid conversation test for `POST /messages` returned `null`; the HTTP status was not recorded.
7. A partial phone search using `016` returned an empty result during testing.
8. Group admin permissions were verified: non-admin rename was rejected, non-admin participant addition was rejected, members can leave by removing themselves, and admins can add/remove members, promote admins, and rename groups.
