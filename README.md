# fauna-event &ensp;&middot;[<img src="/favicon.svg" height="24px"/>](https://www.concentric.io/)
A package for dispatching and listening to events in Fauna.

## FaunaEventClient
Construct a `FaunaEventClient` around an existing `FaunaClient`. Bind the event handlers to arbitrarily named events using `.on`.

```typescript
import {Client} from "faunadb";
import {FaunaEventClient} from "fauna-event";
import {MySendApi} from "my-package";

const client = new Client({
    // your params
});
const eventClient = new FaunaEventClient(client);
client.on("sendEvent", (payload)=>{
    MySendApi.send(`Handled a send event, at ${new Date().toLocaleString()}.`);
})
```

## NewEvent
Dispatch a new event to the the `FaunaEvents` collection, using `NewEvent` in a FaunaQuery.
```typescript
client.query(NewEvent({
    eventType : "sendEvent"
    data : "A cool message."
}));
```

## How it works
To safely handle concurrency, a `FaunaEventClient` uses a sliding window, listening only to documents within the window.

The `Head` document is the document to which all event dispatches should be appended. However, in case of events occurring 

## Upcoming features
- **Fauna-side Blocking**: `FaunaEventClients` can be instantiated such that only one client in a cluster will handle an event. 
- **Rooms/Targeting**: events can be dispatched which may only be handled by particular subset of `FaunaEventClients`.
