import {Client, query as q} from "faunadb";

export const FaunaEventCollectionName = "FaunaEvents";

export const CreateFaunaEventCollection = ()=>{
    return q.If(
        q.Exists(q.Collection(FaunaEventCollectionName)),
        q.Collection(FaunaEventCollectionName),
        q.CreateCollection({
            name : FaunaEventCollectionName
        })
    )
};

export const FaunaEvents = ()=>{
    return q.If(
        q.Exists(q.Collection(FaunaEventCollectionName)),
        q.Collection(FaunaEventCollectionName),
        q.Abort(FaunaEventCollectionName + " does not exist.")
    )
}

export const deployFaunaEventsCollection = async (client : Client)=>{
    await client.query(CreateFaunaEventCollection());
}