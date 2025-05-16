import * as THREE from 'three'
import * as d3 from 'd3'
import type { GeoJsonType, GeoJsonFeature, ExtendObject3D, GeometryCoordinates, GeometryType, LabelDatum, LabelData } from './typed'
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js"
import { Line2 } from "three/examples/jsm/lines/Line2.js"
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'

import gsap from 'gsap'

import ExtrudeTopVert from './shaders/extrude/top.vert'
import ExtrudeTopFrag from './shaders/extrude/top.frag'
import ExtrudeSideVert from './shaders/extrude/side.vert'
import ExtrudeSideFrag from './shaders/extrude/side.frag'

import RingVert from './shaders/ring/shader.vert'
import RingFrag from './shaders/ring/shader.frag'

import FlyingLineVert from './shaders/flyingLine/shader.vert'
import FlyingLineFrag from './shaders/flyingLine/shader.frag'

import Access from './access.ts'

const flowLineSample = '/textures/flow-line-sample.png'
const mapbg = '/textures/earth-top-down-view.jpg'

const POSITION_Z = 2.1
const MAP_DEPTH = 2

const textureLoader = new THREE.TextureLoader()

let extrudeMaterial: THREE.ShaderMaterial | undefined = undefined
let extrudeSideMaterial: THREE.ShaderMaterial | undefined = undefined
let flyingLineMaterial: THREE.ShaderMaterial | undefined = undefined
let ringMaterial: THREE.ShaderMaterial | undefined = undefined

let resources: any[] = []
const mapArgs: [number, [number, number]][] = []

function calcMapScale(map3d: THREE.Object3D): number {
    if (!Access.camera) {
        return 1
    }
    const viewSize = new THREE.Vector2()
    Access.camera.getViewSize(Access.camera.position.length(), viewSize)

    const boundingBox = new THREE.Box3().setFromObject(map3d)
    const mapSize = new THREE.Vector3()
    boundingBox.getSize(mapSize)
    let scale = 1
    const scaleFactor = 0.7
    if (mapSize.x > viewSize.x && mapSize.x > mapSize.y) {
        scale = viewSize.x / mapSize.x * scaleFactor
    } else if (mapSize.y > viewSize.y && mapSize.y > mapSize.x) {

        scale = viewSize.y / mapSize.y * scaleFactor
    }
    return scale
}

export function getExtrudeShaderMaterial(): THREE.ShaderMaterial {
    if (extrudeMaterial) return extrudeMaterial
    const vs = ExtrudeTopVert
    const fs = ExtrudeTopFrag
    const image = textureLoader.load(mapbg)
    extrudeMaterial = new THREE.ShaderMaterial({
        uniforms: {
            image: {
                value: image
            },
            isHover: {
                value: false
            }
        },
        vertexShader: vs,
        fragmentShader: fs
    })
    extrudeMaterial.userData.keepAlive = true
    return extrudeMaterial
}

export function getExtrudeSideShaderMaterial(): THREE.ShaderMaterial {
    if (extrudeSideMaterial) return extrudeSideMaterial
    const vs = ExtrudeSideVert
    const fs = ExtrudeSideFrag
    extrudeSideMaterial = new THREE.ShaderMaterial({
        uniforms: {
            color1: {
                value: new THREE.Color(0x3f9ff3)
            },
            color2: {
                value: new THREE.Color(0x266bf0)
            },
            mapDepth: {
                value: MAP_DEPTH
            }
        },
        vertexShader: vs,
        fragmentShader: fs
    })
    extrudeSideMaterial.userData.keepAlive = true
    return extrudeSideMaterial
}

export function getRingShaderMaterial(): THREE.ShaderMaterial {
    if (ringMaterial) return ringMaterial
    const innerRadius = 0.5
    const outerRadius = 0.7
    const vs = RingVert
    const fs = RingFrag
    ringMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: {
                value: 0.0
            },
            innerRadius: {
                value: innerRadius
            },
            outerRadius: {
                value: outerRadius
            },
            color: {
                value: new THREE.Color(0x3fc5fb)
            }
        },
        vertexShader: vs,
        fragmentShader: fs,
        transparent: true,
        side: THREE.DoubleSide
    })
    ringMaterial.userData.keepAlive = true
    return ringMaterial
}

export function getLineShaderMaterial(): THREE.ShaderMaterial {
    if (flyingLineMaterial) return flyingLineMaterial
    const vs = FlyingLineVert
    const fs = FlyingLineFrag
    const image = textureLoader.load(flowLineSample)
    flyingLineMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: {
                value: 0.0
            },
            image: {
                value: image
            }
        },
        vertexShader: vs,
        fragmentShader: fs,
    })
    flyingLineMaterial.userData.keepAlive = true
    return flyingLineMaterial
}


export const mercatorProjGen: (center: [number, number], scale: number) => d3.GeoProjection = (center: [number, number], scale: number) => d3.geoMercator().center(center).scale(scale).translate([0, 0])

function calcBoundingInfoOfMap(geoJson: GeoJsonType) {
    const boundingInfo = {
        minLon: Infinity, maxLon: -Infinity,
        minLat: Infinity, maxLat: -Infinity,
        minX: Infinity, maxX: -Infinity,
        minY: Infinity, maxY: -Infinity
    }
    const { features: basicFeatures } = geoJson
    basicFeatures.forEach((feature: GeoJsonFeature) => {
        const featureType: GeometryType = feature.geometry.type
        const coordinates: GeometryCoordinates<GeometryType> = feature.geometry.coordinates

        if (featureType == 'MultiPolygon') {
            coordinates.forEach((multiPolygon: [number, number][][]) => {
                multiPolygon.forEach((polygon: [number, number][]) => {
                    polygon.forEach((point: [number, number]) => {
                        const [ lon, lat ] = point
                        if (lon < boundingInfo.minLon) boundingInfo.minLon = lon
                        if (lon > boundingInfo.maxLon) boundingInfo.maxLon = lon
                        if (lat < boundingInfo.minLat) boundingInfo.minLat = lat
                        if (lat > boundingInfo.maxLat) boundingInfo.maxLat = lat
                    })
                })
            })
        }

        if (featureType == 'Polygon') {
            coordinates.forEach((polygon: [number, number][]) => {
                polygon.forEach((point: [number, number]) => {
                    const [ lon, lat ] = point
                    if (lon < boundingInfo.minLon) boundingInfo.minLon = lon
                    if (lon > boundingInfo.maxLon) boundingInfo.maxLon = lon
                    if (lat < boundingInfo.minLat) boundingInfo.minLat = lat
                    if (lat > boundingInfo.maxLat) boundingInfo.maxLat = lat
                })
            })
        }

    })
    return boundingInfo
}

function calcCentroidOfPolygon(coords: [number, number][]): [number, number] {
    // https://en.wikipedia.org/wiki/Centroid#Of_a_polygon
    // http://www.faqs.org/faqs/graphics/algorithms-faq/
    const area = (coords: [number, number][]) => {
        let s = 0.0;
        for (let i = 0; i < (coords.length - 1); i++) {
            s += (coords[i][0] * coords[i + 1][1] - coords[i + 1][0] * coords[i][1])
        }
        return 0.5 * s
    }

    const c: [number, number] = [0, 0]
    for (let i = 0; i < (coords.length - 1); i++) {
        c[0] += (coords[i][0] + coords[i+1][0]) * (coords[i][0]*coords[i+1][1] - coords[i+1][0]*coords[i][1]);
        c[1] += (coords[i][1] + coords[i+1][1]) * (coords[i][0]*coords[i+1][1] - coords[i+1][0]*coords[i][1]);
    }

    const a = area(coords)
    c[0] /= a * 6
    c[1] /= a * 6
    return c
}

function createExtrudeMesh(
    points: [ number, number ][],
    fnProj: any,
    fnUVProj?: any): any {

    const shape = new THREE.Shape()
    // 外廓线的坐标组
    const pointArray: number[] = []

    for (let i = 0; i < points.length; i++) {
        const [x, y] = fnProj(points[i])
        if (0 == i) {
            shape.moveTo(x, -y)
        }
        shape.lineTo(x, -y)
        pointArray.push(x, -y, MAP_DEPTH)
    }

    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: MAP_DEPTH,
        bevelEnabled: false
    })

    let material

    if (fnUVProj) {
        const posAttrBuf = geometry.getAttribute('position')
        const uvs = []
        const { count } = posAttrBuf
        for (let i = 0; i < count; i++) {
            const x = posAttrBuf.getX(i)
            const y = posAttrBuf.getY(i)
            const [u, v] = fnUVProj([x, y])
            uvs.push(u, v)
        }
        const texUVBufferAttribute = new THREE.Float32BufferAttribute(new Float32Array(uvs), 2)
        geometry.setAttribute('texUV', texUVBufferAttribute)
        material = getExtrudeShaderMaterial().clone()
        material.userData.keepAlive = false
    } else {
        material = new THREE.MeshPhongMaterial({
            color: 0x06092A,
            transparent: false,
            opacity: 0.8
        })
    }

    const extrudeSideMat = getExtrudeSideShaderMaterial()

    const mesh = new THREE.Mesh(geometry, [ material, extrudeSideMat ])

    // 绘制地图块的外廓线
    const lineGeometry = new LineGeometry()
    lineGeometry.setPositions(pointArray)
    const lineMaterial = new LineMaterial({
        color: 0x41c0fb,
        linewidth: 3
    })
    const line = new Line2(lineGeometry, lineMaterial)

    // 用来区分其他 Mesh
    mesh.userData.isUnit = true

    resources.push(mesh, line)

    return { mesh, line }
}

export function generateMap(
    mapdata: GeoJsonType,
    center: [ number, number ]
) {
    const mapObj = new THREE.Object3D()
    const labelData: LabelData = []
    const fnProj = mercatorProjGen(center, 80)

    let fnProjUV: ((p: [number, number]) => [number, number]) | null

    {
        // 得到从笛卡尔坐标到UV的变换
        const boundingInfo = calcBoundingInfoOfMap(mapdata)
        const p0: [number, number] = [boundingInfo.minLon, boundingInfo.minLat]
        const p1: [number, number] = [boundingInfo.minLon, boundingInfo.maxLat]
        const p2: [number, number] = [boundingInfo.maxLon, boundingInfo.minLat]

        const p0a = fnProj(p0), p1a = fnProj(p1), p2a = fnProj(p2)

        p0a![1] *= -1
        p1a![1] *= -1
        p2a![1] *= -1

        const mapHeight = 1 / (p1a![1] - p0a![1])
        const mapWidth = 1 / (p2a![0] - p0a![0])

        fnProjUV = ([x, y]: [number, number]) => {
            const dx = x - p0a![0]
            const dy = y - p0a![1]
            return [ dx * mapWidth, dy * mapHeight ]
        }
    }

    const { features: basicFeatures } = mapdata
    basicFeatures.forEach((basicFeatureItem: GeoJsonFeature) => {
        const provinceMapObj = new THREE.Object3D() as ExtendObject3D
        provinceMapObj.customProperties = basicFeatureItem.properties
        const featureType = basicFeatureItem.geometry.type
        const featureCoords: GeometryCoordinates<GeometryType> = basicFeatureItem.geometry.coordinates
        const featureName: string = basicFeatureItem.properties.name
        let centerCoord = basicFeatureItem.properties.centroid
        let featureCenterCoord: [number, number] | null = centerCoord && fnProj(centerCoord)

        if (featureType === 'MultiPolygon') {
            const centroids: [number, number][] = []
            featureCoords.forEach((multiPolygon: [number, number][][]) => {
                multiPolygon.forEach((polygon: [number, number][]) => {
                    // 有时候 GeoJson 数据并不包含 centroid, 所以这里自己进行计算
                    if (!centerCoord) {
                        centroids.push(calcCentroidOfPolygon(polygon))
                    }
                    const { mesh, line } = createExtrudeMesh(polygon, fnProj, fnProjUV)
                    // const { mesh, line } = await createExtrudeMesh(polygon, fnProj)
                    provinceMapObj.add(mesh)
                    provinceMapObj.add(line)
                })
            })

            if (!centerCoord) {
                const cSum = centroids.reduce(
                    (c1: [number, number], c2: [number, number]) => [c1[0] + c2[0], c1[1] + c2[1]],
                    [0, 0])
                const rcpN = 1 / centroids.length
                centerCoord = [ cSum[0] * rcpN, cSum[1] * rcpN ]
                featureCenterCoord = fnProj(centerCoord)
                provinceMapObj.customProperties.centroid = centerCoord
            }
        }

        if (featureType === 'Polygon') {
            const centroids: [number, number][] = []
            // featureCoords: [ polygon ]
            featureCoords.forEach((polygon: [number, number][]) => {
                if (!centerCoord) {
                    centroids.push(calcCentroidOfPolygon(polygon))
                }
                const { mesh, line } = createExtrudeMesh(polygon, fnProj, fnProjUV)
                // const { mesh, line } = await createExtrudeMesh(polygon, fnProj)
                provinceMapObj.add(mesh)
                provinceMapObj.add(line)
            })

            if (!centerCoord) {
                const cSum = centroids.reduce(
                    (c1: [number, number], c2: [number, number]) => [c1[0] + c2[0], c1[1] + c2[1]],
                    [0, 0])
                const rcpN = 1 / centroids.length
                centerCoord = [cSum[0] * rcpN, cSum[1] * rcpN]
                featureCenterCoord = fnProj(centerCoord)
                provinceMapObj.customProperties.centroid = centerCoord
            }
        }

        if (featureCenterCoord) {
            labelData.push({
                featureCenterCoord,
                featureName
            })
        }

        mapObj.add(provinceMapObj)
    })

    const labelGroup = generateMapLabels(labelData)
    labelGroup.name = 'lblGroup'
    mapObj.add(labelGroup)

    const spotGroup = generateMapSpots(labelData)
    spotGroup.name = 'spotGroup'
    mapObj.add(spotGroup)

    return { mapObj, labelData }
}

function generateMapLabels(labelData: LabelData): THREE.Group {
    const group = new THREE.Group()
    labelData.forEach((item: LabelDatum) => {
        const { featureCenterCoord, featureName } = item
        const label: CSS2DObject = drawLabel(featureCenterCoord, featureName)
        group.add(label)
    })
    return group
}

function drawLabel(coord: [number, number], content: string): CSS2DObject {
    const div = document.createElement('div')
    div.innerHTML = `<div class="your-classname" style="color: #fff">${content}</div>`
    div.style.pointerEvents = 'none'
    const obj = new CSS2DObject(div)
    obj.position.set(coord[0], -coord[1], 2)
    resources.push(obj)
    return obj
}

function generateMapSpots(labelData: LabelData): THREE.Group {
    const group = new THREE.Group()
    labelData.forEach((item: LabelDatum) => {
        const { featureCenterCoord } = item
        const spot = drawSpot(featureCenterCoord)
        group.add(spot)
    })
    return group
}

function drawSpot(coord: [number, number]) {
    // coord 是笛卡尔坐标
    const spotGeometry = new THREE.CircleGeometry(.5)
    const ringShaderMat = getRingShaderMaterial()
    const circle = new THREE.Mesh(spotGeometry, ringShaderMat)
    circle.position.set(coord[0], -coord[1], POSITION_Z)
    resources.push(circle)
    return circle
}

export function generateSpotLines(pointPairs: [LabelDatum, LabelDatum][]): THREE.Group {
    const group = new THREE.Group()
    pointPairs.forEach(([p1, p2]: [LabelDatum, LabelDatum]) => {
        const { line } = drawLine(p1.featureCenterCoord, p2.featureCenterCoord)
        group.add(line)
    })
    return group
}

function drawLine(p1: [number, number], p2: [number, number]) {
    const [x1, y1, z1] = [...p1, POSITION_Z]
    const [x2, y2, z2] = [...p2, POSITION_Z]
    const [ xm, ym, zm ] = [(x1 + x2) * 0.5, (y1 + y2) * 0.5, POSITION_Z * 10.0]
    const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(x1, -y1, z1),
        new THREE.Vector3(xm, -ym, zm),
        new THREE.Vector3(x2, -y2, z2),
    )
    const lineGeometry = new THREE.TubeGeometry(curve, 20, 0.1, 8, false)
    const lineShaderMat = getLineShaderMaterial()
    const line = new THREE.Mesh(lineGeometry, lineShaderMat)
    resources.push(line)
    return { line }
}

async function getGeoJson(adcode: number) {
    // https://datav.aliyun.com/portal/school/atlas/area_selector
    const rsp = await fetch(
        `https://geo.datav.aliyun.com/areas_v3/bound/${adcode}_full.json`)
    if (404 === rsp.status) {
        return null
    }
    return rsp.json()
}

// 演示用
function generatePointpairs(labelData: LabelData): [LabelDatum, LabelDatum][] {
    const { length: count } = labelData
    const combinations = Math.floor(count / 2)
    let centroids = labelData.map((item: LabelDatum) => item)
    if (count < 2) {
        return []
    } else {
        const pairs = Math.floor(Math.random() * combinations)
        const result: [LabelDatum, LabelDatum][] = []
        for (let i = 0; i < pairs; i++) {
            let randIndex = Math.floor(Math.random() * centroids.length)
            const p1 = centroids.splice(randIndex, 1)[0]
            randIndex = Math.floor(Math.random() * centroids.length)
            const p2 = centroids.splice(randIndex, 1)[0]
            result.push([p1, p2])
        }
        return result
    }
}

export function clearMap() {
    const map3d = Access.scene!.getObjectByName('3dmap')
    if (!map3d) return
    resources.forEach((obj: any) => {
        if (obj.parent) {
            obj.parent.remove(obj)
        }
        if (obj.geometry) {
            obj.geometry.dispose()
        }
        if (obj.material) {
            if (Array.isArray(obj.material)) {
                obj.material.map((m: THREE.Material) => {
                    if (m.userData && m.userData.keepAlive) return
                    if (m instanceof THREE.ShaderMaterial && m.uniforms.image) {
                        m.uniforms.image.value.dispose()
                    }
                    m.dispose()
                })
            } else {
                const m = obj.material
                if (!m.userData ||
                    (m.userData && !m.userData.keepAlive)) {
                    if (m instanceof THREE.ShaderMaterial && m.uniforms.image) {
                        m.uniforms.image.value.dispose()
                    }
                    m.dispose()
                }
            }
        }
        if (obj.dispose) {
            obj.dispose()
        }
    })

    if (map3d.parent) {
        map3d.parent.remove(map3d)
    }

    const htmlLabel = Access.cssRenderer!.domElement.querySelectorAll('div')
    htmlLabel?.forEach((node) => node.remove())

    resources = []

}

export function goBack() {
    if (mapArgs.length <= 1) return
    mapArgs.pop()
    const lastArg = mapArgs.pop()
    drawMap(...lastArg!)
}

export function drawMap(
    acode: number = 100000,
    centroid: [number, number] = [104.0, 37.5]) {

    // clear scene
    getGeoJson(acode)
        .then(geoData => {
            if (!geoData) return
            mapArgs.push([acode, centroid])
            clearMap()
            const { mapObj, labelData } = generateMap(geoData, centroid)
            mapObj.name = '3dmap'
            const scale = calcMapScale(mapObj)
            mapObj.scale.setScalar(0.1)
            gsap.to(mapObj.scale, { x: scale, y: scale, z: scale, duration: 1 })
            const lineGroup = generateSpotLines(generatePointpairs(labelData))
            mapObj.add(lineGroup)
            Access.scene!.add(mapObj)
        })
}

export function initMapSetup() {
    Access.on('mapAnimate', () => {
        if (ringMaterial) {
            ringMaterial.uniforms.time.value += 0.1
        }
        if (flyingLineMaterial) {
            flyingLineMaterial.uniforms.time.value += 0.1
        }        
    })
}

export function disposeMap() {
    clearMap()

    if (extrudeMaterial) {
        if (extrudeMaterial.uniforms.image) extrudeMaterial.uniforms.image.value.dispose()
        extrudeMaterial.dispose()
        extrudeMaterial = undefined
    }

    if (extrudeSideMaterial) {
        extrudeSideMaterial.dispose()
        extrudeSideMaterial = undefined
    }

    if (flyingLineMaterial) {
        if (flyingLineMaterial.uniforms.image) flyingLineMaterial.uniforms.image.value.dispose()
        flyingLineMaterial.dispose()
        flyingLineMaterial = undefined
    }

    if (ringMaterial) {
        ringMaterial.dispose()
        ringMaterial = undefined
    }

    Access.off('mapAnimate')

}
