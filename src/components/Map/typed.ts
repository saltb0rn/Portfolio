import * as THREE from 'three'

export interface GeoJsonType {
    type: "FeatureCollection",
    features: GeoJsonFeature[]
}

export interface GeoJsonFeature {
    type: string,
    properties: {
        adcode: number,
        name: string,
        center: [ number, number ],
        centroid: [ number, number ],
        childrenNum: number,
        level: Geolevel,
        parent: { adcode: number },
        subFeatureIndex: number,
        acroutes: number[],
        adchar: null
    },
    geometry: {
        type: GeometryType,
        coordinates: GeometryCoordinates<GeometryType>
    },
    vector3: any[][]
}

export type Geolevel = 'province' | 'city' | 'district'

export type GeometryType = 'Point'
    | 'LineString'
    | 'Polygon'
    | 'MultiPoint'
    | 'MultiLineString'
    | 'MultiPolygon'
    | 'GeometryCollection'

export type GeometryCoordinates<T extends GeometryType> =
    T extends 'Point' ? [ number, number ]:
    T extends 'LineString' ? [ number, number ][]:
    T extends 'Polygon' ? [ number, number ][][]:
    T extends 'MultiPoint' ? [ number, number ][]:
    T extends 'MultiLineString' ? [ number, number ][][]:
    T extends 'MultiPolygon' ? [ number, number ][][][]:
    T extends 'GeometryCollection' ? any: never

export interface ExtendObject3D extends THREE.Object3D {
    customProperties: any
}

export type LabelDatum = { featureCenterCoord: [number, number], featureName: string }

export type LabelData = LabelDatum[]
