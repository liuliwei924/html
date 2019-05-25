function canvasMeasure (el, canvasEl) {
  canvasEl.width = el.clientWidth
  canvasEl.height = el.clientHeight
}

function borderPoint (point, canvasEl) {
  let p = point
  if (point.x <= 0 || point.x >= canvasEl.width) {
    p.vx = -p.vx
    p.x += p.vx
  } else if (point.y <= 0 || point.y >= canvasEl.height) {
    p.vy = -p.vy
    p.y += p.vy
  } else {
    p = {
      x: p.x + p.vx,
      y: p.y + p.vy,
      vx: p.vx,
      vy: p.vy
    }
  }
  return p
}

function drawLine (args) {
  let dist = null
  let context = args.canvas
  for (let i = 0, len = args.count; i < len; i++) {
    // 初始化最大连接数
    args.points[i].maxConn = 0
    for (let j = 0; j < len; j++) {
      if (i !== j) {
        dist = Math.round(args.points[i].x - args.points[j].x) * Math.round(args.points[i].x - args.points[j].x) +
          Math.round(args.points[i].y - args.points[j].y) * Math.round(args.points[i].y - args.points[j].y)
          // 两点距离小于吸附距离，而且小于最大连接数，则画线
        if (dist <= args.dist && args.points[i].maxConn < args.maxConn) {
          args.points[i].maxConn++
          // 距离越远，线条越细，而且越透明
          context.lineWidth = 0.5 - dist / args.dist
          context.strokeStyle = 'rgba(' + args.stroke + ',' + (1 - dist / args.dist) + ')'
          context.beginPath()
          context.moveTo(args.points[i].x, args.points[i].y)
          context.lineTo(args.points[j].x, args.points[j].y)
          context.stroke()
        }
      }
    }
    // 如果鼠标进入画布
    if (args.mouse) {
      dist = Math.round(args.points[i].x - args.mouse.x) * Math.round(args.points[i].x - args.mouse.x) +
      Math.round(args.points[i].y - args.mouse.y) * Math.round(args.points[i].y - args.mouse.y)
      // 遇到鼠标吸附距离时加速，直接改变point的x，y值达到加速效果
      if (dist > args.dist && dist <= args.eDist) {
        args.points[i].x = args.points[i].x + (args.mouse.x - args.points[i].x) / 20
        args.points[i].y = args.points[i].y + (args.mouse.y - args.points[i].y) / 20
      }
      if (dist <= args.eDist) {
        context.lineWidth = 1
        context.strokeStyle = 'rgba(' + args.stroke + ',' + (1 - dist / args.eDist) + ')'
        context.beginPath()
        context.moveTo(args.points[i].x, args.points[i].y)
        context.lineTo(args.mouse.x, args.mouse.y)
        context.stroke()
      }
    }
  }
}

function drawPoint (args) {
  let context = args.canvas
  let point = null
  context.clearRect(0, 0, args.canvasEl.width, args.canvasEl.height)
  context.beginPath()
  context.fillStyle = args.color
  for (let i = 0, len = args.count; i < len; i++) {
    if (args.points.length !== args.count) {
      // 初始化所有点
      point = {
        x: Math.floor(Math.random() * args.canvasEl.width),
        y: Math.floor(Math.random() * args.canvasEl.height),
        vx: args.vx / 2 - Math.random() * args.vx,
        vy: args.vy / 2 - Math.random() * args.vy
      }
    } else {
      // 处理球的速度和位置，并且做边界处理
      point = borderPoint(args.points[i], args.canvasEl)
    }
    context.fillRect(point.x - args.width / 2, point.y - args.height / 2, args.width, args.height)

    args.points[i] = point
  }
  drawLine(args)
  context.closePath()
}

function canvasParticle ({
  el,
  vx = 4, // 小球x轴速度,正为右，负为左
  vy = 4, // 小球y轴速度
  width = 2, // 小球高宽，其实为正方形，所以不宜太大
  height = 2,
  count = 200, // 点个数
  color = '#79a2b9', // 点颜色
  stroke = '130,255,255', // 线条颜色
  dist = 6000, // 点吸附距离
  eDist = 20000,
  maxConn = 10
}) {
  let canvasEl = document.createElement('canvas')
  let canvas = canvasEl.getContext('2d')
  if (!canvas) {
    console.error(`your browser not support canvas`)
    return
  }
  el.appendChild(canvasEl)
  canvasEl.style = 'position: fixed; top: 0; left: 0'
  canvasMeasure(el, canvasEl)
  window.onresize = function () {
    canvasMeasure(el, canvasEl)
  }
  let [points, mouse] = [[], null]
  el.onmousemove = function (e) {
    let event = e || window.event
    mouse = {
      x: event.clientX,
      y: event.clientY
    }
  }
  el.onmouseleave = function () {
    mouse = null
  }
  setInterval(function () {
    drawPoint({
      el,
      canvasEl,
      canvas,
      vx,
      vy,
      width,
      height,
      count,
      color,
      stroke,
      dist,
      eDist,
      maxConn,
      points,
      mouse
    })
  }, 40)
}

export default canvasParticle
