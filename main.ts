import { renderGraph, PrivacyGraphNode, PrivacyGraphEdge } from './src/index';

let inputNodes: PrivacyGraphNode[] = [
  {
    id: 'n11',
    label: '(2,1,5,6,6,6,6)',
    layer: 0,
    fillColor: '#e5bbc8',
    strokeColor: '#666666',
    textColor: '#fff',
  },
  {
    id: 'n21',
    label: '(2,0,5)',
    layer: 1,
  },
  {
    id: 'n22',
    label: '(1,1,5)',
    layer: 1,
  },
  {
    id: 'n23',
    label: '(1,1,5)',
    layer: 1,
  },
  {
    id: 'n31',
    label: '(1,1,5)',
    layer: 2,
  },
  {
    id: 'n41',
    label: '(2,0,5)',
    layer: 3,
  },
  {
    id: 'n42',
    label: '(1,1,5)',
    layer: 3,
  },
  {
    id: 'n51',
    label: '(1,1,2)',
    layer: 4,
  },
];

let inputEdges: PrivacyGraphEdge[] = [
  {
    source: 'n11',
    target: 'n21',
    color: '#ffffff',
  },
  {
    source: 'n11',
    target: 'n22',
  },
  {
    source: 'n11',
    target: 'n23',
  },
  {
    source: 'n21',
    target: 'n31',
  },
  {
    source: 'n22',
    target: 'n31',
  },
  {
    source: 'n23',
    target: 'n31',
  },
  {
    source: 'n31',
    target: 'n42',
  },
  {
    source: 'n41',
    target: 'n51',
  },
];

renderGraph(
  document.getElementById('container') as HTMLDivElement,
  inputNodes,
  inputEdges
);
