let curZoom = 1200.0;

class Camera {
  constructor(context, settings) {
    settings = settings || {};
    this.distance = 1000.0;
    this.lookAt = [0, 0];
    this.context = context;
    this.fieldOfView = settings.fieldOfView || Math.PI / 4.0;
    this.viewport = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      width: 0,
      height: 0,
      scale: [1.0, 1.0],
    };

    this.addListeners();
    this.updateViewport();
  }

  begin() {
    this.context.save();
    this.applyScale();
    this.applyTranslation();
  }

  end() {
    this.context.restore();
  }

  applyScale() {
    this.context.scale(this.viewport.scale[0], this.viewport.scale[1]);
  }

  applyTranslation() {
    this.context.translate(-this.viewport.left, -this.viewport.top);
  }

  initViewport(height) {
    // this.aspectRatio = this.context.canvas.width / this.context.canvas.height;
    // const width = height / this.aspectRatio;
    // this.distance = width / Math.tan(this.fieldOfView);
    // console.log('distance', this.distance);
  }

  updateViewport() {
    this.aspectRatio = this.context.canvas.width / this.context.canvas.height;
    this.viewport.width = this.distance * Math.tan(this.fieldOfView);
    this.viewport.height = this.viewport.width / this.aspectRatio;
    this.viewport.left = this.lookAt[0] - this.viewport.width / 2.0;
    this.viewport.top = this.lookAt[1] - this.viewport.height / 2.0;
    this.viewport.right = this.viewport.left + this.viewport.width;
    this.viewport.bottom = this.viewport.top + this.viewport.height;
    this.viewport.scale[0] = this.context.canvas.width / this.viewport.width;
    this.viewport.scale[1] = this.context.canvas.height / this.viewport.height;
  }

  zoomTo(z) {
    this.distance = z;
    this.updateViewport();
  }

  moveTo(x, y) {
    this.lookAt[0] = x;
    this.lookAt[1] = y;
    this.updateViewport();
  }

  screenToWorld(x, y, obj) {
    obj = obj || {};
    obj.x = x / this.viewport.scale[0] + this.viewport.left;
    obj.y = y / this.viewport.scale[1] + this.viewport.top;
    return obj;
  }

  worldToScreen(x, y, obj) {
    obj = obj || {};
    obj.x = (x - this.viewport.left) * this.viewport.scale[0];
    obj.y = (y - this.viewport.top) * this.viewport.scale[1];
    return obj;
  }

  addListeners() {
    // Zoom and scroll around world
    // window.onwheel = (e) => {
    //   if (e.ctrlKey) {
    //     // Your zoom/scale factor
    //     let zoomLevel = this.distance - e.deltaY * 20;
    //     if (zoomLevel <= 1) {
    //       zoomLevel = 1;
    //     }

    //     this.zoomTo(zoomLevel);
    //   } else {
    //     // Your track-pad X and Y positions
    //     const x = this.lookAt[0] + e.deltaX * 2;
    //     const y = this.lookAt[1] + e.deltaY * 2;

    //     this.moveTo(x, y);
    //   }
    // };

    // Center camera on "R"
    window.addEventListener('keydown', (e) => {
      if (e.key === 'r') {
        this.zoomTo(1000);
        this.moveTo(0, 0);
      }
    });
  }
}

class Node {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = 100;
    this.height = 50;
    this.fillColor = '#dfcfd6';
    this.strokeColor = 'red';
    this.textColor = '#ffffff';
    this.innerText = '1,2,3,4,5,6,7,8,9,10,11,12,13,14';
    this.paddingLeft =
      this.paddingRight =
      this.paddingTop =
      this.paddingBottom =
        20;
    this.fontSize = 16;
  }

  bindCtx(ctx) {
    this.ctx = ctx;
  }

  setColor({
    fillColor = '#dfcfd6',
    strokeColor = '#fff',
    textColor = '#000',
  }) {
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.textColor = textColor;
  }

  setInnerText(text = '') {
    this.innerText = text;
    this.ctx.font = `${this.fontSize}px serif`;
    const measureWidth = this.ctx.measureText(this.innerText).width;
    this.width = measureWidth + this.paddingLeft + this.paddingRight;
    this.height = this.fontSize + this.paddingTop + this.paddingBottom;
  }

  render() {
    // this.ctx.fillRect(
    //   this.x,
    //   this.y,
    //   this.x + this.width,
    //   this.y + this.height
    // );

    this.ctx.beginPath();
    this.ctx.ellipse(
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.width / 2,
      this.height / 2,
      0,
      0,
      Math.PI * 2
    );
    this.ctx.fillStyle = this.fillColor;
    this.ctx.fill();
    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.stroke();

    this.ctx.fillStyle = this.textColor;
    this.ctx.fillText(
      this.innerText,
      this.x + this.paddingLeft,
      this.y + this.height / 2 + 5
    );
    // this.ctx.endPath();
  }
}

function renderGraph(container = document.createElement('div'), nodes, edges) {
  const canvas = document.createElement('canvas');
  canvas.style.backgroundColor = 'black';
  canvas.width = '100%';
  canvas.height = '100%';
  container.appendChild(canvas);
  let mousePosWhenPressStart = {
    x: 0,
    y: 0,
  };
  let prevLook = [];
  let mouseDragging = false;
  const cam = new Camera(canvas.getContext('2d'));

  canvas.addEventListener('mousedown', (e) => {
    mouseDragging = true;
    mousePosWhenPressStart = {
      x: e.clientX,
      y: e.clientY,
    };
    console.log('llok', cam.lookAt);
    prevLook = Array.from(cam.lookAt);
  });
  canvas.addEventListener('mouseup', () => {
    mouseDragging = false;
  });
  canvas.addEventListener('mousemove', (e) => {
    if (mouseDragging) {
      const deltaX = e.clientX - mousePosWhenPressStart.x;
      const deltaY = e.clientY - mousePosWhenPressStart.y;
      const ctx = canvas.getContext('2d');
      cam.moveTo(prevLook[0] - deltaX, prevLook[1] - deltaY);
      // cam.zoomTo(500);
      // cam.begin();
      render(canvas, cam, nodes, edges);
      // cam.end();
    }
  });
  resize(container, canvas);
  cam.moveTo(0, 0);
  render(canvas, cam, nodes, edges, true);
  canvas.addEventListener('wheel', (e) => {
    e.stopPropagation();
    console.log('wheel', e);
    curZoom -= e.deltaY / 2;
    curZoom < 1 && (curZoom = 1);
    console.log('cur zoom', curZoom);
    prevLook = Array.from(cam.lookAt);
    render(canvas, cam, nodes, edges);
  });
}

function render(
  canvas = document.createElement('canvas'),
  cam,
  nodes,
  edges,
  init
) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  let node = new Node();
  node.bindCtx(ctx);
  node.setInnerText('a,b,c');
  console.log('node', node);

  let layerMap = {};
  let nodesToDraw = [];
  let maxX = 0,
    maxY = 0;
  for (let n of nodes) {
    console.log('node', n);
    let curX = layerMap[n.layer] || 0;
    let curY = n.layer * 100;
    maxX = Math.max(maxX, curX);
    maxY = Math.max(maxY, curY);

    // visNode.render();
    let visNode = new Node();
    console.log('this is n', n);
    visNode.bindCtx(ctx);
    visNode.setInnerText(n.label);
    nodesToDraw.push({
      x: curX,
      y: curY,
      width: visNode.width,
      height: visNode.height,
      dataNode: n,
    });

    layerMap[n.layer] = curX + visNode.width + 30;
  }

  const maxLayerWidth = Math.max(...Object.values(layerMap));

  let nodesMap = {};

  for (let n of nodesToDraw) {
    const curLayeroffset = (maxLayerWidth - layerMap[n.dataNode.layer]) / 2;
    n.x += curLayeroffset;
    nodesMap[n.dataNode.id] = n;
  }
  init && cam.moveTo(maxX / 2, maxY / 2);
  init && cam.initViewport(maxY);

  cam.zoomTo(curZoom);
  cam.begin();

  // draw line first
  for (const edge of edges) {
    const { source, target } = edge;
    const s = nodesMap[source];
    const t = nodesMap[target];
    if (!s || !t) continue;

    ctx.beginPath();
    ctx.moveTo(s.x + s.width / 2, s.y + s.height);
    ctx.lineTo(t.x + t.width / 2, t.y);
    ctx.closePath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = edge.color || 'blue';
    ctx.stroke();
  }

  for (let n of nodesToDraw) {
    let visNode = new Node();
    visNode.x = n.x;
    visNode.y = n.y;
    visNode.bindCtx(ctx);
    visNode.setColor({
      fillColor: n.dataNode.fillColor || '#dfcfd6',
      strokeColor: n.dataNode.strokeColor || '#fff',
      textColor: n.dataNode.textColor || '#000',
    });
    visNode.setInnerText(n.dataNode.label);
    visNode.render();
  }

  console.log('nodes to draw', nodesToDraw);

  console.log('max', maxLayerWidth);
  cam.end();
}

function debounce(fn = () => {}, delay = 100) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      timer = null;
    }, delay);
  };
}

function resize(
  container = document.createElement('div'),
  canvas = document.createElement('canvas')
) {
  function _resizeAction() {
    const containerRect = container.getClientRects()[0];
    canvas.width = containerRect.width;
    canvas.height = containerRect.height;
  }
  _resizeAction();
  // window.addEventListener(
  //   'resize',
  //   debounce(() => {
  //     _resizeAction();
  //     render(canvas);
  //   }, 1000)
  // );
}
