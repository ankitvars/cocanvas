import * as Y from 'yjs';
import { Shape } from '@cocanvas/shared';

export class ShapeManager {
  private doc: Y.Doc;
  private yShapes: Y.Array<Y.Map<any>>;
  private undoManager: Y.UndoManager;
  private localOrigin: symbol;

  constructor(doc: Y.Doc, localOrigin: symbol) {
    this.doc = doc;
    this.yShapes = doc.getArray('shapes');
    this.localOrigin = localOrigin;
    
    this.undoManager = new Y.UndoManager(this.yShapes, {
      trackedOrigins: new Set([this.localOrigin]),
      captureTimeout: 500
    });
  }

  addShape(shape: Shape): void {
    this.doc.transact(() => {
      const yShape = new Y.Map();
      Object.entries(shape).forEach(([key, value]) => {
        if (value !== undefined) {
          yShape.set(key, value);
        }
      });
      this.yShapes.push([yShape]);
    }, this.localOrigin);
  }

  updateShape(id: string, updates: Partial<Shape>): void {
    this.doc.transact(() => {
      for (let i = 0; i < this.yShapes.length; i++) {
        const yShape = this.yShapes.get(i);
        if (yShape.get('id') === id) {
          // Prevent editing if the shape is locked, unless we are explicitly unlocking it
          if (yShape.get('locked') && updates.locked !== false) {
            return;
          }
          Object.entries(updates).forEach(([key, value]) => {
            if (value === undefined) {
              yShape.delete(key);
            } else {
              yShape.set(key, value);
            }
          });
          break;
        }
      }
    }, this.localOrigin);
  }

  deleteShape(id: string): void {
    this.doc.transact(() => {
      for (let i = 0; i < this.yShapes.length; i++) {
        const yShape = this.yShapes.get(i);
        if (yShape.get('id') === id) {
          if (yShape.get('locked')) {
            return;
          }
          this.yShapes.delete(i, 1);
          break;
        }
      }
    }, this.localOrigin);
  }

  toggleLockShape(id: string): void {
    this.doc.transact(() => {
      for (let i = 0; i < this.yShapes.length; i++) {
        const yShape = this.yShapes.get(i);
        if (yShape.get('id') === id) {
          const isCurrentlyLocked = !!yShape.get('locked');
          yShape.set('locked', !isCurrentlyLocked);
          break;
        }
      }
    }, this.localOrigin);
  }

  getShapes(): Shape[] {
    return this.yShapes.map(yShape => yShape.toJSON() as Shape);
  }

  observe(callback: (...args: any[]) => void): void {
    this.yShapes.observeDeep(callback);
  }

  unobserve(callback: (...args: any[]) => void): void {
    this.yShapes.unobserveDeep(callback);
  }

  undo(): void {
    this.undoManager.undo();
  }

  redo(): void {
    this.undoManager.redo();
  }

  stopCapturing(): void {
    this.undoManager.stopCapturing();
  }
}
