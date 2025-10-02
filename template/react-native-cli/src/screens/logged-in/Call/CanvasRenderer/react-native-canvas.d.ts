import React from 'react'
import { type ViewProps } from 'react-native'

declare module 'react-native-canvas' {
  export interface CanvasProps extends ViewProps, React.ClassAttributes<Canvas> {
    onCanvasReady?: (canvas: Canvas) => void
  }

  export interface CanvasRenderingContext2D {
    clearRect(x: number, y: number, width: number, height: number): void
    drawImage(
      image: CanvasImage,
      dx: number,
      dy: number,
      dWidth: number,
      dHeight: number
    ): void
  }

  export class CanvasImage {
    constructor(canvas: Canvas)
    src: string
    addEventListener(event: string, callback: () => void): void
  }

  export default class Canvas extends React.Component<CanvasProps, any> {
    getContext(contextType: string): CanvasRenderingContext2D | null
  }
}
