import * as THREE from 'three'

import skinLayout from './layout'
import {TAU, toCanvas, toRadians, makeOpaque, hasAlphaLayer} from './helper'

function colorFaces (geometry, canvas, rectangles) {
  if (!rectangles) return null
  const context = canvas.getContext('2d')
  let f = 0
  const faces = []
  const materials = []
  const materialIndexMap = {}
  let side = THREE.FrontSide
  for (const k in rectangles) {
    if ({}.hasOwnProperty.call(rectangles, k)) {
      const rect = rectangles[k]
      const pi = 4 * (rect.flipX ? rect.w - 1 : 0)
      const dp = 4 * (rect.flipX ? -1 : 1)
      const pyi = 4 * (rect.flipY ? rect.w * (rect.h - 1) : 0)
      const dpy = 4 * (rect.flipY ? -rect.w : rect.w)
      const pixels = context.getImageData(rect.x, rect.y, rect.w, rect.h).data
      for (let y = 0, py = pyi + pi; y < rect.h; y += 1, py += dpy) {
        for (let x = 0, p = py; x < rect.w; x += 1, p += dp, f += 2) {
          const a = pixels[p + 3]
          if (a === 0) {
            side = THREE.DoubleSide
            continue
          }
          let materialIndex = materialIndexMap[a]
          if (typeof materialIndex === 'undefined') {
            materials.push(new THREE.MeshBasicMaterial({
              vertexColors: THREE.FaceColors,
              opacity: (a === 255 ? 1 : a / 255),
              transparent: (a !== 255),
            }))
            materialIndex = materials.length - 1
            materialIndexMap[a] = materialIndex
            if (a !== 255) {
              side = THREE.DoubleSide
            }
          }
          const face1 = geometry.faces[f]
          const face2 = geometry.faces[f + 1]
          face1.color.r = pixels[p] / 255
          face1.color.g = pixels[p + 1] / 255
          face1.color.b = pixels[p + 2] / 255
          face2.color = face1.color
          face1.materialIndex = materialIndex
          face2.materialIndex = materialIndex
          faces.push(face1)
          faces.push(face2)
        }
      }
    }
  }
  if (faces.length === 0) return null
  geometry.faces = faces
  materials.forEach((m) => {
    m.side = side
  })
  const bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry)
  return new THREE.Mesh(bufferGeometry, materials)
}

function buildMinecraftModel (skinImage, slim) {
  if (skinImage.width < 64 || skinImage.height < 32) {
    return null
  }
  const version = (skinImage.height >= 64 ? 1 : 0)
  const opaqueSkinCanvas = makeOpaque(skinImage)
  const transparentSkinCanvas = toCanvas(skinImage)
  const hasAlpha = hasAlphaLayer(skinImage)
  const headGroup = new THREE.Object3D()
  headGroup.position.x = 0
  headGroup.position.y = 12
  headGroup.position.z = 0
  let box = new THREE.BoxGeometry(8, 8, 8, 8, 8, 8)
  const headMesh = colorFaces(box, opaqueSkinCanvas, skinLayout[version].head[0])
  headGroup.add(headMesh)
  if (hasAlpha) {
    box = new THREE.BoxGeometry(9, 9, 9, 8, 8, 8)
    const hatMesh = colorFaces(box, transparentSkinCanvas, skinLayout[version].head[1])
    if (hatMesh) headGroup.add(hatMesh)
  }
  const torsoGroup = new THREE.Object3D()
  torsoGroup.position.x = 0
  torsoGroup.position.y = 2
  torsoGroup.position.z = 0
  box = new THREE.BoxGeometry(8.001, 12.001, 4.001, 8, 12, 4)
  const torsoMesh = colorFaces(box, opaqueSkinCanvas, skinLayout[version].torso[0])
  torsoGroup.add(torsoMesh)
  if (version >= 1 && hasAlpha) {
    box = new THREE.BoxGeometry(8.501, 12.501, 4.501, 8, 12, 4)
    const jacketMesh = colorFaces(box, transparentSkinCanvas, skinLayout[version].torso[1])
    if (jacketMesh) torsoGroup.add(jacketMesh)
  }
  const rightArmGroup = new THREE.Object3D()
  rightArmGroup.position.x = slim ? -5.5 : -6
  rightArmGroup.position.y = 6
  rightArmGroup.position.z = 0
  let rightArmMesh
  if (slim) {
    box = new THREE.BoxGeometry(3, 12, 4, 3, 12, 4).translate(0, -4, 0)
    rightArmMesh = colorFaces(box, opaqueSkinCanvas, skinLayout[version].armRightSlim[0])
  } else {
    box = new THREE.BoxGeometry(4, 12, 4, 4, 12, 4).translate(0, -4, 0)
    rightArmMesh = colorFaces(box, opaqueSkinCanvas, skinLayout[version].armRight[0])
  }
  rightArmGroup.add(rightArmMesh)
  if (version >= 1 && hasAlpha) {
    let rightSleeveMesh
    if (slim) {
      box = new THREE.BoxGeometry(3.504, 12.504, 4.504, 3, 12, 4).translate(0, -4, 0)
      rightSleeveMesh = colorFaces(box, transparentSkinCanvas, skinLayout[version].armRightSlim[1])
    } else {
      box = new THREE.BoxGeometry(4.504, 12.504, 4.504, 4, 12, 4).translate(0, -4, 0)
      rightSleeveMesh = colorFaces(box, transparentSkinCanvas, skinLayout[version].armRight[1])
    }
    if (rightSleeveMesh) rightArmGroup.add(rightSleeveMesh)
  }
  const leftArmGroup = new THREE.Object3D()
  leftArmGroup.position.x = slim ? 5.5 : 6
  leftArmGroup.position.y = 6
  leftArmGroup.position.z = 0
  let leftArmMesh
  if (slim) {
    box = new THREE.BoxGeometry(3, 12, 4, 3, 12, 4).translate(0, -4, 0)
    leftArmMesh = colorFaces(box, opaqueSkinCanvas, skinLayout[version].armLeftSlim[0])
  } else {
    box = new THREE.BoxGeometry(4, 12, 4, 4, 12, 4).translate(0, -4, 0)
    leftArmMesh = colorFaces(box, opaqueSkinCanvas, skinLayout[version].armLeft[0])
  }
  leftArmGroup.add(leftArmMesh)
  if (version >= 1 && hasAlpha) {
    let leftSleeveMesh
    if (slim) {
      box = new THREE.BoxGeometry(3.504, 12.504, 4.504, 3, 12, 4).translate(0, -4, 0)
      leftSleeveMesh = colorFaces(box, transparentSkinCanvas, skinLayout[version].armLeftSlim[1])
    } else {
      box = new THREE.BoxGeometry(4.504, 12.504, 4.504, 4, 12, 4).translate(0, -4, 0)
      leftSleeveMesh = colorFaces(box, transparentSkinCanvas, skinLayout[version].armLeft[1])
    }
    if (leftSleeveMesh) leftArmGroup.add(leftSleeveMesh)
  }
  const rightLegGroup = new THREE.Object3D()
  rightLegGroup.position.x = -2
  rightLegGroup.position.y = -4
  rightLegGroup.position.z = 0
  box = new THREE.BoxGeometry(4, 12, 4, 4, 12, 4).translate(0, -6, 0)
  const rightLegMesh = colorFaces(box, opaqueSkinCanvas, skinLayout[version].legRight[0])
  rightLegGroup.add(rightLegMesh)
  if (version >= 1 && hasAlpha) {
    box = new THREE.BoxGeometry(4.502, 12.502, 4.502, 4, 12, 4).translate(0, -6, 0)
    const rightPantMesh = colorFaces(box, transparentSkinCanvas, skinLayout[version].legRight[1])
    if (rightPantMesh) rightLegGroup.add(rightPantMesh)
  }
  const leftLegGroup = new THREE.Object3D()
  leftLegGroup.position.x = 2
  leftLegGroup.position.y = -4
  leftLegGroup.position.z = 0
  box = new THREE.BoxGeometry(4, 12, 4, 4, 12, 4).translate(0, -6, 0)
  const leftLegMesh = colorFaces(box, opaqueSkinCanvas, skinLayout[version].legLeft[0])
  leftLegGroup.add(leftLegMesh)
  if (version >= 1 && hasAlpha) {
    box = new THREE.BoxGeometry(4.503, 12.503, 4.503, 4, 12, 4).translate(0, -6, 0)
    const leftPantMesh = colorFaces(box, transparentSkinCanvas, skinLayout[version].legLeft[1])
    if (leftPantMesh) leftLegGroup.add(leftPantMesh)
  }
  const playerGroup = new THREE.Object3D()
  playerGroup.add(headGroup)
  playerGroup.add(torsoGroup)
  playerGroup.add(rightArmGroup)
  playerGroup.add(leftArmGroup)
  playerGroup.add(rightLegGroup)
  playerGroup.add(leftLegGroup)
  return playerGroup
}

let renderState

function render () {
  const sin = Math.sin(toRadians(4) * renderState.frame)
  renderState.model.children[2].rotation.x = toRadians(18) * sin
  renderState.model.children[3].rotation.x = -toRadians(18) * sin
  renderState.model.children[4].rotation.x = -toRadians(20) * sin
  renderState.model.children[5].rotation.x = toRadians(20) * sin
  renderState.renderer.render(renderState.scene, renderState.camera)
  if (renderState.canvas !== renderState.renderer.domElement) {
    renderState.canvas.getContext('2d').drawImage(renderState.renderer.domElement, 0, 0)
  }
}

let rafId

function renderAnimation () {
  if (renderState.animate) {
    renderState.frame += 1
    render()
    rafId = window.requestAnimationFrame(renderAnimation)
  }
}

function allowRotation (renderState, positionCamera) {
  function startRotation (t, id) {
    renderState.dragState[id] = {
      x: t.screenX,
      y: t.screenY,
    }
  }

  function rotate (t, id) {
    if (!renderState.dragState[id]) {
      return false
    }
    let result = true
    renderState.theta -= (t.screenX - renderState.dragState[id].x) * toRadians(1)
    renderState.phi += (t.screenY - renderState.dragState[id].y) * toRadians(1)
    if (renderState.phi < -toRadians(90)) {
      renderState.phi = -toRadians(90)
      result = false
    } else if (renderState.phi > toRadians(90)) {
      renderState.phi = toRadians(90)
      result = false
    }
    positionCamera(renderState.camera, renderState.theta, renderState.phi)
    renderState.renderer.render(renderState.scene, renderState.camera)
    renderState.dragState[id].x = t.screenX
    renderState.dragState[id].y = t.screenY
    return result
  }

  function endRotation (t, id) {
    delete renderState.dragState[id]
  }
  renderState.canvas.onmousedown = function (e) {
    e.preventDefault()
    startRotation(e, 'mouse')
  }
  window.onmousemove = function (e) {
    rotate(e, 'mouse')
  }
  window.onmouseup = function (e) {
    endRotation(e, 'mouse')
  }
  renderState.canvas.ontouchstart = function (e) {
    for (let i = 0; i < e.changedTouches.length; i += 1) {
      startRotation(e.changedTouches[i], e.changedTouches[i].identifier)
    }
  }
  renderState.canvas.ontouchmove = function (e) {
    let result = false
    for (let i = 0; i < e.changedTouches.length; i += 1) {
      if (rotate(e.changedTouches[i], e.changedTouches[i].identifier)) {
        result = true
      } else {
        delete renderState.dragState[e.changedTouches[i].identifier]
      }
    }
    if (result) {
      e.preventDefault()
    }
  }
  renderState.canvas.ontouchcancel = function (e) {
    for (let i = 0; i < e.changedTouches.length; i += 1) {
      endRotation(e.changedTouches[i], e.changedTouches[i].identifier)
    }
  }
  renderState.canvas.ontouchend = renderState.canvas.ontouchcancel
}

let renderer

function renderSkinHelper (canvas, theta, phi, model) {
  if (renderState) {
    renderState.canvas = canvas
    renderState.scene.remove(renderState.model)
    renderState.model = model
    renderState.scene.add(model)
    render()
    return
  }
  if (!renderer) {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    })
  }
  renderState = {
    animate: true,
    canvas,
    model,
    theta,
    phi,
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(26, canvas.width / canvas.height, 1, 200),
    renderer,
    dragState: {},
    frame: 0,
  }
  const origin = new THREE.Vector3(0, 0, 0)

  function positionCamera (camera, theta, phi) {
    const cosPhi = Math.cos(phi)
    camera.position.x = 85 * cosPhi * Math.sin(theta)
    camera.position.z = 85 * cosPhi * Math.cos(theta)
    camera.position.y = 85 * Math.sin(phi)
    camera.lookAt(origin)
  }
  renderState.scene.add(model)
  positionCamera(renderState.camera, renderState.theta, renderState.phi)
  allowRotation(renderState, positionCamera)
  render()
  if (renderState.animate) {
    window.requestAnimationFrame(renderAnimation)
  }
}

function renderSkin (canvas, slim, theta, phi, uuid, callback) {
  const skinImage = new Image()
  skinImage.crossOrigin = ''
  skinImage.src = `/data/${uuid}/skin.png`
  skinImage.onload = function () {
    const model = buildMinecraftModel(skinImage, slim)
    if (model) {
      try {
        renderSkinHelper(canvas, theta, phi, model)
        callback()
      } catch (e) {
        callback(e)
      }
    } else {
      callback()
    }
  }

  return function destroy () {
    cancelAnimationFrame(rafId)
    rafId = null
    renderState = null
    renderer = null
  }
}

export default function drawSkin3D (canvas, uuid, slim) {
  const theta = -TAU / 12
  const phi = TAU / 18
  return renderSkin(canvas, slim, theta, phi, uuid, (err) => {
    if (err) console.error(err)
  })
}
