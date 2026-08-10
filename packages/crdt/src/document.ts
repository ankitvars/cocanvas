import * as Y from 'yjs';

export function createYDoc(): Y.Doc {
  return new Y.Doc();
}

export function getShapesArray(doc: Y.Doc): Y.Array<Y.Map<any>> {
  return doc.getArray('shapes');
}
