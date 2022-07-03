import { Document, FindCursor, WithId } from "mongodb";

export async function cursorToDoc(originalDoc: FindCursor<WithId<Document>> | WithId<Document>) {
    let toReturn;
    if (originalDoc instanceof FindCursor<WithId<Document>>) {
        toReturn = (await originalDoc.toArray()).map(doc => JSON.parse(JSON.stringify(doc)));
    } else {
        toReturn = await JSON.parse(JSON.stringify(originalDoc));
    }
    return toReturn;
}