import { useMemo } from 'react'
import { Editor, NodeEntry, Range, Element, Text } from 'slate'
import { useStore } from 'zustand'
import { Decorate } from '../plugin/decorate'
import { useEditableStatic } from './use-editable'

export const useDecorateStore = () => {
  const editor = useEditableStatic()
  return useMemo(() => {
    return Decorate.getStore(editor)
  }, [editor])
}

export const useDecorates = (entry: NodeEntry) => {
  const store = useDecorateStore()
  const decorates = useStore(store, state => state.decorates)
  return useMemo(() => {
    const nodeDecorates: { decorate: Decorate; ranges: Range[] }[] = []
    const isElement = Element.isElement(entry[0])
    const isText = Text.isText(entry[0])
    decorates.forEach(decorate => {
      let ranges: Range[] = []
      if (isElement && decorate.type === 'element') {
        ranges = decorate.decorate(entry)
      } else if (isText && decorate.type === 'text') {
        ranges = decorate.decorate(entry)
      }
      if (ranges.length > 0) {
        nodeDecorates.push({ decorate, ranges })
      }
    })
    return nodeDecorates
  }, [decorates, entry])
}
