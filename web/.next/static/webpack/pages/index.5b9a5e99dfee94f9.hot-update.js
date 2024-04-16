"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/index",{

/***/ "./src/utils/gpxParser.js":
/*!********************************!*\
  !*** ./src/utils/gpxParser.js ***!
  \********************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"parseGPX\": function() { return /* binding */ parseGPX; }\n/* harmony export */ });\n/* harmony import */ var gpxparser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gpxparser */ \"./node_modules/gpxparser/dist/GPXParser.min.js\");\n/* harmony import */ var gpxparser__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(gpxparser__WEBPACK_IMPORTED_MODULE_0__);\n\n\nconst parseGPX = async (file)=>{\n    return new Promise((resolve, reject)=>{\n        const reader = new FileReader();\n        reader.onload = (event)=>{\n            try {\n                const gpx = new (gpxparser__WEBPACK_IMPORTED_MODULE_0___default())();\n                gpx.parse(event.target.result);\n                const title = gpx.tracks[0].name;\n                const points = gpx.tracks[0].points;\n                const distance = gpx.tracks[0].distance.total / 1000 // Distance in kilometers\n                ;\n                const date = points[0].time.toLocaleDateString(\"fr-FR\", {\n                    weekday: \"long\",\n                    year: \"numeric\",\n                    month: \"long\",\n                    day: \"numeric\"\n                });\n                const duration = (points[points.length - 1].time - points[0].time) / 1000 / 60;\n                const distanceData = calculateDistance(points);\n                const elevationData = points.map((point, idx)=>({\n                        time: point.time,\n                        elevation: point.ele,\n                        distance: distanceData[idx].distance\n                    }));\n                const elevationSpeedData = movingAverage(calculateElevationSpeed(points), \"elevationSpeed\", 30).map((data, idx)=>({\n                        ...data,\n                        distance: distanceData[idx].distance\n                    }));\n                const speedData = movingAverage(calculateSpeed(points), \"speed\", 30).map((data, idx)=>({\n                        ...data,\n                        distance: distanceData[idx].distance\n                    }));\n                const paceData = movingAverage(calculatePace(points), \"pace\", 30).map((data, idx)=>({\n                        ...data,\n                        distance: distanceData[idx].distance\n                    }));\n                const averageSpeed = distance / (duration / 60);\n                const minElevation = gpx.tracks[0].elevation.min;\n                const maxElevation = gpx.tracks[0].elevation.max;\n                const posElevation = gpx.tracks[0].elevation.pos;\n                resolve({\n                    date,\n                    title,\n                    distance,\n                    duration,\n                    elevationData,\n                    elevationSpeedData,\n                    speedData,\n                    paceData,\n                    averageSpeed,\n                    minElevation,\n                    maxElevation,\n                    posElevation,\n                    fileName: file.name\n                });\n            } catch (error) {\n                reject(error);\n            }\n        };\n        reader.onerror = ()=>{\n            reject(new Error(\"Error reading the GPX file.\"));\n        };\n        reader.readAsText(file);\n    });\n};\nfunction calculatePace(points) {\n    const paceData = [];\n    for(let i = 1; i < points.length; i++){\n        const prevPoint = points[i - 1];\n        const currPoint = points[i];\n        const time1 = new Date(prevPoint.time);\n        const time2 = new Date(currPoint.time);\n        const timeDifference = (time2 - time1) / 1000 / 60 // Time difference in minutes\n        ;\n        const distance = getDistance([\n            prevPoint.lat,\n            prevPoint.lon\n        ], [\n            currPoint.lat,\n            currPoint.lon\n        ]) // Distance in kilometers\n        ;\n        const minDistance = 0.001 // 1 meter\n        ;\n        if (timeDifference > 0 && distance > minDistance) {\n            let pace = timeDifference / distance;\n            if (pace > 300) continue; // Ignore pace > 300 min/km\n            paceData.push({\n                time: currPoint.time,\n                pace\n            });\n        }\n    }\n    return paceData;\n}\nfunction calculateElevationSpeed(points) {\n    const elevationSpeedData = [];\n    for(let i = 1; i < points.length; i++){\n        const prevPoint = points[i - 1];\n        const currPoint = points[i];\n        const time1 = new Date(prevPoint.time);\n        const time2 = new Date(currPoint.time);\n        const timeDifference = (time2 - time1) / 1000 // Time difference in s\n        ;\n        const elevationDifference = currPoint.ele - prevPoint.ele // Elevation difference in meters\n        ;\n        const elevationSpeed = elevationDifference * 60 * 60 / timeDifference // Elevation speed in m/h\n        ;\n        elevationSpeedData.push({\n            time: currPoint.time,\n            elevationSpeed\n        });\n    }\n    return elevationSpeedData;\n}\nfunction calculateDistance(points) {\n    const distanceData = [];\n    for(let i = 1; i < points.length; i++){\n        const prevPoint = points[i - 1];\n        const currPoint = points[i];\n        const distance = getDistance([\n            prevPoint.lat,\n            prevPoint.lon\n        ], [\n            currPoint.lat,\n            currPoint.lon\n        ]) // Distance in kilometers\n        ;\n        distanceData.push({\n            time: currPoint.time,\n            distance\n        });\n    }\n}\nfunction calculateSpeed(points) {\n    const speedData = [];\n    for(let i = 1; i < points.length; i++){\n        const prevPoint = points[i - 1];\n        const currPoint = points[i];\n        const time1 = new Date(prevPoint.time);\n        const time2 = new Date(currPoint.time);\n        const timeDifference = (time2 - time1) / 1000 * 60 * 60 // Time difference in minutes\n        ;\n        const distance = getDistance([\n            prevPoint.lat,\n            prevPoint.lon\n        ], [\n            currPoint.lat,\n            currPoint.lon\n        ]) // Distance in kilometers\n        ;\n        const speed = distance * timeDifference // Speed in km/h\n        ;\n        if (speed < 1000) {\n            speedData.push({\n                time: currPoint.time,\n                speed\n            });\n        }\n    }\n    return speedData;\n}\nfunction getDistance(point1, point2) {\n    const [lat1, lon1] = point1;\n    const [lat2, lon2] = point2;\n    const R = 6371 // Earth's radius in km\n    ;\n    const dLat = (lat2 - lat1) * Math.PI / 180;\n    const dLon = (lon2 - lon1) * Math.PI / 180;\n    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);\n    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));\n    return R * c;\n}\nfunction movingAverage(data, valueKey, windowSize) {\n    const result = [];\n    for(let i = 0; i < data.length - windowSize + 1; i++){\n        const windowData = data.slice(i, i + windowSize);\n        const average = windowData.reduce((sum, value)=>sum + value[valueKey], 0) / windowSize;\n        result.push({\n            time: windowData[windowSize - 1].time,\n            [valueKey]: parseFloat(average.toFixed(2))\n        });\n    }\n    return result;\n}\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports on update so we can compare the boundary\n                // signatures.\n                module.hot.dispose(function (data) {\n                    data.prevExports = currentExports;\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevExports !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevExports !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SSxHQUFHLENBQUNGLE9BQU87SUFFcEIsTUFBTUksSUFBSSxJQUFJTixLQUFLTyxLQUFLLENBQUNQLEtBQUtRLElBQUksQ0FBQ0wsSUFBSUgsS0FBS1EsSUFBSSxDQUFDLElBQUlMO0lBQ3JELE9BQU9MLElBQUlRO0FBQ2I7QUFHQSxTQUFTakQsY0FBY0UsSUFBSSxFQUFFa0QsUUFBUSxFQUFFQyxVQUFVLEVBQUU7SUFDakQsTUFBTTlFLFNBQVMsRUFBRTtJQUNqQixJQUFLLElBQUk0QyxJQUFJLEdBQUdBLElBQUlqQixLQUFLWixNQUFNLEdBQUcrRCxhQUFhLEdBQUdsQyxJQUFLO1FBQ3JELE1BQU1tQyxhQUFhcEQsS0FBS3FELEtBQUssQ0FBQ3BDLEdBQUdBLElBQUlrQztRQUNyQyxNQUFNRyxVQUNKRixXQUFXRyxNQUFNLENBQUMsQ0FBQ0MsS0FBS0MsUUFBVUQsTUFBTUMsS0FBSyxDQUFDUCxTQUFTLEVBQUUsS0FBS0M7UUFDaEU5RSxPQUFPd0QsSUFBSSxDQUFDO1lBQ1ZoRCxNQUFNdUUsVUFBVSxDQUFDRCxhQUFhLEVBQUUsQ0FBQ3RFLElBQUk7WUFDckMsQ0FBQ3FFLFNBQVMsRUFBRVEsV0FBV0osUUFBUUssT0FBTyxDQUFDO1FBQ3pDO0lBQ0Y7SUFDQSxPQUFPdEY7QUFDVCIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9zcmMvdXRpbHMvZ3B4UGFyc2VyLmpzP2FjNTQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGdweFBhcnNlciBmcm9tIFwiZ3B4cGFyc2VyXCJcbmltcG9ydCB7IGZvcm1hdCB9IGZyb20gXCJkYXRlLWZuc1wiXG5cbmV4cG9ydCBjb25zdCBwYXJzZUdQWCA9IGFzeW5jIChmaWxlKSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICAgIHJlYWRlci5vbmxvYWQgPSAoZXZlbnQpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGdweCA9IG5ldyBncHhQYXJzZXIoKVxuICAgICAgICBncHgucGFyc2UoZXZlbnQudGFyZ2V0LnJlc3VsdClcblxuICAgICAgICBjb25zdCB0aXRsZSA9IGdweC50cmFja3NbMF0ubmFtZVxuICAgICAgICBjb25zdCBwb2ludHMgPSBncHgudHJhY2tzWzBdLnBvaW50c1xuICAgICAgICBjb25zdCBkaXN0YW5jZSA9IGdweC50cmFja3NbMF0uZGlzdGFuY2UudG90YWwgLyAxMDAwIC8vIERpc3RhbmNlIGluIGtpbG9tZXRlcnNcblxuICAgICAgICBjb25zdCBkYXRlID0gcG9pbnRzWzBdLnRpbWUudG9Mb2NhbGVEYXRlU3RyaW5nKFwiZnItRlJcIiwge1xuICAgICAgICAgIHdlZWtkYXk6IFwibG9uZ1wiLFxuICAgICAgICAgIHllYXI6IFwibnVtZXJpY1wiLFxuICAgICAgICAgIG1vbnRoOiBcImxvbmdcIixcbiAgICAgICAgICBkYXk6IFwibnVtZXJpY1wiXG4gICAgICAgIH0pXG5cbiAgICAgICAgY29uc3QgZHVyYXRpb24gPVxuICAgICAgICAgIChwb2ludHNbcG9pbnRzLmxlbmd0aCAtIDFdLnRpbWUgLSBwb2ludHNbMF0udGltZSkgLyAxMDAwIC8gNjBcblxuICAgICAgICBjb25zdCBkaXN0YW5jZURhdGEgPSBjYWxjdWxhdGVEaXN0YW5jZShwb2ludHMpXG4gICAgICAgIFxuICAgICAgICBjb25zdCBlbGV2YXRpb25EYXRhID0gcG9pbnRzLm1hcCgocG9pbnQsaWR4KSA9PiAoe1xuICAgICAgICAgIHRpbWU6IHBvaW50LnRpbWUsXG4gICAgICAgICAgZWxldmF0aW9uOiBwb2ludC5lbGUsXG4gICAgICAgICAgZGlzdGFuY2U6IGRpc3RhbmNlRGF0YVtpZHhdLmRpc3RhbmNlXG4gICAgICAgIH0pKVxuXG4gICAgIFxuICAgICAgICBjb25zdCBlbGV2YXRpb25TcGVlZERhdGEgPSBtb3ZpbmdBdmVyYWdlKGNhbGN1bGF0ZUVsZXZhdGlvblNwZWVkKHBvaW50cyksIFwiZWxldmF0aW9uU3BlZWRcIiwgMzApXG4gICAgICAgIC5tYXAoKGRhdGEsIGlkeCkgPT4gKHsgLi4uZGF0YSwgZGlzdGFuY2U6IGRpc3RhbmNlRGF0YVtpZHhdLmRpc3RhbmNlIH0pKTtcbiAgICAgIFxuICAgICAgY29uc3Qgc3BlZWREYXRhID0gbW92aW5nQXZlcmFnZShjYWxjdWxhdGVTcGVlZChwb2ludHMpLCBcInNwZWVkXCIsIDMwKVxuICAgICAgICAubWFwKChkYXRhLCBpZHgpID0+ICh7IC4uLmRhdGEsIGRpc3RhbmNlOiBkaXN0YW5jZURhdGFbaWR4XS5kaXN0YW5jZSB9KSk7XG4gICAgICBcbiAgICAgIGNvbnN0IHBhY2VEYXRhID0gbW92aW5nQXZlcmFnZShjYWxjdWxhdGVQYWNlKHBvaW50cyksIFwicGFjZVwiLCAzMClcbiAgICAgICAgLm1hcCgoZGF0YSwgaWR4KSA9PiAoeyAuLi5kYXRhLCBkaXN0YW5jZTogZGlzdGFuY2VEYXRhW2lkeF0uZGlzdGFuY2UgfSkpO1xuICAgICAgXG4gICAgICAgIGNvbnN0IGF2ZXJhZ2VTcGVlZCA9IGRpc3RhbmNlIC8gKGR1cmF0aW9uIC8gNjApXG5cbiAgICAgICAgY29uc3QgbWluRWxldmF0aW9uID0gZ3B4LnRyYWNrc1swXS5lbGV2YXRpb24ubWluXG4gICAgICAgIGNvbnN0IG1heEVsZXZhdGlvbiA9IGdweC50cmFja3NbMF0uZWxldmF0aW9uLm1heFxuICAgICAgICBjb25zdCBwb3NFbGV2YXRpb24gPSBncHgudHJhY2tzWzBdLmVsZXZhdGlvbi5wb3NcblxuICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICBkYXRlLFxuICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgIGRpc3RhbmNlLFxuICAgICAgICAgIGR1cmF0aW9uLFxuICAgICAgICAgIGVsZXZhdGlvbkRhdGEsXG4gICAgICAgICAgZWxldmF0aW9uU3BlZWREYXRhLFxuICAgICAgICAgIHNwZWVkRGF0YSxcbiAgICAgICAgICBwYWNlRGF0YSxcbiAgICAgICAgICBhdmVyYWdlU3BlZWQsXG4gICAgICAgICAgbWluRWxldmF0aW9uLFxuICAgICAgICAgIG1heEVsZXZhdGlvbixcbiAgICAgICAgICBwb3NFbGV2YXRpb24sXG4gICAgICAgICAgZmlsZU5hbWU6IGZpbGUubmFtZVxuICAgICAgICB9KVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJlYWRlci5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgcmVqZWN0KG5ldyBFcnJvcihcIkVycm9yIHJlYWRpbmcgdGhlIEdQWCBmaWxlLlwiKSlcbiAgICB9XG5cbiAgICByZWFkZXIucmVhZEFzVGV4dChmaWxlKVxuICB9KVxufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVQYWNlKHBvaW50cykge1xuICBjb25zdCBwYWNlRGF0YSA9IFtdXG4gIGZvciAobGV0IGkgPSAxOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgcHJldlBvaW50ID0gcG9pbnRzW2kgLSAxXVxuICAgIGNvbnN0IGN1cnJQb2ludCA9IHBvaW50c1tpXVxuXG4gICAgY29uc3QgdGltZTEgPSBuZXcgRGF0ZShwcmV2UG9pbnQudGltZSlcbiAgICBjb25zdCB0aW1lMiA9IG5ldyBEYXRlKGN1cnJQb2ludC50aW1lKVxuICAgIGNvbnN0IHRpbWVEaWZmZXJlbmNlID0gKHRpbWUyIC0gdGltZTEpIC8gMTAwMCAvIDYwIC8vIFRpbWUgZGlmZmVyZW5jZSBpbiBtaW51dGVzXG5cbiAgICBjb25zdCBkaXN0YW5jZSA9IGdldERpc3RhbmNlKFxuICAgICAgW3ByZXZQb2ludC5sYXQsIHByZXZQb2ludC5sb25dLFxuICAgICAgW2N1cnJQb2ludC5sYXQsIGN1cnJQb2ludC5sb25dXG4gICAgKSAvLyBEaXN0YW5jZSBpbiBraWxvbWV0ZXJzXG5cbiAgICBjb25zdCBtaW5EaXN0YW5jZSA9IDAuMDAxIC8vIDEgbWV0ZXJcblxuICAgIGlmICh0aW1lRGlmZmVyZW5jZSA+IDAgJiYgZGlzdGFuY2UgPiBtaW5EaXN0YW5jZSkge1xuICAgICAgbGV0IHBhY2UgPSB0aW1lRGlmZmVyZW5jZSAvIGRpc3RhbmNlXG5cbiAgICAgIGlmIChwYWNlID4gMzAwKSBjb250aW51ZSAvLyBJZ25vcmUgcGFjZSA+IDMwMCBtaW4va21cblxuICAgICAgcGFjZURhdGEucHVzaCh7XG4gICAgICAgIHRpbWU6IGN1cnJQb2ludC50aW1lLFxuICAgICAgICBwYWNlXG4gICAgICB9KVxuICAgIH1cbiAgfVxuICByZXR1cm4gcGFjZURhdGFcbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRlRWxldmF0aW9uU3BlZWQocG9pbnRzKSB7XG4gIGNvbnN0IGVsZXZhdGlvblNwZWVkRGF0YSA9IFtdXG4gIGZvciAobGV0IGkgPSAxOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgcHJldlBvaW50ID0gcG9pbnRzW2kgLSAxXVxuICAgIGNvbnN0IGN1cnJQb2ludCA9IHBvaW50c1tpXVxuXG4gICAgY29uc3QgdGltZTEgPSBuZXcgRGF0ZShwcmV2UG9pbnQudGltZSlcbiAgICBjb25zdCB0aW1lMiA9IG5ldyBEYXRlKGN1cnJQb2ludC50aW1lKVxuICAgIGNvbnN0IHRpbWVEaWZmZXJlbmNlID0gKCh0aW1lMiAtIHRpbWUxKSAvIDEwMDApIC8vIFRpbWUgZGlmZmVyZW5jZSBpbiBzXG5cbiAgICBjb25zdCBlbGV2YXRpb25EaWZmZXJlbmNlID0gKGN1cnJQb2ludC5lbGUgLSBwcmV2UG9pbnQuZWxlICkgLy8gRWxldmF0aW9uIGRpZmZlcmVuY2UgaW4gbWV0ZXJzXG5cbiAgICBjb25zdCBlbGV2YXRpb25TcGVlZCA9IGVsZXZhdGlvbkRpZmZlcmVuY2UgKiA2MCAqIDYwIC8gdGltZURpZmZlcmVuY2UgLy8gRWxldmF0aW9uIHNwZWVkIGluIG0vaFxuXG4gICAgZWxldmF0aW9uU3BlZWREYXRhLnB1c2goe1xuICAgICAgdGltZTogY3VyclBvaW50LnRpbWUsXG4gICAgICBlbGV2YXRpb25TcGVlZFxuICAgIH0pXG4gIH1cbiAgcmV0dXJuIGVsZXZhdGlvblNwZWVkRGF0YVxufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVEaXN0YW5jZShwb2ludHMpIHtcblxuICBjb25zdCBkaXN0YW5jZURhdGEgPSBbXVxuXG4gIGZvciAobGV0IGkgPSAxOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgcHJldlBvaW50ID0gcG9pbnRzW2kgLSAxXVxuICAgIGNvbnN0IGN1cnJQb2ludCA9IHBvaW50c1tpXVxuXG4gICAgY29uc3QgZGlzdGFuY2UgPSBnZXREaXN0YW5jZShcbiAgICAgIFtwcmV2UG9pbnQubGF0LCBwcmV2UG9pbnQubG9uXSxcbiAgICAgIFtjdXJyUG9pbnQubGF0LCBjdXJyUG9pbnQubG9uXVxuICAgICkgLy8gRGlzdGFuY2UgaW4ga2lsb21ldGVyc1xuXG4gICAgZGlzdGFuY2VEYXRhLnB1c2goe1xuICAgICAgdGltZTogY3VyclBvaW50LnRpbWUsXG4gICAgICBkaXN0YW5jZVxuICAgIH0pXG4gIH1cbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRlU3BlZWQocG9pbnRzKSB7XG4gIGNvbnN0IHNwZWVkRGF0YSA9IFtdXG4gIGZvciAobGV0IGkgPSAxOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgcHJldlBvaW50ID0gcG9pbnRzW2kgLSAxXVxuICAgIGNvbnN0IGN1cnJQb2ludCA9IHBvaW50c1tpXVxuXG4gICAgY29uc3QgdGltZTEgPSBuZXcgRGF0ZShwcmV2UG9pbnQudGltZSlcbiAgICBjb25zdCB0aW1lMiA9IG5ldyBEYXRlKGN1cnJQb2ludC50aW1lKVxuICAgIGNvbnN0IHRpbWVEaWZmZXJlbmNlID0gKCh0aW1lMiAtIHRpbWUxKSAvIDEwMDApICogNjAgKiA2MCAvLyBUaW1lIGRpZmZlcmVuY2UgaW4gbWludXRlc1xuXG4gICAgY29uc3QgZGlzdGFuY2UgPSBnZXREaXN0YW5jZShcbiAgICAgIFtwcmV2UG9pbnQubGF0LCBwcmV2UG9pbnQubG9uXSxcbiAgICAgIFtjdXJyUG9pbnQubGF0LCBjdXJyUG9pbnQubG9uXVxuICAgICkgLy8gRGlzdGFuY2UgaW4ga2lsb21ldGVyc1xuXG4gICAgY29uc3Qgc3BlZWQgPSBkaXN0YW5jZSAqIHRpbWVEaWZmZXJlbmNlIC8vIFNwZWVkIGluIGttL2hcblxuICAgIGlmIChzcGVlZCA8IDEwMDApIHtcbiAgICAgIHNwZWVkRGF0YS5wdXNoKHtcbiAgICAgICAgdGltZTogY3VyclBvaW50LnRpbWUsXG4gICAgICAgIHNwZWVkXG4gICAgICB9KVxuICAgIH1cbiAgfVxuICByZXR1cm4gc3BlZWREYXRhXG59XG5cbmZ1bmN0aW9uIGdldERpc3RhbmNlKHBvaW50MSwgcG9pbnQyKSB7XG4gIGNvbnN0IFtsYXQxLCBsb24xXSA9IHBvaW50MVxuICBjb25zdCBbbGF0MiwgbG9uMl0gPSBwb2ludDJcblxuICBjb25zdCBSID0gNjM3MSAvLyBFYXJ0aCdzIHJhZGl1cyBpbiBrbVxuICBjb25zdCBkTGF0ID0gKChsYXQyIC0gbGF0MSkgKiBNYXRoLlBJKSAvIDE4MFxuICBjb25zdCBkTG9uID0gKChsb24yIC0gbG9uMSkgKiBNYXRoLlBJKSAvIDE4MFxuXG4gIGNvbnN0IGEgPVxuICAgIE1hdGguc2luKGRMYXQgLyAyKSAqIE1hdGguc2luKGRMYXQgLyAyKSArXG4gICAgTWF0aC5jb3MoKGxhdDEgKiBNYXRoLlBJKSAvIDE4MCkgKlxuICAgICAgTWF0aC5jb3MoKGxhdDIgKiBNYXRoLlBJKSAvIDE4MCkgKlxuICAgICAgTWF0aC5zaW4oZExvbiAvIDIpICpcbiAgICAgIE1hdGguc2luKGRMb24gLyAyKVxuXG4gIGNvbnN0IGMgPSAyICogTWF0aC5hdGFuMihNYXRoLnNxcnQoYSksIE1hdGguc3FydCgxIC0gYSkpXG4gIHJldHVybiBSICogY1xufVxuXG5cbmZ1bmN0aW9uIG1vdmluZ0F2ZXJhZ2UoZGF0YSwgdmFsdWVLZXksIHdpbmRvd1NpemUpIHtcbiAgY29uc3QgcmVzdWx0ID0gW11cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aCAtIHdpbmRvd1NpemUgKyAxOyBpKyspIHtcbiAgICBjb25zdCB3aW5kb3dEYXRhID0gZGF0YS5zbGljZShpLCBpICsgd2luZG93U2l6ZSlcbiAgICBjb25zdCBhdmVyYWdlID1cbiAgICAgIHdpbmRvd0RhdGEucmVkdWNlKChzdW0sIHZhbHVlKSA9PiBzdW0gKyB2YWx1ZVt2YWx1ZUtleV0sIDApIC8gd2luZG93U2l6ZVxuICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgIHRpbWU6IHdpbmRvd0RhdGFbd2luZG93U2l6ZSAtIDFdLnRpbWUsXG4gICAgICBbdmFsdWVLZXldOiBwYXJzZUZsb2F0KGF2ZXJhZ2UudG9GaXhlZCgyKSlcbiAgICB9KVxuICB9XG4gIHJldHVybiByZXN1bHRcbn1cbiJdLCJuYW1lcyI6WyJncHhQYXJzZXIiLCJmb3JtYXQiLCJwYXJzZUdQWCIsImZpbGUiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInJlYWRlciIsIkZpbGVSZWFkZXIiLCJvbmxvYWQiLCJldmVudCIsImdweCIsInBhcnNlIiwidGFyZ2V0IiwicmVzdWx0IiwidGl0bGUiLCJ0cmFja3MiLCJuYW1lIiwicG9pbnRzIiwiZGlzdGFuY2UiLCJ0b3RhbCIsImRhdGUiLCJ0aW1lIiwidG9Mb2NhbGVEYXRlU3RyaW5nIiwid2Vla2RheSIsInllYXIiLCJtb250aCIsImRheSIsImR1cmF0aW9uIiwibGVuZ3RoIiwiZGlzdGFuY2VEYXRhIiwiY2FsY3VsYXRlRGlzdGFuY2UiLCJlbGV2YXRpb25EYXRhIiwibWFwIiwicG9pbnQiLCJpZHgiLCJlbGV2YXRpb24iLCJlbGUiLCJlbGV2YXRpb25TcGVlZERhdGEiLCJtb3ZpbmdBdmVyYWdlIiwiY2FsY3VsYXRlRWxldmF0aW9uU3BlZWQiLCJkYXRhIiwic3BlZWREYXRhIiwiY2FsY3VsYXRlU3BlZWQiLCJwYWNlRGF0YSIsImNhbGN1bGF0ZVBhY2UiLCJhdmVyYWdlU3BlZWQiLCJtaW5FbGV2YXRpb24iLCJtaW4iLCJtYXhFbGV2YXRpb24iLCJtYXgiLCJwb3NFbGV2YXRpb24iLCJwb3MiLCJmaWxlTmFtZSIsImVycm9yIiwib25lcnJvciIsIkVycm9yIiwicmVhZEFzVGV4dCIsImkiLCJwcmV2UG9pbnQiLCJjdXJyUG9pbnQiLCJ0aW1lMSIsIkRhdGUiLCJ0aW1lMiIsInRpbWVEaWZmZXJlbmNlIiwiZ2V0RGlzdGFuY2UiLCJsYXQiLCJsb24iLCJtaW5EaXN0YW5jZSIsInBhY2UiLCJwdXNoIiwiZWxldmF0aW9uRGlmZmVyZW5jZSIsImVsZXZhdGlvblNwZWVkIiwic3BlZWQiLCJwb2ludDEiLCJwb2ludDIiLCJsYXQxIiwibG9uMSIsImxhdDIiLCJsb24yIiwiUiIsImRMYXQiLCJNYXRoIiwiUEkiLCJkTG9uIiwiYSIsInNpbiIsImNvcyIsImMiLCJhdGFuMiIsInNxcnQiLCJ2YWx1ZUtleSIsIndpbmRvd1NpemUiLCJ3aW5kb3dEYXRhIiwic2xpY2UiLCJhdmVyYWdlIiwicmVkdWNlIiwic3VtIiwidmFsdWUiLCJwYXJzZUZsb2F0IiwidG9GaXhlZCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/utils/gpxParser.js\n"));

/***/ })

});